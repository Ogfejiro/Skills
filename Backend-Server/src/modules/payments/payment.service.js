import { flwClient } from '../../config/flutterwave.js'
import Payment from '../../models/payment.model.js'
import { randomUUID } from 'crypto'
import crypto from 'crypto'
import Ticket from '../../models/ticket.model.js'
import Event from '../../models/Event.model.js'
import EventTicket from '../../models/EventTicket.model.js'
import Host from '../../models/Host.model.js'
import { getAdminConversionRate } from '../../models/AdminSettings.model.js'
import {
	sendVerificationEmail,
	sendCustomHostEmail,
} from '../../services/shared/sendVerificationEmail.js'
import {
	generateRegularTicket,
	generateTicket,
} from '../../services/shared/ticket.service.js'
import { getEventEmailTemplateByEventId } from '../event-email/eventEmail.service.js'
import nowPaymentsService from '../../config/heleket.js'
import AppError from '../../services/shared/appError.js'
import {
	isWebhookProcessed,
	logWebhookPending,
	markWebhookProcessed,
	markWebhookFailed,
} from '../../services/shared/webhookIdempotency.js'
import {
	splitWithReferralCommission,
	payReferralCommission,
} from '../../services/shared/referralCommission.js'

export async function initiateInvoice(
	amount,
	email,
	userId,
	ticketName,
	eventId,
	quantity,
) {
	const payment = await Payment.create({
		userId,
		eventId,
		amount,
		currency: 'NGN',
		status: 'pending',
		customerEmail: email,
		quantity,
		ticketName,
		eventId,
	})

	const adminConversionRate = await getAdminConversionRate()
	console.log('Admin Conversion Rate (NGN per USD):', adminConversionRate)

	const tx_ref = payment._id.toString()

	const response = await flwClient.post('/payments', {
		tx_ref,
		amount,
		currency: 'NGN',
		redirect_url: `https://www.lofte.live/payment-status?tx_ref=${tx_ref}`,
		customer: { email },
		customizations: {
			title: `${ticketName} Ticket Payment`,
			description: 'Payment for ticket purchase',
		},
	})

	return { paymentLink: response.data.data.link }
}

export async function handleFlutterwaveWebhook(payload) {
	try {
		if (!payload) {
			return { status: 'ignored' }
		}

		const tx_ref = payload.tx_ref
		const externalId = payload.id

		// Check if already processed (idempotency)
		const alreadyProcessed = await isWebhookProcessed(
			'flutterwave',
			externalId,
		)
		if (alreadyProcessed) {
			console.log('✅ Webhook already processed:', externalId)
			return { status: 'already_processed' }
		}

		// Log webhook as pending
		await logWebhookPending('flutterwave', externalId, payload)
		console.log('✅ Webhook already processed')

		const status = payload.status?.toLowerCase()

		// Only process successful payments
		if (!['successful', 'completed', 'success'].includes(status)) {
			console.log('⏭️ Webhook ignored - status not successful:', status)
			return { status: 'ignored' }
		}

		const existingPayment = await Payment.findById({
			_id: tx_ref,
		})
		console.log('✅ Passed Existing Payment')

		if (existingPayment.status === 'successful') return

		if (!existingPayment) {
			console.error('❌ Payment not found:', tx_ref)
			await markWebhookFailed(
				'flutterwave',
				externalId,
				'Payment not found',
			)
			return { status: 'not_found' }
		}

		// Update payment status
		const updatedPayment = await Payment.findOneAndUpdate(
			{ _id: tx_ref },
			{
				tx_ref: tx_ref,
				status: 'successful',
				transactionId: externalId,
			},
			{ new: true },
		)

		// Generate ticket
		try {
			await generateTicket(tx_ref)
		} catch (ticketError) {
			console.error('❌ Ticket generation failed:', ticketError)
			await markWebhookFailed(
				'flutterwave',
				externalId,
				`Ticket generation: ${ticketError.message}`,
			)
			throw ticketError
		}

		const updateEvent = await Event.findByIdAndUpdate(
			existingPayment.eventId,
			{
				$inc: {
					ticketsSold: existingPayment.quantity,
				},
			},
			{ new: true },
		)

		if (!updateEvent) {
			throw new AppError(
				`Event not found for ID: ${existingPayment.eventId}`,
				404,
			)
		}

		const updateEventTicket = await EventTicket.findOneAndUpdate(
			{
				eventId: updateEvent._id,
				title: existingPayment.ticketName,
			},
			{
				$inc: {
					sold: existingPayment.quantity,
				},
			},
			{ new: true },
		)

		if (!updateEventTicket) {
			console.warn(
				`⚠️ EventTicket not found for title: ${existingPayment.ticketName} (eventId: ${updateEvent._id}). Skipping EventTicket update.`,
			)
		}

		// Send email
		try {
			const emailResult = await sendVerificationEmail(
				updatedPayment.customerEmail,
				updatedPayment.ticketName,
				`https://www.lofte.live/tickets?tx_ref=${updatedPayment.tx_ref}`,
				updateEvent.title,
				updateEvent.venue,
				updateEvent.date,
			)

			if (!emailResult.success) {
				console.warn(
					`⚠️ Email sending failed but payment processed. PaymentID: ${updatedPayment._id}, Error: ${emailResult.error}`,
				)
				// Email failure is not fatal - ticket already generated
			}
		} catch (emailError) {
			console.warn(
				`⚠️ Email error for payment ${updatedPayment._id}:`,
				emailError,
			)
			// Continue even if email fails - ticket was already generated
		}

		// Send custom host email if template exists
		try {
			const hostEmailTemplate = await getEventEmailTemplateByEventId(
				existingPayment.eventId,
			)

			if (hostEmailTemplate && hostEmailTemplate.isEnabled) {
				const hostEmailResult = await sendCustomHostEmail(
					updatedPayment.customerEmail,
					hostEmailTemplate.subject,
					hostEmailTemplate.htmlContent,
				)

				if (!hostEmailResult.success) {
					console.warn(
						`⚠️ Custom host email failed for payment ${updatedPayment._id}. Will continue with payment processing.`,
					)
				} else {
					console.log(
						`✅ Custom host email sent for payment ${updatedPayment._id}`,
					)
				}
			}
		} catch (hostEmailError) {
			console.warn(
				`⚠️ Error retrieving/sending custom host email for payment ${updatedPayment._id}:`,
				hostEmailError.message,
			)
			// Continue - custom email is optional
		}

		const ngnAmount = payload.amount

		const hostProfile = await Host.findById(updateEvent.hostId)
		if (!hostProfile) {
			throw new AppError('Update Balance Failed', 409)
		}

		const adminConversionRate = await getAdminConversionRate() // NGN per USD
		const conversionRate = adminConversionRate // NGN per USD
		const usdAmount = ngnAmount / conversionRate

		const { hostEarnings, referrerEarnings, referrerId } =
			await splitWithReferralCommission(usdAmount, hostProfile)

		await Payment.updateOne(
			{ _id: updatedPayment._id },
			{ grossUsd: usdAmount, hostEarningsUsd: hostEarnings },
		)

		hostProfile.balance += hostEarnings
		hostProfile.revenue += hostEarnings
		await hostProfile.save()

		await payReferralCommission({
			referrerId,
			refereeUserId: hostProfile.userId,
			amountUsd: referrerEarnings,
			paymentId: updatedPayment._id,
		})

		// Mark webhook as processed
		await markWebhookProcessed('flutterwave', externalId)

		console.log('✅ Payment successfully processed:', tx_ref)

		return { status: 'processed' }
	} catch (error) {
		console.error('❌ Webhook processing error:', error)
		throw error
	}
}

export async function verifyPay(tx_ref) {
	const payment = await Payment.findOne({ tx_ref })

	if (!payment) {
		throw new AppError('Payment not found', 404)
	}

	if (
		payment.status === 'successful' ||
		payment.status === 'paid' ||
		payment.status === 'completed'
	) {
		return { status: 'success', message: 'Payment successful' }
	}

	throw new AppError('Payment not successful', 400)
}

export async function TicketByRef(tx_ref) {
	const ticket = await Ticket.findOne({ tx_ref })
	if (!ticket) {
		throw new AppError('Ticket not found', 404)
	}
	return ticket
}

export async function TicketById(ticketId) {
	const ticket = await Ticket.findOne({ ticketId })
	if (!ticket) {
		throw new AppError('Ticket not found', 404)
	}

	let eventName = ticket.eventName
	let eventDate = ticket.eventDate
	let eventLocation = ticket.location

	// if (ticket.tx_ref) {
	// 	const payment = await Payment.findOne({ _id: ticket.tx_ref })
	// 	if (payment?.eventId) {
	// 		const event = await Event.findById(payment.eventId)
	// 		if (event) {
	// 			eventName = eventName || event.title
	// 			eventDate = eventDate || event.date
	// 			eventLocation = eventLocation || event.venue
	// 		}
	// 	}
	// }

	return {
		ticketId: ticket.ticketId,
		ticketName: ticket.ticketName,
		amount: ticket.amount,
		currency: ticket.currency,
		status: ticket.status,
		quantity: ticket.quantity,
		customerEmail: ticket.customerEmail,
		eventName,
		eventDate,
		eventLocation,
		purchaseDate: ticket.createdAt,
		tx_ref: ticket.tx_ref,
	}
}

export async function createCryptoInvoice(
	amount,
	email,
	userId,
	ticketName,
	eventId,
	quantity,
) {
	const payment = await Payment.create({
		userId,
		amount,
		quantity,
		eventId,
		currency: 'USD',
		status: 'pending',
		customerEmail: email,
		ticketName,
		provider: 'nowpayments',
	})

	const eventExist = await Event.findById(eventId)

	const tx_ref = payment._id

	let invoice

	try {
		invoice = await nowPaymentsService.createInvoice({
			price_amount: amount,
			price_currency: 'USD',
			order_id: tx_ref,
			is_fee_paid_by_user: false,
			is_fixed_rate: false,
			payout_currency: 'usdtsol',
			order_description: `Payment for ${ticketName} ticket`,
			ipn_callback_url: `${process.env.BACKEND_URL}/api/payments/crypto-webhook`,
			success_url: `${process.env.FRONTEND_URL}/payment-status?tx_ref=${tx_ref}`,
			cancel_url: `${process.env.FRONTEND_URL}/payment-status?tx_ref=${tx_ref}`,
		})
	} catch (err) {
		console.error(err)
		throw new Error('Failed to create crypto invoice')
	}

	return { paymentLink: invoice.invoice_url }
}

export async function handleCryptoWebhook(rawBody, signature) {
	try {
		// Verify signature
		const hmac = crypto
			.createHmac('sha512', process.env.NOWPAYMENTS_IPN_SECRET)
			.update(rawBody)
			.digest('hex')

		if (hmac !== signature) {
			throw new AppError('Invalid signature', 400)
		}

		const paymentData = JSON.parse(rawBody.toString())
		const externalId = paymentData.payment_id

		// Check if already processed (idempotency)
		const alreadyProcessed = await isWebhookProcessed('crypto', externalId)
		if (alreadyProcessed) {
			console.log('✅ Crypto webhook already processed:', externalId)
			return { status: 'already_processed' }
		}

		// Log webhook as pending
		await logWebhookPending('crypto', externalId, paymentData)

		// Ignore non-final states
		if (paymentData.payment_status !== 'finished') {
			console.log(
				'⏭️ Crypto webhook ignored - status not finished:',
				paymentData.payment_status,
			)
			return { status: 'ignored' }
		}

		const existingPayment = await Payment.findOne({
			_id: paymentData.order_id,
		})

		if (!existingPayment) {
			console.error('❌ Payment not found:', paymentData.order_id)
			await markWebhookFailed('crypto', externalId, 'Payment not found')
			return { status: 'not_found' }
		}

		// Validate fiat amount
		if (
			Number(paymentData.price_amount) !== Number(existingPayment.amount)
		) {
			console.error(
				'❌ Amount mismatch! Expected:',
				existingPayment.amount,
				'Got:',
				paymentData.price_amount,
			)
			await markWebhookFailed('crypto', externalId, 'Amount mismatch')
			throw new AppError('Amount mismatch', 400)
		}

		// Validate crypto outcome
		if (!paymentData.pay_amount || !paymentData.pay_currency) {
			console.error('❌ Missing crypto outcome data')
			await markWebhookFailed(
				'crypto',
				externalId,
				'Missing crypto outcome data',
			)
			throw new AppError('Invalid payment data', 400)
		}

		// Determine USD credited (usdtsol ≈ USD). Fall back to price_amount
		// if outcome data is missing or in an unexpected currency.
		const outcomeCurrency = paymentData.outcome_currency
		const outcomeAmount = Number(paymentData.outcome_amount)
		const usdCredited =
			outcomeCurrency === 'usdtsol' && Number.isFinite(outcomeAmount)
				? outcomeAmount
				: Number(paymentData.price_amount)

		// Update payment
		const updatedPayment = await Payment.findOneAndUpdate(
			{ _id: paymentData.order_id },
			{
				status: 'successful',
				transactionId: externalId,
				tx_ref: paymentData.order_id,
				paidAmountCrypto: paymentData.pay_amount,
				currencyPaid: paymentData.pay_currency,
				outcomeAmount: paymentData.outcome_amount,
				outcomeCurrency: paymentData.outcome_currency,
			},
			{ new: true },
		)

		// Generate ticket
		try {
			await generateTicket(updatedPayment.tx_ref)
		} catch (ticketError) {
			console.error('❌ Ticket generation failed:', ticketError)
			await markWebhookFailed(
				'crypto',
				externalId,
				`Ticket generation: ${ticketError.message}`,
			)
			throw ticketError
		}

		const updateEvent = await Event.findByIdAndUpdate(
			existingPayment.eventId,
			{
				$inc: {
					ticketsSold: existingPayment.quantity,
				},
			},
			{ new: true },
		)

		if (!updateEvent) {
			throw new AppError(
				`Updating Event failed, Event with ID: ${existingPayment.eventId} not found. `,
				404,
			)
		}

		const updateEventTicket = await EventTicket.findOneAndUpdate(
			{
				eventId: updateEvent._id,
				title: existingPayment.ticketName,
			},
			{
				$inc: {
					sold: existingPayment.quantity,
				},
			},
			{ new: true },
		)

		if (!updateEventTicket) {
			console.warn(
				`⚠️ EventTicket not found for title: ${existingPayment.ticketName} (eventId: ${updateEvent._id}). Skipping EventTicket update.`,
			)
		}

		// Send email
		try {
			const emailResult = await sendVerificationEmail(
				updatedPayment.customerEmail,
				updatedPayment.ticketName,
				`https://www.lofte.live/tickets?tx_ref=${updatedPayment.tx_ref}`,
				updateEvent.title,
				updateEvent.venue,
				updateEvent.date,
			)

			if (!emailResult.success) {
				console.warn(
					`⚠️ Email sending failed but crypto payment processed. PaymentID: ${updatedPayment._id}, Error: ${emailResult.error}`,
				)
			}
		} catch (emailError) {
			console.warn(
				`⚠️ Email error for crypto payment ${updatedPayment._id}:`,
				emailError,
			)
		}
		// Send custom host email if template exists
		try {
			const hostEmailTemplate = await getEventEmailTemplateByEventId(
				existingPayment.eventId,
			)

			if (hostEmailTemplate && hostEmailTemplate.isEnabled) {
				const hostEmailResult = await sendCustomHostEmail(
					updatedPayment.customerEmail,
					hostEmailTemplate.subject,
					hostEmailTemplate.htmlContent,
				)

				if (!hostEmailResult.success) {
					console.warn(
						`⚠️ Custom host email failed for crypto payment ${updatedPayment._id}. Will continue with payment processing.`,
					)
				} else {
					console.log(
						`✅ Custom host email sent for crypto payment ${updatedPayment._id}`,
					)
				}
			}
		} catch (hostEmailError) {
			console.warn(
				`⚠️ Error retrieving/sending custom host email for crypto payment ${updatedPayment._id}:`,
				hostEmailError.message,
			)
			// Continue - custom email is optional
		}

		const hostProfile = await Host.findById(updateEvent.hostId)
		if (!hostProfile) {
			throw new AppError(`Updating Balance failed, Host not found.`, 404)
		}

		const { hostEarnings, referrerEarnings, referrerId } =
			await splitWithReferralCommission(usdCredited, hostProfile)

		await Payment.updateOne(
			{ _id: updatedPayment._id },
			{ grossUsd: usdCredited, hostEarningsUsd: hostEarnings },
		)

		hostProfile.balance += hostEarnings
		hostProfile.revenue += hostEarnings
		await hostProfile.save()

		await payReferralCommission({
			referrerId,
			refereeUserId: hostProfile.userId,
			amountUsd: referrerEarnings,
			paymentId: updatedPayment._id,
		})

		// Mark webhook as processed
		await markWebhookProcessed('crypto', externalId)

		console.log(
			'✅ Crypto payment successfully processed:',
			paymentData.order_id,
		)

		return { status: 'processed' }
	} catch (error) {
		console.error('❌ Crypto webhook processing error:', error)
		throw error
	}
}

export async function regularTicketService(email, ticketName, eventId) {
	const event = await Event.findById(eventId)
	if (!event) {
		throw new AppError('Event not found', 404)
	}

	const eventName = event.title
	const ticket = await generateRegularTicket(
		email,
		ticketName,
		eventName,
		event.date,
		event.venue,
	)

	const link = `https://www.lofte.live/tickets?tx_ref=${ticket.tx_ref}`

	// Update Event ticketsSold counter
	const updateEvent = await Event.findByIdAndUpdate(
		eventId,
		{
			$inc: {
				ticketsSold: 1,
			},
		},
		{ new: true },
	)

	if (!updateEvent) {
		throw new AppError(`Event not found for ID: ${eventId}`, 404)
	}

	// Update EventTicket sold counter
	const updateEventTicket = await EventTicket.findOneAndUpdate(
		{
			eventId: eventId,
			title: ticketName,
		},
		{
			$inc: {
				sold: 1,
			},
		},
		{ new: true },
	)

	if (!updateEventTicket) {
		console.warn(
			`⚠️ EventTicket not found for ticket: ${ticketName}. Skipping EventTicket update.`,
		)
	}

	// Send platform verification email
	await sendVerificationEmail(email, ticketName, link)

	// Send custom host email if template exists
	try {
		const hostEmailTemplate = await getEventEmailTemplateByEventId(eventId)

		if (hostEmailTemplate && hostEmailTemplate.isEnabled) {
			const hostEmailResult = await sendCustomHostEmail(
				email,
				hostEmailTemplate.subject,
				hostEmailTemplate.htmlContent,
			)

			if (!hostEmailResult.success) {
				console.warn(
					`⚠️ Custom host email failed for regular ticket (${ticketName}). Will continue.`,
				)
			} else {
				console.log(
					`✅ Custom host email sent for regular ticket (${ticketName})`,
				)
			}
		}
	} catch (hostEmailError) {
		console.warn(
			`⚠️ Error retrieving/sending custom host email for regular ticket (${ticketName}):`,
			hostEmailError.message,
		)
		// Continue - custom email is optional
	}

	return 'Ticket has been sent to your email'
}
