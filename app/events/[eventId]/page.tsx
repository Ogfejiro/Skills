'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import {
	Calendar,
	MapPin,
	AlertCircle,
	ArrowLeft,
	Share2,
	Users,
	Tag,
} from 'lucide-react'
import Link from 'next/link'
import eventService from '@/app/services/eventService'
import ticketService from '@/app/services/ticketService'
import Navbar from '@/components/Navbar'
import PaymentModal from '@/components/PaymentModal'

export default function EventDetailPage() {
	const params = useParams()
	const eventId = params?.eventId as string

	const [event, setEvent] = useState<any>(null)
	const [eventLoading, setEventLoading] = useState(true)
	const [eventError, setEventError] = useState('')

	const [tickets, setTickets] = useState<any[]>([])
	const [ticketsLoading, setTicketsLoading] = useState(false)
	const [ticketsError, setTicketsError] = useState('')

	const [isTicketModalOpen, setIsTicketModalOpen] = useState(false)
	const [selectedTicket, setSelectedTicket] = useState<any>(null)
	const [isPaymentOpen, setIsPaymentOpen] = useState(false)
	const [copied, setCopied] = useState(false)

	useEffect(() => {
		if (!eventId) return

		const fetchEvent = async () => {
			try {
				setEventLoading(true)
				setEventError('')

				const res = await eventService.getPublicEventById(eventId)
				setEvent(res?.data || null)
			} catch (err: any) {
				setEventError(err.message || 'Failed to load event')
				setEvent(null)
			} finally {
				setEventLoading(false)
			}
		}

		fetchEvent()
	}, [eventId])

	const handleGetTickets = async () => {
		try {
			setTicketsLoading(true)
			setTicketsError('')
			setTickets([])
			setIsTicketModalOpen(true)

			const res = await ticketService.getEventTicketsPublic(eventId)

			if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
				setTickets(res.data)
			} else {
				setTickets([])
				setTicketsError('No tickets available for this event')
			}
		} catch (err: any) {
			setTickets([])
			setTicketsError(err.message || 'Failed to load tickets')
		} finally {
			setTicketsLoading(false)
		}
	}

	const handleBuyTicket = (ticket: any) => {
		setSelectedTicket({
			eventId: ticket.eventId,
			title: ticket.title,
			priceUSD: ticket.price,
			priceNGN: ticket.priceNGN,
			currency: ticket.currency,
		})
		setIsPaymentOpen(true)
	}

	const handleShare = async () => {
		const shareUrl =
			typeof window !== 'undefined' ? window.location.href : ''

		try {
			if (navigator.share) {
				await navigator.share({
					title: event?.title || 'Event',
					text: event?.description || '',
					url: shareUrl,
				})
			} else {
				await navigator.clipboard.writeText(shareUrl)
				setCopied(true)
				setTimeout(() => setCopied(false), 2000)
			}
		} catch (err) {
			console.error('Share failed:', err)
		}
	}

	return (
		<main className='min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden'>
			<Navbar />

			<div className='pt-24 pb-16 px-4 max-w-5xl mx-auto'>
				<Link
					href='/events'
					className='inline-flex items-center gap-2 text-[#c9a227] hover:text-yellow-400 transition mb-6'
				>
					<ArrowLeft size={16} />
					Back to Events
				</Link>

				{eventLoading && (
					<div className='text-center py-20'>
						<p className='text-gray-400 text-lg'>Loading event...</p>
					</div>
				)}

				{!eventLoading && eventError && (
					<div className='bg-red-500/20 p-4 rounded mb-8 text-sm flex gap-2 items-center'>
						<AlertCircle size={16} />
						{eventError}
					</div>
				)}

				{!eventLoading && !eventError && !event && (
					<div className='text-center py-20'>
						<p className='text-gray-500 text-lg'>Event not found</p>
					</div>
				)}

				{!eventLoading && event && (
					<div className='bg-[#10101e] rounded-2xl border border-white/10 overflow-hidden'>
						{event.banner && (
							<div className='w-full bg-black flex justify-center items-center max-h-[420px] overflow-hidden'>
								<img
									src={event.banner}
									alt={event.title}
									className='w-full h-full object-contain'
								/>
							</div>
						)}

						<div className='p-6 lg:p-10'>
							<div className='flex items-start justify-between gap-4 mb-4 flex-wrap'>
								<h1 className='text-2xl sm:text-3xl lg:text-4xl font-black'>
									{event.title}
								</h1>

								<button
									onClick={handleShare}
									className='flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium transition'
								>
									<Share2 size={16} />
									{copied ? 'Link copied!' : 'Share'}
								</button>
							</div>

							{event.category && (
								<span className='inline-block bg-[#c9a227]/20 text-[#c9a227] text-xs font-bold px-3 py-1 rounded-full mb-4'>
									{event.category}
								</span>
							)}

							<p className='text-gray-300 whitespace-pre-wrap leading-relaxed mb-6'>
								{event.description}
							</p>

							<div className='grid sm:grid-cols-2 gap-4 mb-8 text-sm'>
								<div className='flex gap-3 items-center bg-[#0c0c18] border border-white/10 p-4 rounded-xl'>
									<Calendar
										size={18}
										className='text-[#c9a227] shrink-0'
									/>
									<span className='text-gray-200'>
										{event.date
											? new Date(event.date).toLocaleString()
											: 'TBA'}
									</span>
								</div>

								<div className='flex gap-3 items-center bg-[#0c0c18] border border-white/10 p-4 rounded-xl'>
									<MapPin
										size={18}
										className='text-[#c9a227] shrink-0'
									/>
									<span className='text-gray-200 line-clamp-2'>
										{event.venue || 'TBA'}
									</span>
								</div>

								{typeof event.capacity === 'number' && (
									<div className='flex gap-3 items-center bg-[#0c0c18] border border-white/10 p-4 rounded-xl'>
										<Users
											size={18}
											className='text-[#c9a227] shrink-0'
										/>
										<span className='text-gray-200'>
											Capacity: {event.capacity}
										</span>
									</div>
								)}

								{Array.isArray(event.tags) &&
									event.tags.length > 0 && (
										<div className='flex gap-3 items-center bg-[#0c0c18] border border-white/10 p-4 rounded-xl'>
											<Tag
												size={18}
												className='text-[#c9a227] shrink-0'
											/>
											<span className='text-gray-200 line-clamp-1'>
												{event.tags.join(', ')}
											</span>
										</div>
									)}
							</div>

							<button
								onClick={handleGetTickets}
								className='w-full sm:w-auto bg-[#c9a227] hover:bg-[#b8921f] text-black px-8 py-3 rounded-md font-bold transition'
							>
								Get Tickets
							</button>
						</div>
					</div>
				)}
			</div>

			{isTicketModalOpen && (
				<div className='fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-60 px-4'>
					<div className='bg-[#10101e] w-full max-w-2xl lg:max-w-4xl max-h-[80vh] rounded-2xl border border-white/10 flex flex-col overflow-hidden'>
						<div className='p-6 lg:p-10 border-b border-white/10 flex-shrink-0 flex justify-between items-center'>
							<h2 className='font-bold text-xl lg:text-2xl'>
								Event Tickets
							</h2>

							<button
								onClick={() => setIsTicketModalOpen(false)}
								className='text-gray-400 text-lg hover:text-white'
							>
								✕
							</button>
						</div>

						<div className='flex-1 overflow-y-auto p-6 lg:p-10'>
							{ticketsLoading && (
								<p className='text-gray-400 text-center'>
									Loading tickets...
								</p>
							)}

							{!ticketsLoading && ticketsError && (
								<p className='text-red-400 text-center'>
									{ticketsError}
								</p>
							)}

							{!ticketsLoading && tickets.length > 0 && (
								<div className='grid sm:grid-cols-2 gap-6'>
									{tickets.map((ticket: any) => (
										<div
											key={ticket._id}
											className='border border-white/10 rounded-xl p-5 lg:p-6 bg-[#0c0c18] flex flex-col justify-between hover:border-[#c9a227] transition'
										>
											<div>
												<h3 className='font-bold text-lg mb-1'>
													{ticket.title}
												</h3>

												<p className='text-sm text-gray-400 mb-4'>
													{ticket.description}
												</p>

												{ticket.benefits &&
													ticket.benefits.length > 0 && (
														<ul className='space-y-2 mb-4'>
															{ticket.benefits.map(
																(
																	benefit: string,
																	index: number,
																) => (
																	<li
																		key={index}
																		className='text-sm text-gray-300 flex gap-2 items-start'
																	>
																		<span className='text-[#c9a227]'>
																			✔
																		</span>
																		{benefit}
																	</li>
																),
															)}
														</ul>
													)}
											</div>

											<div className='mt-4'>
												<p className='text-[#c9a227] font-bold text-lg mb-3'>
													{ticket.currency} {ticket.price}
												</p>

												<button
													onClick={() =>
														handleBuyTicket(ticket)
													}
													className='w-full bg-[#c9a227] hover:bg-[#b8921f] text-black py-3 rounded-lg font-bold transition'
												>
													Buy Ticket
												</button>
											</div>
										</div>
									))}
								</div>
							)}

							{!ticketsLoading &&
								tickets.length === 0 &&
								!ticketsError && (
									<p className='text-gray-400 text-center'>
										No tickets available.
									</p>
								)}
						</div>

						<PaymentModal
							isOpen={isPaymentOpen}
							onClose={() => setIsPaymentOpen(false)}
							ticket={selectedTicket}
						/>
					</div>
				</div>
			)}
		</main>
	)
}
