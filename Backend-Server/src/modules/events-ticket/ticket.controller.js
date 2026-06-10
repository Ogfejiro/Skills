import AppError from '../../services/shared/appError.js'
import asyncHandler from '../../services/shared/asyncHandler.js'
import {
	createEventTicket,
	getTicketsByEvent,
	editTicketById,
	deleteTicketById,
	getPurchasedTicketsForEvent,
} from './ticket.service.js'

// ... existing controller code ...
export const createTicket = asyncHandler(async (req, res) => {
	const hostProfileId = req.hostProfile._id
	const { eventId } = req.params
	console.log('Event ID', eventId)
	const { title, price, quantity, benefits, description, currency } = req.body
	if (!title || !currency || price === undefined || quantity === undefined) {
		throw new AppError('Title, price, and quantity are required', 400)
	}

	if (benefits && !Array.isArray(benefits)) {
		throw new AppError('Benefits must be an array of strings', 400)
	}

	const newTicket = await createEventTicket(hostProfileId, eventId, {
		title,
		price,
		quantity,
		benefits,
		description,
		currency,
	})

	res.status(201).json({
		status: 'success',
		data: newTicket,
	})
})

export const getTickets = asyncHandler(async (req, res) => {
	const eventId = req.params.id
	if (!eventId) {
		throw new AppError('Event Id is required', 400)
	}

	const result = await getTicketsByEvent(eventId)

	res.status(201).json(result)
})

export const editTicket = asyncHandler(async (req, res) => {
	const hostProfileId = req.hostProfile._id
	const { title, price, quantity, benefits, description, currency } = req.body
	const ticketId = req.params.id
	if (!ticketId) {
		throw new AppError('Ticked ID is required', 400)
	}

	const result = await editTicketById(ticketId, hostProfileId, {
		title,
		price,
		quantity,
		benefits,
		description,
		currency,
	})

	res.status(201).json(result)
})

export const deleteTicket = asyncHandler(async (req, res) => {
	const { id } = req.params
	const hostProfileId = req.hostProfile._id

	if (!id) {
		throw new AppError('ID is required', 401)
	}

	const result = await deleteTicketById(id, hostProfileId)

	res.status(200).json(result)
})

export const getTicketPurchases = asyncHandler(async (req, res) => {
	const hostProfileId = req.hostProfile._id
	const { eventId } = req.params

	if (!eventId) {
		throw new AppError('Event ID is required', 400)
	}

	const page = parseInt(req.query.page, 10) || 1
	const limit = parseInt(req.query.limit, 10) || 25
	const search = req.query.search || ''
	const ticketType = req.query.ticketType || ''
	const startDate = req.query.startDate || ''
	const endDate = req.query.endDate || ''

	const result = await getPurchasedTicketsForEvent(eventId, hostProfileId, {
		page,
		limit,
		search,
		ticketType,
		startDate,
		endDate,
	})

	res.status(200).json({
		status: 'success',
		...result,
	})
})
