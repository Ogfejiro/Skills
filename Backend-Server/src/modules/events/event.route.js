import express from 'express'
import {
	createEventController,
	getHostEventsController,
	updateEventController,
	deleteEventController,
	cloudinarySignature,
	getEventController,
	getPendingEventsController,
	approveEventController,
	rejectEventController,
} from './event.controller.js'
import {
	authenticateToken,
	authorizeRoles,
	requireHostProfile,
} from '../../services/middleware/auth.middleware.js'
import { profileLimiter } from '../../services/middleware/rateLimit.js'

const router = express.Router()

router.use(profileLimiter)

// Admin protected routes
router.get('/admin/pending', authenticateToken, authorizeRoles('Admin'), getPendingEventsController)
router.post('/admin/approve/:eventId', authenticateToken, authorizeRoles('Admin'), approveEventController)
router.post('/admin/reject/:eventId', authenticateToken, authorizeRoles('Admin'), rejectEventController)

// Host-profile protected
router.use(authenticateToken, requireHostProfile)
router.get('/host', getHostEventsController)
router.post('/', createEventController)
router.get('/cloudinary-signature', cloudinarySignature)
router.put('/:id', updateEventController)
router.delete('/:id', deleteEventController)
router.get('/:id', getEventController)

export default router
