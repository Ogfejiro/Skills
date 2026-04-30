import asyncHandler from '../../services/shared/asyncHandler.js'
import AppError from '../../services/shared/appError.js'
import {
	createHostProfile,
	updateProfile,
	getProfile,
	deleteProfile,
	getDashboard,
} from './host.service.js'

const allowedFields = [
	'firstName',
	'lastName',
	'phone',
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

function pickAllowedFields(body) {
	const profileData = {}

	for (const key of allowedFields) {
		if (body[key] !== undefined) {
			profileData[key] = body[key]
		}
	}

	return profileData
}

export const createHostProfileController = asyncHandler(async (req, res) => {
	const userId = req.user.id
	const profileData = pickAllowedFields(req.body)
	const profile = await createHostProfile(userId, profileData)

	res.status(201).json({
		success: true,
		message: 'Host profile created successfully',
		data: profile,
	})
})

export const updateHostProfile = asyncHandler(async (req, res) => {
	const userId = req.user.id
	const updateData = pickAllowedFields(req.body)
	const profile = await updateProfile(userId, updateData)

	res.status(200).json({
		success: true,
		message: 'Host profile updated successfully',
		data: profile,
	})
})

export const getHostProfile = asyncHandler(async (req, res) => {
	const profile = await getProfile(req.user.id)

	res.status(200).json({
		success: true,
		data: profile,
	})
})

export const deleteHostProfile = asyncHandler(async (req, res) => {
	await deleteProfile(req.user.id)

	res.status(200).json({
		success: true,
		message: 'Host profile deleted successfully',
	})
})

export const getHostDashboard = asyncHandler(async (req, res) => {
	const userId = req.user.id

	if (!userId) {
		throw new AppError('Unauthorized', 401)
	}

	const dashboard = await getDashboard(userId)

	res.status(200).json({
		success: true,
		data: dashboard,
	})
})
