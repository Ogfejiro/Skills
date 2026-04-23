import { Router } from 'express'
import {
	authenticateToken,
	requireHostProfile,
} from '../../services/middleware/auth.middleware.js'
import {
	creteEventEmail,
	getEventEmail,
	updateEventEmail,
} from './eventEmail.controller.js'

const emailRouter = Router()

emailRouter.use(authenticateToken, requireHostProfile)

emailRouter.post('/:eventId', creteEventEmail)
emailRouter.get('/:eventId', getEventEmail)
emailRouter.patch('/:eventId', updateEventEmail)

export default emailRouter
