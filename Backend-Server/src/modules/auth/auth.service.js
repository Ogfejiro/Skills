import bcrypt from 'bcrypt'
import User from '../../models/User.model.js'
import { verifyGoogleToken } from '../../services/shared/GoogleAuth.js'
import AppError from '../../services/shared/appError.js'
import { generateRefId } from '../../services/shared/generateRefId.js'
import { generateAccessToken } from '../../services/shared/generateToken.js'

export async function registrationService(
	email,
	phone,
	password,
	firstName,
	lastName,
	role,
	profession,
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
		role,
		profession,
	})

	return user
}

export async function googleAuth(idToken) {
	const payload = await verifyGoogleToken(idToken)

	const { sub: googleId, email, name, email_verified } = payload

	if (!email_verified) {
		throw new AppError('Google email not verified', 400)
	}

	// Find user by email
	let user = await User.findOne({ email })

	if (user) {
		// USER EXISTS
		const needsUpdate =
			!user.provider.includes('google') || user.googleId !== googleId

		if (needsUpdate) {
			await User.updateOne(
				{ _id: user._id },
				{
					$addToSet: { provider: 'google' }, // prevents duplicates
					$set: { googleId },
				},
			)

			user = await User.findById(user._id)
		}
	} else {
		// CREATE USER
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

	if (userExist.provider.includes('google')) {
		throw new AppError('Login with Google', 402)
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
