import { verifyToken } from '../shared/generateToken.js'
import HostProfile from '../../models/Host.model.js'
import AppError from '../shared/appError.js'

export const authenticateToken = async (req, res, next) => {
	const authHeader = req.headers.authorization
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({ message: 'Unauthorized' })
	}

	const token = authHeader.split(' ')[1]
	try {
		const decoded = verifyToken(token)
		req.user = decoded
		next()
	} catch (error) {
		return res
			.status(401)
			.json({ message: 'Invalid token', error: error.message })
	}
}

export const authorizeRoles = (...allowedRoles) => {
	return (req, res, next) => {
		if (!req.user)
			return res.status(401).json({ message: 'User not authenticated.' })

		if (!allowedRoles.includes(req.user.role)) {
			return res.status(403).json({
				message: 'You do not have permission to perform this action.',
			})
		}

		next()
	}
}

export const requireHostProfile = async (req, res, next) => {
	if (!req.user?.id) {
		return res.status(401).json({ message: 'User not authenticated.' })
	}

	try {
		const hostProfile = await HostProfile.findOne({ userId: req.user.id })

		if (!hostProfile) {
			throw new AppError(
				'Not allowed, create host profile to continue',
				405,
			)
		}

		req.hostProfile = hostProfile
		next()
	} catch (error) {
		return res.status(500).json({
			message: 'Failed to validate host profile.',
			error: error.message,
		})
	}
}
