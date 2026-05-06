import express from 'express'
import { authenticateToken } from '../../services/middleware/auth.middleware.js'
import {
	getMyOverview,
	getMyReferees,
	getMyCommissions,
	requestWithdrawal,
} from './referral.controller.js'

const router = express.Router()

router.use(authenticateToken)

router.get('/me', getMyOverview)
router.get('/list', getMyReferees)
router.get('/commissions', getMyCommissions)
router.post('/withdraw', requestWithdrawal)

export default router
