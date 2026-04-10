import User from '../../models/User.model.js'
import Event from '../../models/Event.model.js'
import EventTicket from '../../models/EventTicket.model.js'
import AppError from '../../services/shared/appError.js'
import cloudinary from './../../config/cloudinary.js'

export const createEvent = async (hostId, eventData) => {
	const event = await Event.create({ ...eventData, hostId })
	return event.populate('hostId', 'firstName lastName')
}

export const getHostEvents = async (hostId, page, limit) => {
	if (!hostId) throw new Error('Host ID is required')

	const query = { hostId: hostId }

	const events = await Event.find(query)
		.sort({ createdAt: -1 })
		.skip((page - 1) * limit)
		.limit(Number(limit))
		.select()

	const total = await Event.countDocuments(query)

	return {
		events,
		page: Number(page),
		totalPages: Math.ceil(total / limit),
		totalEvents: total,
	}
}

export const getPublicEvents = async (query) => {
	const events = await Event.find({ status: { $in: ['live'] } })
		.sort({ date: 1 })
		.limit(query.limit * 1 || 10)
		.skip((query.page - 1) * query.limit)
	const total = await Event.countDocuments({ status: 'live' })
	return {
		page: query.page,
		limit: query.limit,
		Total: total,
		events,
	}
}

export const getEventById = async (id) => {
	const event = await Event.findById(id)
	if (!event) throw new AppError('Event not found', 404)
	return event
}

export const updateEvent = async (id, hostId, updateData) => {
	const event = await Event.findOne({ _id: id, hostId })
	if (!event) throw new AppError('Event not found or not authorized', 404)

	if (
		updateData.status.includes('live') &&
		new Date(event.date) < new Date()
	) {
		throw new AppError(
			'Cannot set event to live if the date is in the past',
			400,
		)
	}

	const ticket = await EventTicket.findOne({ eventId: id })
	if (updateData.status === 'live' && ticket == null) {
		throw new AppError(
			'Cannot set event to live without at least one ticket',
			400,
		)
	}

	const updated = await Event.findByIdAndUpdate(id, updateData, {
		new: true,
		runValidators: true,
	})
	return updated.populate('hostId', 'firstName lastName organization')
}

export const deleteEvent = async (id, hostId) => {
	const event = await Event.findOneAndDelete({ _id: id, hostId })
	if (!event) throw new AppError('Event not found or not authorized', 404)
	return { success: true, message: 'Event deleted' }
}

export const generateBannerSignature = async (hostId) => {
	const user = await User.findById({ _id: hostId })
	if (!user || user.role != 'Host') {
		throw new AppError('Invalid User', 400)
	}

	const timestamp = Math.round(Date.now() / 1000)

	const paramsToSign = {
		timestamp,
		folder: 'event_banner',
	}

	const signature = cloudinary.utils.api_sign_request(
		paramsToSign,
		process.env.CLOUDINARY_API_SECRET,
	)

	return res.json({
		...paramsToSign,
		signature,
		apiKey: process.env.CLOUDINARY_API_KEY,
		cloudName: process.env.CLOUDINARY_CLOUD_NAME,
	})
}
