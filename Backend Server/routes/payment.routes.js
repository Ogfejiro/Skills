import express from 'express'
import {
  initiatePayment,
  paymentRedirect,
  flutterwaveWebhook,
  getAllPayments,
  getAllTickets,
  ticket,
} from '../controller/payment.controller.js'

const router = express.Router()

router.post('/initiate', initiatePayment)
router.get('/redirect', paymentRedirect)
router.post('/ticket', ticket)
router.post('/webhook', flutterwaveWebhook)
router.get('/all', getAllPayments)
router.get('/tickets', getAllTickets)

export default router
