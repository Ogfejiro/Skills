import express from 'express'
import {
  initiatePayment,
  paymentRedirect,
  flutterwaveWebhook,
  getTicketByTxRef,
} from '../controller/payment.controller.js'

const router = express.Router()

router.post('/initiate', initiatePayment)
router.get('/redirect', paymentRedirect)
router.get('/ticket/:id', getTicketByTxRef)
router.post('/webhook', flutterwaveWebhook)

export default router
