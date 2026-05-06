import User from '../../models/User.model.js'
import Referral from '../../models/Referral.model.js'
import HostProfile from '../../models/Host.model.js'

const PLATFORM_RATE_FULL = 0.03
const PLATFORM_RATE_WITH_REFERRAL = 0.02
const REFERRAL_RATE = 0.01

/**
 * Splits a USD payment into platform / host / referrer earnings.
 * If the host's owning user has a referredBy set, 1% of gross goes to the
 * referrer and the platform keeps 2%. Otherwise the platform keeps the full 3%.
 */
export async function splitWithReferralCommission(usdAmount, hostProfile) {
	const hostOwner = await User.findById(hostProfile.userId).select(
		'referredBy',
	)

	const hasReferrer = !!hostOwner?.referredBy
	const platformRate = hasReferrer
		? PLATFORM_RATE_WITH_REFERRAL
		: PLATFORM_RATE_FULL
	const referralRate = hasReferrer ? REFERRAL_RATE : 0

	const platformFee = usdAmount * platformRate
	const referrerEarnings = usdAmount * referralRate
	const hostEarnings = usdAmount - platformFee - referrerEarnings

	return {
		platformFee,
		referrerEarnings,
		hostEarnings,
		referrerId: hasReferrer ? hostOwner.referredBy : null,
	}
}

/**
 * Credits a referrer's wallet and logs a purchase Referral entry.
 * Failures are non-fatal (logged) so they don't roll back the payment.
 */
export async function payReferralCommission({
	referrerId,
	refereeUserId,
	amountUsd,
	paymentId,
}) {
	if (!referrerId || amountUsd <= 0) return

	try {
		await User.findByIdAndUpdate(referrerId, {
			$inc: {
				referralWallet: amountUsd,
				referralEarningsTotal: amountUsd,
			},
		})

		await Referral.create({
			referrerId,
			refereeId: refereeUserId,
			eventType: 'purchase',
			status: 'rewarded',
			rewardAmount: amountUsd,
			rewardCurrency: 'USD',
			metadata: { paymentId: paymentId?.toString() },
		})
	} catch (err) {
		console.warn(
			`⚠️ Referral commission failed for referrer ${referrerId} on payment ${paymentId}:`,
			err.message,
		)
	}
}

export async function loadHostOwnerUserId(hostProfileId) {
	const profile = await HostProfile.findById(hostProfileId).select('userId')
	return profile?.userId || null
}
