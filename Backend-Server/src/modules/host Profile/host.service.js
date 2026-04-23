import HostProfile from '../../models/Host.model.js'
import User from '../../models/User.model.js'
import AppError from '../../services/shared/appError.js'

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
	const user = await getUserOrThrow(userId)
	const profile = await getHostProfileOrThrow(userId)

	return {
		...user.toObject(),
		...profile.toObject(),
	}
}

export async function createHostProfile(userId, payload) {
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

export const getDashboard = async (userId) => {
	const profile = await getHostProfileOrThrow(userId)

	return {
		profile,
		totalEarnings: 0,
		balance: profile.balance || 0,
		eventEarnings: {},
	}
}
