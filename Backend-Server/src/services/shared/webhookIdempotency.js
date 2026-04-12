import WebhookLog from '../../models/WebhookLog.model.js'

export async function isWebhookProcessed(provider, externalId) {
	const log = await WebhookLog.findOne({
		provider,
		externalId,
		status: 'processed',
	})

	return !!log
}


export async function logWebhookPending(provider, externalId, payload) {
	try {
		const log = await WebhookLog.findOneAndUpdate(
			{ provider, externalId },
			{
				provider,
				externalId,
				payload,
				status: 'pending',
			},
			{ upsert: true, new: true, runValidators: true },
		)
		return log
	} catch (error) {
		// Handle duplicate key error
		if (error.code === 11000) {
			console.warn(`Webhook already exists for ${provider}:${externalId}`)
			return null
		}
		throw error
	}
}

export async function markWebhookProcessed(provider, externalId) {
	const log = await WebhookLog.findOneAndUpdate(
		{ provider, externalId },
		{ status: 'processed' },
		{ new: true },
	)
	return log
}

export async function markWebhookFailed(provider, externalId, error) {
	const log = await WebhookLog.findOneAndUpdate(
		{ provider, externalId },
		{ status: 'failed', error: error.toString() },
		{ new: true },
	)
	return log
}
