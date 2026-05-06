'use client'

import { useState, useEffect } from 'react'
import { Calendar, MapPin, AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import eventService from '@/app/services/eventService'
import Navbar from '@/components/Navbar'

export default function EventsPage() {
	const [eventType, setEventType] = useState<'live' | 'previous'>('live')
	const [events, setEvents] = useState<any[]>([])
	const [eventsLoading, setEventsLoading] = useState(true)
	const [eventsError, setEventsError] = useState('')
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

										<Link
											href={`/events/${event._id}`}
											className='mt-4 block w-full bg-[#c9a227] text-black py-2 rounded-md text-xs font-bold hover:opacity-90 transition text-center'
										>
											View Event
										</Link>
									</div>
								</div>
							))}
						</div>
					</>
				)}

			</div>
		</main>
	)
}
