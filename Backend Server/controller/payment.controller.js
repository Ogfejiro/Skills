// payment.controller.js - COMPLETE WITH ALL FUNCTIONS
import { flwClient } from '../config/flutterwave.js'
import Payment from '../models/payment.model.js'
import crypto from 'crypto'
import Ticket from '../models/ticket.model.js'
import { sendVerificationEmail } from '../services/sendVerificationEmail.js'
import { generateTicket } from '../services/ticket.service.js'
import { heleketService } from './../config/heleket.js'

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

    const paymentData = req.body

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
        return res.sendStatus(200)
      }

      console.log('Payment updated:', updatedPayment)

      await generateTicket(updatedPayment.tx_ref)

      await sendVerificationEmail(
        updatedPayment.customerEmail,
        updatedPayment.amount,
        `https://www.lofte.live/tickets?tx_ref=${updatedPayment.tx_ref}`,
        updatedPayment.ticketName,
        updatedPayment.tx_ref,
      )
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

export const initiateCryptoPayment = async (req, res) => {
  try {
    const { amount, email, userId, ticketName } = req.body

    const tx_ref = 'tx-' + Date.now()

    await Payment.create({
      userId,
      tx_ref,
      amount,
      currency: 'USDT',
      status: 'pending',
      customerEmail: email,
      ticketName,
    })

    const paymentData = await heleketService({
      amount,
      currency: 'USDT',
      order_id: tx_ref,
      payer_email: email,
      subtract: 100,
      callback_url:
        'https://skills-k6pv.onrender.com/api/payments/crypto-webhook',
      return_url: `https://www.lofte.live/`,
      url_success: `https://www.lofte.live/payment-status?tx_ref=${tx_ref}`,
    })

    console.log('Heleket response:', paymentData.result.url)

    res.status(200).json({
      success: true,
      paymentLink: paymentData.result.url,
    })
  } catch (error) {
    console.error('Initiate Error:', error.response?.data || error.message)
    res.status(500).json({ success: false })
  }
}

export const heleketWebhook = async (req, res) => {
  try {
    const data = { ...req.body }

    const receivedSign = data.sign
    if (!receivedSign) {
      return res.status(400).json({ message: 'No signature' })
    }

    delete data.sign

    const jsonString = JSON.stringify(data).replace(/\//g, '\\/')

    const base64 = Buffer.from(jsonString).toString('base64')
    const generatedSign = crypto
      .createHash('md5')
      .update(base64 + process.env.HELEKET_API_KEY)
      .digest('hex')

    if (generatedSign !== receivedSign) {
      return res.status(400).json({ message: 'Invalid signature' })
    }

    const {
      order_id,
      status,
      is_final,
      merchant_amount,
      txid,
      network,
      uuid,
      payer_currency,
    } = data

    const order = await Payment.findOne({ tx_ref: order_id })
    if (!order) return res.status(404).json({ message: 'Order not found' })

    if (is_final && status === 'paid') {
      // Prevent double processing
      if (order.status !== 'paid') {
        order.status = 'paid'
        order.paymentReference = uuid
        order.transactionId = txid
        order.network = network
        order.amount = merchant_amount
        order.currency = payer_currency
        await order.save()

        await generateTicket(order.tx_ref)
        await sendVerificationEmail(
          order.customerEmail,
          order.amount,
          `https://www.lofte.live/tickets?tx_ref=${order.tx_ref}`,
          order.ticketName,
          order.tx_ref,
        )
      }
    }

    return res.status(200).json({ received: true })
  } catch (error) {
    console.error('Webhook Error:', error)
    return res.status(500).json({ success: false, error: error.message })
  }
}
