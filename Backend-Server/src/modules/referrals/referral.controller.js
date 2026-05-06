import asyncHandler from '../../services/shared/asyncHandler.js'
import {
	getMyReferralOverview,
	listMyReferees,
	listMyCommissions,
	requestReferralWithdrawal,
} from './referral.service.js'

export const getMyOverview = asyncHandler(async (req, res) => {
	const result = await getMyReferralOverview(req.user.id)
	return res.status(200).json(result)
})

export const getMyReferees = asyncHandler(async (req, res) => {
	const { page, limit } = req.query
	const result = await listMyReferees(req.user.id, { page, limit })
	return res.status(200).json(result)
})

export const getMyCommissions = asyncHandler(async (req, res) => {
	const { page, limit } = req.query
	const result = await listMyCommissions(req.user.id, { page, limit })
	return res.status(200).json(result)
})

export const requestWithdrawal = asyncHandler(async (req, res) => {
	const { amount, method, paymentInfo } = req.body

	const result = await requestReferralWithdrawal(req.user.id, {
		amount,
		method,
		paymentInfo,
	})

	return res.status(200).json({
		success: true,
		message:
			'Withdrawal request submitted. Your payment will be processed within 24 hours.',
		data: result,
	})
})
