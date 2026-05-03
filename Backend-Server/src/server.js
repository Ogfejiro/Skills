import express from 'express'
import dotenv from 'dotenv'
import connectDB from '../src/config/db.js'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import authRoutes from './modules/auth/auth.route.js'
import hostRoutes from './modules/host Profile/host.route.js'
import eventRoutes from './modules/events/event.route.js'
import publicEventRoutes from './modules/events/event.public.route.js'
import paymentRoutes from '../src/modules/payments/payment.routes.js'
import ticketRoutes from '../src/modules/events-ticket/ticket.route.js'
import adminRoutes from './modules/admin/admin.route.js'
import healthRoutes from './modules/health/health.route.js'
import errorMiddle from '../src/services/middleware/error.js'
import { cryptoWebhook } from '../src/modules/payments/payment.controller.js'
import { validateEnvironment } from '../src/services/shared/validateEnv.js'
import { schedulePaymentCleanup } from '../src/services/shared/paymentCleanup.js'
import emailRouter from './modules/event-email/eventEmail.route.js'

dotenv.config()
validateEnvironment()

const app = express()
app.use(
	cors({
		origin: process.env.FRONTEND_URL,
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
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

app.use('/api/health', healthRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/host', hostRoutes)
app.use('/api/event-public', publicEventRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/tickets', ticketRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/email', emailRouter)

app.use(errorMiddle)
const PORT = process.env.PORT

const server = app.listen(PORT, async () => {
	await connectDB()
	console.log('✅ Server running on port', PORT)

	schedulePaymentCleanup()
})

process.on('unhandledRejection', (err) => {
	console.error('❌ Unhandled Rejection:', err)
	server.close(() => process.exit(1))
})

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
	console.error('❌ Uncaught Exception:', err)
	process.exit(1)
})
