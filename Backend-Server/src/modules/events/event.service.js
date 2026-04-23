import User from '../../models/User.model.js'
import HostProfile from '../../models/Host.model.js'
import Event from '../../models/Event.model.js'
import EventTicket from '../../models/EventTicket.model.js'
import AppError from '../../services/shared/appError.js'
import cloudinary from './../../config/cloudinary.js'
import { sendEventEmail } from '../../services/shared/sendVerificationEmail.js'

const eventHostPopulate = {
	path: 'hostId',
	select: 'organization profession socials userId',
	populate: {
		path: 'userId',
		select: 'firstName lastName email phone',
	},
}

async function getHostProfileOrThrow(hostProfileId) {
	const hostProfile = await HostProfile.findById(hostProfileId)

	if (!hostProfile) {
		throw new AppError('Host profile not found', 404)
	}

	return hostProfile
}

export const createEvent = async (userId, hostProfileId, eventData) => {
	const [user, hostProfile] = await Promise.all([
		User.findById(userId),
		getHostProfileOrThrow(hostProfileId),
	])

	if (!user) {
		throw new AppError('User not found', 404)
	}

	const event = await Event.create({ ...eventData, hostId: hostProfile._id })

	await sendEventEmail(user.email, eventData.title, eventData.date)

	return event.populate(eventHostPopulate)
}

export const getHostEvents = async (hostProfileId, page, limit) => {
	if (!hostProfileId) {
		throw new AppError('Host profile ID is required', 400)
	}

	const query = { hostId: hostProfileId }

	const events = await Event.find(query)
		.sort({ createdAt: -1 })
		.skip((page - 1) * limit)
		.limit(Number(limit))
		.populate(eventHostPopulate)

	const total = await Event.countDocuments(query)

	return {
		events,
		page: Number(page),
		totalPages: Math.ceil(total / limit),
		totalEvents: total,
	}
}

export const getPublicEvents = async (query) => {
	const events = await Event.find({
		status: { $in: ['live'] },
		approvalStatus: 'approved',
	})
		.sort({ date: 1 })
		.limit(query.limit * 1 || 10)
		.skip((query.page - 1) * query.limit)
		.populate(eventHostPopulate)

	const total = await Event.countDocuments({
		status: 'live',
		approvalStatus: 'approved',
	})

	return {
		page: query.page,
		limit: query.limit,
		total: total,
		events,
	}
}

export const getPreviousEvents = async (query) => {
	const events = await Event.find({ status: { $in: ['ended'] }, approvalStatus: 'approved' })
		.sort({ date: -1 })
		.limit(query.limit * 1 || 10)
		.skip((query.page - 1) * query.limit)
	const total = await Event.countDocuments({ status: 'ended', approvalStatus: 'approved' })
	return {
		page: query.page,
		limit: query.limit,
		total: total,
		events,
	}
}

export const getEventsByStatus = async (query, status) => {
	const events = await Event.find({ status: { $in: [status] }, approvalStatus: 'approved' })
		.sort(status === 'live' ? { date: 1 } : { date: -1 })
		.limit(query.limit * 1 || 10)
		.skip((query.page - 1) * query.limit)
	const total = await Event.countDocuments({ status: status, approvalStatus: 'approved' })
	return {
		page: query.page,
		limit: query.limit,
		total: total,
		events,
	}
}

export const getEventById = async (id) => {
	const event = await Event.findById(id).populate(eventHostPopulate)
	if (!event) throw new AppError('Event not found', 404)
	return event
}

export const updateEvent = async (id, hostProfileId, updateData) => {
	const event = await Event.findOne({ _id: id, hostId: hostProfileId })
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

	return updated.populate(eventHostPopulate)
}

export const deleteEvent = async (id, hostProfileId) => {
	const event = await Event.findOneAndDelete({ _id: id, hostId: hostProfileId })
	if (!event) throw new AppError('Event not found or not authorized', 404)
	return { success: true, message: 'Event deleted' }
}

export const generateBannerSignature = async (hostProfileId) => {
	await getHostProfileOrThrow(hostProfileId)

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
		.populate(eventHostPopulate)
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
		{ new: true },
	).populate(eventHostPopulate)

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
		{ new: true },
	).populate(eventHostPopulate)

	return updated
}
