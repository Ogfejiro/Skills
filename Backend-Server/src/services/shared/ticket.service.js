import Payment from '../../models/payment.model.js'
import Ticket from '../../models/ticket.model.js'
import { nanoid } from 'nanoid'

export async function generateTicket(tx_ref) {
	const payment = await Payment.findOne({ tx_ref })

	if (!payment) {
		throw new Error('Payment not found for ticket generation')
	}

	if (payment.status !== 'successful') {
		throw new Error('Payment not successful, cannot generate ticket')
	}

	const existingTicket = await Ticket.findOne({ tx_ref })
	if (existingTicket) {
		return existingTicket
	}

	const paymentDate = new Date(payment.createdAt)

	const monthYear =
		String(paymentDate.getMonth() + 1).padStart(2, '0') +
		String(paymentDate.getFullYear()).slice(-2)

	const ticketId = `LOFTE-${monthYear}-${nanoid(6)}`

	const newTicket = await Ticket.create({
		paymentId: payment._id,
		ticketId,
		tx_ref: payment.tx_ref,
		ticketName: payment.ticketName,
		amount: payment.amount,
		quantity: payment.quantity,
		currency: payment.currency,
		status: 'active',
		customerEmail: payment.customerEmail,
	})

	return newTicket
}

export async function generateRegularTicket(email, ticketName, eventName) {
	const existingTicket = await Ticket.findOne({ customerEmail: email })
	if (existingTicket) {
		return existingTicket
	}

	const monthYear =
		String(now.getMonth() + 1).padStart(2, '0') +
		String(now.getFullYear()).slice(-2)

	const ticketId = `LOFTE-${monthYear}-${nanoid(6)}`
	const tx_ref = `REGULAR-${monthYear}-${nanoid(6)}`

	const newTicket = await Ticket.create({
		paymentId: 0,
		ticketId,
		tx_ref: tx_ref,
		ticketName: ticketName,
		amount: 0,
		status: 'active',
		customerEmail: email,
		eventName: eventName,
	})

	return newTicket
}
