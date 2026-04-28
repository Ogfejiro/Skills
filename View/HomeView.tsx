'use client'

import { useState, useEffect } from 'react'
import { Calendar, MapPin, AlertCircle, ArrowRight, Zap, Shield, Globe, Ticket, Users, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import eventService from '@/app/services/eventService'
import ticketService from '@/app/services/ticketService'
import PaymentModal from '@/components/PaymentModal'
import ViewEventModal from '@/components/ViewEventModal'

const FEATURES = [
	{
		icon: <Calendar className='w-5 h-5' />,
		title: 'Interactive Schedule',
		desc: 'Easily navigate and plan your day with our interactive schedule.',
	},
	{
		icon: <Shield className='w-5 h-5' />,
		title: 'Exclusive Content',
		desc: 'Gain access to exclusive sessions that will elevate your knowledge.',
	},
	{
		icon: <Zap className='w-5 h-5' />,
		title: 'Event Updates',
		desc: 'Stay informed with real-time updates and announcements.',
	},
	{
		icon: <Globe className='w-5 h-5' />,
		title: 'Live Streaming',
		desc: 'Experience the event from anywhere with seamless live streaming.',
	},
]

const BENEFITS = [
	{ icon: <Globe className='w-5 h-5' />, title: 'Networking', desc: 'Connect with innovators and leaders.' },
	{ icon: <Zap className='w-5 h-5' />, title: 'Premium Events', desc: 'Exclusively curated experiences.' },
	{ icon: <Ticket className='w-5 h-5' />, title: 'Seamless Payments', desc: 'Quick and easy ticket purchasing.' },
	{ icon: <Shield className='w-5 h-5' />, title: 'Wide Reach', desc: 'Connect with everyone.' },
]

const PREVIOUS_EVENTS = [
	{
		id: 'prev-1',
		title: 'LOFTE-3 Dinner Night',
		description: 'An exclusive dinner night showcasing culture and luxury at Eko Hotels & Suites, Lagos.',
		date: 'March, 2026',
		location: 'Eko Hotels & Suites, Lagos',
		attendees: '342+',
		image: '/images/event1.jpg',
		link: '#',
		highlights: ['Event Access', 'Premium Seating', 'Networking'],
	},
	{
		id: 'prev-2',
		title: 'Afriverse CTFFCT',
		description: 'The groundbreaking CTFFCT event bringing together traders, investors, and enthusiasts in Jos.',
		date: 'November, 2025',
		location: 'Jos',
		attendees: '1000+',
		image: '/images/ctffct.jpg',
		link: 'https://x.com/i/status/1993282618797048112',
		highlights: ['Trading Workshops', 'Networking Sessions', 'Market Analysis'],
	},
	{
		id: 'prev-3',
		title: 'Exclusive Games Weekend by THE Boiz',
		description: 'An exclusive gaming extravaganza featuring competitive tournaments and premium networking.',
		date: 'August, 2025',
		location: 'Port Harcourt',
		attendees: '100+',
		image: '/images/dboys.jpg',
		link: 'https://x.com/i/status/2007340472709296637',
		highlights: ['Gaming Tournaments', 'Premium Catering', 'Prize Pool Events'],
	},
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

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				setEventsLoading(true)
				const res = await eventService.getPublicEvents(1, 6)
				const events = res?.data?.events || []
				setPublicEvents(Array.isArray(events) ? events : [])
			} catch (err: any) {
				setEventsError(err.message || 'Failed to load events')
				setPublicEvents([])
			} finally {
				setEventsLoading(false)
			}
		}

		fetchEvents()
	}, [])

	const handleViewEvent = (event: any) => {
		setSelectedEvent(event)
		setIsViewModalOpen(true)
	}

	const handleCloseModal = () => {
		setIsViewModalOpen(false)
		setSelectedEvent(null)
	}

	const handleGetTickets = async (eventId: string) => {
		try {
			setTicketLoading(true)
			setTicketError('')
			setModalTickets([])
			setIsTicketModalOpen(true)

			const res = await ticketService.getEventTicketsPublic(eventId)

			if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
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

	const openLink = (url: string) => {
		if (url && url !== '#') {
			window.open(url, '_blank', 'noopener,noreferrer')
		}
	}

	const EventCard = ({ event }: { event: any }) => (
		<div className='group bg-[#111118] rounded-2xl border border-white/[0.06] overflow-hidden transition-all duration-300 hover:border-[#c9a227]/30 hover:shadow-lg hover:shadow-[#c9a227]/5'>
			{event.banner ? (
				<div className='relative h-48 lg:h-52 overflow-hidden'>
					<img
						src={event.banner}
						alt={event.title}
						className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
					/>
					<div className='absolute inset-0 bg-gradient-to-t from-[#111118] via-transparent to-transparent' />
				</div>
			) : (
				<div className='h-48 lg:h-52 bg-gradient-to-br from-[#c9a227]/10 to-[#111118] flex items-center justify-center'>
					<Calendar className='w-12 h-12 text-[#c9a227]/30' />
				</div>
			)}

			<div className='p-5 lg:p-6'>
				<h3 className='font-semibold text-base lg:text-lg text-white leading-snug'>
					{event.title}
				</h3>

				<p className='text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed'>
					{event.description}
				</p>

				<div className='mt-4 space-y-2'>
					<div className='flex gap-2 items-center text-sm text-gray-400'>
						<Calendar size={14} className='text-[#c9a227]/70' />
						{event.date ? new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'TBA'}
					</div>
					<div className='flex gap-2 items-center text-sm text-gray-400'>
						<MapPin size={14} className='text-[#c9a227]/70' />
						{event.venue || 'TBA'}
					</div>
				</div>

				<button
					onClick={() => handleViewEvent(event)}
					className='mt-5 w-full bg-[#c9a227] text-black py-2.5 rounded-lg text-sm font-semibold hover:bg-[#d4b84a] transition-colors'
				>
					View Event
				</button>
			</div>
		</div>
	)

	return (
		<div className='min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden'>
			{/* Hero */}
			<section className='relative w-full flex flex-col items-center justify-start text-center px-4 pt-24 md:pt-32 pb-16 md:pb-24'>
				{/* Background glow */}
				<div className='absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#c9a227]/8 rounded-full blur-[140px] pointer-events-none' />

				<p className='text-[11px] md:text-xs text-[#c9a227]/70 tracking-[0.2em] mb-6 uppercase font-medium'>
					An unforgettable experience awaits
				</p>

				<h1 className='text-4xl md:text-5xl lg:text-7xl font-black leading-[1.1] max-w-4xl mb-5'>
					<span className='text-white'>Join the</span>
					<br />
					<span className='text-[#c9a227]'>Event Experience</span>
				</h1>

				<p className='text-gray-400 max-w-lg text-sm md:text-base mt-2 mb-8 leading-relaxed'>
					Where every moment is designed to inspire. Discover curated events that bring together the best in culture, innovation, and community.
				</p>

				<div className='flex flex-col sm:flex-row items-center gap-4'>
					<Link
						href='/auth/register'
						className='group px-7 py-3 rounded-full bg-[#c9a227] text-black font-semibold text-sm hover:bg-[#d4b84a] transition-all flex items-center gap-2'
					>
						Get Started
						<ArrowRight className='w-4 h-4 transition-transform group-hover:translate-x-0.5' />
					</Link>
					<Link
						href='/events'
						className='px-7 py-3 rounded-full border border-white/10 text-gray-300 font-medium text-sm hover:border-white/20 hover:text-white transition-all'
					>
						Browse Events
					</Link>
				</div>

				{/* Benefits */}
				<div className='mt-16 md:mt-20 w-full max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4'>
					{BENEFITS.map((b, idx) => (
						<div
							key={idx}
							className='bg-white/[0.03] rounded-xl border border-white/[0.06] p-5 md:p-6 hover:border-[#c9a227]/20 transition-colors'
						>
							<div className='w-9 h-9 rounded-lg bg-[#c9a227]/10 flex items-center justify-center text-[#c9a227] mb-3'>
								{b.icon}
							</div>
							<h3 className='text-sm font-semibold text-white mb-1'>
								{b.title}
							</h3>
							<p className='text-xs text-gray-500 leading-relaxed'>
								{b.desc}
							</p>
						</div>
					))}
				</div>
			</section>

			{/* Features Section */}
			<section className='py-16 md:py-24 px-4 border-t border-white/[0.04]'>
				<div className='max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-start'>
					<div>
						<p className='text-xs text-[#c9a227]/70 tracking-[0.2em] uppercase font-medium mb-3'>
							Platform Features
						</p>
						<h2 className='text-3xl md:text-4xl font-bold leading-tight'>
							Everything you need
							<br />
							<span className='text-[#c9a227]'>in one place</span>
						</h2>
						<p className='text-gray-400 text-sm md:text-base leading-relaxed mt-4 max-w-md'>
							Our platform makes it easy to discover events, purchase tickets, and connect with communities — all with a seamless experience.
						</p>
					</div>

					<div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
						{FEATURES.map((f) => (
							<div key={f.title} className='group'>
								<div className='w-9 h-9 rounded-lg bg-[#c9a227]/10 flex items-center justify-center text-[#c9a227] mb-3 group-hover:bg-[#c9a227]/15 transition-colors'>
									{f.icon}
								</div>
								<p className='text-sm font-semibold text-white mb-1'>
									{f.title}
								</p>
								<p className='text-sm text-gray-500 leading-relaxed'>
									{f.desc}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Current Events */}
			<section id='events' className='py-16 md:py-24 px-4 lg:px-6 max-w-7xl mx-auto'>
				<div className='flex items-end justify-between mb-10'>
					<div>
						<p className='text-xs text-[#c9a227]/70 tracking-[0.2em] uppercase font-medium mb-2'>
							Happening Now
						</p>
						<h2 className='text-2xl sm:text-3xl font-bold'>
							Current Events
						</h2>
					</div>
					<Link
						href='/events'
						className='hidden sm:flex items-center gap-1.5 text-sm text-[#c9a227] font-medium hover:underline underline-offset-4'
					>
						View all <ArrowRight className='w-3.5 h-3.5' />
					</Link>
				</div>

				{eventsError && (
					<div className='bg-red-500/10 border border-red-500/20 p-4 rounded-lg mb-8 text-sm flex gap-2 items-center max-w-xl'>
						<AlertCircle size={16} className='text-red-400' />
						<span className='text-red-300'>{eventsError}</span>
					</div>
				)}

				{eventsLoading ? (
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
						{[1, 2, 3].map((i) => (
							<div key={i} className='bg-white/[0.03] rounded-2xl border border-white/[0.06] overflow-hidden animate-pulse'>
								<div className='h-48 bg-white/[0.04]' />
								<div className='p-6 space-y-3'>
									<div className='h-4 bg-white/[0.06] rounded w-3/4' />
									<div className='h-3 bg-white/[0.04] rounded w-full' />
									<div className='h-3 bg-white/[0.04] rounded w-1/2' />
								</div>
							</div>
						))}
					</div>
				) : publicEvents.length === 0 ? (
					<div className='text-center py-16'>
						<Calendar className='w-12 h-12 text-gray-700 mx-auto mb-4' />
						<p className='text-gray-500'>No events available right now</p>
						<p className='text-gray-600 text-sm mt-1'>Check back soon for upcoming events</p>
					</div>
				) : (
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
						{publicEvents.map((event: any) => (
							<EventCard key={event._id} event={event} />
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

			{/* Previous Events - Hardcoded, no API fetch */}
			<section className='py-16 md:py-24 px-4 lg:px-6 max-w-7xl mx-auto border-t border-white/[0.04]'>
				<div className='flex items-end justify-between mb-10'>
					<div>
						<p className='text-xs text-[#c9a227]/70 tracking-[0.2em] uppercase font-medium mb-2'>
							Looking Back
						</p>
						<h2 className='text-2xl sm:text-3xl font-bold'>
							Previous Events
						</h2>
					</div>
					<Link
						href='/previous-events'
						className='flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#c9a227] text-black font-semibold text-sm hover:bg-[#d4b84a] transition-colors'
					>
						View All <ArrowRight className='w-3.5 h-3.5' />
					</Link>
				</div>

				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
					{PREVIOUS_EVENTS.map((event) => (
						<div
							key={event.id}
							className='group bg-[#111118] rounded-2xl border border-white/[0.06] overflow-hidden transition-all duration-300 hover:border-[#c9a227]/30 hover:shadow-lg hover:shadow-[#c9a227]/5'
						>
							<div className='relative h-48 lg:h-52 overflow-hidden cursor-pointer' onClick={() => openLink(event.link)}>
								<img
									src={event.image}
									alt={event.title}
									className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
								/>
								<div className='absolute inset-0 bg-gradient-to-t from-[#111118] via-transparent to-transparent' />
								<div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40'>
									<div className='p-3 rounded-full bg-[#c9a227]/20 backdrop-blur-sm border border-[#c9a227]'>
										<ExternalLink className='w-5 h-5 text-[#c9a227]' />
									</div>
								</div>
								<div className='absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm border border-[#c9a227]/50'>
									<span className='text-[10px] text-[#c9a227] font-semibold tracking-wide'>PAST EVENT</span>
								</div>
							</div>

							<div className='p-5 lg:p-6'>
								<h3 className='font-semibold text-base lg:text-lg text-white leading-snug group-hover:text-[#c9a227] transition-colors'>
									{event.title}
								</h3>
								<p className='text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed'>
									{event.description}
								</p>

								<div className='mt-4 space-y-2'>
									<div className='flex gap-2 items-center text-sm text-gray-400'>
										<Calendar size={14} className='text-[#c9a227]/70' />
										{event.date}
									</div>
									<div className='flex gap-2 items-center text-sm text-gray-400'>
										<MapPin size={14} className='text-[#c9a227]/70' />
										{event.location}
									</div>
									<div className='flex gap-2 items-center text-sm text-gray-400'>
										<Users size={14} className='text-[#c9a227]/70' />
										{event.attendees} attendees
									</div>
								</div>

								<div className='mt-4 flex flex-wrap gap-1.5'>
									{event.highlights.map((h, idx) => (
										<span key={idx} className='px-2.5 py-1 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/15 text-[11px] text-gray-400'>
											{h}
										</span>
									))}
								</div>

								{event.link && event.link !== '#' && (
									<button
										onClick={() => openLink(event.link)}
										className='w-full mt-5 px-4 py-2.5 rounded-lg border border-[#c9a227]/30 text-[#c9a227] text-sm font-medium hover:bg-[#c9a227]/10 transition flex items-center justify-center gap-2'
									>
										View Highlight
										<ExternalLink className='w-3.5 h-3.5' />
									</button>
								)}
							</div>
						</div>
					))}
				</div>
			</section>

			{/* Ticket Modal */}
			{isTicketModalOpen && (
				<div className='fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-60 px-4'>
					<div className='bg-[#111118] w-full max-w-2xl lg:max-w-4xl max-h-[80vh] rounded-2xl border border-white/[0.08] flex flex-col overflow-hidden'>
						<div className='p-6 lg:p-8 border-b border-white/[0.06] flex-shrink-0 flex justify-between items-center'>
							<h2 className='font-bold text-lg lg:text-xl'>
								Event Tickets
							</h2>
							<button
								onClick={() => setIsTicketModalOpen(false)}
								className='w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition'
							>
								&times;
							</button>
						</div>

						<div className='flex-1 overflow-y-auto p-6 lg:p-8'>
							{ticketLoading && (
								<p className='text-gray-400 text-center py-8'>Loading tickets...</p>
							)}

							{!ticketLoading && ticketError && (
								<p className='text-red-400 text-center py-8'>{ticketError}</p>
							)}

							{!ticketLoading && modalTickets.length > 0 && (
								<div className='grid sm:grid-cols-2 gap-5'>
									{modalTickets.map((ticket: any) => (
										<div
											key={ticket._id}
											className='border border-white/[0.08] rounded-xl p-5 bg-white/[0.02] flex flex-col justify-between hover:border-[#c9a227]/30 transition'
										>
											<div>
												<h3 className='font-semibold text-base mb-1'>{ticket.title}</h3>
												<p className='text-sm text-gray-500 mb-4'>{ticket.description}</p>

												{ticket.benefits && ticket.benefits.length > 0 && (
													<ul className='space-y-1.5 mb-4'>
														{ticket.benefits.map((benefit: string, index: number) => (
															<li key={index} className='text-sm text-gray-400 flex gap-2 items-start'>
																<span className='text-[#c9a227] mt-0.5'>&#10003;</span>
																{benefit}
															</li>
														))}
													</ul>
												)}
											</div>

											<div className='mt-4'>
												<p className='text-[#c9a227] font-bold text-lg mb-3'>
													{ticket.currency} {ticket.price}
												</p>
												<button
													onClick={() => handleBuyTicket(ticket)}
													className='w-full bg-[#c9a227] hover:bg-[#d4b84a] text-black py-2.5 rounded-lg font-semibold transition-colors text-sm'
												>
													Buy Ticket
												</button>
											</div>
										</div>
									))}
								</div>
							)}

							{!ticketLoading && modalTickets.length === 0 && !ticketError && (
								<p className='text-gray-500 text-center py-8'>No tickets available.</p>
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
		</div>
	)
}
