import express from 'express'
import {
	authenticateToken,
	requireHostProfile,
} from '../../services/middleware/auth.middleware.js'
import { profileLimiter } from '../../services/middleware/rateLimit.js'
import {
	createTicket,
	getTickets,
	editTicket,
	deleteTicket,
} from './ticket.controller.js'

const router = express.Router()

router.use(profileLimiter)
router.get('/public/:id', getTickets)

router.use(authenticateToken, requireHostProfile)
router.get('/:id', getTickets)
router.post('/:eventId', createTicket)
router.put('/:id', editTicket)
router.delete('/:id', deleteTicket)

export default router
