import mongoose from 'mongoose'

const withdrawalSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},
		source: {
			type: String,
			enum: ['host', 'referral'],
			required: true,
			index: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		currency: {
			type: String,
			default: 'USD',
		},
		method: {
			type: String,
			enum: ['bank', 'crypto'],
			required: true,
		},
		paymentInfo: {
			type: mongoose.Schema.Types.Mixed,
			required: true,
		},
		payoutAmount: {
			type: Number,
		},
		payoutCurrency: {
			type: String,
		},
		conversionRate: {
			type: Number,
		},
		status: {
			type: String,
			enum: ['pending', 'submitted', 'failed', 'refunded', 'paid'],
			default: 'pending',
			index: true,
		},
		emailStatus: {
			admin: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
			user: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
		},
		failureReason: {
			type: String,
		},
		requestedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true },
)

withdrawalSchema.index({ userId: 1, createdAt: -1 })
withdrawalSchema.index({ source: 1, status: 1, createdAt: -1 })

const Withdrawal = mongoose.model('Withdrawal', withdrawalSchema)

export default Withdrawal
