import mongoose from 'mongoose'

const webhookLogSchema = new mongoose.Schema(
	{
		provider: {
			type: String,
			enum: ['flutterwave', 'crypto', 'other'],
			required: true,
		},
		externalId: {
			type: String,
			required: true,
		},
		payload: mongoose.Schema.Types.Mixed,
		status: {
			type: String,
			enum: ['pending', 'processed', 'failed'],
			default: 'pending',
		},
		error: String,
	},
	{ timestamps: true },
)

// Unique index on provider + externalId to prevent duplicates
webhookLogSchema.index({ provider: 1, externalId: 1 }, { unique: true })
webhookLogSchema.index({ createdAt: 1 })

export default mongoose.model('WebhookLog', webhookLogSchema)
