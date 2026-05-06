import User from '../../models/User.model.js'
import Referral from '../../models/Referral.model.js'
import Withdrawal from '../../models/Withdrawal.model.js'
import AppError from '../../services/shared/appError.js'
import {
	sendWithdrawalAdminEmail,
	sendWithdrawalUserEmail,
} from '../../services/shared/sendVerificationEmail.js'
import { getAdminConversionRate } from '../../models/AdminSettings.model.js'

const MIN_REFERRAL_WITHDRAWAL_USD = 5
const WITHDRAWAL_METHODS = ['bank', 'crypto']

export async function getMyReferralOverview(userId) {
	const user = await User.findById(userId).select(
		'refId referralWallet referralEarningsTotal',
	)

	if (!user) {
		throw new AppError('User not found', 404)
	}

	const totalReferred = await User.countDocuments({ referredBy: userId })

	return {
		refId: user.refId,
		referralWallet: user.referralWallet || 0,
		referralEarningsTotal: user.referralEarningsTotal || 0,
		totalReferred,
	}
}

export async function listMyReferees(userId, { page = 1, limit = 20 } = {}) {
	const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100)
	const safePage = Math.max(parseInt(page, 10) || 1, 1)
	const skip = (safePage - 1) * safeLimit

	const [referees, total] = await Promise.all([
		User.find({ referredBy: userId })
			.select('firstName lastName email createdAt')
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(safeLimit),
		User.countDocuments({ referredBy: userId }),
	])

	return {
		page: safePage,
		limit: safeLimit,
		total,
		totalPages: Math.ceil(total / safeLimit),
		referees: referees.map((u) => ({
			id: u._id,
			firstName: u.firstName,
			lastName: u.lastName,
			email: u.email,
			joinedAt: u.createdAt,
		})),
	}
}

export async function listMyCommissions(
	userId,
	{ page = 1, limit = 20 } = {},
) {
	const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100)
	const safePage = Math.max(parseInt(page, 10) || 1, 1)
	const skip = (safePage - 1) * safeLimit

	const [entries, total] = await Promise.all([
		Referral.find({ referrerId: userId, eventType: 'purchase' })
			.populate('refereeId', 'firstName lastName email')
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(safeLimit),
		Referral.countDocuments({
			referrerId: userId,
			eventType: 'purchase',
		}),
	])

	return {
		page: safePage,
		limit: safeLimit,
		total,
		totalPages: Math.ceil(total / safeLimit),
		entries: entries.map((e) => ({
			id: e._id,
			amount: e.rewardAmount,
			currency: e.rewardCurrency,
			status: e.status,
			referee: e.refereeId
				? {
						id: e.refereeId._id,
						firstName: e.refereeId.firstName,
						lastName: e.refereeId.lastName,
						email: e.refereeId.email,
					}
				: null,
			createdAt: e.createdAt,
		})),
	}
}

function validatePaymentInfo(method, paymentInfo) {
	if (!paymentInfo || typeof paymentInfo !== 'object') {
		throw new AppError('paymentInfo is required', 400)
	}

	if (method === 'bank') {
		const { bankName, accountName, accountNo } = paymentInfo
		if (!bankName || !accountName || !accountNo) {
			throw new AppError(
				'bankName, accountName and accountNo are required for bank withdrawal',
				400,
			)
		}
		return {
			bankName: String(bankName).trim(),
			accountName: String(accountName).trim(),
			accountNo: String(accountNo).trim(),
		}
	}

	const { walletType, walletAddress } = paymentInfo
	if (!walletType || !walletAddress) {
		throw new AppError(
			'walletType and walletAddress are required for crypto withdrawal',
			400,
		)
	}
	return {
		walletType: String(walletType).trim(),
		walletAddress: String(walletAddress).trim(),
	}
}

export async function requestReferralWithdrawal(userId, payload) {
	if (!userId) {
		throw new AppError('User authentication required', 401)
	}

	const amount = Number(payload?.amount)
	if (!amount || Number.isNaN(amount) || amount <= 0) {
		throw new AppError('Please enter a valid withdrawal amount', 400)
	}

	if (amount < MIN_REFERRAL_WITHDRAWAL_USD) {
		throw new AppError(
			`Minimum referral withdrawal amount is $${MIN_REFERRAL_WITHDRAWAL_USD}`,
			400,
		)
	}

	const method = payload?.method
	if (!method || !WITHDRAWAL_METHODS.includes(method)) {
		throw new AppError(
			'Invalid withdrawal method. Must be "bank" or "crypto"',
			400,
		)
	}

	const cleanPaymentInfo = validatePaymentInfo(method, payload?.paymentInfo)

	const user = await User.findById(userId)
	if (!user) {
		throw new AppError('User not found', 404)
	}

	if ((user.referralWallet || 0) < amount) {
		throw new AppError('Insufficient referral balance', 400)
	}

	// Atomic debit - only succeeds if balance is still sufficient
	const debited = await User.findOneAndUpdate(
		{ _id: userId, referralWallet: { $gte: amount } },
		{ $inc: { referralWallet: -amount } },
		{ new: true },
	)

	if (!debited) {
		throw new AppError('Insufficient referral balance', 400)
	}

	const fullName =
		[user.firstName, user.lastName].filter(Boolean).join(' ') ||
		user.email

	const requestedAt = new Date().toISOString()

	let payoutAmount
	let payoutCurrency
	let conversionRate

	if (method === 'bank') {
		conversionRate = await getAdminConversionRate()
		payoutAmount = amount * conversionRate
		payoutCurrency = 'NGN'
	}

	const withdrawal = await Withdrawal.create({
		userId,
		source: 'referral',
		amount,
		currency: 'USD',
		method,
		paymentInfo: cleanPaymentInfo,
		payoutAmount,
		payoutCurrency,
		conversionRate,
		status: 'pending',
		requestedAt,
	})

	const [adminResult, userResult] = await Promise.all([
		sendWithdrawalAdminEmail({
			hostName: fullName,
			hostEmail: user.email,
			hostPhone: user.phone,
			amount,
			method,
			paymentInfo: cleanPaymentInfo,
			requestedAt,
			currency: 'USD',
			requestType: 'referral',
			payoutAmount,
			payoutCurrency,
			conversionRate,
		}),
		sendWithdrawalUserEmail({
			customerEmail: user.email,
			hostName: fullName,
			amount,
			method,
			paymentInfo: cleanPaymentInfo,
			currency: 'USD',
		}),
	])

	if (!adminResult.success || !userResult.success) {
		// Refund on email failure so the user can retry
		await User.updateOne(
			{ _id: userId },
			{ $inc: { referralWallet: amount } },
		)

		await Withdrawal.updateOne(
			{ _id: withdrawal._id },
			{
				status: 'refunded',
				emailStatus: {
					admin: adminResult.success ? 'sent' : 'failed',
					user: userResult.success ? 'sent' : 'failed',
				},
				failureReason:
					adminResult.error || userResult.error || 'Email delivery failed',
			},
		)

		console.error('Referral withdrawal email failure:', {
			admin: adminResult,
			user: userResult,
		})

		throw new AppError(
			'Could not submit withdrawal request. Please try again later.',
			502,
		)
	}

	await Withdrawal.updateOne(
		{ _id: withdrawal._id },
		{
			status: 'submitted',
			emailStatus: { admin: 'sent', user: 'sent' },
		},
	)

	return {
		withdrawalId: withdrawal._id,
		amount,
		method,
		currency: 'USD',
		newBalance: debited.referralWallet,
		payoutAmount,
		payoutCurrency,
		conversionRate,
		requestedAt,
	}
}
