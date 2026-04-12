import Payment from '../../models/payment.model.js'
import AppError from './appError.js'

export async function cleanupPendingPayments(daysOld = 7) {
	try {
		const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000)

		const result = await Payment.deleteMany({
			status: 'pending',
			createdAt: { $lt: cutoffDate },
		})

		console.log(
			`🧹 Cleanup: Removed ${result.deletedCount} pending payments older than ${daysOld} days`,
		)

		return {
			success: true,
			deletedCount: result.deletedCount,
		}
	} catch (error) {
		console.error('❌ Payment cleanup failed:', error)
		throw new AppError(`Payment cleanup failed: ${error.message}`, 500)
	}
}

export function schedulePaymentCleanup() {
	// Run cleanup every 24 hours
	const intervalMs = 24 * 60 * 60 * 1000

	console.log('Scheduling payment cleanup job (runs every 24 hours)')

	setInterval(() => {
		cleanupPendingPayments(7)
	}, intervalMs)

	// Run once on startup
	cleanupPendingPayments(7)
}
