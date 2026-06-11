'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
	Ticket,
	Download,
	Share2,
	Calendar,
	User,
	Mail,
	Coins,
	QrCode,
	AlertCircle,
	ArrowLeft,
	MapPin,
} from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { useSearchParams } from 'next/navigation'

interface TicketData {
	ticketId: string
	amount: number
	currency: string
	status: string
	customerEmail: string
	ticketName: string
	eventDate: string
	eventName?: string
	location?: string
	purchaseDate?: string
	tx_ref?: string
}

export default function TicketsPage() {
	const searchParams = useSearchParams()
	const [tickets, setTickets] = useState<TicketData[]>([])
	const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(
		null,
	)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	const baseUrl = process.env.NEXT_PUBLIC_API_URL
	const tx_ref = searchParams.get('tx_ref')

	useEffect(() => {
		const fetchTicket = async () => {
			if (!tx_ref) {
				setLoading(false)
				setError('No ticket reference provided.')
				return
			}

			try {
				const response = await fetch(
					`${baseUrl}/api/payments/ticket/${tx_ref}`,
				)
				if (!response.ok) {
					const errData = await response.json()
					throw new Error(errData.error || 'Ticket not found')
				}

				const ticketData: TicketData = await response.json()
				setTickets([ticketData])
			} catch (err: any) {
				console.error('Error fetching ticket:', err)
				setError(err.message || 'Failed to load ticket')
			} finally {
				setLoading(false)
			}
		}

		fetchTicket()
	}, [tx_ref, baseUrl])

	const downloadTicket = (ticket: TicketData) => {
		alert(
			'Download feature coming soon! Your ticket QR code will be available for download.',
		)
	}

	const shareTicket = (ticket: TicketData) => {
		alert(
			'Share feature coming soon! You will be able to share your ticket via email.',
		)
	}

	const toggleTicketDetails = (ticket: TicketData) => {
		setSelectedTicket(
			selectedTicket?.ticketId === ticket.ticketId ? null : ticket,
		)
	}

	if (loading) {
		return (
			<main className='min-h-screen bg-black text-white'>
				<Navbar />
				<div className='container mx-auto px-4 pt-24 md:pt-32 pb-20 text-center'>
					<div className='w-16 h-16 md:w-20 md:h-20 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4 md:mb-6'></div>
					<p className='text-sm md:text-base text-gray-400'>
						Loading your ticket...
					</p>
				</div>
			</main>
		)
	}

	if (error) {
		return (
			<main className='min-h-screen bg-black text-white'>
				<Navbar />
				<div className='container mx-auto px-4 pt-24 md:pt-32 pb-20 text-center'>
					<div className='w-16 h-16 md:w-20 md:h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6'>
						<AlertCircle className='w-8 h-8 md:w-10 md:h-10 text-red-500' />
					</div>
					<h2 className='text-xl md:text-2xl font-bold text-red-500 mb-2 md:mb-4'>
						Error Loading Ticket
					</h2>
					<p className='text-sm md:text-base text-gray-400 mb-6 md:mb-8 px-4'>
						{error}
					</p>
					<Link
						href='/'
						className='inline-block px-6 md:px-8 py-2 md:py-3 bg-gold text-black font-bold rounded-lg hover:opacity-90 transition text-sm md:text-base'
					>
						Back to Home
					</Link>
				</div>
			</main>
		)
	}

	return (
		<main className='min-h-screen bg-black text-white flex flex-col'>
			<Navbar />
			<div className='flex-1 overflow-y-auto'>
				<div className='container mx-auto px-4 pt-24 md:pt-32 pb-12 md:pb-20'>
					{/* Back Button */}
					<Link
						href='/'
						className='inline-flex items-center gap-1 md:gap-2 text-sm md:text-base text-gray-400 hover:text-gold transition-colors mb-6 md:mb-8'
					>
						<ArrowLeft className='w-3 h-3 md:w-4 md:h-4' />
						<span>Back to Events</span>
					</Link>

					{/* Tickets Grid */}
					{tickets.length > 0 ? (
						<div className='grid grid-cols-1 gap-6 md:gap-8'>
							{tickets.map((ticket) => (
								<motion.div
									key={ticket.ticketId}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
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
													{ticket.eventName}
												</h3>
											</div>

											{/* Ticket Meta Info Grid */}
											<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 text-sm mb-6'>
												<div className='flex items-start gap-3'>
													<Calendar className='w-5 h-5 text-gold flex-shrink-0 mt-0.5' />
													<div>
														<p className='text-xs text-gray-400 uppercase tracking-wider font-semibold'>Date & Time</p>
														<p className='text-white font-medium mt-0.5'>{ticket.eventDate}</p>
													</div>
												</div>

												<div className='flex items-start gap-3'>
													<MapPin className='w-5 h-5 text-gold flex-shrink-0 mt-0.5' />
													<div>
														<p className='text-xs text-gray-400 uppercase tracking-wider font-semibold'>Venue</p>
														<p className='text-white font-medium mt-0.5 break-words'>{ticket.location || 'No location specified'}</p>
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
																{ticket.amount.toLocaleString()}
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

										{/* RIGHT SECTION: Stub / QR Scan (Desktop) / BOTTOM SECTION (Mobile) */}
										<div className='w-full md:w-80 p-6 md:p-8 flex flex-col items-center justify-between bg-black/40 relative'>
											{/* QR Code Container */}
											<div className='flex flex-col items-center flex-1 justify-center w-full'>
												<div className='relative p-3 bg-white rounded-2xl shadow-inner mb-4 transition-transform duration-300 hover:scale-105'>
													<img
														src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.ticketId}`}
														alt='Ticket QR Code'
														className='w-32 h-32 md:w-36 md:h-36 rounded-lg'
													/>
												</div>
												<span className='font-mono text-xs text-gold/80 font-semibold uppercase tracking-widest bg-gold/5 border border-gold/15 rounded px-2.5 py-1 mb-2'>
													{ticket.ticketId}
												</span>
												<p className='text-[10px] text-gray-400 uppercase tracking-widest font-semibold text-center mb-6'>
													PRESENT QR CODE AT ENTRY
												</p>
											</div>

											{/* Actions (Download / Share) */}
											<div className='w-full space-y-2.5 mt-auto'>
												<div className='flex gap-2.5'>
													<button
														onClick={() => downloadTicket(ticket)}
														className='flex-1 py-2.5 bg-gold text-black rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 text-xs md:text-sm shadow-lg shadow-gold/10'
													>
														<Download className='w-4 h-4' />
														<span>Download</span>
													</button>
													<button
														onClick={() => shareTicket(ticket)}
														className='flex-1 py-2.5 bg-gray-900 border border-gold/25 text-gold rounded-xl font-bold hover:bg-gold/10 transition-all flex items-center justify-center gap-2 text-xs md:text-sm'
													>
														<Share2 className='w-4 h-4' />
														<span>Share</span>
													</button>
												</div>
											</div>
										</div>
									</div>
								</motion.div>
							))}
						</div>
					) : (
						<div className='text-center py-12 md:py-20'>
							<Ticket className='w-12 h-12 md:w-16 md:h-16 text-gray-600 mx-auto mb-4 md:mb-6' />
							<h3 className='text-xl md:text-2xl font-bold text-white mb-2 md:mb-3'>
								No Tickets Found
							</h3>
							<p className='text-sm md:text-base text-gray-400 mb-6 md:mb-8 px-4'>
								You haven't purchased any tickets yet. Browse
								upcoming events to get your tickets.
							</p>
							<Link
								href='/'
								className='inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-gold text-black font-bold rounded-xl hover:opacity-90 transition text-sm md:text-base'
							>
								Browse Events
							</Link>
						</div>
					)}
				</div>
			</div>
		</main>
	)
}
