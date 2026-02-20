// payment.routes.js - COMPLETE CORRECTED VERSION
import express from 'express'
import {
  initiatePayment,
  paymentRedirect,
  flutterwaveWebhook,
  getTicketByTxRef,
  getUserTickets,  // ✅ Import the new function
} from '../controller/payment.controller.js'

const router = express.Router()

// Payment routes
router.post('/initiate', initiatePayment)
router.get('/redirect', paymentRedirect)
router.post('/webhook', flutterwaveWebhook)

// Ticket routes
router.get('/ticket/:tx_ref', getTicketByTxRef)
router.get('/api/tickets/user/:userId', getUserTickets)  // ✅ New user tickets endpoint

export default router