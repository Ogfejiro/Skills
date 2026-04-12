import mongoose from 'mongoose'

const hostSchema = new mongoose.Schema(
	{
		hostId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			unique: true,
		},
		address: {
			type: String,
		},
		organization: {
			type: String,
		},
		accountNo: {
			type: String,
			required: function () {
				return this.accountName
			},
		},
		accountName: {
			type: String,
		},
		walletAddress: {
			type: String,
		},
		walletType: {
			type: String,
		},
		walletSet: {
			type: Boolean,
			default: false,
		},
		balance: {
			type: Number,
			default: 0,
			min: 0,
		},
		conversionRate: {
			type: Number,
			default: 1400, // NGN per USD unit, host editable
			min: 100,
		},
		bankName: {
			type: String,
		},
		socials: {
			twitter: String,
			instagram: String,
			facebook: String,
			linkedin: String,
			website: String,
		},
	},
	{ timestamps: true },
)

const HostProfile = mongoose.model('HostProfile', hostSchema)

export default HostProfile
