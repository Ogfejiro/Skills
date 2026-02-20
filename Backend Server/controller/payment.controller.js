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

    const paymentData = req.body

    // Check successful payment
    if (paymentData.status === 'successful') {
      const updatedPayment = await Payment.findOneAndUpdate(
        { tx_ref: paymentData.txRef },
        {
          status: 'successful',
          transactionId: paymentData.id,
        },
        { new: true },
      )

      if (!updatedPayment) {
        console.log('Payment not found:', paymentData.txRef)
      } else {
        console.log('Payment updated:', updatedPayment)
      }
    }

    await generateTicket(paymentData.txRef)

    res.sendStatus(200)

    sendVerificationEmail(
      updatedPayment.customerEmail,
      updatedPayment.amount,
      `${process.env.FRONTEND_URL}/tickets/${updatedPayment.tx_ref}`,
      updatedPayment.ticketName,
      updatedPayment.tx_ref,
    )
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
