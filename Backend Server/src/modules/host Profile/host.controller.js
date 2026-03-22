import asyncHandler from '../../services/shared/asyncHandler.js'
import { updateProfile, getProfile, deleteProfile } from './host.service.js'

export const updateHostProfile = asyncHandler(async (req, res) => {
  const profile = await updateProfile(req.user.id, req.body)
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
