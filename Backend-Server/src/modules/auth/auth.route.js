import express from 'express'
import { authLimiter } from '../../services/middleware/rateLimit.js'
import {
	register,
	googleLogin,
	login,
	forgotPassword,
	verifyForgotPasswordToken,
	resetPassword,
} from './auth.controller.js'

const router = express.Router()

router.use(authLimiter)

router.post('/register', register)
router.post('/google', googleLogin)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.get('/verify-reset-password-token', verifyForgotPasswordToken)
router.post('/reset-password', resetPassword)

export default router
