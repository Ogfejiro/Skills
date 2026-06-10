import EventTicket from '../../models/EventTicket.model.js'
import Event from '../../models/Event.model.js'
import Host from '../../models/Host.model.js'
import Ticket from '../../models/ticket.model.js'
import Payment from '../../models/payment.model.js'

import AppError from './../../services/shared/appError.js'

export async function createEventTicket(hostId, eventId, ticketData) {
	const host = await Host.findById(hostId)

	if (!host) {
		throw new AppError(
			'Please Setup your Profile before creating ticket',
			404,
		)
	}

	const eventExist = await Event.findById(eventId)

	if (!eventExist) {
		throw new AppError('Event not found', 404)
	}

	if (eventExist.hostId.toString() !== hostId.toString()) {
		throw new AppError('Unauthorized to create ticket for this event', 403)
	}

	const rate = host.conversionRate || 1350
	const currency = ticketData.currency?.toUpperCase()

	if (!currency) {
		throw new AppError('Currency is required', 400)
	}

	let priceNGN, priceUSD

	if (currency === 'NGN') {
		priceNGN = ticketData.price
		priceUSD = Number((ticketData.price / rate).toFixed(2))
	} else {
		priceUSD = ticketData.price
		priceNGN = Math.round(ticketData.price * rate)
	}

	const newTicket = new EventTicket({
		...ticketData,
		eventId,
		priceNGN,
		priceUSD,
		conversionRate: rate,
	})

	await newTicket.save()
	return newTicket
}

export async function getTicketsByEvent(eventId) {
	const eventExist = await Event.findOne({ _id: eventId })
	if (!eventExist) {
		throw new AppError('Event not found', 404)
	}

	const tickets = await EventTicket.find({ eventId })

	return tickets
}

export async function editTicketById(ticketId, hostId, updateData) {
	const ticket = await EventTicket.findById(ticketId)
	if (!ticket) {
		throw new AppError('Ticket not found', 404)
	}

	const userEvent = await Event.findOne({ _id: ticket.eventId, hostId })
	if (!userEvent) {
		throw new AppError('Not Authorized to access this route', 401)
	}

	await EventTicket.findByIdAndUpdate(ticketId, updateData, {
		new: true,
		runValidators: true,
	})

	return 'ticket updated'
}

export async function deleteTicketById(id, hostId) {
	const ticket = await EventTicket.findById(id)

	if (!ticket) {
		throw new AppError('Event Ticket not found', 404)
	}

	const userEvent = await Event.findOne({ _id: ticket.eventId, hostId })
	if (!userEvent) {
		throw new AppError('Not Authorized to access this route', 401)
	}

	if (ticket.sold > 0) {
		throw new AppError(`Can't delete ticket with active sales`, 409)
	}

	await ticket.deleteOne()

	return 'Ticket deleted successfully'
}

export async function getPurchasedTicketsForEvent(eventId, hostId, filters) {
	const event = await Event.findById(eventId)
	if (!event) {
		throw new AppError('Event not found', 404)
	}

	if (event.hostId.toString() !== hostId.toString()) {
		throw new AppError('Unauthorized to view purchases for this event', 403)
	}

	// 1. Legacy support: Fetch all payments for this event to find matching tickets
	const payments = await Payment.find({ eventId }).select('_id')
	const paymentIds = payments.map((p) => p._id.toString())

	// 2. Build the base query to match any ticket for this event
	const baseQuery = {
		$or: [
			{ eventId: eventId },
			{ paymentId: { $in: paymentIds } },
		],
	}

	if (event.title) {
		baseQuery.$or.push({ eventName: event.title, amount: 0 })
	}

	// 3. Overall stats for total tickets bought
	const totalBoughtCount = await Ticket.countDocuments(baseQuery)

	// 4. Build filter conditions
	const conditions = [baseQuery]

	if (filters.ticketType) {
		conditions.push({ ticketName: filters.ticketType })
	}

	if (filters.search) {
		const searchRegex = new RegExp(filters.search, 'i')
		conditions.push({
			$or: [
				{ ticketId: searchRegex },
				{ customerEmail: searchRegex },
				{ ticketName: searchRegex },
			],
		})
	}

	if (filters.startDate || filters.endDate) {
		const dateCond = {}
		if (filters.startDate) {
			dateCond.$gte = new Date(filters.startDate)
		}
		if (filters.endDate) {
			const end = new Date(filters.endDate)
			end.setHours(23, 59, 59, 999)
			dateCond.$lte = end
		}
		conditions.push({ createdAt: dateCond })
	}

	const finalQuery =
		conditions.length > 1 ? { $and: conditions } : conditions[0]

	// 5. Paginate and execute
	const page = filters.page || 1
	const limit = filters.limit || 25
	const skip = (page - 1) * limit

	const totalFiltered = await Ticket.countDocuments(finalQuery)
	const tickets = await Ticket.find(finalQuery)
		.sort({ createdAt: -1 })
		.skip(skip)
		.limit(limit)

	return {
		tickets,
		totalBought: totalBoughtCount,
		pagination: {
			total: totalFiltered,
			page,
			limit,
			pages: Math.ceil(totalFiltered / limit),
		},
	}
}
