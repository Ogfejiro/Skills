// payment.routes.js - COMPLETE CORRECTED VERSION
import express from 'express'
import {
  initiatePayment,
  verifyPayment,
  flutterwaveWebhook,
  getTicketByTxRef,
  getUserTickets, // ✅ Import the new function
} from '../controller/payment.controller.js'

const router = express.Router()

// Payment routes
router.post('/initiate', initiatePayment)
router.post('/verify', verifyPayment)
router.post('/webhook', flutterwaveWebhook)
router.get('/ticket/:tx_ref', getTicketByTxRef)

// Ticket routes
router.get('/api/tickets/user/:userId', getUserTickets) // ✅ New user tickets endpoint

export default router
