import AppError from '../../services/shared/appError.js'
import Event from '../../models/Event.model.js'
import EventTicket from '../../models/EventTicket.model.js'
import paymentModel from '../../models/payment.model.js'

export async function getAllEventsWithStats(page, limit) {
	if (!page || !limit) {
		throw new AppError('Page and limit are required', 400)
	}

	const skip = (page - 1) * limit

	const events = await Event.find()
		.sort({ createdAt: -1 })
		.skip(skip)
		.limit(Number(limit))
		.populate('hostId', 'firstName lastName email organization')

	const totalEvents = await Event.countDocuments()

	const eventsWithStats = await Promise.all(
		events.map(async (event) => {
			const tickets = await EventTicket.find({ eventId: event._id })
			const ticketsSold = tickets.reduce(
				(sum, ticket) => sum + ticket.sold,
				0,
			)

			const EXCHANGE_RATE = 1350

			const totalRevenue = payments.reduce((sum, payment) => {
				const amount = payment.amount || 0

				const normalizedAmount =
					payment.currency === 'NGN' ? amount : amount * EXCHANGE_RATE

				return sum + normalizedAmount
			}, 0)

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
				host: {
					_id: event.hostId._id,
					name: `${event.hostId.firstName} ${event.hostId.lastName}`,
					email: event.hostId.email,
					organization: event.hostId.organization,
				},
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

	const paymentStats = await paymentModel.aggregate([
		{
			$match: { status: 'successful' },
		},
		{
			$group: {
				_id: null,
				totalEarned: { $sum: '$amount' },
				totalTransactions: { $sum: 1 },
			},
		},
	])

	const totalAmountEarned = paymentStats[0]?.totalEarned || 0
	const totalTransactions = paymentStats[0]?.totalTransactions || 0

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
	).populate('hostId', 'firstName lastName email organization')

	if (!updatedEvent) {
		throw new AppError('Failed to update event', 500)
	}

	return updatedEvent
}

export async function getEventByIdAdmin(eventId) {
	if (!eventId) {
		throw new AppError('Event ID is required', 400)
	}

	const event = await Event.findById(eventId).populate(
		'hostId',
		'firstName lastName email organization',
	)

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

	const totalRevenue = payments.reduce(
		(sum, payment) => sum + (payment.amount || 0),
		0,
	)
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
		totalTransactions,
		ticketDetails: tickets,
		host: {
			_id: event.hostId._id,
			name: `${event.hostId.firstName} ${event.hostId.lastName}`,
			email: event.hostId.email,
			organization: event.hostId.organization,
		},
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
		.populate('hostId', 'firstName lastName email')

	const total = await Event.countDocuments(query)

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

			const totalRevenue = payments.reduce(
				(sum, payment) => sum + (payment.amount || 0),
				0,
			)

			return {
				_id: event._id,
				title: event.title,
				date: event.date,
				status: event.status,
				ticketsSold,
				totalRevenue,
				host: event.hostId,
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
