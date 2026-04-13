import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema(
	{
		hostId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		title: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
		},
		date: {
			type: Date,
			required: true,
		},
		venue: {
			type: String,
			required: true,
		},
		capacity: {
			type: Number,
			required: true,
			min: 1,
		},
		ticketsSold: {
			type: Number,
			default: 0,
		},
		status: {
			type: String,
			enum: ['draft', 'Auditing', 'live', 'ended', 'cancelled'],
			default: 'draft',
		},
		isApproved: {
			type: Boolean,
			default: false,
		},
		feeByUser: {
			type: Boolean,
			default: false,
		},
		approvalStatus: {
			type: String,
			enum: ['pending', 'approved', 'rejected'],
			default: 'pending',
		},
		approvalDate: {
			type: Date,
		},
		rejectionReason: {
			type: String,
		},
		banner: {
			type: String, // URL
		},
		category: {
			type: String,
		},
		tags: [
			{
				type: String,
			},
		],
	},
	{ timestamps: true },
)

eventSchema.index({ hostId: 1, status: 1, createdAt: -1 })
eventSchema.index({ date: 1 })
eventSchema.index({ status: 1 })

const Event = mongoose.model('Event', eventSchema)

export default Event
