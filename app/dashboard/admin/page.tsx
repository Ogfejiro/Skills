'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import DashboardSidebar from '@/components/DashboardSidebar'
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
	ChevronLeft,
	ChevronRight,
	BarChart3,
	Ticket,
	MapPin,
	XCircle,
	FileText,
	Shield,
	Activity,
} from 'lucide-react'
import { toast } from 'sonner'

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; dot?: string }> = {
	draft: { label: 'Draft', color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20' },
	Auditing: { label: 'In Review', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', dot: 'bg-amber-400' },
	live: { label: 'Live', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', dot: 'bg-emerald-400' },
	ended: { label: 'Ended', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
	cancelled: { label: 'Cancelled', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
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
	const [showDetailModal, setShowDetailModal] = useState(false)
	const [newStatus, setNewStatus] = useState<'draft' | 'Auditing' | 'live' | 'ended' | 'cancelled'>('live')
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

			setEvents(normalizeEventsResponse(eventsData))
			setPagination({
				page: eventsData.page ?? 1,
				limit: eventsData.limit ?? 10,
				totalEvents: eventsData.Total ?? 0,
				totalPages: eventsData.totalPages ?? 1,
			})
			setAnalytics(analyticsData)
		} catch (err: any) {
			toast.error(err.message || 'Failed to load dashboard')
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
			setEvents(normalizeEventsResponse(eventsData))
			setPagination({
				page: eventsData.page ?? page,
				limit: eventsData.limit ?? 10,
				totalEvents: eventsData.Total ?? 0,
				totalPages: eventsData.totalPages ?? 1,
			})
		} catch (err: any) {
			toast.error(err.message || 'Failed to load events')
		} finally {
			setLoading(false)
		}
	}

	const handleUpdateStatus = async () => {
		if (!selectedEvent || !token) return
		try {
			setActionLoading(true)
			await adminService.updateEventStatus(selectedEvent._id, newStatus, token)
			toast.success(`Event status updated to ${STATUS_CONFIG[newStatus]?.label || newStatus}`)
			setShowStatusModal(false)
			loadDashboard()
		} catch (err: any) {
			toast.error(err.message || 'Failed to update status')
		} finally {
			setActionLoading(false)
		}
	}

	const filteredEvents = (events ?? []).filter((event) => {
		const q = searchQuery.toLowerCase()
		const matchesSearch =
			!q ||
			event.title?.toLowerCase().includes(q) ||
			event.venue?.toLowerCase().includes(q) ||
			event.host?.name?.toLowerCase().includes(q)

		const matchesStatus = selectedStatus === 'all' || event.status === selectedStatus
		return matchesSearch && matchesStatus
	})

	const getStatusBadge = (status: string) => {
		const config = STATUS_CONFIG[status] || STATUS_CONFIG.ended
		return (
			<span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${config.bg} ${config.color} ${config.border}`}>
				{config.dot && <span className={`w-1.5 h-1.5 rounded-full ${config.dot} ${status === 'live' ? 'animate-pulse' : ''}`} />}
				{config.label}
			</span>
		)
	}

	const formatDate = (dateString: string) => {
		if (!dateString) return 'TBA'
		return new Date(dateString).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		})
	}

	const formatCurrency = (amount: number) => {
		return `\u20a6${(amount || 0).toLocaleString()}`
	}

	const getGreeting = () => {
		const hour = new Date().getHours()
		if (hour < 12) return 'Good morning'
		if (hour < 17) return 'Good afternoon'
		return 'Good evening'
	}

	// Stats derived from analytics with safe fallbacks
	const statsCards = analytics
		? [
				{
					label: 'Total Events',
					value: analytics.totalEvents || 0,
					icon: <Calendar className='w-5 h-5' />,
					iconColor: 'text-[#c9a227]',
					borderHover: 'hover:border-[#c9a227]/20',
				},
				{
					label: 'Live Events',
					value: analytics.totalLiveEvents || 0,
					icon: <Activity className='w-5 h-5' />,
					iconColor: 'text-emerald-400',
					borderHover: 'hover:border-emerald-500/20',
					dot: true,
				},
				{
					label: 'Tickets Sold',
					value: analytics.totalTicketsSold || 0,
					icon: <Ticket className='w-5 h-5' />,
					iconColor: 'text-purple-400',
					borderHover: 'hover:border-purple-500/20',
				},
				{
					label: 'Revenue',
					value: formatCurrency(analytics.totalAmountEarned || 0),
					icon: <DollarSign className='w-5 h-5' />,
					iconColor: 'text-emerald-400',
					borderHover: 'hover:border-emerald-500/20',
					isString: true,
				},
				{
					label: 'Transactions',
					value: analytics.totalTransactions || 0,
					icon: <TrendingUp className='w-5 h-5' />,
					iconColor: 'text-blue-400',
					borderHover: 'hover:border-blue-500/20',
				},
			]
		: []

	// Status breakdown from analytics
	const statusBreakdown = analytics?.eventsByStatus
		? Object.entries(analytics.eventsByStatus).map(([status, count]) => ({
				status,
				count: count as number,
				config: STATUS_CONFIG[status] || STATUS_CONFIG.ended,
			}))
		: []

	if (authLoading) {
		return (
			<div className='min-h-screen bg-[#0a0a0f] flex items-center justify-center'>
				<Loader2 className='w-10 h-10 text-[#c9a227] animate-spin' />
			</div>
		)
	}

	if (!user || user.role !== 'Admin') return null

	return (
		<div className='min-h-screen bg-[#0a0a0f] text-white flex'>
			<DashboardSidebar />

			<main className='flex-1 min-h-screen'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16 md:pt-8'>
					{/* Header */}
					<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8'>
						<div>
							<p className='text-sm text-gray-500 mb-1'>{getGreeting()},</p>
							<h1 className='text-2xl sm:text-3xl font-bold'>
								Admin <span className='text-[#c9a227]'>Dashboard</span>
							</h1>
							<p className='text-gray-500 text-sm mt-1'>Manage and monitor all platform events</p>
						</div>
						<div className='flex items-center gap-2'>
							<div className='px-3 py-1.5 bg-[#c9a227]/10 border border-[#c9a227]/20 rounded-lg flex items-center gap-2'>
								<Shield className='w-4 h-4 text-[#c9a227]' />
								<span className='text-xs font-semibold text-[#c9a227]'>Admin</span>
							</div>
						</div>
					</div>

					{/* Stats Cards */}
					{loading ? (
						<div className='grid grid-cols-2 lg:grid-cols-5 gap-3 mb-8'>
							{[1, 2, 3, 4, 5].map((i) => (
								<div key={i} className='bg-[#111118] rounded-xl border border-white/[0.06] p-4 animate-pulse'>
									<div className='h-3 bg-white/[0.06] rounded w-16 mb-3' />
									<div className='h-7 bg-white/[0.06] rounded w-12' />
								</div>
							))}
						</div>
					) : (
						<div className='grid grid-cols-2 lg:grid-cols-5 gap-3 mb-8'>
							{statsCards.map((card, i) => (
								<div key={i} className={`bg-[#111118] rounded-xl border border-white/[0.06] p-4 transition ${card.borderHover}`}>
									<div className='flex items-center justify-between mb-2'>
										<p className='text-xs text-gray-500'>{card.label}</p>
										<span className={card.iconColor}>
											{card.dot ? (
												<span className='w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block' />
											) : (
												card.icon
											)}
										</span>
									</div>
									<p className='text-2xl font-bold'>{card.isString ? card.value : (card.value as number).toLocaleString()}</p>
								</div>
							))}
						</div>
					)}

					{/* Status Breakdown Bar */}
					{!loading && statusBreakdown.length > 0 && (
						<div className='bg-[#111118] rounded-xl border border-white/[0.06] p-5 mb-8'>
							<h3 className='text-sm font-semibold text-gray-400 mb-4 flex items-center gap-2'>
								<BarChart3 className='w-4 h-4 text-[#c9a227]' />
								Event Status Breakdown
							</h3>
							<div className='flex gap-2 mb-3 h-2 rounded-full overflow-hidden bg-white/[0.04]'>
								{statusBreakdown.map(({ status, count, config }) => {
									const total = analytics?.totalEvents || 1
									const pct = (count / total) * 100
									if (pct === 0) return null
									return (
										<div
											key={status}
											className={`h-full rounded-full transition-all ${
												status === 'live' ? 'bg-emerald-500' :
												status === 'Auditing' ? 'bg-amber-500' :
												status === 'draft' ? 'bg-gray-500' :
												status === 'ended' ? 'bg-blue-500' :
												'bg-red-500'
											}`}
											style={{ width: `${Math.max(pct, 2)}%` }}
											title={`${config.label}: ${count}`}
										/>
									)
								})}
							</div>
							<div className='flex flex-wrap gap-4'>
								{statusBreakdown.map(({ status, count, config }) => (
									<button
										key={status}
										onClick={() => setSelectedStatus(selectedStatus === status ? 'all' : status)}
										className={`flex items-center gap-2 text-xs transition-all px-2 py-1 rounded-md ${
											selectedStatus === status
												? `${config.bg} ${config.color} border ${config.border}`
												: 'text-gray-500 hover:text-gray-300'
										}`}
									>
										<span className={`w-2 h-2 rounded-full ${
											status === 'live' ? 'bg-emerald-400' :
											status === 'Auditing' ? 'bg-amber-400' :
											status === 'draft' ? 'bg-gray-400' :
											status === 'ended' ? 'bg-blue-400' :
											'bg-red-400'
										}`} />
										<span className='font-medium'>{config.label}</span>
										<span className='font-bold'>{count}</span>
									</button>
								))}
							</div>
						</div>
					)}

					{/* Search & Filter */}
					<div className='mb-6 flex flex-col sm:flex-row gap-3'>
						<div className='flex-1 relative'>
							<Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4' />
							<input
								type='text'
								placeholder='Search events, venues, or hosts...'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className='w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#111118] border border-white/[0.08] text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#c9a227]/50 focus:ring-1 focus:ring-[#c9a227]/30 transition'
							/>
						</div>
						<div className='flex gap-1.5 flex-wrap'>
							{['all', 'draft', 'Auditing', 'live', 'ended', 'cancelled'].map((status) => {
								const config = STATUS_CONFIG[status]
								const isActive = selectedStatus === status
								return (
									<button
										key={status}
										onClick={() => setSelectedStatus(status)}
										className={`px-3 py-2 text-xs font-medium rounded-lg transition ${
											isActive
												? 'bg-[#c9a227]/15 text-[#c9a227] border border-[#c9a227]/20'
												: 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent'
										}`}
									>
										{status === 'all' ? 'All' : config?.label || status}
									</button>
								)
							})}
						</div>
					</div>

					{/* Events List */}
					{loading ? (
						<div className='bg-[#111118] rounded-xl border border-white/[0.06] overflow-hidden'>
							<div className='p-5 border-b border-white/[0.06]'>
								<div className='h-5 bg-white/[0.06] rounded w-40 animate-pulse' />
							</div>
							{[1, 2, 3, 4].map((i) => (
								<div key={i} className='p-5 border-b border-white/[0.04] animate-pulse'>
									<div className='flex items-center gap-4'>
										<div className='w-12 h-12 bg-white/[0.06] rounded-lg flex-shrink-0' />
										<div className='flex-1'>
											<div className='h-4 bg-white/[0.06] rounded w-1/3 mb-2' />
											<div className='h-3 bg-white/[0.04] rounded w-1/4' />
										</div>
										<div className='h-6 bg-white/[0.06] rounded-full w-16' />
									</div>
								</div>
							))}
						</div>
					) : (
						<div className='bg-[#111118] rounded-xl border border-white/[0.06] overflow-hidden'>
							<div className='p-5 border-b border-white/[0.06] flex items-center justify-between'>
								<h2 className='text-lg font-semibold flex items-center gap-2'>
									<FileText className='w-5 h-5 text-[#c9a227]' />
									All Events
									<span className='text-sm font-normal text-gray-500'>({pagination.totalEvents})</span>
								</h2>
							</div>

							{filteredEvents.length === 0 ? (
								<div className='p-12 text-center'>
									<AlertCircle className='w-10 h-10 text-gray-700 mx-auto mb-3' />
									<p className='text-gray-500 text-sm'>
										{searchQuery ? 'No events match your search' : 'No events found'}
									</p>
								</div>
							) : (
								<>
									<div className='divide-y divide-white/[0.04]'>
										{filteredEvents.map((event) => (
											<div key={event._id} className='p-4 sm:p-5 hover:bg-white/[0.02] transition group'>
												<div className='flex items-start gap-4'>
													{/* Banner thumbnail */}
													{event.banner ? (
														<div className='w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border border-white/[0.06]'>
															<img
																src={event.banner}
																alt={event.title}
																className='w-full h-full object-cover'
															/>
														</div>
													) : (
														<div className='w-14 h-14 rounded-lg bg-white/[0.04] flex items-center justify-center flex-shrink-0'>
															<Calendar className='w-5 h-5 text-gray-600' />
														</div>
													)}

													{/* Event info */}
													<div className='flex-1 min-w-0'>
														<div className='flex items-start justify-between gap-3'>
															<div className='min-w-0'>
																<h3 className='font-semibold text-sm text-white truncate'>{event.title}</h3>
																<div className='flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-gray-500'>
																	<span className='flex items-center gap-1.5'>
																		<Calendar className='w-3 h-3' />
																		{formatDate(event.date)}
																	</span>
																	<span className='flex items-center gap-1.5'>
																		<MapPin className='w-3 h-3' />
																		<span className='truncate max-w-[120px]'>{event.venue}</span>
																	</span>
																	<span className='flex items-center gap-1.5'>
																		<Users className='w-3 h-3' />
																		{event.host?.name || 'Unknown Host'}
																	</span>
																</div>
															</div>
															{getStatusBadge(event.status)}
														</div>

														{/* Stats row */}
														<div className='flex items-center gap-4 mt-3'>
															<span className='text-xs text-gray-500'>
																<span className='text-white font-medium'>{event.ticketsSold || 0}</span>/{event.capacity} tickets
															</span>
															<span className='text-xs text-gray-500'>
																Revenue: <span className='text-emerald-400 font-medium'>{formatCurrency(event.totalRevenue)}</span>
															</span>
															{event.category && (
																<span className='px-2 py-0.5 text-[10px] bg-white/[0.04] text-gray-400 rounded'>
																	{event.category}
																</span>
															)}
														</div>
													</div>

													{/* Actions */}
													<div className='flex gap-1.5 flex-shrink-0'>
														<button
															onClick={() => {
																setSelectedEvent(event)
																setShowDetailModal(true)
															}}
															className='p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition'
															title='View Details'
														>
															<Eye className='w-4 h-4' />
														</button>
														<button
															onClick={() => {
																setSelectedEvent(event)
																setNewStatus(event.status as any)
																setShowStatusModal(true)
															}}
															className='p-2 text-[#c9a227] hover:bg-[#c9a227]/10 rounded-lg transition'
															title='Change Status'
														>
															<CheckCircle className='w-4 h-4' />
														</button>
													</div>
												</div>
											</div>
										))}
									</div>

									{/* Pagination */}
									<div className='px-5 py-4 border-t border-white/[0.06] flex items-center justify-between'>
										<p className='text-xs text-gray-500'>
											Page {pagination.page} of {pagination.totalPages}
											<span className='hidden sm:inline'> &middot; {pagination.totalEvents} total events</span>
										</p>
										<div className='flex gap-1.5'>
											<button
												onClick={() => handlePageChange(pagination.page - 1)}
												disabled={pagination.page === 1}
												className='p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition'
											>
												<ChevronLeft className='w-4 h-4' />
											</button>
											{/* Page numbers */}
											{Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
												let pageNum: number
												if (pagination.totalPages <= 5) {
													pageNum = i + 1
												} else if (pagination.page <= 3) {
													pageNum = i + 1
												} else if (pagination.page >= pagination.totalPages - 2) {
													pageNum = pagination.totalPages - 4 + i
												} else {
													pageNum = pagination.page - 2 + i
												}
												return (
													<button
														key={pageNum}
														onClick={() => handlePageChange(pageNum)}
														className={`w-8 h-8 rounded-lg text-xs font-medium transition ${
															pagination.page === pageNum
																? 'bg-[#c9a227]/15 text-[#c9a227] border border-[#c9a227]/20'
																: 'text-gray-500 hover:text-white hover:bg-white/5'
														}`}
													>
														{pageNum}
													</button>
												)
											})}
											<button
												onClick={() => handlePageChange(pagination.page + 1)}
												disabled={pagination.page === pagination.totalPages}
												className='p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition'
											>
												<ChevronRight className='w-4 h-4' />
											</button>
										</div>
									</div>
								</>
							)}
						</div>
					)}
				</div>
			</main>

			{/* Event Detail Modal */}
			{showDetailModal && selectedEvent && (
				<div className='fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
					<div className='bg-[#111118] border border-white/[0.08] rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto'>
						{/* Banner */}
						{selectedEvent.banner && (
							<div className='relative h-40 overflow-hidden rounded-t-2xl'>
								<img
									src={selectedEvent.banner}
									alt={selectedEvent.title}
									className='w-full h-full object-cover'
								/>
								<div className='absolute inset-0 bg-gradient-to-t from-[#111118] via-transparent to-transparent' />
								<button
									onClick={() => setShowDetailModal(false)}
									className='absolute top-3 right-3 p-1.5 bg-black/50 rounded-full text-white hover:bg-black/70 transition'
								>
									<XCircle className='w-5 h-5' />
								</button>
							</div>
						)}

						<div className='p-6'>
							{!selectedEvent.banner && (
								<div className='flex justify-end mb-2'>
									<button
										onClick={() => setShowDetailModal(false)}
										className='p-1 text-gray-500 hover:text-white transition'
									>
										<XCircle className='w-5 h-5' />
									</button>
								</div>
							)}

							<div className='flex items-start justify-between gap-3 mb-4'>
								<h2 className='text-xl font-bold'>{selectedEvent.title}</h2>
								{getStatusBadge(selectedEvent.status)}
							</div>

							<div className='space-y-3 mb-6'>
								<div className='flex items-center gap-3 text-sm text-gray-400'>
									<Calendar className='w-4 h-4 text-[#c9a227]' />
									{formatDate(selectedEvent.date)}
								</div>
								<div className='flex items-center gap-3 text-sm text-gray-400'>
									<MapPin className='w-4 h-4 text-[#c9a227]' />
									{selectedEvent.venue}
								</div>
								<div className='flex items-center gap-3 text-sm text-gray-400'>
									<Users className='w-4 h-4 text-[#c9a227]' />
									Hosted by {selectedEvent.host?.name || 'Unknown'}
									{selectedEvent.host?.organization && (
										<span className='text-gray-600'>({selectedEvent.host.organization})</span>
									)}
								</div>
							</div>

							{/* Stats grid */}
							<div className='grid grid-cols-3 gap-3 mb-6'>
								<div className='bg-white/[0.03] rounded-lg p-3 text-center'>
									<p className='text-lg font-bold'>{selectedEvent.ticketsSold || 0}</p>
									<p className='text-[10px] text-gray-500 uppercase tracking-wider'>Sold</p>
								</div>
								<div className='bg-white/[0.03] rounded-lg p-3 text-center'>
									<p className='text-lg font-bold'>{selectedEvent.capacity}</p>
									<p className='text-[10px] text-gray-500 uppercase tracking-wider'>Capacity</p>
								</div>
								<div className='bg-white/[0.03] rounded-lg p-3 text-center'>
									<p className='text-lg font-bold text-emerald-400'>{formatCurrency(selectedEvent.totalRevenue)}</p>
									<p className='text-[10px] text-gray-500 uppercase tracking-wider'>Revenue</p>
								</div>
							</div>

							{selectedEvent.category && (
								<div className='flex items-center gap-2 mb-6'>
									<span className='px-2.5 py-1 text-xs bg-white/[0.04] text-gray-300 rounded-md border border-white/[0.06]'>
										{selectedEvent.category}
									</span>
								</div>
							)}

							{/* Action buttons */}
							<div className='flex gap-3'>
								<button
									onClick={() => {
										setShowDetailModal(false)
										setNewStatus(selectedEvent.status as any)
										setShowStatusModal(true)
									}}
									className='flex-1 px-4 py-2.5 bg-[#c9a227] text-black font-bold rounded-lg hover:bg-[#d4b84a] transition text-sm'
								>
									Change Status
								</button>
								<button
									onClick={() => setShowDetailModal(false)}
									className='px-4 py-2.5 bg-white/5 border border-white/[0.08] rounded-lg hover:bg-white/10 transition text-sm'
								>
									Close
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Status Update Modal */}
			{showStatusModal && selectedEvent && (
				<div className='fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
					<div className='bg-[#111118] border border-white/[0.08] rounded-2xl p-6 sm:p-8 max-w-md w-full'>
						<div className='w-12 h-12 bg-[#c9a227]/10 rounded-full flex items-center justify-center mx-auto mb-4'>
							<CheckCircle className='w-6 h-6 text-[#c9a227]' />
						</div>
						<h2 className='text-xl font-bold text-center mb-1'>Update Event Status</h2>
						<p className='text-sm text-gray-500 text-center mb-6'>
							<span className='text-white font-medium'>{selectedEvent.title}</span>
						</p>

						<div className='space-y-2 mb-6'>
							{(['draft', 'Auditing', 'live', 'ended', 'cancelled'] as const).map((status) => {
								const config = STATUS_CONFIG[status]
								const isSelected = newStatus === status
								const isCurrent = selectedEvent.status === status
								return (
									<button
										key={status}
										onClick={() => setNewStatus(status)}
										className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition border ${
											isSelected
												? 'bg-[#c9a227]/15 border-[#c9a227]/30 text-[#c9a227]'
												: 'bg-white/[0.02] border-white/[0.06] text-gray-400 hover:bg-white/[0.04] hover:text-white'
										}`}
									>
										<span className='flex items-center gap-2'>
											{config.dot && <span className={`w-2 h-2 rounded-full ${config.dot}`} />}
											{config.label}
										</span>
										{isCurrent && (
											<span className='text-[10px] text-gray-600 uppercase tracking-wider'>Current</span>
										)}
									</button>
								)
							})}
						</div>

						{newStatus === 'live' && (
							<div className='p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 mb-4'>
								<p className='text-xs text-emerald-400'>This will make the event publicly visible and open for ticket purchases.</p>
							</div>
						)}

						{newStatus === 'cancelled' && (
							<div className='p-3 rounded-lg bg-red-500/5 border border-red-500/10 mb-4'>
								<p className='text-xs text-red-400'>This will cancel the event. Ticket holders may need to be notified.</p>
							</div>
						)}

						<div className='flex gap-3'>
							<button
								onClick={() => setShowStatusModal(false)}
								disabled={actionLoading}
								className='flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 border border-white/[0.08] hover:bg-white/5 transition disabled:opacity-50'
							>
								Cancel
							</button>
							<button
								onClick={handleUpdateStatus}
								disabled={actionLoading || newStatus === selectedEvent.status}
								className='flex-1 px-4 py-2.5 rounded-lg text-sm font-bold bg-[#c9a227] text-black hover:bg-[#d4b84a] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
							>
								{actionLoading ? (
									<>
										<Loader2 className='w-4 h-4 animate-spin' />
										Updating...
									</>
								) : (
									'Update Status'
								)}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
