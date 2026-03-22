import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import connectDB from '../src/config/db.js'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import paymentRoutes from '../src/modules/payments/payment.routes.js'
import { cryptoWebhook } from '../src/modules/payments/payment.controller.js'

dotenv.config()

const app = express()
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'verif-hash',
      'x-flutterwave-signature',
      'x-flutterwave-event',
      'x-flutterwave-timestamp',
      'x-flutterwave-idempotency-key',
      'x-flutterwave-signature-256',
      'x-flutterwave-signature-512',
    ],
  }),
)
app.use(morgan('dev'))
app.use(helmet())

app.post(
  '/api/payments/crypto-webhook',
  express.raw({ type: 'application/json' }),
  cryptoWebhook,
)
app.use(express.json())

app.use('/api/payments', paymentRoutes)

const PORT = process.env.PORT
app.listen(PORT, async () => {
  await connectDB()
  console.log('Server running on port', PORT)
})
