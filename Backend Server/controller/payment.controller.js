// payment.controller.js - COMPLETE WITH ALL FUNCTIONS
import { flwClient } from '../config/flutterwave.js'
import Payment from '../models/payment.model.js'
import Ticket from '../models/ticket.model.js'
import { sendVerificationEmail } from '../services/sendVerificationEmail.js'
import { generateTicket } from '../services/ticket.service.js'

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

    if (payment.status === 'successful') {
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

    if (payload.status === 'successful') {
      const updatedPayment = await Payment.findOneAndUpdate(
        { tx_ref: payload.tx_ref },
        {
          status: 'successful',
          transactionId: payload.id,
        },
        { new: true },
      )

      if (!updatedPayment) {
        console.log('Payment not found:', payload.tx_ref)
        return res.sendStatus(200)
      }

      await generateTicket(payload.tx_ref)

      await sendVerificationEmail(
        updatedPayment.customerEmail,
        updatedPayment.amount,
        `https://www.lofte.live/tickets?tx_ref=${payload.tx_ref}`,
        updatedPayment.ticketName,
        payload.tx_ref,
      )
    }

    console.log(req.body)
    console.log('Headers:', req.headers)
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
