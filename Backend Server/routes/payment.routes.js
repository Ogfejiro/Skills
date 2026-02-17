import express from 'express'
import {
  initiatePayment,
  paymentRedirect,
  verifyPayment,
  flutterwaveWebhook,
} from '../controller/payment.controller.js'

const router = express.Router()

router.post('/initiate', initiatePayment)
router.get('/redirect', paymentRedirect)
router.post('/verify', verifyPayment)
router.post('/webhook', flutterwaveWebhook)

export default router
