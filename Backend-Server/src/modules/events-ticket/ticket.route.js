import express from 'express'
import {
	authenticateToken,
	authorizeRoles,
} from '../../services/middleware/auth.middleware.js'
import { profileLimiter } from '../../services/middleware/rateLimit.js'
import { createTicket, getTickets, editTicket } from './ticket.controller.js'

const router = express.Router()

router.use(profileLimiter)
router.get('/public/:id', getTickets)

router.use(authenticateToken, authorizeRoles('Host'))
router.get('/:id', getTickets)
router.post('/:id', createTicket)
router.put('/:id', editTicket)

export default router
