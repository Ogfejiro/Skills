import EventEmail from '../../models/EventEmail.model.js'
import Event from '../../models/Event.model.js'
import AppError from '../../services/shared/appError.js'

async function getOwnedEventOrThrow(eventId, hostId) {
	const event = await Event.findOne({ _id: eventId, hostId })

	if (!event) {
		throw new AppError('Event not found or not authorized', 404)
	}

	return event
}

export async function createEventEmailTemplate(hostId, payload) {
	const { eventId, subject, htmlContent, isEnabled } = payload

	await getOwnedEventOrThrow(eventId, hostId)

	const existingTemplate = await EventEmail.findOne({ eventId })

	if (existingTemplate) {
		throw new AppError(
			'Custom event email already exists for this event',
			409,
		)
	}

	const template = await EventEmail.create({
		eventId,
		hostId,
		subject,
		htmlContent,
		isEnabled,
	})

	return template.populate('eventId', 'title date venue status')
}

export async function getEventEmailTemplate(hostId, eventId) {
	await getOwnedEventOrThrow(eventId, hostId)

	const template = await EventEmail.findOne({ eventId, hostId }).populate(
		'eventId',
		'title date venue status',
	)

	if (!template) {
		throw new AppError('Custom event email not found', 404)
	}

	return template
}

// Helper function to get event email template by eventId only (for payment service)
export async function getEventEmailTemplateByEventId(eventId) {
	const template = await EventEmail.findOne({ eventId, isEnabled: true })

	return template // Returns null if not found or not enabled
}

export async function getHostEventEmailTemplates(hostId, page, limit) {
	const query = { hostId }

	const templates = await EventEmail.find(query)
		.sort({ createdAt: -1 })
		.skip((page - 1) * limit)
		.limit(Number(limit))
		.populate('eventId', 'title date venue status')

	const total = await EventEmail.countDocuments(query)

	return {
		templates,
		page: Number(page),
		totalPages: Math.ceil(total / limit),
		totalTemplates: total,
	}
}

export async function updateEventEmailTemplate(hostId, eventId, updateData) {
	await getOwnedEventOrThrow(eventId, hostId)

	const template = await EventEmail.findOneAndUpdate(
		{ eventId, hostId },
		{ $set: updateData },
		{ new: true, runValidators: true },
	).populate('eventId', 'title date venue status')

	if (!template) {
		throw new AppError('Custom event email not found', 404)
	}

	return template
}

export async function deleteEventEmailTemplate(hostId, eventId) {
	await getOwnedEventOrThrow(eventId, hostId)

	const deleted = await EventEmail.findOneAndDelete({ eventId, hostId })

	if (!deleted) {
		throw new AppError('Custom event email not found', 404)
	}

	return {
		success: true,
		message: 'Custom event email deleted successfully',
	}
}
