import Payment from '../models/payment.model.js'
import Ticket from '../models/ticket.model.js'
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
    ticketType: payment.ticketType,
    amount: payment.amount,
    currency: payment.currency,
    status: 'active',
    customerEmail: payment.customerEmail,
  })

  return newTicket
}
