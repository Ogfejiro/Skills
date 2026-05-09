// payment.routes.js - COMPLETE CORRECTED VERSION
import express from 'express'
import {
	initiatePayment,
	verifyPayment,
	flutterwaveWebhook,
	getTicketByTxRef,
	getTicketById,
	createInvoice,
	cryptoWebhook,
	regularTicket,
} from './payment.controller.js'

const router = express.Router()

// Payment routes
router.post('/regular', regularTicket)
router.post('/initiate', initiatePayment)
router.post('/pay-usdt', createInvoice)
router.post('/crypto-webhook', cryptoWebhook)
router.post('/verify', verifyPayment)
router.post('/webhook', flutterwaveWebhook)
router.get('/ticket/:tx_ref', getTicketByTxRef)
router.get('/ticket-by-id/:ticketId', getTicketById)

export default router
