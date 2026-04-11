import EventTicket from '../../models/EventTicket.model.js'
import Event from '../../models/Event.model.js'

import AppError from './../../services/shared/appError.js'

export async function createEventTicket(hostId, eventId, ticketData) {
	const eventExist = await Event.findOne({ _id: eventId })
	if (!eventExist) {
		throw new AppError('Event not found', 404)
	}
	if (eventExist.hostId.toString() !== hostId) {
		throw new AppError('Unauthorized to create ticket for this event', 403)
	}

	const newTicket = new EventTicket({
		eventId,
		...ticketData,
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

export async function editTicketById(ticketId, userId, updateData) {
	const userEvent = await Event.findOne({ hostId: userId })
	if (!userEvent) {
		throw new AppError('Not Authorized to access this route', 401)
	}
	const ticket = await EventTicket.findByIdAndUpdate(ticketId, updateData, {
		new: true,
		runValidators: true,
	})
	if (!ticket) {
		throw new AppError('Ticket not found', 404)
	}
	return 'ticket updated'
}
