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
} // This function can be used to get the conversion rate for payments even if you are not an admin. It will return the default conversion rate if no settings are found.

export async function getAdminConversionRate() {
	const settings = await getAdminSettings()
	return settings.conversionRate || 1500
} // This function can be used to get the conversion rate for payments even if you are not an admin. It will return the default conversion rate if no settings are found.

export default AdminSettings
