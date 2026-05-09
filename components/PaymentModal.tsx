'use client'
import { useState, useEffect } from 'react'
import { paymentService } from '@/app/services/paymentService'

interface PaymentTicket {
	eventId: string
	title: string
	priceUSD: number
	priceNGN: number
	currency: 'NGN' | 'USD'
}

interface PaymentPayload {
	amount: number
	email: string
	userId: string
	ticketName: string
	eventId: string
	quantity: number
}

interface Props {
	isOpen: boolean
	onClose: () => void
	ticket: PaymentTicket | null
}

export default function PaymentModal({ isOpen, onClose, ticket }: Props) {
	const [currency, setCurrency] = useState<'NGN' | 'USD'>('NGN')
	const [quantity, setQuantity] = useState(1)
	const [email, setEmail] = useState('')
	const [loading, setLoading] = useState(false)

	// reset modal state when ticket changes
	useEffect(() => {
		if (ticket?.currency === 'USD') {
			setCurrency('USD')
		} else {
			setCurrency('NGN')
		}
		setQuantity(1)
		setEmail('')
	}, [ticket])

	// ✅ SAFE EARLY RETURN (after hooks)
	if (!isOpen || !ticket) return null

	const unitPrice = currency === 'USD' ? ticket.priceUSD : ticket.priceNGN

	const totalPrice = unitPrice * quantity

	const cryptoMinUSD = 2.5
	const cryptoBelowMinimum =
		currency === 'USD' && totalPrice > 0 && totalPrice < cryptoMinUSD

	const handlePayment = async () => {
		if (cryptoBelowMinimum) return

		if (!email) {
			alert('Please enter your email')
			return
		}

		try {
			setLoading(true)

			const payload: PaymentPayload = {
				amount: totalPrice,
				email,
				userId: crypto.randomUUID(),
				ticketName: ticket.title,
				eventId: ticket.eventId,
				quantity,
			}

			// Check if amount is zero for free tickets
			if (totalPrice === 0) {
				// Call regular ticket endpoint
				const res = await paymentService.regularTicket({
					email,
					ticketName: ticket.title,
					eventId: ticket.eventId,
					quantity,
				})

				if (res?.success) {
					alert(
						'🎉 Free ticket registered successfully! Check your email.',
					)
					onClose()
				} else {
					throw new Error('Failed to register free ticket')
				}
			} else {
				// Proceed with normal payment flow
				let res

				if (currency === 'NGN') {
					res = await paymentService.initiatePayment(payload)
				} else {
					res = await paymentService.initiateCryptoPayment(payload)
				}

				if (res?.paymentLink) {
					window.location.href = res.paymentLink
				} else {
					throw new Error('No payment link returned')
				}
			}
		} catch (err) {
			console.error(err)
			alert('Operation failed. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-70 px-4 py-4'>
			<div className='bg-[#10101e] w-full max-w-md sm:max-w-lg lg:max-w-xl rounded-2xl border border-white/10 p-6 lg:p-8 relative max-h-[90vh] overflow-y-auto'>
				{/* CLOSE */}
				<button
					onClick={onClose}
					className='absolute top-4 right-4 text-gray-400 hover:text-white text-lg z-10'
				>
					✕
				</button>

				{/* CURRENCY */}
				<div className='flex gap-2 mb-6'>
					<button
						onClick={() => setCurrency('NGN')}
						className={`px-3 py-1 rounded-full text-xs font-bold transition ${
							currency === 'NGN'
								? 'bg-[#c9a227] text-black'
								: 'bg-white/10 text-gray-300 hover:bg-white/20'
						}`}
					>
						NGN
					</button>

					<button
						onClick={() => setCurrency('USD')}
						className={`px-3 py-1 rounded-full text-xs font-bold transition ${
							currency === 'USD'
								? 'bg-[#c9a227] text-black'
								: 'bg-white/10 text-gray-300 hover:bg-white/20'
						}`}
					>
						USD
					</button>
				</div>

				{/* TITLE */}
				<h2 className='text-xl lg:text-2xl font-bold mb-2'>
					{ticket.title}
				</h2>

				<p className='text-gray-400 text-sm mb-6'>
					Complete your purchase
				</p>

				{/* QUANTITY */}
				<div className='mb-6'>
					<label className='text-sm text-gray-400'>Quantity</label>

					<input
						type='number'
						min={1}
						value={quantity}
						onChange={(e) => setQuantity(Number(e.target.value))}
						className='w-full mt-1 bg-[#0c0c18] border border-white/10 rounded-lg px-3 py-2 text-sm outline-none'
					/>
				</div>

				{/* PRICE */}
				<div className='mb-6'>
					<p className='text-gray-400 text-sm'>Total Amount</p>
					<p className='text-3xl font-bold text-[#c9a227]'>
						{currency === 'NGN' ? '₦' : '$'}{' '}
						{totalPrice.toLocaleString()}
					</p>
				</div>

				{/* EMAIL */}
				<div className='mb-6'>
					<label className='text-sm text-gray-400'>Email</label>

					<input
						type='email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder='Enter your email'
						className='w-full mt-1 bg-[#0c0c18] border border-white/10 rounded-lg px-3 py-2 text-sm outline-none'
					/>
				</div>

				{/* CRYPTO MINIMUM WARNING */}
				{cryptoBelowMinimum && (
					<div className='mb-4 p-3 rounded-lg border border-red-500/40 bg-red-500/10 text-red-300 text-sm'>
						You cannot pay with crypto for ticket amounts less than $
						{cryptoMinUSD}. Please switch to the NGN payment option.
					</div>
				)}

				{/* BUTTON */}
				<button
					onClick={handlePayment}
					disabled={loading || cryptoBelowMinimum}
					className='w-full bg-[#c9a227] hover:bg-[#b8921f] text-black py-3 rounded-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed'
				>
					{loading
						? 'Processing...'
						: cryptoBelowMinimum
							? 'Crypto unavailable below $2.5'
							: totalPrice === 0
								? 'Register Free Ticket'
								: 'Proceed to Payment'}
				</button>
			</div>
		</div>
	)
}
