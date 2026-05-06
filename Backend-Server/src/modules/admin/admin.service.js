import AppError from '../../services/shared/appError.js'
import Event from '../../models/Event.model.js'
import EventTicket from '../../models/EventTicket.model.js'
import paymentModel from '../../models/payment.model.js'
import { getAdminConversionRate } from '../../models/AdminSettings.model.js'

function paymentToUsd(payment, fallbackRate) {
	if (payment.grossUsd !== undefined && payment.grossUsd !== null) {
		return payment.grossUsd
	}

	const amount = Number(payment.amount) || 0
	if (!amount) return 0

	if (payment.currency === 'NGN') {
		return fallbackRate ? amount / fallbackRate : 0
	}

	return amount
}

function sumUsdRevenue(payments, fallbackRate) {
	return payments.reduce(
		(sum, payment) => sum + paymentToUsd(payment, fallbackRate),
		0,
	)
}

const eventHostPopulate = {
	path: 'hostId',
	select: 'organization profession socials userId',
	populate: {
		path: 'userId',
		select: 'firstName lastName email phone',
	},
}

function mapHostProfile(hostProfile) {
	const user = hostProfile?.userId

	return {
		_id: hostProfile?._id,
		name: [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim(),
		email: user?.email,
		organization: hostProfile?.organization,
	}
}

export async function getAllEventsWithStats(page, limit) {
	if (!page || !limit) {
		throw new AppError('Page and limit are required', 400)
	}

	const skip = (page - 1) * limit

	const events = await Event.find()
		.sort({ createdAt: -1 })
		.skip(skip)
		.limit(Number(limit))
		.populate(eventHostPopulate)

	const totalEvents = await Event.countDocuments()
	const fallbackRate = await getAdminConversionRate()

	const eventsWithStats = await Promise.all(
		events.map(async (event) => {
			const tickets = await EventTicket.find({ eventId: event._id })
			const ticketsSold = tickets.reduce(
				(sum, ticket) => sum + ticket.sold,
				0,
			)

			const payments = await paymentModel.find({
				ticketName: { $in: tickets.map((t) => t.title) },
				status: 'successful',
			})

			const totalRevenue = sumUsdRevenue(payments, fallbackRate)

			return {
				_id: event._id,
				title: event.title,
				date: event.date,
				venue: event.venue,
				status: event.status,
				category: event.category,
				capacity: event.capacity,
				ticketsSold,
				totalRevenue,
				revenueCurrency: 'USD',
				host: mapHostProfile(event.hostId),
			}
		}),
	)

	return {
		events: eventsWithStats,
		page: Number(page),
		limit: Number(limit),
		totalEvents,
		totalPages: Math.ceil(totalEvents / limit),
	}
}

export async function getAdminAnalytics() {
	const totalEvents = await Event.countDocuments()

	const totalLiveEvents = await Event.countDocuments({ status: 'live' })

	const ticketStats = await EventTicket.aggregate([
		{
			$group: {
				_id: null,
				totalTicketsSold: { $sum: '$sold' },
			},
		},
	])

	const totalTicketsSold = ticketStats[0]?.totalTicketsSold || 0

	const successfulPayments = await paymentModel.find({
		status: 'successful',
	})
	const fallbackRate = await getAdminConversionRate()
	const totalAmountEarned = sumUsdRevenue(successfulPayments, fallbackRate)
	const totalTransactions = successfulPayments.length

	const eventsByStatus = await Event.aggregate([
		{
			$group: {
				_id: '$status',
				count: { $sum: 1 },
			},
		},
	])

	const statusBreakdown = {}
	eventsByStatus.forEach((item) => {
		statusBreakdown[item._id] = item.count
	})

	return {
		totalEvents,
		totalLiveEvents,
		totalTicketsSold,
		totalAmountEarned,
		revenueCurrency: 'USD',
		totalTransactions,
		eventsByStatus: statusBreakdown,
	}
}

export async function updateEventStatusAdmin(eventId, newStatus) {
	if (
		!['draft', 'Auditing', 'live', 'ended', 'cancelled'].includes(newStatus)
	) {
		throw new AppError(
			'Invalid status. Must be one of: draft, Auditing, live, ended, cancelled',
			400,
		)
	}

	const event = await Event.findById(eventId)
	if (!event) {
		throw new AppError('Event not found', 404)
	}

	if (newStatus === 'live') {
		const tickets = await EventTicket.findOne({ eventId })
		if (!tickets) {
			throw new AppError(
				'Cannot set event to live without at least one ticket',
				400,
			)
		}

		if (new Date(event.date) < new Date()) {
			throw new AppError(
				'Cannot set event to live if the date is in the past',
				400,
			)
		}
	}

	const updatedEvent = await Event.findByIdAndUpdate(
		eventId,
		{ status: newStatus },
		{
			new: true,
			runValidators: true,
		},
	).populate(eventHostPopulate)

	if (!updatedEvent) {
		throw new AppError('Failed to update event', 500)
	}

	return updatedEvent
}

export async function getEventByIdAdmin(eventId) {
	if (!eventId) {
		throw new AppError('Event ID is required', 400)
	}

	const event = await Event.findById(eventId).populate(eventHostPopulate)

	if (!event) {
		throw new AppError('Event not found', 404)
	}

	const tickets = await EventTicket.find({ eventId })
	const ticketsSold = tickets.reduce((sum, ticket) => sum + ticket.sold, 0)
	const ticketsAvailable = tickets.reduce(
		(sum, ticket) => sum + ticket.quantity,
		0,
	)

	const payments = await paymentModel.find({
		ticketName: { $in: tickets.map((t) => t.title) },
		status: 'successful',
	})

	const fallbackRate = await getAdminConversionRate()
	const totalRevenue = sumUsdRevenue(payments, fallbackRate)
	const totalTransactions = payments.length

	return {
		_id: event._id,
		title: event.title,
		description: event.description,
		date: event.date,
		venue: event.venue,
		status: event.status,
		category: event.category,
		capacity: event.capacity,
		banner: event.banner,
		ticketsSold,
		ticketsAvailable,
		ticketsRemaining: ticketsAvailable - ticketsSold,
		totalRevenue,
		revenueCurrency: 'USD',
		totalTransactions,
		ticketDetails: tickets,
		host: mapHostProfile(event.hostId),
		createdAt: event.createdAt,
		updatedAt: event.updatedAt,
	}
}

export async function searchEventsAdmin(searchTerm, page, limit) {
	if (!searchTerm) {
		throw new AppError('Search term is required', 400)
	}

	if (!page || !limit) {
		throw new AppError('Page and limit are required', 400)
	}

	const skip = (page - 1) * limit

	const query = {
		$or: [
			{ title: { $regex: searchTerm, $options: 'i' } },
			{ status: searchTerm.toLowerCase() },
		],
	}

	const events = await Event.find(query)
		.sort({ createdAt: -1 })
		.skip(skip)
		.limit(Number(limit))
		.populate(eventHostPopulate)

	const total = await Event.countDocuments(query)
	const fallbackRate = await getAdminConversionRate()

	const eventsWithStats = await Promise.all(
		events.map(async (event) => {
			const tickets = await EventTicket.find({
				eventId: event._id,
			})
			const ticketsSold = tickets.reduce(
				(sum, ticket) => sum + ticket.sold,
				0,
			)

			const payments = await paymentModel.find({
				ticketName: { $in: tickets.map((t) => t.title) },
				status: 'successful',
			})

			const totalRevenue = sumUsdRevenue(payments, fallbackRate)

			return {
				_id: event._id,
				title: event.title,
				date: event.date,
				status: event.status,
				ticketsSold,
				totalRevenue,
				revenueCurrency: 'USD',
				host: mapHostProfile(event.hostId),
			}
		}),
	)

	return {
		events: eventsWithStats,
		page: Number(page),
		limit: Number(limit),
		total,
		totalPages: Math.ceil(total / limit),
	}
}
