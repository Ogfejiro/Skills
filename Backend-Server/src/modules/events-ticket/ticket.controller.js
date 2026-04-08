import AppError from '../../services/shared/appError.js'
import asyncHandler from '../../services/shared/asyncHandler.js'
import { createEventTicket } from './ticket.service.js'

export const createTicket = asyncHandler(async (req, res) => {
	const hostId = req.user.id
	const { eventId } = req.params
	const { title, price, quantity, benefits, description } = req.body
	if (!title || price === undefined || quantity === undefined) {
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
	})

	res.status(201).json({
		status: 'success',
		data: newTicket,
	})
})
