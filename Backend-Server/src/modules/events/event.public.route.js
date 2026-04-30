import express from 'express'
import {
	getPublicEventsController,
	getPreviousEventsController,
	getEventsByStatusController,
	getEventController,
} from './event.controller.js'
import { profileLimiter } from '../../services/middleware/rateLimit.js'

const router = express.Router()

router.use(profileLimiter)

//// Public
router.get('/', getPublicEventsController)
router.get('/previous', getPreviousEventsController)
router.get('/by-status', getEventsByStatusController)
router.get('/:id', getEventController)

export default router
