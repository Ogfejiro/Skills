'use client'

import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
	Loader2,
	Calendar,
	DollarSign,
	PlusCircle,
	Edit,
	Trash2,
	Eye,
	Clock,
	TrendingUp,
	MapPin,
	Users,
	ArrowRight,
	BarChart3,
	AlertCircle,
} from 'lucide-react'
import Link from 'next/link'
import DashboardSidebar from '@/components/DashboardSidebar'
import eventService, { Event } from '@/app/services/eventService'
import hostProfileService, { HostProfile } from '@/app/services/hostProfileService'
import { toast } from 'sonner'

interface HostStats {
	totalEvents: number
	liveEvents: number
	pendingEvents: number
	totalBalance: number
	revenue: number
}

export default function HostDashboard() {
	const { user, isAuthenticated, loading: authLoading, token } = useAuth()
	const router = useRouter()
	const [loading, setLoading] = useState(true)
	const [events, setEvents] = useState<Event[]>([])
	const [stats, setStats] = useState<HostStats>({
		totalEvents: 0,
		liveEvents: 0,
		pendingEvents: 0,
		totalBalance: 0,
		revenue: 0,
	})
	const [hostProfile, setHostProfile] = useState<HostProfile | null>(null)
	const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
	const [showWithdrawalModal, setShowWithdrawalModal] = useState(false)
	const [withdrawalAmount, setWithdrawalAmount] = useState('')
	const [withdrawalLoading, setWithdrawalLoading] = useState(false)
	const [filterStatus, setFilterStatus] = useState<string>('all')

	useEffect(() => {
		if (!authLoading && !isAuthenticated) {
			router.push('/auth/login')
		} else if (user && user.role !== 'Host' && user.role !== 'Admin') {
			router.push('/dashboard/user')
		} else if (token) {
			fetchHostData()
		}
	}, [authLoading, isAuthenticated, user, router, token])

	const fetchHostData = async () => {
		try {
			setLoading(true)
			if (!token) throw new Error('No authentication token')

			const response = await eventService.getHostEvents(token, 1, 100)
			if (response.success && response.data.events) {
				setEvents(response.data.events)

				const liveCount = response.data.events.filter((e) => e.status === 'live').length
				const pendingCount = response.data.events.filter((e) => e.status === 'draft' || e.status === 'Auditing').length

				const profileResponse = await hostProfileService.getProfile(token)
				if (profileResponse.success && profileResponse.data) {
					setHostProfile(profileResponse.data)
					setStats({
						totalEvents: response.data.events.length,
						liveEvents: liveCount,
						pendingEvents: pendingCount,
						totalBalance: profileResponse.data.balance || 0,
						revenue: profileResponse.data.balance || 0,
					})
				} else {
					setStats({
						totalEvents: response.data.events.length,
						liveEvents: liveCount,
						pendingEvents: pendingCount,
						totalBalance: 0,
						revenue: 0,
					})
				}
			}
		} catch (err) {
			console.error('Error fetching host data:', err)
			toast.error('Failed to load host dashboard')
		} finally {
			setLoading(false)
		}
	}

	const handleDeleteEvent = async (eventId: string) => {
		if (!window.confirm('Are you sure you want to delete this event?')) return

		try {
			setDeleteLoading(eventId)
			if (!token) throw new Error('No authentication token')

			await eventService.deleteEvent(eventId, token)
			setEvents(events.filter((e) => e._id !== eventId))
			setStats((prev) => ({ ...prev, totalEvents: prev.totalEvents - 1 }))
			toast.success('Event deleted successfully')
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed to delete event')
		} finally {
			setDeleteLoading(null)
		}
	}

	const handleWithdrawal = async () => {
		try {
			const amount = parseFloat(withdrawalAmount)

			if (!amount || amount <= 0) {
				toast.error('Please enter a valid amount')
				return
			}

			if (amount < 5000) {
				toast.error('Minimum withdrawal amount is \u20a65,000')
				return
			}

			if (amount > stats.totalBalance) {
				toast.error(`Insufficient balance. Your balance is \u20a6${stats.totalBalance.toLocaleString()}`)
				return
			}

			setWithdrawalLoading(true)
			if (!token) throw new Error('No authentication token')

			const response = await hostProfileService.requestWithdrawal(amount, token)

			if (response.success) {
				toast.success('Withdrawal request submitted! You will receive your funds within 24-48 hours.')
				setShowWithdrawalModal(false)
				setWithdrawalAmount('')
				fetchHostData()
			}
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed to process withdrawal')
		} finally {
			setWithdrawalLoading(false)
		}
	}

	const getStatusBadge = (status: string) => {
		const styles: Record<string, string> = {
			live: 'bg-green-500/10 text-green-400 border-green-500/20',
			draft: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
			Auditing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
			ended: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
			cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
		}
		const labels: Record<string, string> = {
			live: 'Live',
			draft: 'Draft',
			Auditing: 'In Review',
			ended: 'Ended',
			cancelled: 'Cancelled',
		}
		return (
			<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${styles[status] || styles.ended}`}>
				{status === 'live' && <span className='w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5 animate-pulse' />}
				{labels[status] || status}
			</span>
		)
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		})
	}

	const filteredEvents = filterStatus === 'all' ? events : events.filter((e) => e.status === filterStatus)

	const getGreeting = () => {
		const hour = new Date().getHours()
		if (hour < 12) return 'Good morning'
		if (hour < 17) return 'Good afternoon'
		return 'Good evening'
	}

	if (authLoading || loading) {
		return (
			<div className='min-h-screen bg-[#0a0a0f] flex items-center justify-center'>
				<div className='text-center'>
					<Loader2 className='w-10 h-10 text-[#c9a227] animate-spin mx-auto mb-3' />
					<p className='text-gray-500 text-sm'>Loading host dashboard...</p>
				</div>
			</div>
		)
	}

	if (!user) return null

	return (
		<div className='min-h-screen bg-[#0a0a0f] text-white flex'>
			<DashboardSidebar />

			<main className='flex-1 min-h-screen'>
				<div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16 md:pt-8'>
					{/* Header */}
					<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8'>
						<div>
							<p className='text-sm text-gray-500 mb-1'>{getGreeting()},</p>
							<h1 className='text-2xl sm:text-3xl font-bold'>
								Host Dashboard, <span className='text-[#c9a227]'>{user.firstName}</span>
							</h1>
						</div>
						<div className='flex gap-2'>
							<button
								onClick={() => setShowWithdrawalModal(true)}
								className='px-4 py-2 text-sm font-medium border border-emerald-500/30 text-emerald-400 rounded-lg hover:bg-emerald-500/10 transition flex items-center gap-1.5'
							>
								<DollarSign className='w-4 h-4' />
								Withdraw
							</button>
							<Link
								href='/dashboard/events/create'
								className='px-4 py-2 text-sm font-bold bg-[#c9a227] text-black rounded-lg hover:bg-[#d4b84a] transition flex items-center gap-1.5'
							>
								<PlusCircle className='w-4 h-4' />
								Create Event
							</Link>
						</div>
					</div>

					{/* Stats */}
					<div className='grid grid-cols-2 lg:grid-cols-5 gap-3 mb-8'>
						<div className='bg-[#111118] rounded-xl border border-white/[0.06] p-4 hover:border-[#c9a227]/20 transition'>
							<div className='flex items-center justify-between mb-2'>
								<p className='text-xs text-gray-500'>Total Events</p>
								<Calendar className='w-4 h-4 text-[#c9a227]' />
							</div>
							<p className='text-2xl font-bold'>{stats.totalEvents}</p>
						</div>

						<div className='bg-[#111118] rounded-xl border border-white/[0.06] p-4 hover:border-green-500/20 transition'>
							<div className='flex items-center justify-between mb-2'>
								<p className='text-xs text-gray-500'>Live</p>
								<span className='w-2 h-2 rounded-full bg-green-400 animate-pulse' />
							</div>
							<p className='text-2xl font-bold'>{stats.liveEvents}</p>
						</div>

						<div className='bg-[#111118] rounded-xl border border-white/[0.06] p-4 hover:border-yellow-500/20 transition'>
							<div className='flex items-center justify-between mb-2'>
								<p className='text-xs text-gray-500'>Pending</p>
								<Clock className='w-4 h-4 text-yellow-400' />
							</div>
							<p className='text-2xl font-bold'>{stats.pendingEvents}</p>
						</div>

						<div className='bg-[#111118] rounded-xl border border-white/[0.06] p-4 hover:border-emerald-500/20 transition'>
							<div className='flex items-center justify-between mb-2'>
								<p className='text-xs text-gray-500'>Balance</p>
								<DollarSign className='w-4 h-4 text-emerald-400' />
							</div>
							<p className='text-2xl font-bold'>{'\u20a6'}{(stats.totalBalance || 0).toLocaleString()}</p>
						</div>

						<div className='bg-[#111118] rounded-xl border border-white/[0.06] p-4 hover:border-blue-500/20 transition'>
							<div className='flex items-center justify-between mb-2'>
								<p className='text-xs text-gray-500'>Revenue</p>
								<TrendingUp className='w-4 h-4 text-blue-400' />
							</div>
							<p className='text-2xl font-bold'>{'\u20a6'}{(stats.revenue || 0).toLocaleString()}</p>
						</div>
					</div>

					{/* Host Profile Card */}
					{hostProfile && (
						<div className='bg-[#111118] rounded-xl border border-white/[0.06] p-5 mb-8'>
							<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
								<div className='flex items-center gap-4'>
									<div className='w-12 h-12 bg-gradient-to-br from-[#c9a227] to-[#a8861e] rounded-full flex items-center justify-center text-black font-bold text-base flex-shrink-0'>
										{user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
									</div>
									<div>
										<h3 className='font-semibold'>{hostProfile.organization || `${user.firstName} ${user.lastName}`}</h3>
										<div className='flex items-center gap-3 mt-1 text-xs text-gray-500'>
											{hostProfile.walletSet && (
												<span className='inline-flex items-center gap-1 text-emerald-400'>
													<span className='w-1.5 h-1.5 rounded-full bg-emerald-400' />
													Wallet Active
												</span>
											)}
											{hostProfile.bankName && (
												<span className='text-gray-400'>{hostProfile.bankName}</span>
											)}
										</div>
									</div>
								</div>
								<Link
									href='/dashboard/profile'
									className='px-4 py-2 text-sm font-medium text-gray-400 border border-white/[0.08] rounded-lg hover:text-white hover:border-white/20 transition'
								>
									Edit Profile
								</Link>
							</div>
						</div>
					)}

					{/* Events List */}
					<div className='bg-[#111118] rounded-xl border border-white/[0.06] overflow-hidden'>
						<div className='p-5 border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
							<h2 className='text-lg font-semibold flex items-center gap-2'>
								<BarChart3 className='w-5 h-5 text-[#c9a227]' />
								Your Events
							</h2>
							<div className='flex gap-1.5 flex-wrap'>
								{['all', 'live', 'draft', 'Auditing', 'ended'].map((status) => (
									<button
										key={status}
										onClick={() => setFilterStatus(status)}
										className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
											filterStatus === status
												? 'bg-[#c9a227]/15 text-[#c9a227] border border-[#c9a227]/20'
												: 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent'
										}`}
									>
										{status === 'all' ? 'All' : status === 'Auditing' ? 'In Review' : status.charAt(0).toUpperCase() + status.slice(1)}
									</button>
								))}
							</div>
						</div>

						{filteredEvents.length === 0 ? (
							<div className='p-12 text-center'>
								<Calendar className='w-10 h-10 text-gray-700 mx-auto mb-3' />
								<p className='text-gray-500 text-sm mb-4'>
									{filterStatus === 'all' ? 'No events created yet' : `No ${filterStatus} events`}
								</p>
								{filterStatus === 'all' && (
									<Link
										href='/dashboard/events/create'
										className='inline-flex items-center gap-2 px-5 py-2 bg-[#c9a227] text-black text-sm font-bold rounded-lg hover:bg-[#d4b84a] transition'
									>
										<PlusCircle className='w-4 h-4' />
										Create Your First Event
									</Link>
								)}
							</div>
						) : (
							<div className='divide-y divide-white/[0.04]'>
								{filteredEvents.map((event) => (
									<div key={event._id} className='p-4 sm:p-5 hover:bg-white/[0.02] transition'>
										<div className='flex flex-col sm:flex-row items-start justify-between gap-4'>
											<div className='flex-1 min-w-0'>
												<div className='flex items-start gap-3 mb-2'>
													<div className='flex-1 min-w-0'>
														<h3 className='font-semibold text-sm sm:text-base text-white truncate'>{event.title}</h3>
														<div className='flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-gray-500'>
															<span className='flex items-center gap-1.5'>
																<Calendar className='w-3.5 h-3.5' />
																{formatDate(event.date)}
															</span>
															<span className='flex items-center gap-1.5'>
																<MapPin className='w-3.5 h-3.5' />
																{event.venue}
															</span>
															<span className='flex items-center gap-1.5'>
																<Users className='w-3.5 h-3.5' />
																{event.ticketsSold}/{event.capacity}
															</span>
														</div>
													</div>
												</div>
												<div className='flex items-center gap-2 flex-wrap'>
													{getStatusBadge(event.status)}
													{event.category && (
														<span className='px-2 py-0.5 text-[10px] bg-white/[0.04] text-gray-400 rounded'>
															{event.category}
														</span>
													)}
												</div>
											</div>

											<div className='flex gap-1.5 flex-shrink-0'>
												<Link
													href={`/dashboard/events/${event._id}`}
													className='p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition'
													title='View'
												>
													<Eye className='w-4 h-4' />
												</Link>
												<Link
													href={`/dashboard/events/${event._id}/edit`}
													className='p-2 text-[#c9a227] hover:bg-[#c9a227]/10 rounded-lg transition'
													title='Edit'
												>
													<Edit className='w-4 h-4' />
												</Link>
												<button
													onClick={() => handleDeleteEvent(event._id)}
													disabled={deleteLoading === event._id}
													className='p-2 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition disabled:opacity-50'
													title='Delete'
												>
													{deleteLoading === event._id ? (
														<Loader2 className='w-4 h-4 animate-spin' />
													) : (
														<Trash2 className='w-4 h-4' />
													)}
												</button>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</main>

			{/* Withdrawal Modal */}
			{showWithdrawalModal && (
				<div className='fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
					<div className='bg-[#111118] border border-white/[0.08] rounded-2xl p-6 sm:p-8 max-w-md w-full'>
						<div className='w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4'>
							<DollarSign className='w-6 h-6 text-emerald-400' />
						</div>
						<h2 className='text-xl font-bold text-center mb-1'>Withdraw Funds</h2>
						<p className='text-sm text-gray-500 text-center mb-6'>
							Balance: <span className='font-semibold text-[#c9a227]'>{'\u20a6'}{stats.totalBalance.toLocaleString()}</span>
						</p>

						<div className='space-y-4'>
							<div>
								<label className='block text-xs font-medium text-gray-400 mb-1.5'>Amount</label>
								<div className='flex items-center gap-2'>
									<span className='text-gray-500 text-sm'>{'\u20a6'}</span>
									<input
										type='number'
										placeholder='5000'
										value={withdrawalAmount}
										onChange={(e) => setWithdrawalAmount(e.target.value)}
										className='flex-1 px-4 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#c9a227]/50 transition'
										disabled={withdrawalLoading}
									/>
								</div>
								<p className='text-[11px] text-gray-600 mt-1.5'>Minimum: {'\u20a6'}5,000</p>
							</div>

							{withdrawalAmount && parseFloat(withdrawalAmount) < 5000 && parseFloat(withdrawalAmount) > 0 && (
								<div className='flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/15'>
									<AlertCircle className='w-4 h-4 text-red-400 flex-shrink-0' />
									<p className='text-xs text-red-400'>Minimum withdrawal amount is {'\u20a6'}5,000</p>
								</div>
							)}

							{withdrawalAmount && parseFloat(withdrawalAmount) > stats.totalBalance && (
								<div className='flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/15'>
									<AlertCircle className='w-4 h-4 text-red-400 flex-shrink-0' />
									<p className='text-xs text-red-400'>Insufficient balance</p>
								</div>
							)}

							<div className='p-3 rounded-lg bg-blue-500/5 border border-blue-500/10'>
								<p className='text-xs text-blue-400'>Withdrawals are processed within 24-48 hours to your registered bank account.</p>
							</div>
						</div>

						<div className='flex gap-3 mt-6'>
							<button
								onClick={() => {
									setShowWithdrawalModal(false)
									setWithdrawalAmount('')
								}}
								disabled={withdrawalLoading}
								className='flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 border border-white/[0.08] hover:bg-white/5 transition disabled:opacity-50'
							>
								Cancel
							</button>
							<button
								onClick={handleWithdrawal}
								disabled={
									withdrawalLoading ||
									!withdrawalAmount ||
									parseFloat(withdrawalAmount) < 5000 ||
									parseFloat(withdrawalAmount) > stats.totalBalance
								}
								className='flex-1 px-4 py-2.5 rounded-lg text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
							>
								{withdrawalLoading ? (
									<>
										<Loader2 className='w-4 h-4 animate-spin' />
										Processing...
									</>
								) : (
									'Withdraw'
								)}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
