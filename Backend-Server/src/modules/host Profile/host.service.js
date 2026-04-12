import HostProfile from '../../models/Host.model.js'
import User from '../../models/User.model.js'
import AppError from '../../services/shared/appError.js'

export async function updateProfile(hostId, updateData) {
	const user = await User.findById(hostId).select('firstName lastName role')

	if (!user || user.role.toLowerCase() !== 'host') {
		throw new AppError('Host not found', 404)
	}

	const expectedName = `${user.firstName} ${user.lastName}`

	if (updateData.accountName && updateData.accountName !== expectedName) {
		throw new AppError('Account name must match profile name', 400)
	}

	// Separate User model fields from Host profile fields
	const userFields = ['firstName', 'lastName', 'profession', 'phone']
	const userUpdateData = {}
	const hostUpdateData = {}

	for (const [key, value] of Object.entries(updateData)) {
		if (userFields.includes(key)) {
			userUpdateData[key] = value
		} else {
			hostUpdateData[key] = value
		}
	}

	// Update User model if there are user fields to update
	if (Object.keys(userUpdateData).length > 0) {
		await User.findByIdAndUpdate(
			hostId,
			{ $set: userUpdateData },
			{ new: true, runValidators: true },
		)
	}

	let profile = await HostProfile.findOne({ hostId })

	if (hostUpdateData.walletAddress) {
		if (profile && profile.walletSet) {
			throw new AppError('Wallet address can only be set once', 400)
		}
		hostUpdateData.walletSet = true
	}

	if (
		'conversionRate' in hostUpdateData &&
		hostUpdateData.conversionRate < 100
	) {
		throw new AppError('Conversion rate must be at least 100', 400)
	}

	if (profile) {
		profile = await HostProfile.findOneAndUpdate(
			{ hostId },
			{ $set: hostUpdateData },
			{ new: true, runValidators: true },
		)
	} else if (Object.keys(hostUpdateData).length > 0) {
		hostUpdateData.hostId = hostId
		profile = await HostProfile.create(hostUpdateData)
	}

	return profile
}
export const getProfile = async (hostId) => {
	const user = await User.findById(hostId).select(
		'role email phone refId firstName lastName profession emailVerified phoneVerified',
	)

	if (!user || user.role.toLowerCase() !== 'host') {
		throw new AppError('Host not found', 404)
	}

	const profile = await HostProfile.findOne({ hostId })

	return {
		...user.toObject(), // convert Mongoose doc to plain object
		...((profile && profile.toObject()) || {}), // merge profile if exists
	}
}
export const deleteProfile = async (hostId) => {
	const user = await User.findById(hostId).select('role')
	if (!user || user.role !== 'Host') throw new AppError('Host not found', 404)
	const deleted = await User.deleteOne({ hostId })
	if (deleted.deletedCount === 0) throw new AppError('Profile not found', 404)
	return { success: true, message: 'Profile deleted successfully' }
}

export const getDashboard = async (hostId) => {
	const user = await User.findById(hostId).select('role')
	if (!user || user.role !== 'Host') throw new AppError('Host not found', 404)
	const profile = await HostProfile.findOne({ hostId }).select(
		'balance conversionRate walletSet accountNo accountName walletAddress',
	)
	return {
		profile,
		totalEarnings: 0, // TODO: aggregate from successful payments
		balance: profile?.balance || 0,
		eventEarnings: {}, // per event later
	}
}
