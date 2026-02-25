// payment.routes.js - COMPLETE CORRECTED VERSION
import express from 'express'
import {
  initiatePayment,
  verifyPayment,
  flutterwaveWebhook,
  getTicketByTxRef,
  initiateCryptoPayment,
  heleketWebhook,
} from '../controller/payment.controller.js'

const router = express.Router()

// Payment routes
router.post('/initiate', initiatePayment)
router.post('/pay-usdt', initiateCryptoPayment)
router.post('/crypto-webhook', heleketWebhook)
router.post('/verify', verifyPayment)
router.post('/webhook', flutterwaveWebhook)
router.get('/ticket/:tx_ref', getTicketByTxRef)

export default router
