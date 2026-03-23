import asyncHandler from '../../services/shared/asyncHandler.js'
import AppError from '../../services/shared/appError.js'
import {
  registrationService,
  googleAuth,
  loginService,
} from './auth.service.js'

export const register = asyncHandler(async (req, res) => {
  const { email, phone, password, firstName, lastName, role, profession } =
    req.body

  if (
    !email ||
    !phone ||
    !password ||
    !firstName ||
    !lastName ||
    !role ||
    !profession
  ) {
    throw new AppError('All Fields are required', 402)
  }

  if (phone.length < 10 || phone.length > 15) {
    throw new AppError('Phone number is either 10 or 15 digits')
  }

  if (password.length < 6) {
    throw new AppError('Password is less than 6', 401)
  }

  const user = await registrationService(
    email,
    phone,
    password,
    firstName,
    lastName,
    role,
    profession,
  )

  return res.status(201).json({ message: 'User registration successful' })
})

export const googleLogin = asyncHandler(async (req, res) => {
  const { idToken } = req.body
  if (!idToken) {
    return res.status(400).json({ message: 'Google token is required' })
  }
  const result = await googleAuth({ idToken })
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
