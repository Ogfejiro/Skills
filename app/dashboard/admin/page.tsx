'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import adminService, {
	AdminEvent,
	Analytics,
} from '@/app/services/adminService'
import {
	Loader2,
	CheckCircle,
	XCircle,
	Clock,
	Search,
	TrendingUp,
	DollarSign,
	Users,
	Calendar,
	AlertCircle,
	Eye,
} from 'lucide-react'
import { showNotification } from '@/lib/showNotification'

const STATUS_COLORS = {
	draft: 'text-gray-400 bg-gray-900',
	Auditing: 'text-yellow-400 bg-yellow-900/20',
	live: 'text-green-400 bg-green-900/20',
	ended: 'text-blue-400 bg-blue-900/20',
	cancelled: 'text-red-400 bg-red-900/20',
}

export default function AdminDashboard() {
	const { user, isAuthenticated, loading: authLoading, token } = useAuth()
	const router = useRouter()
	const [loading, setLoading] = useState(true)
	const [events, setEvents] = useState<AdminEvent[]>([])
	const [analytics, setAnalytics] = useState<Analytics | null>(null)
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedStatus, setSelectedStatus] = useState<string>('all')
	const [selectedEvent, setSelectedEvent] = useState<AdminEvent | null>(null)
	const [showStatusModal, setShowStatusModal] = useState(false)
	const [newStatus, setNewStatus] = useState<
		'draft' | 'Auditing' | 'live' | 'ended' | 'cancelled'
	>('live')
	const [actionLoading, setActionLoading] = useState(false)
	const [currentPage, setCurrentPage] = useState(1)
	const [pagination, setPagination] = useState({
		page: 1,
		limit: 10,
		totalEvents: 0,
		totalPages: 1,
	})

	useEffect(() => {
		if (!authLoading && !isAuthenticated) {
			router.push('/auth/login')
		} else if (user && user.role !== 'Admin') {
			router.push('/dashboard/user')
		} else if (token) {
			loadDashboard()
		}
	}, [authLoading, isAuthenticated, user, router, token])

	const loadDashboard = async () => {
		try {
			setLoading(true)
			if (!token) throw new Error('No authentication token')

			// Load events and analytics in parallel
			const [eventsData, analyticsData] = await Promise.all([
				adminService.getAllEvents(1, 10, token),
				adminService.getAnalytics(token),
			])

			setEvents(eventsData.data)
			setPagination({
				page: eventsData.page,
				limit: eventsData.limit,
				totalEvents: eventsData.totalEvents,
				totalPages: eventsData.totalPages,
			})
			setAnalytics(analyticsData)
		} catch (err: any) {
			showNotification({
				message: err.message || 'Failed to load dashboard',
				type: 'error',
			})
			console.error('Error loading dashboard:', err)
		} finally {
			setLoading(false)
		}
	}

	const handlePageChange = async (page: number) => {
		try {
			setLoading(true)
			if (!token) throw new Error('No authentication token')

			const eventsData = await adminService.getAllEvents(page, 10, token)
			setEvents(eventsData.data)
			setPagination({
				page: eventsData.page,
				limit: eventsData.limit,
				totalEvents: eventsData.totalEvents,
				totalPages: eventsData.totalPages,
			})
			setCurrentPage(page)
		} catch (err: any) {
			showNotification({
				message: err.message || 'Failed to load events',
				type: 'error',
			})
		} finally {
			setLoading(false)
		}
	}

	const handleStatusChange = async (eventId: string) => {
		try {
			setActionLoading(true)
			if (!token) throw new Error('No authentication token')

			await adminService.updateEventStatus(eventId, newStatus, token)

			// Update local state
			setEvents(
				events.map((e) =>
					e._id === eventId ? { ...e, status: newStatus } : e,
				),
			)

			setShowStatusModal(false)
			setSelectedEvent(null)
			showNotification({
				message: `Event status updated to ${newStatus}.`,
				type: 'success',
			})

			// Reload analytics since numbers might have changed
			const updatedAnalytics = await adminService.getAnalytics(token)
			setAnalytics(updatedAnalytics)
		} catch (err: any) {
			showNotification({
				message: err.message || 'Failed to update status',
				type: 'error',
			})
		} finally {
			setActionLoading(false)
		}
	}

	const openStatusModal = (event: AdminEvent) => {
		setSelectedEvent(event)
		setNewStatus('live')
		setShowStatusModal(true)
	}

	const closeStatusModal = () => {
		setShowStatusModal(false)
		setSelectedEvent(null)
	}

	const filteredEvents = events.filter((event) => {
		const matchesSearch =
			event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
			event.host.name.toLowerCase().includes(searchQuery.toLowerCase())

		const matchesStatus =
			selectedStatus === 'all' || event.status === selectedStatus

		return matchesSearch && matchesStatus
	})

	if (authLoading || loading) {
		return (
			<div className='min-h-screen bg-black'>
				<Navbar />
				<div className='flex items-center justify-center min-h-[60vh]'>
					<div className='text-center'>
						<Loader2
							className='animate-spin text-gold mx-auto mb-4'
							size={32}
						/>
						<p className='text-gray-400'>
							Loading admin dashboard...
						</p>
					</div>
				</div>
			</div>
		)
	}

	if (!user || user.role !== 'Admin') {
		return null
	}

	return (
		<div className='min-h-screen bg-black'>
			<Navbar />

			<div className='max-w-7xl mx-auto px-4 md:px-8 py-8'>
				{/* Header */}
				<div className='mb-8'>
					<h1 className='text-3xl md:text-4xl font-bold text-white mb-2'>
						Admin Dashboard
					</h1>
					<p className='text-gray-400'>
						Manage events and monitor platform analytics
					</p>
				</div>

				{/* Analytics Cards */}
				{analytics && (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8'>
						{/* Total Events */}
						<div className='bg-neutral-900 rounded-lg border border-neutral-800 p-6'>
							<div className='flex items-center justify-between mb-4'>
								<h3 className='text-sm font-medium text-gray-400'>
									Total Events
								</h3>
								<Calendar className='text-blue-500' size={20} />
							</div>
							<p className='text-3xl font-bold text-white'>
								{analytics.totalEvents}
							</p>
							<p className='text-xs text-gray-400 mt-2'>
								All time
							</p>
						</div>

						{/* Live Events */}
						<div className='bg-neutral-900 rounded-lg border border-neutral-800 p-6'>
							<div className='flex items-center justify-between mb-4'>
								<h3 className='text-sm font-medium text-gray-400'>
									Live Events
								</h3>
								<TrendingUp
									className='text-green-500'
									size={20}
								/>
							</div>
							<p className='text-3xl font-bold text-white'>
								{analytics.totalLiveEvents}
							</p>
							<p className='text-xs text-gray-400 mt-2'>
								Currently active
							</p>
						</div>

						{/* Tickets Sold */}
						<div className='bg-neutral-900 rounded-lg border border-neutral-800 p-6'>
							<div className='flex items-center justify-between mb-4'>
								<h3 className='text-sm font-medium text-gray-400'>
									Tickets Sold
								</h3>
								<Users className='text-purple-500' size={20} />
							</div>
							<p className='text-3xl font-bold text-white'>
								{analytics.totalTicketsSold}
							</p>
							<p className='text-xs text-gray-400 mt-2'>
								{analytics.totalTransactions} transactions
							</p>
						</div>

						{/* Total Revenue */}
						<div className='bg-neutral-900 rounded-lg border border-neutral-800 p-6'>
							<div className='flex items-center justify-between mb-4'>
								<h3 className='text-sm font-medium text-gray-400'>
									Revenue
								</h3>
								<DollarSign
									className='text-yellow-500'
									size={20}
								/>
							</div>
							<p className='text-3xl font-bold text-white'>
								₦
								{(analytics.totalAmountEarned / 1000).toFixed(
									1,
								)}
								k
							</p>
							<p className='text-xs text-gray-400 mt-2'>
								{analytics.totalAmountEarned.toLocaleString()}{' '}
								NGN
							</p>
						</div>

						{/* Status Breakdown */}
						<div className='bg-neutral-900 rounded-lg border border-neutral-800 p-6'>
							<div className='mb-4'>
								<h3 className='text-sm font-medium text-gray-400 mb-3'>
									By Status
								</h3>
							</div>
							<div className='space-y-2 text-sm'>
								{analytics.eventsByStatus['Auditing'] && (
									<div className='flex justify-between'>
										<span className='text-gray-400'>
											Auditing
										</span>
										<span className='text-yellow-400 font-semibold'>
											{
												analytics.eventsByStatus[
													'Auditing'
												]
											}
										</span>
									</div>
								)}
								{analytics.eventsByStatus['live'] && (
									<div className='flex justify-between'>
										<span className='text-gray-400'>
											Live
										</span>
										<span className='text-green-400 font-semibold'>
											{analytics.eventsByStatus['live']}
										</span>
									</div>
								)}
								{analytics.eventsByStatus['draft'] && (
									<div className='flex justify-between'>
										<span className='text-gray-400'>
											Draft
										</span>
										<span className='text-gray-400 font-semibold'>
											{analytics.eventsByStatus['draft']}
										</span>
									</div>
								)}
							</div>
						</div>
					</div>
				)}

				{/* Search and Filter */}
				<div className='flex flex-col gap-4 mb-8'>
					<div className='relative'>
						<Search
							className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'
							size={20}
						/>
						<input
							type='text'
							placeholder='Search by event title, venue, or host...'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className='w-full pl-10 pr-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold'
						/>
					</div>

					{/* Status Filter */}
					<div className='flex gap-2 overflow-x-auto pb-2'>
						{[
							'all',
							'draft',
							'Auditing',
							'live',
							'ended',
							'cancelled',
						].map((status) => (
							<button
								key={status}
								onClick={() => setSelectedStatus(status)}
								className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors ${
									selectedStatus === status
										? 'bg-gold text-black'
										: 'bg-neutral-800 text-gray-400 hover:bg-neutral-700'
								}`}
							>
								{status === 'all' ? 'All Events' : status}
							</button>
						))}
					</div>
				</div>

				{/* Events Table */}
				{filteredEvents.length === 0 ? (
					<div className='bg-neutral-900 rounded-lg border border-neutral-800 p-12 text-center'>
						<AlertCircle
							className='mx-auto mb-4 text-gray-500'
							size={48}
						/>
						<h3 className='text-xl font-bold text-white mb-2'>
							No Events Found
						</h3>
						<p className='text-gray-400'>
							{events.length === 0
								? 'No events to manage at the moment'
								: 'No events match your search filters'}
						</p>
					</div>
				) : (
					<div className='space-y-4'>
						{filteredEvents.map((event) => (
							<div
								key={event._id}
								className='bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden hover:border-neutral-700 transition-colors'
							>
								<div className='p-6'>
									<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4'>
										{/* Event Info */}
										<div className='sm:col-span-2'>
											<div className='flex gap-4'>
												{event.host && (
													<div>
														<h3 className='text-lg font-bold text-white mb-1'>
															{event.title}
														</h3>
														<p className='text-sm text-gray-400 mb-1'>
															{event.venue}
														</p>
														<div className='flex items-center gap-2 text-xs text-gray-400'>
															<Clock size={14} />
															{new Date(
																event.date,
															).toLocaleDateString(
																'en-US',
																{
																	year: 'numeric',
																	month: 'short',
																	day: 'numeric',
																	hour: '2-digit',
																	minute: '2-digit',
																},
															)}
														</div>
													</div>
												)}
											</div>
										</div>

										{/* Host Info */}
										<div>
											<p className='text-xs text-gray-400 mb-1'>
												HOST
											</p>
											<p className='text-white font-semibold'>
												{event.host.name}
											</p>
											<p className='text-xs text-gray-400 truncate'>
												{event.host.email}
											</p>
										</div>

										{/* Status */}
										<div>
											<p className='text-xs text-gray-400 mb-1'>
												STATUS
											</p>
											<span
												className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
													STATUS_COLORS[
														event.status as keyof typeof STATUS_COLORS
													]
												}`}
											>
												{event.status}
											</span>
										</div>

										{/* Stats */}
										<div>
											<p className='text-xs text-gray-400 mb-1'>
												STATS
											</p>
											<div className='space-y-1 text-sm'>
												<p className='text-white font-semibold'>
													{event.ticketsSold} /{' '}
													{event.capacity}
												</p>
												<p className='text-gray-400'>
													₦
													{event.totalRevenue.toLocaleString()}
												</p>
											</div>
										</div>
									</div>

									{/* Action Buttons */}
									<div className='flex gap-2 pt-4 border-t border-neutral-800'>
										<button
											onClick={() =>
												openStatusModal(event)
											}
											className='flex-1 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors text-sm'
										>
											<Eye size={16} />
											Change Status
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}

				{/* Pagination */}
				{pagination.totalPages > 1 && (
					<div className='mt-8 flex justify-center gap-2'>
						<button
							onClick={() =>
								handlePageChange(
									Math.max(1, pagination.page - 1),
								)
							}
							disabled={pagination.page === 1 || loading}
							className='px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 text-white rounded-lg transition-colors'
						>
							Previous
						</button>
						<span className='px-4 py-2 text-gray-400'>
							Page {pagination.page} of {pagination.totalPages}
						</span>
						<button
							onClick={() =>
								handlePageChange(
									Math.min(
										pagination.totalPages,
										pagination.page + 1,
									),
								)
							}
							disabled={
								pagination.page === pagination.totalPages ||
								loading
							}
							className='px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 text-white rounded-lg transition-colors'
						>
							Next
						</button>
					</div>
				)}
			</div>

			{/* Status Modal */}
			{showStatusModal && selectedEvent && (
				<div className='fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50'>
					<div className='bg-neutral-900 rounded-lg border border-neutral-800 max-w-md w-full p-6'>
						<h3 className='text-xl font-bold text-white mb-4'>
							Update Event Status
						</h3>

						<div className='mb-6 p-4 bg-neutral-800 rounded-lg'>
							<p className='text-sm text-white font-semibold mb-1'>
								{selectedEvent.title}
							</p>
							<p className='text-xs text-gray-400'>
								Current:{' '}
								<span className='text-yellow-400'>
									{selectedEvent.status}
								</span>
							</p>
						</div>

						<div className='mb-6'>
							<label className='block text-sm font-medium text-gray-300 mb-3'>
								New Status
							</label>
							<div className='space-y-2'>
								{[
									'draft',
									'Auditing',
									'live',
									'ended',
									'cancelled',
								].map((status) => (
									<button
										key={status}
										onClick={() =>
											setNewStatus(
												status as
													| 'draft'
													| 'Auditing'
													| 'live'
													| 'ended'
													| 'cancelled',
											)
										}
										className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
											newStatus === status
												? 'bg-gold text-black'
												: 'bg-neutral-800 text-white hover:bg-neutral-700'
										}`}
									>
										{status}
									</button>
								))}
							</div>
						</div>

						<div className='flex gap-3'>
							<button
								onClick={closeStatusModal}
								disabled={actionLoading}
								className='flex-1 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors'
							>
								Cancel
							</button>
							<button
								onClick={() =>
									handleStatusChange(selectedEvent._id)
								}
								disabled={
									actionLoading ||
									newStatus === selectedEvent.status
								}
								className='flex-1 px-4 py-2 bg-gold hover:bg-yellow-500 disabled:opacity-50 text-black rounded-lg font-medium flex items-center justify-center gap-2 transition-colors'
							>
								{actionLoading ? (
									<>
										<Loader2
											className='animate-spin'
											size={16}
										/>
										Updating...
									</>
								) : (
									<>
										<CheckCircle size={16} />
										Update
									</>
								)}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
