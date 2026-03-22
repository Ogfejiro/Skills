import express from 'express'
import {
    updateHostProfile,
    getHostProfile,
    deleteHostProfile,
    getHostDashboard,
} from './host.controller.js'
import {
    authenticateToken,
    authorizeRoles,
} from '../../services/middleware/auth.middleware.js'
import { authLimiter } from '../../services/middleware/rateLimit.js'

const router = express.Router()

router.use(authLimiter)
router.use(authenticateToken, authorizeRoles('Host'))

router
    .route('/profile')
    .get(getHostProfile)
    .post(updateHostProfile)
    .delete(deleteHostProfile)

router.get('/dashboard', getHostDashboard)

export default router
