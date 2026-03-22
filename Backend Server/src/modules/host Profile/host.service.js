import HostProfile from '../../models/Host.model.js'
import User from '../../models/User.model.js'
import AppError from '../../services/shared/appError.js'

export const updateProfile = async (hostId, updateData) => {
    const session = await HostProfile.startSession()
    let profile

    await session.withTransaction(async () => {
        const user = await User.findById(hostId)
            .select('firstName lastName')
            .session(session)
        if (!user || user.role !== 'Host') {
            throw new AppError('Host not found', 404)
        }

        const expectedName = `${user.firstName} ${user.lastName}`

        if (updateData.accountName && updateData.accountName !== expectedName) {
            throw new AppError('Account name must match profile name', 400)
        }

        profile = await HostProfile.findOne({ hostId }).session(session)

        if (updateData.walletAddress) {
            if (profile && profile.walletSet) {
                throw new AppError('Wallet address can only be set once', 400)
            }
            updateData.walletSet = true
        }

        if ('conversionRate' in updateData && updateData.conversionRate < 100) {
            throw new AppError('Conversion rate must be at least 100', 400)
        }

        if (profile) {
            profile = await HostProfile.findOneAndUpdate(
                { hostId },
                { $set: updateData },
                { new: true, runValidators: true },
            ).session(session)
        } else {
            updateData.hostId = hostId
            profile = await HostProfile.create([updateData], { session })
        }
    })

    await session.endSession()
    return profile[0] || profile
}

export const getProfile = async (hostId) => {
    const user = await User.findById(hostId).select(
        'role email phone refId firstName lastName profession emailVerified phoneVerified',
    )
    if (!user || user.role !== 'Host') throw new AppError('Host not found', 404)
    const profile = await HostProfile.findOne({ hostId })
    return (profile, user)
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
