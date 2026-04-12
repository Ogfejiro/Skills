import User from '../../models/User.model.js'
import Event from '../../models/Event.model.js'
import EventTicket from '../../models/EventTicket.model.js'
import AppError from '../../services/shared/appError.js'
import cloudinary from './../../config/cloudinary.js'
import { sendEventEmail } from '../../services/shared/sendVerificationEmail.js'

export const createEvent = async (hostId, eventData) => {
	const user = await User.findById(hostId)
	const event = await Event.create({ ...eventData, hostId })

	await sendEventEmail({
		customerEmail: user.email,
		title: eventData.title,
		date: eventData.date,
	})

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
	const events = await Event.find({ status: { $in: ['live'] }, approvalStatus: 'approved' })
		.sort({ date: 1 })
		.limit(query.limit * 1 || 10)
		.skip((query.page - 1) * query.limit)
	const total = await Event.countDocuments({ status: 'live', approvalStatus: 'approved' })
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
		updateData.status?.includes('live') &&
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
	const user = await User.findById(hostId)
	if (!user) {
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

	return {
		...paramsToSign,
		signature,
		apiKey: process.env.CLOUDINARY_API_KEY,
		cloudName: process.env.CLOUDINARY_CLOUD_NAME,
	}
}

export const getPendingEvents = async (page, limit) => {
	const skip = (page - 1) * limit
	const events = await Event.find({ approvalStatus: 'pending' })
		.populate('hostId', 'firstName lastName organization email')
		.sort({ createdAt: -1 })
		.skip(skip)
		.limit(Number(limit))
	
	const total = await Event.countDocuments({ approvalStatus: 'pending' })
	
	return {
		events,
		page: Number(page),
		totalPages: Math.ceil(total / limit),
		totalEvents: total,
	}
}

export const approveEvent = async (eventId) => {
	const event = await Event.findById(eventId)
	if (!event) throw new AppError('Event not found', 404)
	
	const updated = await Event.findByIdAndUpdate(
		eventId,
		{
			approvalStatus: 'approved',
			isApproved: true,
			approvalDate: new Date(),
		},
		{ new: true }
	).populate('hostId', 'firstName lastName')
	
	return updated
}

export const rejectEvent = async (eventId, rejectionReason) => {
	const event = await Event.findById(eventId)
	if (!event) throw new AppError('Event not found', 404)
	
	const updated = await Event.findByIdAndUpdate(
		eventId,
		{
			approvalStatus: 'rejected',
			isApproved: false,
			approvalDate: new Date(),
			rejectionReason,
		},
		{ new: true }
	).populate('hostId', 'firstName lastName')
	
	return updated
}

