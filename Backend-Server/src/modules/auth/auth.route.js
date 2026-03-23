import express from 'express'
import { authLimiter } from '../../services/middleware/rateLimit.js'
import { register, googleLogin, login } from './auth.controller.js'

const router = express.Router()

router.use(authLimiter)

router.post('/register', register)
router.post('/google', googleLogin)
router.post('/login', login)

export default router
