import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import connectDB from './config/db.js'
import cors from 'cors'
import morgan from 'morgan'
import paymentRoutes from './routes/payment.routes.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())


app.use('/api/payments', paymentRoutes)

const PORT = process.env.PORT
app.listen(PORT, async () => {
  await connectDB()
  console.log('Server running on port', PORT)
})
