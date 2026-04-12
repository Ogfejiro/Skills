import express from 'express'
import { healthCheckController } from './health.controller.js'

const router = express.Router()

router.get('/', healthCheckController)

export default router
