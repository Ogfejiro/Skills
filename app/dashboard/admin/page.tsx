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

	// ✅ SAFE DEFAULT (prevents crash)
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

	// ✅ NORMALIZER (IMPORTANT)
	const normalizeEventsResponse = (res: any): AdminEvent[] => {
		return res?.events ?? []
	}

	const loadDashboard = async () => {
		try {
			setLoading(true)
			if (!token) throw new Error('No authentication token')

			const [eventsData, analyticsData] = await Promise.all([
				adminService.getAllEvents(1, 10, token),
				adminService.getAnalytics(token),
			])

			const safeEvents = normalizeEventsResponse(eventsData)

			setEvents(safeEvents)

			setPagination({
				page: eventsData.page ?? 1,
				limit: eventsData.limit ?? 10,

				// ⚠️ backend uses "Total" (capital T)
				totalEvents: eventsData.Total ?? 0,

				totalPages: eventsData.totalPages ?? 1,
			})

			setAnalytics(analyticsData)
		} catch (err: any) {
			showNotification({
				message: err.message || 'Failed to load dashboard',
				type: 'error',
			})
			console.error(err)
		} finally {
			setLoading(false)
		}
	}

	const handlePageChange = async (page: number) => {
		try {
			setLoading(true)
			if (!token) throw new Error('No authentication token')

			const eventsData = await adminService.getAllEvents(page, 10, token)

			const safeEvents = normalizeEventsResponse(eventsData)

			setEvents(safeEvents)

			setPagination({
				page: eventsData.page ?? page,
				limit: eventsData.limit ?? 10,
				totalEvents: eventsData.Total ?? 0,
				totalPages: eventsData.totalPages ?? 1,
			})
		} catch (err: any) {
			showNotification({
				message: err.message || 'Failed to load events',
				type: 'error',
			})
		} finally {
			setLoading(false)
		}
	}

	// ✅ SAFE FILTER (prevents crash)
	const filteredEvents = (events ?? []).filter((event) => {
		const matchesSearch =
			event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			event.venue?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			event.host?.name?.toLowerCase().includes(searchQuery.toLowerCase())

		const matchesStatus =
			selectedStatus === 'all' || event.status === selectedStatus

		return matchesSearch && matchesStatus
	})

	if (authLoading || loading) {
		return (
			<div className='min-h-screen bg-black'>
				<Navbar />
				<div className='flex items-center justify-center min-h-[60vh]'>
					<Loader2
						className='animate-spin text-yellow-400'
						size={32}
					/>
				</div>
			</div>
		)
	}

	if (!user || user.role !== 'Admin') return null

	return (
		<div className='min-h-screen bg-black text-white'>
			<Navbar />

			<div className='max-w-7xl mx-auto px-4 pt-24 pb-12'>
				{/* HEADER */}
				<div className='mb-8'>
					<h1 className='text-3xl md:text-4xl font-bold mb-2'>
						Admin Dashboard
					</h1>
					<p className='text-gray-400'>Manage and monitor all events on the platform</p>
				</div>

				{/* STATS */}
				{analytics && (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
						<div className='border border-gold/20 rounded-xl p-6 bg-gray-900/50'>
							<div className='flex items-center justify-between mb-2'>
								<p className='text-gray-400 text-sm'>Total Events</p>
								<Calendar className='w-5 h-5 text-gold' />
							</div>
							<p className='text-2xl font-bold'>{analytics.totalEvents || 0}</p>
						</div>

						<div className='border border-gold/20 rounded-xl p-6 bg-gray-900/50'>
							<div className='flex items-center justify-between mb-2'>
								<p className='text-gray-400 text-sm'>Live Events</p>
								<CheckCircle className='w-5 h-5 text-green-400' />
							</div>
							<p className='text-2xl font-bold'>{analytics.liveEvents || 0}</p>
						</div>

						<div className='border border-gold/20 rounded-xl p-6 bg-gray-900/50'>
							<div className='flex items-center justify-between mb-2'>
								<p className='text-gray-400 text-sm'>Auditing</p>
								<Clock className='w-5 h-5 text-yellow-400' />
							</div>
							<p className='text-2xl font-bold'>{analytics.auditingEvents || 0}</p>
						</div>

						<div className='border border-gold/20 rounded-xl p-6 bg-gray-900/50'>
							<div className='flex items-center justify-between mb-2'>
								<p className='text-gray-400 text-sm'>Total Users</p>
								<Users className='w-5 h-5 text-blue-400' />
							</div>
							<p className='text-2xl font-bold'>{analytics.totalUsers || 0}</p>
						</div>
					</div>
				)}

				{/* SEARCH & FILTER */}
				<div className='mb-6 flex flex-col sm:flex-row gap-4'>
					<div className='flex-1 relative'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5' />
						<input
							type='text'
							placeholder='Search events, venue, or host...'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className='w-full pl-10 pr-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:border-gold focus:outline-none'
						/>
					</div>

					<select
						value={selectedStatus}
						onChange={(e) => setSelectedStatus(e.target.value)}
						className='px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:border-gold focus:outline-none'
					>
						<option value='all'>All Status</option>
						<option value='draft'>Draft</option>
						<option value='Auditing'>Auditing</option>
						<option value='live'>Live</option>
						<option value='ended'>Ended</option>
						<option value='cancelled'>Cancelled</option>
					</select>
				</div>

				{/* EVENTS TABLE */}
				<div className='border border-gray-800 rounded-xl overflow-hidden bg-gray-900/30'>
					{filteredEvents.length === 0 ? (
						<div className='p-12 text-center'>
							<AlertCircle className='w-12 h-12 text-gray-600 mx-auto mb-3' />
							<p className='text-gray-400'>No events found</p>
						</div>
					) : (
						<>
							<div className='overflow-x-auto'>
								<table className='w-full'>
									<thead className='border-b border-gray-800 bg-gray-900/50'>
										<tr>
											<th className='px-6 py-4 text-left text-sm font-semibold text-gray-300'>Event</th>
											<th className='px-6 py-4 text-left text-sm font-semibold text-gray-300'>Host</th>
											<th className='px-6 py-4 text-left text-sm font-semibold text-gray-300'>Date</th>
											<th className='px-6 py-4 text-left text-sm font-semibold text-gray-300'>Status</th>
											<th className='px-6 py-4 text-left text-sm font-semibold text-gray-300'>Actions</th>
										</tr>
									</thead>
									<tbody>
										{filteredEvents.map((event) => (
											<tr key={event._id} className='border-b border-gray-800 hover:bg-gray-800/30 transition'>
												<td className='px-6 py-4'>
													<div className='flex items-center gap-3'>
														{event.banner && (
															<img
																src={event.banner}
																alt={event.title}
																className='w-10 h-10 rounded object-cover'
															/>
														)}
														<div>
															<p className='font-medium text-white truncate'>{event.title}</p>
															<p className='text-xs text-gray-500'>{event.venue}</p>
														</div>
													</div>
												</td>
												<td className='px-6 py-4 text-sm text-gray-300'>
													{event.host?.name || 'N/A'}
												</td>
												<td className='px-6 py-4 text-sm text-gray-400'>
													{event.date
														? new Date(event.date).toLocaleDateString()
														: 'TBA'}
												</td>
												<td className='px-6 py-4'>
													{getStatusBadge(event.status)}
												</td>
												<td className='px-6 py-4'>
													<button
														onClick={() => {
															setSelectedEvent(event)
															setNewStatus(event.status as any)
															setShowStatusModal(true)
														}}
														className='px-3 py-1 text-xs font-medium bg-gold/20 text-gold rounded hover:bg-gold/30 transition'
													>
														Change Status
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>

							{/* PAGINATION */}
							<div className='px-6 py-4 border-t border-gray-800 flex items-center justify-between'>
								<p className='text-sm text-gray-400'>
									Page {pagination.page} of {pagination.totalPages} ({pagination.totalEvents} total events)
								</p>
								<div className='flex gap-2'>
									<button
										onClick={() => handlePageChange(pagination.page - 1)}
										disabled={pagination.page === 1}
										className='px-3 py-1 text-sm rounded bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition'
									>
										Previous
									</button>
									<button
										onClick={() => handlePageChange(pagination.page + 1)}
										disabled={pagination.page === pagination.totalPages}
										className='px-3 py-1 text-sm rounded bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition'
									>
										Next
									</button>
								</div>
							</div>
						</>
					)}
				</div>

				{/* STATUS MODAL */}
				{showStatusModal && selectedEvent && (
					<div className='fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
						<div className='bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-md w-full'>
							<h2 className='text-xl font-bold mb-4'>Change Event Status</h2>
							<p className='text-gray-400 text-sm mb-4'>
								Event: <span className='text-white font-medium'>{selectedEvent.title}</span>
							</p>

							<div className='space-y-3 mb-6'>
								{(['draft', 'Auditing', 'live', 'ended', 'cancelled'] as const).map((status) => (
									<button
										key={status}
										onClick={() => setNewStatus(status)}
										className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition ${
											newStatus === status
												? 'bg-gold text-black'
												: 'bg-gray-800 text-gray-300 hover:bg-gray-700'
										}`}
									>
										{status.charAt(0).toUpperCase() + status.slice(1)}
									</button>
								))}
							</div>

							<div className='flex gap-3'>
								<button
									onClick={() => setShowStatusModal(false)}
									className='flex-1 px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition font-medium'
								>
									Cancel
								</button>
								<button
									onClick={async () => {
										try {
											setActionLoading(true)
											await adminService.updateEventStatus(
												selectedEvent._id,
												newStatus,
												token!
											)
											showNotification({
												message: 'Event status updated successfully',
												type: 'success',
											})
											loadDashboard()
											setShowStatusModal(false)
										} catch (err: any) {
											showNotification({
												message: err.message || 'Failed to update status',
												type: 'error',
											})
										} finally {
											setActionLoading(false)
										}
									}}
									disabled={actionLoading}
									className='flex-1 px-4 py-2 rounded-lg bg-gold text-black hover:bg-yellow-400 transition font-medium disabled:opacity-50'
								>
									{actionLoading ? (
										<Loader2 className='w-4 h-4 animate-spin mx-auto' />
									) : (
										'Update'
									)}
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
