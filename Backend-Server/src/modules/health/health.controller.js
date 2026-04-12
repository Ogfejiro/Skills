import asyncHandler from '../../services/shared/asyncHandler.js'
import mongoose from 'mongoose'

export const healthCheckController = asyncHandler(async (req, res) => {
	const dbConnection =
		mongoose.connection.readyState === 1 ? 'healthy' : 'unhealthy'

	res.status(200).json({
		status: 'ok',
		timestamp: new Date().toISOString(),
		database: dbConnection,
		uptime: process.uptime(),
		environment: process.env.NODE_ENV,
	})
})
