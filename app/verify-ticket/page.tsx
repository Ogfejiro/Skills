'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Ticket, Search, AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import TicketCard, { TicketCardData } from '@/components/TicketCard'

interface TicketData {
	ticketId: string
	ticketName: string
	amount: number
	currency: string
	status: string
	quantity?: number | string
	customerEmail: string
	eventName?: string
	eventDate?: string
	eventLocation?: string
	purchaseDate?: string
	tx_ref?: string
}

export default function VerifyTicketPage() {
	const [query, setQuery] = useState('')
	const [ticket, setTicket] = useState<TicketData | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [searched, setSearched] = useState(false)

	const baseUrl = process.env.NEXT_PUBLIC_API_URL

	const handleSearch = async (e: React.FormEvent) => {
		e.preventDefault()
		const trimmed = query.trim()
		if (!trimmed) {
			setError('Please enter a ticket ID')
			return
		}

		setLoading(true)
		setError('')
		setTicket(null)
		setSearched(true)

		try {
			const res = await fetch(
				`${baseUrl}/api/payments/ticket-by-id/${encodeURIComponent(trimmed)}`,
			)
			if (!res.ok) {
				const errData = await res.json().catch(() => ({}))
				throw new Error(errData.error || errData.message || 'Ticket not found')
			}
			const data: TicketData = await res.json()
			setTicket(data)
		} catch (err: any) {
			setError(err.message || 'Failed to verify ticket')
		} finally {
			setLoading(false)
		}
	}

	// Map the verify API shape onto the shared ticket card shape.
	const cardData: TicketCardData | null = ticket
		? {
				ticketId: ticket.ticketId,
				eventName: ticket.eventName,
				eventDate: ticket.eventDate
					? new Date(ticket.eventDate).toLocaleDateString()
					: 'N/A',
				location: ticket.eventLocation,
				customerEmail: ticket.customerEmail,
				ticketName: ticket.ticketName,
				amount: ticket.amount,
				currency: ticket.currency,
				status: ticket.status,
				tx_ref: ticket.tx_ref,
				purchaseDate: ticket.purchaseDate,
		  }
		: null

	return (
		<main className='min-h-screen bg-black text-white flex flex-col'>
			<Navbar />

			<div className='flex-1 overflow-y-auto'>
				<div className='container mx-auto px-4 pt-24 md:pt-32 pb-12 md:pb-20 flex flex-col items-center'>
					{/* Back link */}
					<div className='w-full max-w-2xl mb-6 md:mb-8'>
						<Link
							href='/'
							className='inline-flex items-center gap-1 md:gap-2 text-sm md:text-base text-gray-400 hover:text-gold transition-colors'
						>
							<ArrowLeft className='w-3 h-3 md:w-4 md:h-4' />
							<span>Back to Home</span>
						</Link>
					</div>

					{/* Header */}
					<div className='w-full max-w-2xl text-center mb-8 md:mb-10'>
						<div className='inline-flex w-14 h-14 md:w-16 md:h-16 bg-gold/15 rounded-full items-center justify-center mb-4'>
							<Search className='w-7 h-7 md:w-8 md:h-8 text-gold' />
						</div>
						<h1 className='text-2xl md:text-4xl font-bold text-white mb-2 md:mb-3'>
							Verify Ticket
						</h1>
						<p className='text-sm md:text-base text-gray-400 px-2'>
							Enter a ticket ID to look up the ticket details. Hosts can use
							this at the door to confirm a guest's ticket is valid.
						</p>
					</div>

					{/* Search form */}
					<form
						onSubmit={handleSearch}
						className='w-full max-w-2xl bg-gradient-to-br from-gray-900 to-black border border-gold/30 rounded-xl md:rounded-2xl p-4 md:p-6 mb-6 md:mb-8'
					>
						<label className='block text-xs md:text-sm text-gray-400 mb-2'>
							Ticket ID
						</label>
						<div className='flex flex-col sm:flex-row gap-3'>
							<input
								type='text'
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								placeholder='e.g. LOFTE-1125-aB3xY7'
								className='flex-1 bg-[#0c0c18] border border-white/10 focus:border-gold/50 rounded-lg px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-white placeholder-gray-500 outline-none transition-colors'
							/>
							<button
								type='submit'
								disabled={loading}
								className='inline-flex items-center justify-center gap-2 px-5 md:px-6 py-2 md:py-3 bg-gold text-black font-bold rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base'
							>
								{loading ? (
									<>
										<div className='w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin' />
										<span>Searching</span>
									</>
								) : (
									<>
										<Search className='w-4 h-4' />
										<span>Search</span>
									</>
								)}
							</button>
						</div>
					</form>

					{/* Result area */}
					<div className='w-full max-w-4xl'>
						<AnimatePresence mode='wait'>
							{error && (
								<motion.div
									key='error'
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									className='max-w-2xl mx-auto bg-red-500/10 border border-red-500/30 rounded-xl p-4 md:p-6 flex items-start gap-3'
								>
									<AlertCircle className='w-5 h-5 md:w-6 md:h-6 text-red-400 flex-shrink-0 mt-0.5' />
									<div>
										<p className='font-bold text-red-400 text-sm md:text-base'>
											Ticket not found
										</p>
										<p className='text-xs md:text-sm text-gray-400 mt-1'>
											{error}
										</p>
									</div>
								</motion.div>
							)}

							{cardData && (
								<motion.div
									key='ticket'
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
								>
									<TicketCard ticket={cardData} showVerificationStamp />
								</motion.div>
							)}

							{!loading && !ticket && !error && !searched && (
								<motion.div
									key='empty'
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className='text-center py-8 md:py-12'
								>
									<Ticket className='w-12 h-12 md:w-16 md:h-16 text-gray-700 mx-auto mb-4' />
									<p className='text-sm md:text-base text-gray-500'>
										Enter a ticket ID above to verify a ticket.
									</p>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</div>
			</div>
		</main>
	)
}
