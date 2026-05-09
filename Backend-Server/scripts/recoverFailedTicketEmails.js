// scripts/recoverFailedTicketEmails.js
//
// Finds payments that succeeded but whose webhook threw before sending the
// confirmation email and crediting the host. Re-sends the email and credits
// the host balance. Idempotent — safe to re-run.
//
// Usage:
//   node scripts/recoverFailedTicketEmails.js --dry-run
//   node scripts/recoverFailedTicketEmails.js
//   node scripts/recoverFailedTicketEmails.js --tx-ref=<paymentId>
//
// A payment is considered "stuck" when:
//   - Payment.status === 'successful'
//   - A Ticket exists for its tx_ref
//   - Payment.hostEarningsUsd is missing/0 (host was never credited)

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Payment from '../src/models/payment.model.js'
import Ticket from '../src/models/ticket.model.js'
import Event from '../src/models/Event.model.js'
import Host from '../src/models/Host.model.js'
import WebhookLog from '../src/models/WebhookLog.model.js'
import {
	sendVerificationEmail,
	sendCustomHostEmail,
} from '../src/services/shared/sendVerificationEmail.js'
import { getEventEmailTemplateByEventId } from '../src/modules/event-email/eventEmail.service.js'
import {
	splitWithReferralCommission,
	payReferralCommission,
} from '../src/services/shared/referralCommission.js'

dotenv.config()

const DRY_RUN = process.argv.includes('--dry-run')
const txRefArg = process.argv
	.find((a) => a.startsWith('--tx-ref='))
	?.split('=')[1]

async function run() {
	if (!process.env.MONGODB_URI) {
		console.error('MONGODB_URI is not set')
		process.exit(1)
	}

	await mongoose.connect(process.env.MONGODB_URI)
	console.log(`Connected. Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`)

	const query = {
		status: 'successful',
		$or: [
			{ hostEarningsUsd: { $exists: false } },
			{ hostEarningsUsd: 0 },
			{ hostEarningsUsd: null },
		],
	}
	if (txRefArg) {
		query._id = txRefArg
		delete query.$or
	}

	const payments = await Payment.find(query).sort({ createdAt: 1 })
	console.log(`Found ${payments.length} candidate payment(s)`)

	let recovered = 0
	let skipped = 0
	const skippedDetails = []

	for (const payment of payments) {
		const txRef = payment._id.toString()
		const log = (line) => console.log(`[${txRef}] ${line}`)

		// Must have a Ticket already (otherwise this isn't the bug we're recovering)
		const ticket = await Ticket.findOne({ tx_ref: txRef })
		if (!ticket) {
			skipped++
			skippedDetails.push({ txRef, reason: 'no Ticket exists yet' })
			continue
		}

		const event = await Event.findById(payment.eventId)
		if (!event) {
			skipped++
			skippedDetails.push({ txRef, reason: 'event not found' })
			continue
		}

		const host = await Host.findById(event.hostId)
		if (!host) {
			skipped++
			skippedDetails.push({ txRef, reason: 'host not found' })
			continue
		}

		// Determine USD amount credited
		let usdAmount
		if (payment.currency === 'USD') {
			// Crypto payment — prefer outcomeAmount when usdtsol, else price (amount)
			usdAmount =
				payment.outcomeCurrency === 'usdtsol' &&
				Number.isFinite(Number(payment.outcomeAmount))
					? Number(payment.outcomeAmount)
					: Number(payment.amount)
		} else {
			// NGN / Flutterwave
			const rate = host.conversionRate
			if (!rate || rate <= 0) {
				skipped++
				skippedDetails.push({
					txRef,
					reason: `host.conversionRate invalid: ${rate}`,
				})
				continue
			}
			usdAmount = Number(payment.amount) / rate
		}

		if (!Number.isFinite(usdAmount) || usdAmount <= 0) {
			skipped++
			skippedDetails.push({ txRef, reason: `bad usdAmount: ${usdAmount}` })
			continue
		}

		log(`will recover (currency=${payment.currency}, usd=${usdAmount.toFixed(4)})`)

		if (DRY_RUN) {
			recovered++
			continue
		}

		// 1. Send verification email
		try {
			const emailResult = await sendVerificationEmail(
				payment.customerEmail,
				payment.ticketName,
				`https://www.lofte.live/tickets?tx_ref=${txRef}`,
				event.title,
				event.venue,
				event.date,
			)
			if (!emailResult.success) {
				log(`⚠️ email send returned failure: ${emailResult.error}`)
			} else {
				log(`✅ verification email sent`)
			}
		} catch (err) {
			log(`⚠️ verification email error: ${err.message}`)
		}

		// 2. Custom host email (optional)
		try {
			const tpl = await getEventEmailTemplateByEventId(payment.eventId)
			if (tpl && tpl.isEnabled) {
				const r = await sendCustomHostEmail(
					payment.customerEmail,
					tpl.subject,
					tpl.htmlContent,
				)
				log(r.success ? `✅ host email sent` : `⚠️ host email failed`)
			}
		} catch (err) {
			log(`⚠️ host email error: ${err.message}`)
		}

		// 3. Credit host balance + referral commission
		try {
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

			log(
				`✅ host credited (hostEarnings=${hostEarnings}, referrer=${referrerEarnings})`,
			)
		} catch (err) {
			log(`❌ host credit failed: ${err.message}`)
			skipped++
			skippedDetails.push({ txRef, reason: `credit failed: ${err.message}` })
			continue
		}

		// 4. Mark any pending/failed webhook log as processed
		try {
			const provider = payment.currency === 'USD' ? 'crypto' : 'flutterwave'
			await WebhookLog.updateMany(
				{ provider, 'payload.order_id': txRef, status: { $ne: 'processed' } },
				{ status: 'processed' },
			)
			await WebhookLog.updateMany(
				{ provider, 'payload.tx_ref': txRef, status: { $ne: 'processed' } },
				{ status: 'processed' },
			)
		} catch (err) {
			log(`⚠️ webhook log cleanup failed: ${err.message}`)
		}

		recovered++
	}

	console.log('\n=== Summary ===')
	console.log(`Recovered: ${recovered}`)
	console.log(`Skipped:   ${skipped}`)
	if (skippedDetails.length) {
		console.log('Skipped details:')
		for (const d of skippedDetails) console.log(`  - ${d.txRef}: ${d.reason}`)
	}

	await mongoose.disconnect()
	process.exit(0)
}

run().catch((err) => {
	console.error('Fatal:', err)
	process.exit(1)
})
