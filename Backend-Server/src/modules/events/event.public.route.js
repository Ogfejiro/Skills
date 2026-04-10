import express from 'express'
import {
	getPublicEventsController,
	getEventController,
} from './event.controller.js'
import { profileLimiter } from '../../services/middleware/rateLimit.js'

const router = express.Router()

router.use(profileLimiter)

//// Public
router.get('/', getPublicEventsController)
router.get('/:id', getEventController)

export default router
