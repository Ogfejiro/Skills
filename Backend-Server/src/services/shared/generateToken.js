import jwt from 'jsonwebtoken'

export const generateAccessToken = (payload) => {
	return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: process.env.ACCESS_JWT_EXPIRES_IN,
	})
}

export const generateRefreshToken = (payload) => {
	return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: process.env.REFRESH_JWT_EXPIRES_IN,
	})
}

export const verifyToken = (token) => {
	try {
		return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
	} catch (error) {
		throw new Error('Invalid token')
	}
}

export const generatePasswordResetToken = (payload) => {
	return jwt.sign(payload, process.env.RESET_PASSWORD_TOKEN_SECRET, {
		expiresIn: process.env.RESET_PASSWORD_JWT_EXPIRES_IN,
	})
}

export const verifyPasswordResetToken = (token) => {
	try {
		return jwt.verify(token, process.env.RESET_PASSWORD_TOKEN_SECRET)
	} catch (error) {
		throw new Error('Invalid or expired reset token')
	}
}
