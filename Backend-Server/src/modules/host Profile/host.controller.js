import asyncHandler from '../../services/shared/asyncHandler.js'
import {
    updateProfile,
    getProfile,
    deleteProfile,
    getDashboard,
} from './host.service.js'

export const updateHostProfile = asyncHandler(async (req, res) => {
    const allowedFields = [
        'address',
        'accountNo',
        'accountName',
        'walletAddress',
        'walletType',
        'conversionRate',
    ]
    const hostId = req.user.id

    const updateData = {}

    for (const key of allowedFields) {
        if (req.body[key] !== undefined) {
            updateData[key] = req.body[key]
        }
    }

    const profile = await updateProfile(hostId, updateData)

    res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
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
        message: 'Profile deleted successfully',
    })
})

export const getHostDashboard = asyncHandler(async (req, res) => {
    const { id } = req.user.id
    if (!id) {
        throw new AppError('UnAuthorized', 305)
    }

    const dashboard = await getDashboard(id)

    res.status(200).json({
        success: true,
        data: dashboard,
    })
})
