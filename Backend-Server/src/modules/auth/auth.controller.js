import asyncHandler from '../../services/shared/asyncHandler.js'
import AppError from '../../services/shared/appError.js'
import {
	registrationService,
	googleAuth,
	loginService,
	forgotPasswordService,
	verifyForgotPasswordTokenService,
	resetPasswordService,
} from './auth.service.js'

export const register = asyncHandler(async (req, res) => {
	const { email, phone, password, firstName, lastName } = req.body

	if (!email || !phone || !password || !firstName || !lastName) {
		throw new AppError('All Fields are required', 402)
	}

	if (phone.length < 10 || phone.length > 15) {
		throw new AppError('Phone number is either 10 or 15 digits')
	}

	if (password.length < 6) {
		throw new AppError('Password is less than 6', 401)
	}

	await registrationService(email, phone, password, firstName, lastName)

	return res.status(201).json({ message: 'User registration successful' })
})

export const googleLogin = asyncHandler(async (req, res) => {
	const { idToken } = req.body
	if (!idToken) {
		return res.status(400).json({ message: 'Google token is required' })
	}
	const result = await googleAuth(idToken)
	return res.status(200).json(result)
})

export const login = asyncHandler(async (req, res) => {
	const { email, password } = req.body

	if (!email || !password) {
		throw new AppError('email and password is required', 403)
	}

	if (password.length < 6) {
		throw new AppError('Password is less than 6 digit')
	}

	const result = await loginService(email, password)

	return res.status(200).json(result)
})

export const forgotPassword = asyncHandler(async (req, res) => {
	const { email } = req.body

	if (!email) {
		throw new AppError('Email is required', 400)
	}

	const result = await forgotPasswordService(email)

	return res.status(200).json(result)
})

export const verifyForgotPasswordToken = asyncHandler(async (req, res) => {
	const token = req.query.token || req.body.token
	const result = await verifyForgotPasswordTokenService(token)

	return res.status(200).json(result)
})

export const resetPassword = asyncHandler(async (req, res) => {
	const authHeader = req.headers.authorization
	const token = authHeader?.startsWith('Bearer ')
		? authHeader.split(' ')[1]
		: null

	const { password, confirmPassword } = req.body

	if (!password || !confirmPassword) {
		throw new AppError('Password and confirmPassword are required', 400)
	}

	if (password.length < 6) {
		throw new AppError('Password is less than 6', 400)
	}

	if (password !== confirmPassword) {
		throw new AppError('Passwords do not match', 400)
	}

	const result = await resetPasswordService(token, password)

	return res.status(200).json(result)
})
