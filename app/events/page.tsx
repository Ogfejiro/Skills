'use client'

import { useState, useEffect } from 'react'
import { Calendar, MapPin, AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import eventService from '@/app/services/eventService'
import ticketService from '@/app/services/ticketService'
import Navbar from '@/components/Navbar'
import PaymentModal from '@/components/PaymentModal'
import TicketModal from '@/components/TicketModal'
import ViewEventModal from '@/components/ViewEventModal'

export default function EventsPage() {
	const [eventType, setEventType] = useState<'live' | 'previous'>('live')
	const [events, setEvents] = useState<any[]>([])
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
	const [page, setPage] = useState(1)

	// FETCH EVENTS
	useEffect(() => {
		const fetchEvents = async () => {
			try {
				setEventsLoading(true)
				setEventsError('')

				let res
				if (eventType === 'live') {
					res = await eventService.getPublicEvents(page, 12)
				} else {
					res = await eventService.getPreviousEvents(page, 12)
				}

				console.log('Events response:', res)
				const fetchedEvents = res?.data?.events || []
				setEvents(Array.isArray(fetchedEvents) ? fetchedEvents : [])
			} catch (err: any) {
				setEventsError(err.message || 'Failed to load events')
				setEvents([])
			} finally {
				setEventsLoading(false)
			}
		}

		setPage(1)
		fetchEvents()
	}, [eventType])

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

	// BUY BUTTON
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
		<main className='min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden'>
			<Navbar />

			<div className='pt-24 pb-16 px-4 max-w-7xl xl:max-w-[1400px] mx-auto'>
				{/* Header */}
				<div className='mb-12'>
					<Link
						href='/'
						className='flex items-center gap-2 text-[#c9a227] hover:text-yellow-400 transition mb-6'
					>
						<ArrowLeft size={16} />
						Back to Home
					</Link>

					<h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4'>
						All Events
					</h1>
					<p className='text-gray-400 text-base sm:text-lg max-w-2xl'>
						Explore all upcoming and previous events. Toggle between live and past events to find what interests you.
					</p>
				</div>

				{/* Toggle */}
				<div className='mb-12 flex gap-3 sm:gap-4 flex-wrap'>
					<button
						onClick={() => setEventType('live')}
						className={`px-6 py-3 rounded-full font-bold transition-all ${
							eventType === 'live'
								? 'bg-[#c9a227] text-black shadow-lg shadow-yellow-900/40'
								: 'bg-[#10101e] text-gray-400 border border-white/10 hover:border-white/20'
						}`}
					>
						Live Events
					</button>
					<button
						onClick={() => setEventType('previous')}
						className={`px-6 py-3 rounded-full font-bold transition-all ${
							eventType === 'previous'
								? 'bg-[#c9a227] text-black shadow-lg shadow-yellow-900/40'
								: 'bg-[#10101e] text-gray-400 border border-white/10 hover:border-white/20'
						}`}
					>
						Previous Events
					</button>
				</div>

				{/* Events Error */}
				{eventsError && (
					<div className='bg-red-500/20 p-4 rounded mb-8 text-sm flex gap-2 items-center'>
						<AlertCircle size={16} />
						{eventsError}
					</div>
				)}

				{/* Loading State */}
				{eventsLoading ? (
					<div className='text-center py-16'>
						<p className='text-gray-400 text-lg'>Loading {eventType === 'live' ? 'live' : 'previous'} events...</p>
					</div>
				) : events.length === 0 ? (
					<div className='text-center py-16'>
						<p className='text-gray-500 text-lg'>
							No {eventType === 'live' ? 'live' : 'previous'} events available
						</p>
					</div>
				) : (
					<>
						{/* Events Grid */}
						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 mb-12'>
							{events.map((event: any) => (
								<div
									key={event._id}
									className='bg-[#10101e] rounded-2xl border border-white/10 overflow-hidden hover:scale-[1.02] transition'
								>
									{event.banner && (
										<img
											src={event.banner}
											className='h-40 w-full object-cover'
											alt={event.title}
										/>
									)}

									<div className='p-4 lg:p-5'>
										<h3 className='font-bold text-base line-clamp-2'>
											{event.title}
										</h3>

										<p className='text-xs text-gray-400 mt-2 line-clamp-2'>
											{event.description}
										</p>

										<div className='mt-3 text-xs text-gray-400 space-y-1'>
											<div className='flex gap-2 items-center'>
												<Calendar size={14} />
												<span>
													{event.date
														? new Date(
																event.date,
														  ).toLocaleDateString()
														: 'TBA'}
												</span>
											</div>

											<div className='flex gap-2 items-center'>
												<MapPin size={14} />
												<span className='line-clamp-1'>
													{event.venue || 'TBA'}
												</span>
											</div>
										</div>

										<button
											onClick={() => handleViewEvent(event)}
											className='mt-4 w-full bg-[#c9a227] text-black py-2 rounded-md text-xs font-bold hover:opacity-90 transition'
										>
											View Event
										</button>
									</div>
								</div>
							))}
						</div>

						{/* View Event Modal */}
						<ViewEventModal
							event={selectedEvent}
							isOpen={isViewModalOpen}
							onClose={handleCloseModal}
							onGetTickets={(id) => handleGetTickets(id)}
						/>
					</>
				)}

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

							{/* PAYMENT MODAL */}
							<PaymentModal
								isOpen={isPaymentOpen}
								onClose={() => setIsPaymentOpen(false)}
								ticket={selectedTicket}
							/>
						</div>
					</div>
				)}
			</div>
		</main>
	)
}
