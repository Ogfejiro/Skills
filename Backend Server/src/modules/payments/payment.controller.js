import asyncHandler from '../../services/shared/asyncHandler.js'
import AppError from '../../services/shared/appError.js'
import {
  initiateInvoice,
  verifyPay,
  handleFlutterwaveWebhook,
  TicketByRef,
  createCryptoInvoice,
  handleCryptoWebhook,
} from './payment.service.js'

export const initiatePayment = asyncHandler(async (req, res) => {
  const { amount, email, userId, ticketName } = req.body

  if (!amount || !email || !userId || !ticketName) {
    throw new AppError('Missing required fields', 400)
  }

  const { paymentLink } = await initiateInvoice(
    amount,
    email,
    userId,
    ticketName,
  )

  res.json({ paymentLink })
})

export const verifyPayment = asyncHandler(async (req, res) => {
  const { tx_ref } = req.body
  if (!tx_ref) {
    throw new AppError('Missing tx_ref', 400)
  }

  const verificationResult = await verifyPay(tx_ref)

  if (verificationResult.status === 'success') {
    res.json({ message: 'Payment verified successfully' })
  } else {
    res.status(400).json({ message: 'Payment verification failed' })
  }
})

export const flutterwaveWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers['verif-hash']

  if (!signature || signature !== process.env.FLW_WEBHOOK_SECRET) {
    return res.sendStatus(401)
  }

  const payload = req.body.data

  await handleFlutterwaveWebhook(payload)

  return res.sendStatus(200)
})

export const getTicketByTxRef = asyncHandler(async (req, res) => {
  const { tx_ref } = req.params
  if (!tx_ref) {
    throw new AppError('tx_ref is required', 401)
  }

  const tickets = await TicketByRef(tx_ref)

  return res.json(tickets)
})

export const createInvoice = asyncHandler(async (req, res) => {
  const { amount, email, userId, ticketName } = req.body

  if (!amount || !email || !userId || !ticketName) {
    throw new AppError('All fields are required', 400)
  }

  const result = await createCryptoInvoice(amount, email, userId, ticketName)

  return res.status(200).json(result)
})

export const cryptoWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers['x-nowpayments-sig']

  if (!signature) {
    throw new AppError('Missing signature header', 400)
  }

  const rawBody = req.body

  await handleCryptoWebhook(rawBody, signature)

  return res.sendStatus(200)
})
