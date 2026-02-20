// payment.routes.js - COMPLETE CORRECTED VERSION
import express from 'express'
import {
  initiatePayment,
  verifyPayment,
  flutterwaveWebhook,
  getTicketByTxRef,
} from '../controller/payment.controller.js'

const router = express.Router()

// Payment routes
router.post('/initiate', initiatePayment)
router.post('/verify', verifyPayment)
router.post('/webhook', flutterwaveWebhook)
router.get('/ticket/:tx_ref', getTicketByTxRef)

export default router
