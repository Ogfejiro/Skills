import asyncHandler from '../../services/shared/asyncHandler.js'
import AppError from '../../services/shared/appError.js'
import {
	createEventEmailTemplate,
	getEventEmailTemplate,
	updateEventEmailTemplate,
} from './eventEmail.service.js'

export const creteEventEmail = asyncHandler(async (req, res) => {
	const hostId = req.hostProfile._id
	const eventId = req.params.eventId
	const { subject, htmlContent, isEnabled } = req.body

	if (!hostId) {
		throw new AppError('Unauthorized', 409)
	}

	if (!eventId || !subject || !htmlContent) {
		throw new AppError('All Fields are required', 401)
	}

	const result = await createEventEmailTemplate(hostId, {
		eventId,
		subject,
		htmlContent,
		isEnabled: isEnabled ?? true,
	})

	return res
		.status(201)
		.json({ message: 'Event Email set successfully', data: result })
})

export const getEventEmail = asyncHandler(async (req, res) => {
	const hostId = req.hostProfile._id
	const eventId = req.params.eventId
	if (!eventId) {
		throw new AppError('Event ID is required', 401)
	}

	const result = await getEventEmailTemplate(hostId, eventId)

	return res.status(200).json(result)
})

export const updateEventEmail = asyncHandler(async (req, res) => {
	const hostId = req.hostProfile._id
	const eventId = req.params.eventId
	const { subject, htmlContent, isEnabled } = req.body

	if (!eventId) {
		throw new AppError('Event ID is required', 401)
	}
	if (!hostId) {
		throw new AppError('Unauthorized', 409)
	}

	const result = await updateEventEmailTemplate(hostId, eventId, {
		subject,
		htmlContent,
		isEnabled,
	})

	return res.status(200).json(result)
})
