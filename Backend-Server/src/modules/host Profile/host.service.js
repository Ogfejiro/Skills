import HostProfile from '../../models/Host.model.js'
import User from '../../models/User.model.js'
import Withdrawal from '../../models/Withdrawal.model.js'
import AppError from '../../services/shared/appError.js'
import {
	sendWithdrawalAdminEmail,
	sendWithdrawalUserEmail,
} from '../../services/shared/sendVerificationEmail.js'
import { getAdminConversionRate } from '../../models/AdminSettings.model.js'

const MIN_WITHDRAWAL_USD = 5
const WITHDRAWAL_METHODS = ['bank', 'crypto']

const USER_FIELDS = ['firstName', 'lastName', 'phone']
const HOST_FIELDS = [
	'address',
	'profession',
	'organization',
	'accountNo',
	'accountName',
	'walletAddress',
	'walletType',
	'conversionRate',
	'bankName',
	'socials',
]

function splitProfileData(payload) {
	const userUpdateData = {}
	const hostUpdateData = {}

	for (const [key, value] of Object.entries(payload)) {
		if (value === undefined) continue

		if (USER_FIELDS.includes(key)) {
			userUpdateData[key] = value
			continue
		}

		if (HOST_FIELDS.includes(key)) {
			hostUpdateData[key] = value
		}
	}

	return { userUpdateData, hostUpdateData }
}

async function getUserOrThrow(userId) {
	const user = await User.findById(userId).select(
		'email phone refId firstName lastName emailVerified phoneVerified',
	)

	if (!user) {
		throw new AppError('User not found', 404)
	}

	return user
}

async function getHostProfileOrThrow(userId) {
	const profile = await HostProfile.findOne({ userId })

	if (!profile) {
		throw new AppError('Host profile not found', 404)
	}

	if (profile.revenue === undefined || profile.revenue === null) {
		profile.revenue = profile.balance || 0
		await profile.save()
	}

	return profile
}

function validateAccountName(user, userUpdateData, hostUpdateData) {
	if (!hostUpdateData.accountName) return

	const firstName = userUpdateData.firstName ?? user.firstName ?? ''
	const lastName = userUpdateData.lastName ?? user.lastName ?? ''
	const expectedName =
		`${firstName} ${lastName}`.trim() || `${lastName} ${firstName}`.trim()

	if (hostUpdateData.accountName !== expectedName) {
		throw new AppError('Account name must match profile name', 400)
	}
}

function validateHostData(existingProfile, hostUpdateData) {
	if (
		'conversionRate' in hostUpdateData &&
		Number(hostUpdateData.conversionRate) < 100
	) {
		throw new AppError('Conversion rate must be at least 100', 400)
	}

	if (
		hostUpdateData.walletAddress &&
		existingProfile &&
		existingProfile.walletSet &&
		hostUpdateData.walletAddress !== existingProfile.walletAddress
	) {
		throw new AppError('Wallet address can only be set once', 400)
	}

	if (hostUpdateData.walletAddress) {
		hostUpdateData.walletSet = true
	}
}

async function updateUserFields(userId, userUpdateData) {
	if (Object.keys(userUpdateData).length === 0) return

	await User.findByIdAndUpdate(
		userId,
		{ $set: userUpdateData },
		{ new: true, runValidators: true },
	)
}

async function buildHostResponse(userId) {
	const [user, profile, adminConversionRate] = await Promise.all([
		getUserOrThrow(userId),
		getHostProfileOrThrow(userId),
		getAdminConversionRate(),
	])

	return {
		...user.toObject(),
		...profile.toObject(),
		adminConversionRate,
	}
}

export async function createHostProfile(userId, payload) {
	if (!userId) {
		throw new AppError('User authentication required', 401)
	}

	const user = await getUserOrThrow(userId)
	const existingProfile = await HostProfile.findOne({ userId })

	if (existingProfile) {
		throw new AppError('Host profile already exists', 409)
	}

	const { userUpdateData, hostUpdateData } = splitProfileData(payload)

	validateAccountName(user, userUpdateData, hostUpdateData)
	validateHostData(null, hostUpdateData)

	await updateUserFields(userId, userUpdateData)

	await HostProfile.create({
		userId,
		...hostUpdateData,
	})

	return buildHostResponse(userId)
}

export async function updateProfile(userId, updateData) {
	const user = await getUserOrThrow(userId)
	const profile = await getHostProfileOrThrow(userId)
	const { userUpdateData, hostUpdateData } = splitProfileData(updateData)

	validateAccountName(user, userUpdateData, hostUpdateData)
	validateHostData(profile, hostUpdateData)

	await updateUserFields(userId, userUpdateData)

	if (Object.keys(hostUpdateData).length > 0) {
		await HostProfile.findOneAndUpdate(
			{ userId },
			{ $set: hostUpdateData },
			{ new: true, runValidators: true },
		)
	}

	return buildHostResponse(userId)
}

export const getProfile = async (userId) => buildHostResponse(userId)

export const deleteProfile = async (userId) => {
	await getUserOrThrow(userId)

	const deleted = await HostProfile.deleteOne({ userId })

	if (deleted.deletedCount === 0) {
		throw new AppError('Host profile not found', 404)
	}

	return { success: true, message: 'Host profile deleted successfully' }
}

function resolveWithdrawalMethod(profile, requestedMethod) {
	if (requestedMethod) {
		if (!WITHDRAWAL_METHODS.includes(requestedMethod)) {
			throw new AppError('Invalid withdrawal method', 400)
		}
		return requestedMethod
	}

	const hasBank = Boolean(profile.accountNo && profile.accountName)
	const hasCrypto = Boolean(profile.walletAddress && profile.walletType)

	if (hasBank && hasCrypto) {
		throw new AppError(
			'Please select a withdrawal method (bank or crypto)',
			400,
		)
	}

	if (hasBank) return 'bank'
	if (hasCrypto) return 'crypto'

	return null
}

function ensureMethodConfigured(profile, method) {
	if (method === 'bank') {
		if (!profile.accountNo || !profile.accountName || !profile.bankName) {
			throw new AppError(
				'You must set your bank details before withdrawing',
				400,
			)
		}
		return
	}

	if (!profile.walletAddress || !profile.walletType) {
		throw new AppError(
			'You must set your crypto wallet before withdrawing',
			400,
		)
	}
}

function ensurePaymentInfoMatches(profile, method, paymentInfo) {
	if (!paymentInfo) return

	if (method === 'bank') {
		const mismatch =
			(paymentInfo.accountNo && paymentInfo.accountNo !== profile.accountNo) ||
			(paymentInfo.accountName &&
				paymentInfo.accountName !== profile.accountName) ||
			(paymentInfo.bankName && paymentInfo.bankName !== profile.bankName)

		if (mismatch) {
			throw new AppError(
				'Selected bank details do not match your saved profile',
				400,
			)
		}
		return
	}

	const mismatch =
		(paymentInfo.walletAddress &&
			paymentInfo.walletAddress !== profile.walletAddress) ||
		(paymentInfo.walletType &&
			paymentInfo.walletType !== profile.walletType)

	if (mismatch) {
		throw new AppError(
			'Selected wallet details do not match your saved profile',
			400,
		)
	}
}

function buildPaymentInfo(profile, method) {
	if (method === 'bank') {
		return {
			bankName: profile.bankName,
			accountName: profile.accountName,
			accountNo: profile.accountNo,
		}
	}

	return {
		walletType: profile.walletType,
		walletAddress: profile.walletAddress,
	}
}

export async function requestWithdrawal(userId, payload) {
	if (!userId) {
		throw new AppError('User authentication required', 401)
	}

	const amount = Number(payload?.amount)

	if (!amount || Number.isNaN(amount) || amount <= 0) {
		throw new AppError('Please enter a valid withdrawal amount', 400)
	}

	if (amount < MIN_WITHDRAWAL_USD) {
		throw new AppError(
			`Minimum withdrawal amount is $${MIN_WITHDRAWAL_USD}`,
			400,
		)
	}

	const user = await getUserOrThrow(userId)
	const profile = await getHostProfileOrThrow(userId)

	if ((profile.balance || 0) < amount) {
		throw new AppError('Insufficient balance', 400)
	}

	const method = resolveWithdrawalMethod(profile, payload?.method)

	if (!method) {
		throw new AppError(
			'You must set a withdrawal method (bank or crypto) first',
			400,
		)
	}

	ensureMethodConfigured(profile, method)
	ensurePaymentInfoMatches(profile, method, payload?.paymentInfo)

	const updatedProfile = await HostProfile.findOneAndUpdate(
		{ userId, balance: { $gte: amount } },
		{ $inc: { balance: -amount } },
		{ new: true },
	)

	if (!updatedProfile) {
		throw new AppError('Insufficient balance', 400)
	}

	const paymentInfo = buildPaymentInfo(profile, method)
	const hostName = `${user.firstName || ''} ${user.lastName || ''}`.trim()
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
		source: 'host',
		amount,
		currency: 'USD',
		method,
		paymentInfo,
		payoutAmount,
		payoutCurrency,
		conversionRate,
		status: 'pending',
		requestedAt,
	})

	const [adminResult, userResult] = await Promise.all([
		sendWithdrawalAdminEmail({
			hostName,
			hostEmail: user.email,
			hostPhone: user.phone,
			amount,
			method,
			paymentInfo,
			requestedAt,
			currency: 'USD',
			requestType: 'host',
			payoutAmount,
			payoutCurrency,
			conversionRate,
		}),
		sendWithdrawalUserEmail({
			customerEmail: user.email,
			hostName,
			amount,
			method,
			paymentInfo,
			currency: 'USD',
		}),
	])

	if (!adminResult.success || !userResult.success) {
		// Refund on email failure so the user can retry
		await HostProfile.updateOne(
			{ userId },
			{ $inc: { balance: amount } },
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

		console.error('Withdrawal email failure:', {
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
		currency: 'USD',
		method,
		paymentInfo,
		balance: updatedProfile.balance,
		payoutAmount,
		payoutCurrency,
		conversionRate,
		requestedAt,
	}
}

export const getDashboard = async (userId) => {
	const profile = await getHostProfileOrThrow(userId)

	return {
		profile,
		totalEarnings: profile.revenue || 0,
		balance: profile.balance || 0,
		revenue: profile.revenue || 0,
		eventEarnings: {},
	}
}
