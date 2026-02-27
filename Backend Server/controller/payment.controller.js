// payment.controller.js - COMPLETE WITH ALL FUNCTIONS
import { flwClient } from '../config/flutterwave.js'
import Payment from '../models/payment.model.js'
import crypto from 'crypto'
import Ticket from '../models/ticket.model.js'
import { sendVerificationEmail } from '../services/sendVerificationEmail.js'
import { generateTicket } from '../services/ticket.service.js'
import nowPaymentsService from './../config/heleket.js'

export const initiatePayment = async (req, res) => {
  try {
    const { amount, email, userId, ticketName } = req.body

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

    res.json({
      paymentLink: response.data.data.link,
    })
  } catch (err) {
    console.log(err.response?.data || err.message)
    res.status(500).json({ error: 'Payment initialization failed' })
  }
}

export const verifyPayment = async (req, res) => {
  try {
    const { transaction_id, tx_ref } = req.body

    const payment = await Payment.findOne({
      tx_ref,
      transactionId: transaction_id,
    })

    if (!payment) {
      return res
        .status(404)
        .json({ success: false, error: 'Payment not found' })
    }

    if (
      payment.status === 'successful' ||
      payment.status === 'paid' ||
      payment.status === 'completed'
    ) {
      return res.status(200).json({ success: true })
    } else {
      return res
        .status(200)
        .json({ success: false, error: 'Payment not successful' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, error: 'Verification failed' })
  }
}

export const flutterwaveWebhook = async (req, res) => {
  try {
    const signature = req.headers['verif-hash']

    if (!signature || signature !== process.env.FLW_WEBHOOK_SECRET) {
      return res.sendStatus(401)
    }

    console.log('Webhook payload:', JSON.stringify(req.body, null, 2))

    const payload = req.body.data

    if (!payload) {
      return res.sendStatus(200)
    }

    const status = payload.status?.toLowerCase()

    // Accept possible success values
    if (['successful', 'completed', 'success'].includes(status)) {
      
      // OPTIONAL BUT RECOMMENDED: find existing payment first
      const existingPayment = await Payment.findOne({
        tx_ref: payload.tx_ref,
      })

      if (!existingPayment) {
        console.log('Payment not found:', payload.tx_ref)
        return res.sendStatus(200)
      }

      // Prevent double-processing (webhooks can fire multiple times)
      if (existingPayment.status === 'successful') {
        console.log('Payment already processed:', payload.tx_ref)
        return res.sendStatus(200)
      }

      const updatedPayment = await Payment.findOneAndUpdate(
        { tx_ref: payload.tx_ref },
        {
          status: 'successful',
          transactionId: payload.id,
        },
        { returnDocument: 'after' } // fixed deprecation warning
      )

      await generateTicket(payload.tx_ref)

      await sendVerificationEmail(
        updatedPayment.customerEmail,
        updatedPayment.amount,
        `https://www.lofte.live/tickets?tx_ref=${payload.tx_ref}`,
        updatedPayment.ticketName,
        payload.tx_ref,
      )

      console.log('Payment successfully processed:', payload.tx_ref)
    }

    return res.sendStatus(200)
  } catch (error) {
    console.error('Webhook error:', error)
    return res.status(500).json({ error: 'Webhook processing failed' })
  }
}

export const getTicketByTxRef = async (req, res) => {
  try {
    const { tx_ref } = req.params
    const ticket = await Ticket.findOne({ tx_ref })
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' })
    }
    res.json(ticket)
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve ticket' })
  }
}

export const createInvoice = async (req, res) => {
  try {
    const { amount, email, userId, ticketName } = req.body

    const tx_ref = 'tx-' + Date.now()

    await Payment.create({
      userId,
      tx_ref,
      amount,
      currency: 'USD',
      status: 'pending',
      customerEmail: email,
      ticketName,
    })

    const invoice = await nowPaymentsService.createInvoice({
      price_amount: amount,
      price_currency: 'USD',
      order_id: tx_ref,
      order_description: `Payment for ${ticketName} ticket`,
      ipn_callback_url:
        'https://skills-k6pv.onrender.com/api/payments/crypto-webhook',
      success_url: `${process.env.FRONTEND_URL}/payment-status?tx_ref=${tx_ref}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-status?tx_ref=${tx_ref}`,
    })

    res.json({
      checkout_url: invoice.invoice_url,
    })
  } catch (error) {
    console.error(error.response?.data || error.message)
    res
      .status(500)
      .json({ message: 'Invoice creation failed', error: error.message })
  }
}

export const cryptoWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-nowpayments-sig']
    const rawBody = req.body.toString()

    const hmac = crypto
      .createHmac('sha512', process.env.NOWPAYMENTS_IPN_SECRET)
      .update(rawBody)
      .digest('hex')

    if (hmac !== signature) {
      return res.status(400).send('Invalid signature')
    }

    const paymentData = JSON.parse(rawBody)

    if (paymentData.payment_status !== 'finished') {
      return res.sendStatus(200)
    }

    const existingPayment = await Payment.findOne({
      tx_ref: paymentData.order_id,
    })

    if (!existingPayment) {
      console.log('Payment not found:', paymentData.order_id)
      return res.sendStatus(200)
    }

    if (existingPayment.status === 'successful') {
      return res.sendStatus(200)
    }

    if (Number(paymentData.price_amount) !== Number(existingPayment.amount)) {
      console.log('Amount mismatch!')
      return res.status(400).send('Amount mismatch')
    }

    if (!paymentData.pay_amount || !paymentData.pay_currency) {
      console.log('Missing crypto outcome data')
      return res.status(400).send('Invalid payment data')
    }

    existingPayment.status = 'successful'
    existingPayment.transactionId = paymentData.payment_id
    existingPayment.paidAmountCrypto = paymentData.pay_amount
    existingPayment.currency = paymentData.pay_currency

    await existingPayment.save()

    await generateTicket(existingPayment.tx_ref)

    await sendVerificationEmail(
      existingPayment.customerEmail,
      existingPayment.amount,
      `https://www.lofte.live/tickets?tx_ref=${existingPayment.tx_ref}`,
      existingPayment.ticketName,
      existingPayment.tx_ref,
    )

    return res.sendStatus(200)
  } catch (error) {
    console.error(error)
    return res.sendStatus(500)
  }
}
