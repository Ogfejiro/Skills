import express from 'express'
import {
	createHostProfileController,
	updateHostProfile,
	getHostProfile,
	deleteHostProfile,
	getHostDashboard,
} from './host.controller.js'
import { authenticateToken } from '../../services/middleware/auth.middleware.js'
import { profileLimiter } from '../../services/middleware/rateLimit.js'

const router = express.Router()

router.use(profileLimiter)
router.use(authenticateToken)

router
	.route('/profile')
	.get(getHostProfile)
	.post(createHostProfileController)
	.put(updateHostProfile)
	.delete(deleteHostProfile)

router.get('/dashboard', getHostDashboard)

export default router
