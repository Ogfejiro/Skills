import express from 'express'
import { register, googleLogin, login } from './auth.controller.js'

const router = express.Router()

router.post('/register', register)
router.post('/google', googleLogin)
router.post('/login', login)

export default router
