// app/services/paymentService.ts - COMPLETE WITH CRYPTO SUPPORT
export interface InitiatePaymentRequest {
	amount: number
	email: string
	userId?: string
	eventId: string
	ticketName: string
	quantity: number
}

export interface InitiatePaymentResponse {
	paymentLink: string
}

export interface VerifyPaymentRequest {
	transaction_id: string
	tx_ref: string
}

class PaymentService {
	private baseUrl =
		process.env.NEXT_PUBLIC_API_URL || 'https://skills-k6pv.onrender.com'

	// For Naira payments (Flutterwave)
	async initiatePayment(
		data: InitiatePaymentRequest,
	): Promise<InitiatePaymentResponse> {
		try {
			console.log(
				'📡 Naira payment to:',
				`${this.baseUrl}/api/payments/initiate`,
			)
			console.log('📡 Request data:', {
				amount: data.amount,
				email: data.email,
				userId: data.userId,
				ticketName: data.ticketName,
				eventId: data.eventId,
				quantity: data.quantity,
			})

			const response = await fetch(
				`${this.baseUrl}/api/payments/initiate`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						amount: data.amount,
						email: data.email,
						userId: data.userId,
						ticketName: data.ticketName,
						eventId: data.eventId,
						quantity: data.quantity,
					}),
				},
			)

			if (!response.ok) {
				const error = await response.json()
				console.error('❌ Naira backend error:', error)
				throw new Error(
					error.error || 'Naira payment initialization failed',
				)
			}

			const result = await response.json()
			console.log('📡 Naira response:', result)

			return result
		} catch (error) {
			console.error('❌ Naira payment error:', error)
			throw error
		}
	}

	// For Crypto payments (USDT)
	async initiateCryptoPayment(
		data: InitiatePaymentRequest,
	): Promise<InitiatePaymentResponse> {
		try {
			console.log(
				'📡 Crypto payment to:',
				`${this.baseUrl}/api/payments/pay-usdt`,
			)
			console.log('📡 Crypto request data:', {
				amount: data.amount,
				email: data.email,
				userId: data.userId,
				ticketName: data.ticketName,
				eventId: data.eventId,
				quantity: data.quantity,
			})

			const response = await fetch(
				`${this.baseUrl}/api/payments/pay-usdt`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						amount: data.amount,
						email: data.email,
						userId: data.userId,
						ticketName: data.ticketName,
						eventId: data.eventId,
						quantity: data.quantity,
					}),
				},
			)

			if (!response.ok) {
				const error = await response.json()
				console.error('❌ Crypto backend error:', error)
				throw new Error(
					error.error || 'Crypto payment initialization failed',
				)
			}

			const result = await response.json()
			console.log('📡 Crypto response:', result)

			return result
		} catch (error) {
			console.error('❌ Crypto payment error:', error)
			throw error
		}
	}

	// Verify payment (works for both)
	async verifyPayment(data: VerifyPaymentRequest): Promise<void> {
		try {
			console.log(
				'📡 Verifying with backend:',
				`${this.baseUrl}/api/payments/verify`,
			)
			console.log('📡 Verification data:', data)

			const response = await fetch(
				`${this.baseUrl}/api/payments/verify`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(data),
				},
			)

			if (!response.ok) {
				const error = await response.json()
				console.error('❌ Verification error:', error)
				throw new Error(error.error || 'Payment verification failed')
			}

			console.log('✅ Payment verified by backend')
		} catch (error) {
			console.error('❌ Payment verification error:', error)
			throw error
		}
	}

	// For free tickets (zero amount)
	async regularTicket(data: {
		email: string
		ticketName: string
		eventId: string
		quantity: number
	}): Promise<{ success: boolean; message: string }> {
		try {
			console.log(
				'🎫 Registering free ticket to:',
				`${this.baseUrl}/api/payments/regular`,
			)
			console.log('🎫 Free ticket data:', {
				email: data.email,
				ticketName: data.ticketName,
				eventId: data.eventId,
				quantity: data.quantity,
			})

			const response = await fetch(
				`${this.baseUrl}/api/payments/regular`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						email: data.email,
						ticketName: data.ticketName,
						eventName: data.eventId,
						quantity: data.quantity,
					}),
				},
			)

			if (!response.ok) {
				const error = await response.json()
				console.error('❌ Free ticket error:', error)
				throw new Error(
					error.error || 'Failed to register free ticket',
				)
			}

			const result = await response.json()
			console.log('✅ Free ticket registered:', result)

			return {
				success: true,
				message: 'Ticket registered successfully',
			}
		} catch (error) {
			console.error('❌ Free ticket service error:', error)
			throw error
		}
	}
}

export const paymentService = new PaymentService()
