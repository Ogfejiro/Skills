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
									className='relative max-w-4xl mx-auto w-full group'
								>
									{/* Main Ticket Card (Horizontal on Desktop, Vertical on Mobile) */}
									<div className='flex flex-col md:flex-row bg-[#0c0c14] border border-gold/30 rounded-3xl overflow-hidden shadow-2xl relative transition-all duration-300 hover:border-gold/60'>
										{/* Glow effects */}
										<div className='absolute -top-12 -left-12 w-48 h-48 bg-gold/5 rounded-full blur-3xl pointer-events-none'></div>
										<div className='absolute -bottom-12 -right-12 w-48 h-48 bg-gold/5 rounded-full blur-3xl pointer-events-none'></div>

										{/* LEFT SECTION: Main Ticket Details (Desktop) / TOP SECTION (Mobile) */}
										<div className='flex-1 p-6 md:p-8 flex flex-col justify-between relative min-w-0'>
											{/* Branding & Status */}
											<div className='flex justify-between items-center mb-6 gap-3'>
												<div className='flex items-center gap-2'>
													<div className='w-2 h-2 rounded-full bg-gold animate-pulse'></div>
													<span className='text-xs md:text-sm font-bold tracking-widest text-gold uppercase'>LOFTE ADMISSION PASS</span>
												</div>
												<span
													className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
														ticket.status === 'active'
															? 'bg-green-500/10 text-green-400 border border-green-500/20'
															: 'bg-red-500/10 text-red-400 border border-red-500/20'
													}`}
												>
													{ticket.status}
												</span>
											</div>

											{/* Event Name */}
											<div className='mb-6 md:mb-8'>
												<h3 className='text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight group-hover:text-gold transition-colors duration-300'>
													{ticket.eventName || 'Event'}
												</h3>
											</div>

											{/* Ticket Meta Info Grid */}
											<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 text-sm mb-6'>
												<div className='flex items-start gap-3'>
													<Calendar className='w-5 h-5 text-gold flex-shrink-0 mt-0.5' />
													<div>
														<p className='text-xs text-gray-400 uppercase tracking-wider font-semibold'>Date & Time</p>
														<p className='text-white font-medium mt-0.5'>
															{ticket.eventDate ? new Date(ticket.eventDate).toLocaleDateString() : 'N/A'}
														</p>
													</div>
												</div>

												<div className='flex items-start gap-3'>
													<MapPin className='w-5 h-5 text-gold flex-shrink-0 mt-0.5' />
													<div>
														<p className='text-xs text-gray-400 uppercase tracking-wider font-semibold'>Venue</p>
														<p className='text-white font-medium mt-0.5 break-words'>{ticket.eventLocation || 'No location specified'}</p>
													</div>
												</div>

												<div className='flex items-start gap-3'>
													<User className='w-5 h-5 text-gold flex-shrink-0 mt-0.5' />
													<div>
														<p className='text-xs text-gray-400 uppercase tracking-wider font-semibold'>Attendee</p>
														<p className='text-white font-medium mt-0.5 truncate'>{ticket.customerEmail}</p>
													</div>
												</div>

												<div className='flex items-start gap-3'>
													<Coins className='w-5 h-5 text-gold flex-shrink-0 mt-0.5' />
													<div>
														<p className='text-xs text-gray-400 uppercase tracking-wider font-semibold'>Ticket Class & Price</p>
														<p className='text-white font-bold mt-0.5 flex items-center gap-1.5'>
															<span className='px-2 py-0.5 bg-gold/10 text-gold rounded border border-gold/25 text-xs font-semibold uppercase'>
																{ticket.ticketName}
															</span>
															<span className='text-gold'>
																{ticket.currency === 'NGN' ? '₦' : '$'}
																{Number(ticket.amount || 0).toLocaleString()}
															</span>
														</p>
													</div>
												</div>
											</div>

											{/* Purchase timestamp & Tx Ref */}
											<div className='text-[10px] text-gray-500 uppercase tracking-wider border-t border-white/5 pt-4 flex flex-col sm:flex-row justify-between gap-2'>
												<div className='flex items-center gap-1'>
													<span>LOFTE PASS</span>
													{ticket.tx_ref && (
														<>
															<span>•</span>
															<span className='font-mono text-gray-400 text-[9px] lowercase break-all'>REF: {ticket.tx_ref}</span>
														</>
													)}
												</div>
												<span>PURCHASED: {ticket.purchaseDate ? new Date(ticket.purchaseDate).toLocaleDateString() : new Date().toLocaleDateString()}</span>
											</div>
										</div>

										{/* TICKET DIVIDER (Vertical on Desktop, Horizontal on Mobile) */}
										<div className='relative flex md:flex-col items-center justify-center py-4 md:py-0'>
											{/* Desktop Circular Cutouts (Top and Bottom) */}
											<div className='hidden md:block absolute -top-4 w-8 h-8 bg-black rounded-full border border-gold/30 z-10'></div>
											<div className='hidden md:block absolute -bottom-4 w-8 h-8 bg-black rounded-full border border-gold/30 z-10'></div>

											{/* Mobile Circular Cutouts (Left and Right) */}
											<div className='md:hidden absolute -left-4 w-8 h-8 bg-black rounded-full border border-gold/30 z-10'></div>
											<div className='md:hidden absolute -right-4 w-8 h-8 bg-black rounded-full border border-gold/30 z-10'></div>

											{/* Perforation Line */}
											<div className='w-full md:w-[1px] h-[1px] md:h-[80%] border-t md:border-t-0 md:border-r border-dashed border-gold/30'></div>
										</div>

										{/* RIGHT SECTION: Stub / Verification Status (Desktop) / BOTTOM SECTION (Mobile) */}
										<div className='w-full md:w-80 p-6 md:p-8 flex flex-col items-center justify-between bg-black/40 relative'>
											{/* QR Code & Status stamp */}
											<div className='flex flex-col items-center flex-1 justify-center w-full'>
												<div className='relative p-3 bg-white rounded-2xl shadow-inner mb-4 transition-transform duration-300 hover:scale-105'>
													<img
														src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.ticketId}`}
														alt='Ticket QR Code'
														className='w-28 h-28 md:w-32 md:h-32 rounded-lg'
													/>
												</div>
												
												{/* Large Status Stamp */}
												<div className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 font-black uppercase text-sm tracking-widest mb-4 ${
													ticket.status === 'active'
														? 'bg-green-500/10 text-green-400 border-green-500/40 rotate-[-3deg]'
														: 'bg-red-500/10 text-red-400 border-red-500/40 rotate-[3deg]'
												}`}>
													{ticket.status === 'active' ? (
														<>
															<CheckCircle className='w-4 h-4' />
															<span>VERIFIED</span>
														</>
													) : (
														<>
															<AlertCircle className='w-4 h-4' />
															<span>INVALID</span>
														</>
													)}
												</div>

												<span className='font-mono text-xs text-gold/80 font-semibold uppercase tracking-widest bg-gold/5 border border-gold/15 rounded px-2.5 py-1 mb-1'>
													{ticket.ticketId}
												</span>
												<p className='text-[9px] text-gray-500 uppercase tracking-widest font-semibold text-center'>
													TICKET VERIFICATION SYSTEM
												</p>
											</div>
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
