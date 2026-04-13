import AppError from '../../services/shared/appError.js'
import asyncHandler from '../../services/shared/asyncHandler.js'
import {
	createEventTicket,
	getTicketsByEvent,
	editTicketById,
	deleteTicketById,
} from './ticket.service.js'

export const createTicket = asyncHandler(async (req, res) => {
	const hostId = req.user.id
	const { eventId } = req.params
	console.log('Event ID', eventId)
	const { title, price, quantity, benefits, description, currency } = req.body
	if (!title || !currency || price === undefined || quantity === undefined) {
		throw new AppError('Title, price, and quantity are required', 400)
	}

	if (benefits && !Array.isArray(benefits)) {
		throw new AppError('Benefits must be an array of strings', 400)
	}

	const newTicket = await createEventTicket(hostId, eventId, {
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
	const userId = req.user.id
	const { title, price, quantity, benefits, description, currency } = req.body
	const ticketId = req.params.id
	if (!ticketId) {
		throw new AppError('Ticked ID is required', 400)
	}

	const result = await editTicketById(ticketId, userId, {
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

	if (!id) {
		throw new AppError('ID is required', 401)
	}

	const result = await deleteTicketById(id)

	res.status(200).json(result)
})
