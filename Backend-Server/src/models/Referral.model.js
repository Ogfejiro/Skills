import mongoose from 'mongoose'

const referralSchema = new mongoose.Schema(
	{
		referrerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},
		refereeId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},
		eventType: {
			type: String,
			enum: ['signup', 'purchase'],
			required: true,
		},
		status: {
			type: String,
			enum: ['pending', 'qualified', 'rewarded', 'void'],
			default: 'pending',
		},
		rewardAmount: {
			type: Number,
			default: 0,
		},
		rewardCurrency: {
			type: String,
			default: 'USD',
		},
		metadata: {
			type: mongoose.Schema.Types.Mixed,
		},
	},
	{ timestamps: true },
)

referralSchema.index(
	{ referrerId: 1, refereeId: 1, eventType: 1 },
	{ unique: true },
)

const Referral = mongoose.model('Referral', referralSchema)

export default Referral
