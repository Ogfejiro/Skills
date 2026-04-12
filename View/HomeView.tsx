'use client'

import { useState, useEffect, useMemo } from 'react'
import { Calendar, MapPin, Users, Ticket, AlertCircle } from 'lucide-react'
import Navbar from '@/components/Navbar'
import eventService from '@/app/services/eventService'
import ticketService from '@/app/services/ticketService'

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

const LOFTE3_BENEFITS = [
	{ icon: '🌐', title: 'Web3 Networking', desc: 'Connect with innovators.' },
	{ icon: '⭐', title: 'Premium Events', desc: 'Exclusive curated events.' },
	{ icon: '🎟️', title: 'Easy Ticketing', desc: 'Simple buying experience.' },
	{ icon: '🌍', title: 'Global Reach', desc: 'Connect worldwide.' },
]

export default function HomePage() {
	const [publicEvents, setPublicEvents] = useState<any[]>([])
	const [eventsLoading, setEventsLoading] = useState(true)
	const [eventsError, setEventsError] = useState('')

	// MODAL STATES
	const [isTicketModalOpen, setIsTicketModalOpen] = useState(false)
	const [modalTickets, setModalTickets] = useState<any[]>([])
	const [ticketLoading, setTicketLoading] = useState(false)
	const [ticketError, setTicketError] = useState('')

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
		alert(`Buying ticket: ${ticket.title} - Feature coming soon 🚀`)
	}

	return (
		<div className='min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden'>
			<Navbar />

			{/* HERO */}
			<section className='relative flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-28 pb-16'>
				{/* stars */}
				<div className='absolute inset-0 pointer-events-none'>
					{stars.map((s, i) => (
						<div
							key={i}
							className='absolute bg-white rounded-full'
							style={{
								width: s.size,
								height: s.size,
								top: `${s.top}%`,
								left: `${s.left}%`,
								opacity: s.opacity,
							}}
						/>
					))}
				</div>

				<h1 className='text-3xl sm:text-5xl md:text-6xl font-black text-center max-w-3xl'>
					Unforgettable <span className='text-[#c9a227]'>Events</span>{' '}
					Experience
				</h1>

				<p className='text-gray-400 max-w-xl mt-4 text-sm sm:text-base'>
					Discover premium Web3 events and connect globally.
				</p>
			</section>

			{/* EVENTS */}
			<section className='py-20 px-4 sm:px-6 max-w-6xl mx-auto'>
				<h2 className='text-2xl sm:text-4xl font-black text-center mb-10'>
					Current Events
				</h2>

				{eventsError && (
					<div className='bg-red-500/20 p-3 rounded mb-6 text-sm flex gap-2 items-center'>
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
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
						{publicEvents.map((event: any) => (
							<div
								key={event._id}
								className='bg-[#10101e] rounded-xl border border-white/10 overflow-hidden'
							>
								{event.banner && (
									<img
										src={event.banner}
										className='h-40 w-full object-cover'
									/>
								)}

								<div className='p-4'>
									<h3 className='font-bold text-sm'>
										{event.title}
									</h3>

									<p className='text-xs text-gray-400 mt-1 line-clamp-2'>
										{event.description}
									</p>

									<div className='mt-3 text-xs text-gray-400 space-y-1'>
										<div className='flex gap-2 items-center'>
											<Calendar size={14} />
											{event.date
												? new Date(
														event.date,
													).toLocaleString()
												: 'TBA'}
										</div>

										<div className='flex gap-2 items-center'>
											<MapPin size={14} />
											{event.venue || 'TBA'}
										</div>
									</div>

									{/* GET TICKETS */}
									<button
										onClick={() =>
											handleGetTickets(event._id)
										}
										className='mt-4 w-full bg-[#c9a227] text-black py-2 rounded text-sm font-bold'
									>
										Get Tickets
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</section>

			{/* TICKET MODAL */}
			{isTicketModalOpen && (
				<div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4'>
					<div className='bg-[#10101e] w-full max-w-md rounded-xl border border-white/10 p-6'>
						{/* HEADER */}
						<div className='flex justify-between items-center mb-4'>
							<h2 className='font-bold'>Event Tickets</h2>

							<button
								onClick={() => setIsTicketModalOpen(false)}
								className='text-gray-400'
							>
								✕
							</button>
						</div>

						{/* LOADING */}
						{ticketLoading && (
							<p className='text-gray-400 text-sm'>
								Loading tickets...
							</p>
						)}

						{/* ERROR / EMPTY */}
						{!ticketLoading && ticketError && (
							<p className='text-red-400 text-sm'>
								{ticketError}
							</p>
						)}

						{/* TICKETS */}
						{!ticketLoading && modalTickets.length > 0 && (
							<div className='space-y-3'>
								{modalTickets.map((ticket: any) => (
									<div
										key={ticket._id}
										className='border border-white/10 rounded-lg p-3'
									>
										<h3 className='font-bold text-sm'>
											{ticket.title}
										</h3>

										<p className='text-xs text-gray-400'>
											{ticket.description}
										</p>

										<div className='mt-2 flex justify-between items-center'>
											<span className='text-[#c9a227] font-bold text-sm'>
												{ticket.currency} {ticket.price}
											</span>

											<button
												onClick={() =>
													handleBuyTicket(ticket)
												}
												className='px-3 py-1 text-xs bg-green-500 text-black rounded'
											>
												Buy
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
								<p className='text-gray-400 text-sm'>
									No tickets available.
								</p>
							)}
					</div>
				</div>
			)}
		</div>
	)
}
