import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema(
	{
		userId: String,
		tx_ref: String,
		transactionId: String,
		amount: Number,
		quantity: Number,
		currency: String,
		currencyPaid: String,
		status: String,
		customerEmail: String,
		paidAmountCrypto: String,
		ticketName: String,
	},
	{ timestamps: true },
)

// Add indexes for performance
paymentSchema.index({ tx_ref: 1 }, { unique: true })
paymentSchema.index({ userId: 1 })
paymentSchema.index({ status: 1 })
paymentSchema.index({ createdAt: 1 })
paymentSchema.index({ status: 1, createdAt: 1 })

export default mongoose.model('Payment', paymentSchema)
