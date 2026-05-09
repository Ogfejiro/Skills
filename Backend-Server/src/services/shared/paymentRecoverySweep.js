// services/shared/paymentRecoverySweep.js
//
// Finds payments that succeeded but whose webhook threw before sending the
// confirmation email and crediting the host, then finishes that work.
// Idempotent: a recovered payment falls out of the query on the next sweep.
//
// Triggers:
//   - schedulePaymentRecoverySweep(): interval timer at server boot
//   - runPaymentRecoverySweep(): fire-and-forget after each webhook handler

import Payment from '../../models/payment.model.js'
import Ticket from '../../models/ticket.model.js'
import Event from '../../models/Event.model.js'
import Host from '../../models/Host.model.js'
import WebhookLog from '../../models/WebhookLog.model.js'
import {
	sendVerificationEmail,
	sendCustomHostEmail,
} from './sendVerificationEmail.js'
import { getEventEmailTemplateByEventId } from '../../modules/event-email/eventEmail.service.js'
import {
	splitWithReferralCommission,
	payReferralCommission,
} from './referralCommission.js'

const LOOKBACK_HOURS = 24
const SWEEP_INTERVAL_MS = 10 * 60 * 1000 // every 10 minutes

let sweepInFlight = false

export async function runPaymentRecoverySweep() {
	if (sweepInFlight) return { skipped: true, reason: 'already running' }
	sweepInFlight = true

	const startedAt = Date.now()
	let recovered = 0
	let skipped = 0

	try {
		const cutoff = new Date(Date.now() - LOOKBACK_HOURS * 60 * 60 * 1000)

		const candidates = await Payment.find({
			status: 'successful',
			createdAt: { $gte: cutoff },
			$or: [
				{ hostEarningsUsd: { $exists: false } },
				{ hostEarningsUsd: 0 },
				{ hostEarningsUsd: null },
			],
		}).sort({ createdAt: 1 })

		if (candidates.length === 0) {
			return { recovered: 0, skipped: 0, durationMs: Date.now() - startedAt }
		}

		console.log(
			`🔁 Recovery sweep: ${candidates.length} candidate payment(s) in last ${LOOKBACK_HOURS}h`,
		)

		for (const payment of candidates) {
			const txRef = payment._id.toString()
			try {
				const result = await recoverPayment(payment, txRef)
				if (result.recovered) recovered++
				else skipped++
			} catch (err) {
				skipped++
				console.error(`[recovery ${txRef}] failed:`, err.message)
			}
		}

		console.log(
			`✅ Recovery sweep done: recovered=${recovered} skipped=${skipped}`,
		)
		return { recovered, skipped, durationMs: Date.now() - startedAt }
	} finally {
		sweepInFlight = false
	}
}

async function recoverPayment(payment, txRef) {
	const ticket = await Ticket.findOne({ tx_ref: txRef })
	if (!ticket) return { recovered: false, reason: 'no Ticket yet' }

	const event = await Event.findById(payment.eventId)
	if (!event) return { recovered: false, reason: 'event not found' }

	const host = await Host.findById(event.hostId)
	if (!host) return { recovered: false, reason: 'host not found' }

	let usdAmount
	if (payment.currency === 'USD') {
		usdAmount =
			payment.outcomeCurrency === 'usdtsol' &&
			Number.isFinite(Number(payment.outcomeAmount))
				? Number(payment.outcomeAmount)
				: Number(payment.amount)
	} else {
		const rate = host.conversionRate
		if (!rate || rate <= 0) {
			return { recovered: false, reason: `bad conversionRate: ${rate}` }
		}
		usdAmount = Number(payment.amount) / rate
	}

	if (!Number.isFinite(usdAmount) || usdAmount <= 0) {
		return { recovered: false, reason: `bad usdAmount: ${usdAmount}` }
	}

	// 1. Verification email
	try {
		const r = await sendVerificationEmail(
			payment.customerEmail,
			payment.ticketName,
			`https://www.lofte.live/tickets?tx_ref=${txRef}`,
			event.title,
			event.venue,
			event.date,
		)
		if (!r.success) {
			console.warn(`[recovery ${txRef}] email send failed: ${r.error}`)
		}
	} catch (err) {
		console.warn(`[recovery ${txRef}] email error: ${err.message}`)
	}

	// 2. Custom host email (optional)
	try {
		const tpl = await getEventEmailTemplateByEventId(payment.eventId)
		if (tpl && tpl.isEnabled) {
			await sendCustomHostEmail(
				payment.customerEmail,
				tpl.subject,
				tpl.htmlContent,
			)
		}
	} catch (err) {
		console.warn(`[recovery ${txRef}] host email error: ${err.message}`)
	}

	// 3. Credit host + referral
	const { hostEarnings, referrerEarnings, referrerId } =
		await splitWithReferralCommission(usdAmount, host)

	await Payment.updateOne(
		{ _id: payment._id },
		{ grossUsd: usdAmount, hostEarningsUsd: hostEarnings },
	)

	host.balance += hostEarnings
	host.revenue += hostEarnings
	await host.save()

	await payReferralCommission({
		referrerId,
		refereeUserId: host.userId,
		amountUsd: referrerEarnings,
		paymentId: payment._id,
	})

	// 4. Mark stuck webhook logs as processed
	try {
		const provider = payment.currency === 'USD' ? 'crypto' : 'flutterwave'
		await WebhookLog.updateMany(
			{
				provider,
				status: { $ne: 'processed' },
				$or: [{ 'payload.order_id': txRef }, { 'payload.tx_ref': txRef }],
			},
			{ status: 'processed' },
		)
	} catch (err) {
		console.warn(`[recovery ${txRef}] webhook log cleanup: ${err.message}`)
	}

	console.log(`[recovery ${txRef}] ✅ recovered (usd=${usdAmount.toFixed(4)})`)
	return { recovered: true }
}

export function schedulePaymentRecoverySweep() {
	console.log(
		`Scheduling payment recovery sweep (every ${SWEEP_INTERVAL_MS / 60000} min, lookback ${LOOKBACK_HOURS}h)`,
	)
	setInterval(() => {
		runPaymentRecoverySweep().catch((err) =>
			console.error('Recovery sweep error:', err),
		)
	}, SWEEP_INTERVAL_MS)

	// Run once on startup
	runPaymentRecoverySweep().catch((err) =>
		console.error('Recovery sweep error:', err),
	)
}
