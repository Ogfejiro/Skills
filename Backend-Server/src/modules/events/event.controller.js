import asyncHandler from '../../services/shared/asyncHandler.js'
import {
	createEvent,
	getHostEvents,
	getPublicEvents,
	getEventById,
	updateEvent,
	deleteEvent,
	generateBannerSignature,
} from './event.service.js'

export const createEventController = asyncHandler(async (req, res) => {
	const id = req.user.id
	const {
		title,
		description,
		date,
		venue,
		capacity,
		banner,
		category,
		tags,
	} = req.body

	if (
		!title ||
		!description ||
		!date ||
		!venue ||
		!capacity ||
		!banner ||
		!category
	) {
		throw new AppError('All fields are required', 403)
	}

	if (capacity <= 5) {
		throw new AppError(
			'Event capacity cannot be less than or equal to 5',
			400,
		)
	}

	if (new Date(date) < new Date()) {
		throw new AppError('Event date cannot be in the past', 400)
	}

	const event = await createEvent(id, {
		title,
		description,
		date,
		venue,
		capacity,
		banner,
		category,
		tags,
	})

	res.status(201).json({
		success: true,
		message: 'Event created successfully',
		data: event,
	})
})

export const getHostEventsController = asyncHandler(async (req, res) => {
	console.log('hostId:', req.user.role)
	const { page = 1, limit = 10 } = req.query
	const hostId = req.user.id

	const eventsData = await getHostEvents(hostId, page, limit)

	res.status(200).json({
		success: true,
		data: eventsData,
	})
})

export const getPublicEventsController = asyncHandler(async (req, res) => {
	const { page, limit } = req.query
	const query = {
		page: parseInt(page) || 1,
		limit: parseInt(limit) || 10,
	}

	const events = await getPublicEvents(query)
	res.status(200).json({
		success: true,
		data: events,
	})
})

export const getEventController = asyncHandler(async (req, res) => {
	const event = await getEventById(req.params.id)
	res.status(200).json({
		success: true,
		data: event,
	})
})

export const updateEventController = asyncHandler(async (req, res) => {
	const event = await updateEvent(req.params.id, req.user.id, req.body)
	res.status(200).json({
		success: true,
		message: 'Event updated',
		data: event,
	})
})

export const deleteEventController = asyncHandler(async (req, res) => {
	await deleteEvent(req.params.id, req.user.id)
	res.status(200).json({
		success: true,
		message: 'Event deleted',
	})
})

export const cloudinarySignature = asyncHandler(async (req, res) => {
	const hostId = req.user.id

	if (!hostId) {
		throw new AppError('UnAthorized', 409)
	}

	const result = await generateBannerSignature(hostId)

	res.status(200).json(result)
})
