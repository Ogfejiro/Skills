import { flwClient } from '../../config/flutterwave.js'
import Payment from '../../models/payment.model.js'
import { randomUUID } from 'crypto'
import crypto from 'crypto'
import Ticket from '../../models/ticket.model.js'
import { sendVerificationEmail } from '../../services/shared/sendVerificationEmail.js'
import { generateTicket } from '../../services/shared/ticket.service.js'
import nowPaymentsService from '../../config/heleket.js'
import AppError from '../../services/shared/appError.js'

export async function initiateInvoice(amount, email, userId, ticketName) {
  const tx_ref = 'tx-' + Date.now()

  await Payment.create({
    userId,
    tx_ref,
    amount,
    currency: 'NGN',
    status: 'pending',
    customerEmail: email,
    ticketName,
  })

  const response = await flwClient.post('/payments', {
    tx_ref,
    amount,
    currency: 'NGN',
    redirect_url: `https://www.lofte.live/payment-status?tx_ref=${tx_ref}`,
    customer: { email },
    customizations: {
      title: `${ticketName} Ticket Payment`,
      description: 'Payment for ticket purchase',
    },
  })

  return { paymentLink: response.data.data.link }
}

export async function handleFlutterwaveWebhook(payload) {
  try {
    if (!payload) {
      return { status: 'ignored' }
    }

    const status = payload.status?.toLowerCase()

    // Only process successful payments
    if (!['successful', 'completed', 'success'].includes(status)) {
      return { status: 'ignored' }
    }

    const existingPayment = await Payment.findOne({
      tx_ref: payload.tx_ref,
    })

    if (!existingPayment) {
      console.log('Payment not found:', payload.tx_ref)
      return { status: 'not_found' }
    }

    if (existingPayment.status === 'successful') {
      console.log('Payment already processed:', payload.tx_ref)
      return { status: 'already_processed' }
    }

    const updatedPayment = await Payment.findOneAndUpdate(
      { tx_ref: payload.tx_ref },
      {
        status: 'successful',
        transactionId: payload.id,
      },
      { returnDocument: 'after' },
    )

    // Generate ticket
    await generateTicket(payload.tx_ref)

    // Send email
    await sendVerificationEmail(
      updatedPayment.customerEmail,
      updatedPayment.amount,
      `https://www.lofte.live/tickets?tx_ref=${payload.tx_ref}`,
      updatedPayment.ticketName,
      payload.tx_ref,
    )

    console.log('Payment successfully processed:', payload.tx_ref)

    return { status: 'processed' }
  } catch (error) {
    console.error('Service error:', error)
    throw error
  }
}

export async function verifyPay(tx_ref) {
  const payment = await Payment.findOne({ tx_ref })

  if (!payment) {
    throw new AppError('Payment not found', 404)
  }

  if (
    payment.status === 'successful' ||
    payment.status === 'paid' ||
    payment.status === 'completed'
  ) {
    return { success: true, message: 'Payment successful' }
  } else {
    throw new AppError('Payment not successful', 200)
  }
}

export async function TicketByRef(tx_ref) {
  const ticket = await Ticket.findOne({ tx_ref })
  if (!ticket) {
    throw new AppError('Ticket not found', 404)
  }
  return ticket
}

export async function createCryptoInvoice(amount, email, userId, ticketName) {
  const tx_ref = `tx-${randomUUID()}`

  let invoice

  try {
    invoice = await nowPaymentsService.createInvoice({
      price_amount: amount,
      price_currency: 'USD',
      order_id: tx_ref,
      order_description: `Payment for ${ticketName} ticket`,
      ipn_callback_url: `${process.env.BACKEND_URL}/api/payments/crypto-webhook`,
      success_url: `${process.env.FRONTEND_URL}/payment-status?tx_ref=${tx_ref}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-status?tx_ref=${tx_ref}`,
    })
  } catch (err) {
    console.error(err)
    throw new Error('Failed to create crypto invoice')
  }

  await Payment.create({
    userId,
    tx_ref,
    amount,
    currency: 'USD',
    status: 'pending',
    customerEmail: email,
    ticketName,
    provider: 'nowpayments',
  })

  return { paymentLink: invoice.invoice_url }
}

export async function handleCryptoWebhook(rawBody, signature) {
  // Verify signature
  const hmac = crypto
    .createHmac('sha512', process.env.NOWPAYMENTS_IPN_SECRET)
    .update(rawBody)
    .digest('hex')

  if (hmac !== signature) {
    throw new AppError('Invalid signature', 400)
  }

  const paymentData = JSON.parse(rawBody.toString())

  // Ignore non-final states
  if (paymentData.payment_status !== 'finished') {
    return { status: 'ignored' }
  }

  const existingPayment = await Payment.findOne({
    tx_ref: paymentData.order_id,
  })

  if (!existingPayment) {
    console.log('Payment not found:', paymentData.order_id)
    return { status: 'not_found' }
  }

  // Idempotency protection
  if (existingPayment.status === 'successful') {
    return { status: 'already_processed' }
  }

  // Validate fiat amount
  if (Number(paymentData.price_amount) !== Number(existingPayment.amount)) {
    console.log('Amount mismatch!')
    throw new AppError('Amount mismatch', 400)
  }

  // 🪙 Validate crypto outcome
  if (!paymentData.pay_amount || !paymentData.pay_currency) {
    console.log('Missing crypto outcome data')
    throw new AppError('Invalid payment data', 400)
  }

  //  Update payment
  existingPayment.status = 'successful'
  existingPayment.transactionId = paymentData.payment_id
  existingPayment.paidAmountCrypto = paymentData.pay_amount
  existingPayment.currency = paymentData.pay_currency

  await existingPayment.save()

  // Generate ticket
  await generateTicket(existingPayment.tx_ref)

  // Send email
  await sendVerificationEmail(
    existingPayment.customerEmail,
    existingPayment.amount,
    `https://www.lofte.live/tickets?tx_ref=${existingPayment.tx_ref}`,
    existingPayment.ticketName,
    existingPayment.tx_ref,
  )

  return { status: 'processed' }
}
