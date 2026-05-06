import mongoose from 'mongoose'

const adminSettingsSchema = new mongoose.Schema(
	{
		key: {
			type: String,
			default: 'global',
			unique: true,
			immutable: true,
		},
		conversionRate: {
			type: Number,
			default: 1500, // NGN per USD
			min: 100,
		},
	},
	{ timestamps: true },
)

const AdminSettings = mongoose.model('AdminSettings', adminSettingsSchema)

export async function getAdminSettings() {
	let settings = await AdminSettings.findOne({ key: 'global' })
	if (!settings) {
		settings = await AdminSettings.create({ key: 'global' })
	}
	return settings
}

export async function getAdminConversionRate() {
	const settings = await getAdminSettings()
	return settings.conversionRate || 1500
}

export default AdminSettings
