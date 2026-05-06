import asyncHandler from '../../services/shared/asyncHandler.js'
import AppError from '../../services/shared/appError.js'
import {
	getAllEventsWithStats,
	getAdminAnalytics,
	updateEventStatusAdmin,
	getEventByIdAdmin,
	searchEventsAdmin,
} from './admin.service.js'
import AdminSettings, {
	getAdminSettings,
} from '../../models/AdminSettings.model.js'

export const getAdminSettingsController = asyncHandler(async (req, res) => {
	const settings = await getAdminSettings()
	return res.status(200).json({
		conversionRate: settings.conversionRate,
		updatedAt: settings.updatedAt,
	})
})

export const updateAdminSettingsController = asyncHandler(async (req, res) => {
	const { conversionRate } = req.body

	if (conversionRate === undefined) {
		throw new AppError('conversionRate is required', 400)
	}

	const rate = Number(conversionRate)
	if (!Number.isFinite(rate) || rate < 100) {
		throw new AppError('conversionRate must be a number >= 100', 400)
	}

	const settings = await AdminSettings.findOneAndUpdate(
		{ key: 'global' },
		{ $set: { conversionRate: rate } },
		{ new: true, upsert: true },
	)

	return res.status(200).json({
		conversionRate: settings.conversionRate,
		updatedAt: settings.updatedAt,
	})
})

export const getAllEventsController = asyncHandler(async (req, res) => {
	const { page = 1, limit = 10 } = req.query

	const result = await getAllEventsWithStats(page, limit)

	res.status(200).json({
		success: true,
		data: result,
	})
})

export const getAnalyticsController = asyncHandler(async (req, res) => {
	const result = await getAdminAnalytics()

	res.status(200).json({
		success: true,
		data: result,
	})
})

export const updateEventStatusController = asyncHandler(async (req, res) => {
	const { eventId } = req.params
	const { status } = req.body

	if (!eventId || !status) {
		throw new AppError('Event ID and status are required', 400)
	}

	const result = await updateEventStatusAdmin(eventId, status)

	res.status(200).json({
		success: true,
		message: `Event status updated to ${status}`,
		data: result,
	})
})

export const getEventDetailsController = asyncHandler(async (req, res) => {
	const { eventId } = req.params

	if (!eventId) {
		throw new AppError('Event ID is required', 400)
	}

	const result = await getEventByIdAdmin(eventId)

	res.status(200).json({
		success: true,
		data: result,
	})
})

export const searchEventsController = asyncHandler(async (req, res) => {
	const { searchTerm, page = 1, limit = 10 } = req.query

	if (!searchTerm) {
		throw new AppError('Search term is required', 400)
	}

	const result = await searchEventsAdmin(searchTerm, page, limit)

	res.status(200).json({
		success: true,
		data: result,
	})
})
