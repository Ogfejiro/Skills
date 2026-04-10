import express from 'express'
import {
	createEventController,
	getHostEventsController,
	getPublicEventsController,
	getEventController,
	updateEventController,
	deleteEventController,
	cloudinarySignature,
} from './event.controller.js'
import {
	authenticateToken,
	authorizeRoles,
} from '../../services/middleware/auth.middleware.js'
import { profileLimiter } from '../../services/middleware/rateLimit.js'

const router = express.Router()

router.use(profileLimiter)

// Host protected
router.use(authenticateToken, authorizeRoles('Host'))
router.get('/host', getHostEventsController)
router.post('/', createEventController)
router.get('/cloudinary-signature', cloudinarySignature)
router.put('/:id', updateEventController)
router.delete('/:id', deleteEventController)

export default router
