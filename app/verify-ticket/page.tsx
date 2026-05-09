'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
	Ticket,
	Search,
	Calendar,
	User,
	Mail,
	Coins,
	AlertCircle,
	ArrowLeft,
	MapPin,
	CheckCircle,
} from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

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
					<div className='w-full max-w-2xl'>
						<AnimatePresence mode='wait'>
							{error && (
								<motion.div
									key='error'
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									className='bg-red-500/10 border border-red-500/30 rounded-xl p-4 md:p-6 flex items-start gap-3'
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

							{ticket && (
								<motion.div
									key='ticket'
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									className='bg-gradient-to-br from-gray-900 to-black border-2 border-gold/30 rounded-xl md:rounded-2xl overflow-hidden'
								>
									{/* Header */}
									<div className='p-4 md:p-6 border-b border-gold/20 bg-gray-900/50'>
										<div className='flex flex-col sm:flex-row justify-between items-start gap-3 mb-4'>
											<div className='w-full sm:w-auto'>
												<span className='text-xs md:text-sm text-gold font-bold mb-1 md:mb-2 block break-all'>
													{ticket.ticketId}
												</span>
												<h3 className='text-lg md:text-xl font-bold text-white'>
													{ticket.eventName || 'Event'}
												</h3>
											</div>
											<span
												className={`inline-flex items-center gap-1 px-2 md:px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
													ticket.status === 'active'
														? 'bg-green-500/20 text-green-400 border border-green-500/30'
														: 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
												}`}
											>
												{ticket.status === 'active' && (
													<CheckCircle className='w-3 h-3' />
												)}
												{ticket.status?.toUpperCase()}
											</span>
										</div>

										<div className='grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4'>
											{ticket.eventDate && (
												<div className='flex items-center gap-2 md:gap-3'>
													<Calendar className='w-4 h-4 md:w-5 md:h-5 text-gold flex-shrink-0' />
													<div className='min-w-0 flex-1'>
														<p className='text-xs text-gray-400'>
															Event Date
														</p>
														<p className='text-xs md:text-sm text-white truncate'>
															{new Date(
																ticket.eventDate,
															).toLocaleDateString()}
														</p>
													</div>
												</div>
											)}

											<div className='flex items-center gap-2 md:gap-3'>
												<User className='w-4 h-4 md:w-5 md:h-5 text-gold flex-shrink-0' />
												<div className='min-w-0 flex-1'>
													<p className='text-xs text-gray-400'>
														Ticket Type
													</p>
													<p className='text-xs md:text-sm text-white truncate'>
														{ticket.ticketName}
													</p>
												</div>
											</div>

											<div className='flex items-center gap-2 md:gap-3'>
												<Mail className='w-4 h-4 md:w-5 md:h-5 text-gold flex-shrink-0' />
												<div className='min-w-0 flex-1'>
													<p className='text-xs text-gray-400'>Email</p>
													<p className='text-xs md:text-sm text-white truncate'>
														{ticket.customerEmail}
													</p>
												</div>
											</div>

											<div className='flex items-center gap-2 md:gap-3'>
												<Coins className='w-4 h-4 md:w-5 md:h-5 text-gold flex-shrink-0' />
												<div className='min-w-0 flex-1'>
													<p className='text-xs text-gray-400'>Amount</p>
													<p className='text-xs md:text-sm text-white font-bold'>
														{ticket.currency === 'NGN' ? '₦' : '$'}
														{Number(ticket.amount || 0).toLocaleString()}
													</p>
												</div>
											</div>

											{ticket.eventLocation && (
												<div className='flex items-center gap-2 md:gap-3 sm:col-span-2'>
													<MapPin className='w-4 h-4 md:w-5 md:h-5 text-gold flex-shrink-0' />
													<div className='min-w-0 flex-1'>
														<p className='text-xs text-gray-400'>
															Location
														</p>
														<p className='text-xs md:text-sm text-white break-words'>
															{ticket.eventLocation}
														</p>
													</div>
												</div>
											)}
										</div>
									</div>

									{/* Body */}
									<div className='p-4 md:p-6'>
										<div className='flex justify-center mb-4 md:mb-6'>
											<div className='relative'>
												<img
													src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.ticketId}`}
													alt='Ticket QR Code'
													className='w-24 h-24 md:w-32 md:h-32 border-2 border-gold/30 rounded-lg'
												/>
												<div className='absolute inset-0 bg-gold/5 rounded-lg' />
											</div>
										</div>

										<div className='space-y-2 text-xs md:text-sm pt-3 md:pt-4 border-t border-gold/20'>
											{ticket.purchaseDate && (
												<div className='flex flex-col sm:flex-row sm:justify-between gap-1'>
													<span className='text-gray-400'>
														Purchase Date:
													</span>
													<span className='text-white'>
														{new Date(
															ticket.purchaseDate,
														).toLocaleDateString()}
													</span>
												</div>
											)}
											{ticket.quantity && (
												<div className='flex flex-col sm:flex-row sm:justify-between gap-1'>
													<span className='text-gray-400'>Quantity:</span>
													<span className='text-white'>
														{ticket.quantity}
													</span>
												</div>
											)}
											{ticket.tx_ref && (
												<div className='flex flex-col sm:flex-row sm:justify-between gap-1'>
													<span className='text-gray-400'>
														Transaction Ref:
													</span>
													<span className='text-gold font-mono text-xs break-all'>
														{ticket.tx_ref}
													</span>
												</div>
											)}
										</div>
									</div>
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
