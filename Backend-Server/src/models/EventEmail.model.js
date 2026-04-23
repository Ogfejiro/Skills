import mongoose from 'mongoose'

const eventEmailSchema = new mongoose.Schema(
	{
		eventId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Event',
			required: true,
			unique: true,
		},
		hostId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'HostProfile',
			required: true,
		},
		subject: {
			type: String,
			required: true,
			trim: true,
		},
		htmlContent: {
			type: String,
			required: true,
		},
		isEnabled: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true },
)

eventEmailSchema.index({ hostId: 1, createdAt: -1 })

const EventEmail = mongoose.model('EventEmail', eventEmailSchema)

export default EventEmail
