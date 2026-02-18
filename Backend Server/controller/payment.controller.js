import { flwClient } from '../config/flutterwave.js'
import Payment from '../models/payment.model.js'
import Ticket from '../models/ticket.model.js'
import { generateTicket } from '../services/ticket.service.js'

export const initiatePayment = async (req, res) => {
  try {
    const { amount, email, userId } = req.body

    const tx_ref = 'tx-' + Date.now()

    await Payment.create({
      userId,
      tx_ref,
      amount,
      currency: 'NGN',
      status: 'pending',
      customerEmail: email,
    })

    const response = await flwClient.post('/payments', {
      tx_ref,
      amount,
      currency: 'NGN',
      redirect_url: `https://www.lofte.live/payment/confirm?ticket=${tx_ref}&currency=NGN&method=naira`,
      customer: { email },
      customizations: {
        title: 'Checkout Payment',
        description: 'Payment for order',
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

export const paymentRedirect = async (req, res) => {
  try {
    const { transaction_id, tx_ref } = req.query

    return res.redirect(
      `${process.env.FRONTEND_URL}/payment-status?transaction_id=${transaction_id}&tx_ref=${tx_ref}`,
    )
  } catch (err) {
    res.status(500).json({ error: 'Redirect error' })
  }
}

export const flutterwaveWebhook = async (req, res) => {
  try {
    console.log("🔥 WEBHOOK HIT");
    const signature = req.headers['verif-hash']
    console.log(req.headers)

    if (!signature || signature !== process.env.FLW_WEBHOOK_SECRET) {
      return res.sendStatus(401)
    }

    const payload = req.body
    console.log("BODY:", req.body);
    if (payload.event === 'charge.completed') {
      const paymentData = payload.data

      if (paymentData.status === 'successful') {
        const updatedPayment = await Payment.findOneAndUpdate(
          { tx_ref: paymentData.tx_ref },
          {
            status: 'successful',
            transactionId: paymentData.id,
          },
          { new: true },
        )

        if (!updatedPayment) {
          console.log('Payment not found for:', paymentData.tx_ref)
        } else {
          await generateTicket(paymentData.tx_ref)
        }
      }
    }

    return res.sendStatus(200)
  } catch (error) {
    console.error('Webhook error:', error)
    return res.status(500).json({ error: 'Webhook processing failed' })
  }
}

export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 })
    res.json(payments)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch payments' })
  }
}

export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 })
    res.json(tickets)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tickets' })
  }
}

export const ticket = async (req, res) => {
  try {
    const { tx_ref } = req.body
    await generateTicket(tx_ref)
    res.json({ message: 'Ticket generated successfully' })
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Failed to generate ticket', message: err.message })
  }
}
