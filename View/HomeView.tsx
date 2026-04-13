'use client'

import { useState, useEffect, useMemo } from 'react'
import { Calendar, MapPin, Users, Ticket, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import eventService from '@/app/services/eventService'
import ticketService from '@/app/services/ticketService'
import PaymentModal from '@/components/PaymentModal'
import TicketModal from '@/components/TicketModal'
import ViewEventModal from '@/components/ViewEventModal'

const LOGOS = [
	'Sorare',
	'VISA',
	'Sling',
	'Slack',
	'Unqork',
	'Segment',
	'LinkedIn',
	'Overwolf',
	'Microsoft',
	'Humaans',
]

const FEATURES = [
	{
		icon: '📅',
		title: 'Interactive Schedule',
		desc: 'Easily navigate and plan your day with interactive schedule.',
	},
	{
		icon: '🔒',
		title: 'Exclusive Content',
		desc: 'Gain access to exclusive sessions that will elevate your knowledge.',
	},
	{
		icon: '🔔',
		title: 'Event Updates',
		desc: 'Stay informed with real-time updates and announcements.',
	},
	{
		icon: '📡',
		title: 'Live Streaming',
		desc: 'Experience the event from anywhere with seamless live streaming.',
	},
]

const LOFTE3_BENEFITS = [
	{ icon: '🌐', title: 'Networking', desc: 'Connect with innovators.' },
	{ icon: '⭐', title: 'Premium Events', desc: 'Exclusive curated events.' },
	{
		icon: '🎟️',
		title: 'Automated Payment',
		desc: 'Seamless payment experience.',
	},
	{ icon: '🌍', title: 'Global Reach', desc: 'Connect worldwide.' },
]

export default function HomePage() {
	const [publicEvents, setPublicEvents] = useState<any[]>([])
	const [eventsLoading, setEventsLoading] = useState(true)
	const [eventsError, setEventsError] = useState('')
	const [selectedEvent, setSelectedEvent] = useState<any>(null)
	const [isViewModalOpen, setIsViewModalOpen] = useState(false)

	// MODAL STATES
	const [isTicketModalOpen, setIsTicketModalOpen] = useState(false)
	const [modalTickets, setModalTickets] = useState<any[]>([])
	const [ticketLoading, setTicketLoading] = useState(false)
	const [ticketError, setTicketError] = useState('')
	const [selectedTicket, setSelectedTicket] = useState<any>(null)
	const [isPaymentOpen, setIsPaymentOpen] = useState(false)

	const stars = useMemo(
		() =>
			Array.from({ length: 60 }).map(() => ({
				top: Math.random() * 100,
				left: Math.random() * 100,
				size: Math.random() > 0.8 ? 2 : 1,
				opacity: Math.random() * 0.6 + 0.2,
			})),
		[],
	)

	// FETCH EVENTS
	useEffect(() => {
		const fetchEvents = async () => {
			try {
				setEventsLoading(true)
				const res = await eventService.getPublicEvents(1, 6)

				const events = res?.data?.events || res?.data || []
				setPublicEvents(Array.isArray(events) ? events : [])
			} catch (err: any) {
				setEventsError(err.message || 'Failed to load events')
			} finally {
				setEventsLoading(false)
			}
		}

		fetchEvents()
	}, [])

	// View Event Modal

	const handleViewEvent = (event: any) => {
		setSelectedEvent(event)
		setIsViewModalOpen(true)
	}

	const handleCloseModal = () => {
		setIsViewModalOpen(false)
		setSelectedEvent(null)
	}

	// FETCH TICKETS ON CLICK
	const handleGetTickets = async (eventId: string) => {
		try {
			setTicketLoading(true)
			setTicketError('')
			setModalTickets([])
			setIsTicketModalOpen(true)

			const res = await ticketService.getEventTicketsPublic(eventId)

			if (
				res?.success &&
				Array.isArray(res.data) &&
				res.data.length > 0
			) {
				setModalTickets(res.data)
			} else {
				setModalTickets([])
				setTicketError('No tickets available for this event')
			}
		} catch (err: any) {
			setModalTickets([])
			setTicketError(err.message || 'Failed to load tickets')
		} finally {
			setTicketLoading(false)
		}
	}

	// BUY BUTTON (PLACEHOLDER)
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

	return (
		<div className='min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden'>
			{/* ── Hero ── */}
			<section className='relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-24 pb-16 overflow-hidden'>
				{/* Stars background */}
				<div className='absolute inset-0 pointer-events-none'>
					{Array.from({ length: 80 }).map((_, i) => (
						<div
							key={i}
							className='absolute rounded-full bg-white'
							style={{
								width: Math.random() > 0.8 ? '2px' : '1px',
								height: Math.random() > 0.8 ? '2px' : '1px',
								top: `${Math.random() * 100}%`,
								left: `${Math.random() * 100}%`,
								opacity: Math.random() * 0.6 + 0.1,
							}}
						/>
					))}
				</div>

				{/* Glow orbs */}
				<div className='absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#c9a227]/10 rounded-full blur-[120px] pointer-events-none' />
				<div className='absolute bottom-0 left-1/4 w-[300px] h-[200px] bg-purple-900/20 rounded-full blur-[100px] pointer-events-none' />

				<p className='text-xs text-gray-500 tracking-widest mb-6 uppercase'>
					✦ This is an unforgettable experience
				</p>

				<h1 className='text-4xl md:text-6xl lg:text-7xl font-black leading-tight max-w-4xl mb-4'>
					<span className='text-white'>Join the Celebration</span>
					<br />
					<span className='text-white'>Unforgettable </span>
					<span className='text-[#c9a227]'>Event Experience</span>
				</h1>

				<p className='text-gray-400 max-w-xl text-sm md:text-base mt-4 mb-8 leading-relaxed'>
					Embark on a journey of sophistication and joy, where each
					moment is designed to inspire and delight. Join us and
					discover the perfect fusion.
				</p>

				<div className='flex flex-col sm:flex-row items-center gap-4'>
					<Link
						href='/auth/register'
						className='px-6 py-3 rounded-full bg-[#c9a227] text-black font-bold text-sm hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-900/40'
					>
						Register Now Today →
					</Link>
					<div className='flex items-center gap-3'>
						<div className='flex -space-x-2'>
							{['🧑', '👩', '🧔', '👱'].map((emoji, i) => (
								<div
									key={i}
									className='w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border-2 border-[#0a0a0f] flex items-center justify-center text-xs'
								>
									{emoji}
								</div>
							))}
						</div>
						<div className='text-left'>
							<p className='text-xs text-white font-semibold'>
								Relied upon by more
							</p>
							<p className='text-xs text-gray-500'>
								than 20,000 Users
							</p>
						</div>
					</div>
				</div>

				{/* LOFTE-3 Benefits Cards */}
				<div className='relative mt-16 w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
					{LOFTE3_BENEFITS.map((benefit, idx) => (
						<div
							key={idx}
							className='bg-[#10101e] rounded-xl border border-white/10 p-6 hover:border-white/20 hover:shadow-lg hover:shadow-[#c9a227]/10 transition-all hover:scale-105'
						>
							<div className='text-4xl mb-3'>{benefit.icon}</div>
							<h3 className='text-sm font-bold text-white mb-2'>
								{benefit.title}
							</h3>
							<p className='text-xs text-gray-400 leading-relaxed'>
								{benefit.desc}
							</p>
						</div>
					))}
				</div>
			</section>

			{/* ── Logo Marquee ── */}
			<section className='py-12 border-y border-white/5 overflow-hidden'>
				<div className='flex gap-12 animate-marquee whitespace-nowrap'>
					{[...LOGOS, ...LOGOS].map((logo, i) => (
						<span
							key={i}
							className='text-gray-500 font-semibold text-sm tracking-wide hover:text-[#c9a227] transition-colors cursor-default'
						>
							{logo}
						</span>
					))}
				</div>
			</section>

			{/* ── Explore Our Event Website Offers ── */}
			<section className='py-24 px-4'>
				<div className='max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start'>
					{/* LEFT SIDE */}
					<div>
						<span className='text-[10px] text-[#c9a227] tracking-widest uppercase font-semibold'>
							✦ Website Features
						</span>

						<h2 className='text-3xl md:text-4xl lg:text-5xl font-black mt-3 mb-6 leading-tight'>
							Explore Our Event
							<br />
							Website Offers
						</h2>

						<p className='text-gray-400 text-base leading-relaxed max-w-md'>
							Our interactive schedule allows attendees to easily
							view and plan their day. It offers a user-friendly
							interface where participants can explore session
							details, speakers, and event locations.
						</p>
					</div>

					{/* RIGHT SIDE */}
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
						{FEATURES.map((f) => (
							<div key={f.title}>
								<div className='flex items-center gap-3 mb-2'>
									<span className='text-[#c9a227] text-xl'>
										{f.icon}
									</span>
									<p className='text-lg font-semibold text-white'>
										{f.title}
									</p>
								</div>

								<p className='text-sm text-gray-400 leading-relaxed'>
									{f.desc}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* EVENTS */}
			<section className='py-24 px-6 lg:px-12 max-w-7xl xl:max-w-[1400px] mx-auto'>
				<h2 className='text-3xl sm:text-4xl lg:text-5xl font-black text-center mb-14'>
					Current Events
				</h2>

				{eventsError && (
					<div className='bg-red-500/20 p-4 rounded mb-8 text-sm flex gap-2 items-center max-w-xl mx-auto'>
						<AlertCircle size={16} />
						{eventsError}
					</div>
				)}

				{eventsLoading ? (
					<p className='text-center text-gray-400'>Loading...</p>
				) : publicEvents.length === 0 ? (
					<p className='text-center text-gray-500'>
						No events available
					</p>
				) : (
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 lg:gap-10'>
						{publicEvents.map((event: any) => (
							<div
								key={event._id}
								className='bg-[#10101e] rounded-2xl border border-white/10 overflow-hidden hover:scale-[1.02] transition'
							>
								{event.banner && (
									<img
										src={event.banner}
										className='h-48 lg:h-56 w-full object-cover'
									/>
								)}

								<div className='p-5 lg:p-6'>
									<h3 className='font-bold text-base lg:text-lg'>
										{event.title}
									</h3>

									<p className='text-sm text-gray-400 mt-2 line-clamp-2'>
										{event.description}
									</p>

									<div className='mt-4 text-sm text-gray-400 space-y-2'>
										<div className='flex gap-2 items-center'>
											<Calendar size={16} />
											{event.date
												? new Date(
														event.date,
													).toLocaleString()
												: 'TBA'}
										</div>

										<div className='flex gap-2 items-center'>
											<MapPin size={16} />
											{event.venue || 'TBA'}
										</div>
									</div>

									<button
										onClick={() => handleViewEvent(event)}
										className='mt-5 w-full bg-[#c9a227] text-black py-3 rounded-md text-sm font-bold hover:opacity-90 transition'
									>
										View Event
									</button>
								</div>
							</div>
						))}
					</div>
				)}
				<ViewEventModal
					event={selectedEvent}
					isOpen={isViewModalOpen}
					onClose={handleCloseModal}
					onGetTickets={(id) => handleGetTickets(id)}
				/>
			</section>

			{/* TICKET MODAL */}
			{isTicketModalOpen && (
				<div className='fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-60 px-4'>
					<div className='bg-[#10101e] w-full max-w-2xl lg:max-w-4xl max-h-[80vh] rounded-2xl border border-white/10 flex flex-col overflow-hidden'>
						{/* HEADER */}
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

						{/* SCROLLABLE CONTENT */}
						<div className='flex-1 overflow-y-auto p-6 lg:p-10'>
							{/* LOADING */}
							{ticketLoading && (
								<p className='text-gray-400 text-center'>
									Loading tickets...
								</p>
							)}

							{/* ERROR */}
							{!ticketLoading && ticketError && (
								<p className='text-red-400 text-center'>
									{ticketError}
								</p>
							)}

							{/* TICKETS */}
							{!ticketLoading && modalTickets.length > 0 && (
								<div className='grid sm:grid-cols-2 gap-6'>
									{modalTickets.map((ticket: any) => (
										<div
											key={ticket._id}
											className='border border-white/10 rounded-xl p-5 lg:p-6 bg-[#0c0c18] flex flex-col justify-between hover:border-[#c9a227] transition'
										>
											{/* TOP */}
											<div>
												<h3 className='font-bold text-lg mb-1'>
													{ticket.title}
												</h3>

												<p className='text-sm text-gray-400 mb-4'>
													{ticket.description}
												</p>

												{/* BENEFITS */}
												{ticket.benefits &&
													ticket.benefits.length >
														0 && (
														<ul className='space-y-2 mb-4'>
															{ticket.benefits.map(
																(
																	benefit: string,
																	index: number,
																) => (
																	<li
																		key={
																			index
																		}
																		className='text-sm text-gray-300 flex gap-2 items-start'
																	>
																		<span className='text-[#c9a227]'>
																			✔
																		</span>
																		{
																			benefit
																		}
																	</li>
																),
															)}
														</ul>
													)}
											</div>

											{/* BOTTOM */}
											<div className='mt-4'>
												<p className='text-[#c9a227] font-bold text-lg mb-3'>
													{ticket.currency}{' '}
													{ticket.price}
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

							{/* EMPTY */}
							{!ticketLoading &&
								modalTickets.length === 0 &&
								!ticketError && (
									<p className='text-gray-400 text-center'>
										No tickets available.
									</p>
								)}
						</div>

						{/* ✅ PAYMENT MODAL */}
						<PaymentModal
							isOpen={isPaymentOpen}
							onClose={() => setIsPaymentOpen(false)}
							ticket={selectedTicket}
						/>
					</div>
				</div>
			)}
		</div>
	)
}
