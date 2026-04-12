import express from 'express'
import {
	getAllEventsController,
	getAnalyticsController,
	updateEventStatusController,
	getEventDetailsController,
	searchEventsController,
} from './admin.controller.js'
import {
	authenticateToken,
	authorizeRoles,
} from '../../services/middleware/auth.middleware.js'
import { profileLimiter } from '../../services/middleware/rateLimit.js'

const router = express.Router()

router.use(profileLimiter)
router.use(authenticateToken, authorizeRoles('Admin'))

router.get('/', getAllEventsController)
router.get('/stats/analytics', getAnalyticsController)
router.get('/search', searchEventsController)
router.get('/:eventId', getEventDetailsController)
router.put('/:eventId/status', updateEventStatusController)

export default router
