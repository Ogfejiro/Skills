'use client'

import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
	Loader2,
	Ticket,
	Calendar,
	CreditCard,
	MapPin,
	Zap,
	ArrowRight,
	TrendingUp,
	Clock,
	Search,
} from 'lucide-react'
import Link from 'next/link'
import DashboardSidebar from '@/components/DashboardSidebar'
import eventService from '@/app/services/eventService'
import { toast } from 'sonner'

export default function UserDashboard() {
	const {
		user,
		isAuthenticated,
		loading: authLoading,
		token,
		hostProfile: hostProfileCache,
	} = useAuth()
	const router = useRouter()
	const [loading, setLoading] = useState(true)
	const [upcomingEvents, setUpcomingEvents] = useState<any[]>([])
	const [myTickets, setMyTickets] = useState<any[]>([])
	const [eventsLoading, setEventsLoading] = useState(true)
	const [showHostModal, setShowHostModal] = useState(false)
	const [checkingHost, setCheckingHost] = useState(false)

	const hasHostProfile = hostProfileCache.hasProfile

	useEffect(() => {
		if (!authLoading && !isAuthenticated) {
			router.push('/auth/login')
		} else if (user && user.role === 'Admin') {
			router.push('/dashboard/admin')
		} else if (!authLoading) {
			loadDashboardData()
		}
	}, [authLoading, isAuthenticated, user, router])

	const loadDashboardData = async () => {
		try {
			setEventsLoading(true)
			const res = await eventService.getPublicEvents(1, 6)
			if (res?.data?.events) {
				setUpcomingEvents(
					Array.isArray(res.data.events) ? res.data.events : [],
				)
			}
			setMyTickets([])
		} catch (error) {
			toast.error('Failed to load dashboard data')
		} finally {
			setEventsLoading(false)
			setLoading(false)
		}
	}

	const handleSwitchToHost = () => {
		if (hasHostProfile) {
			router.push('/dashboard/host')
		} else {
			setShowHostModal(true)
		}
	}

	const handleCreateHostProfile = () => {
		setCheckingHost(true)
		router.push('/dashboard/host-settings?create=true')
	}

	const getGreeting = () => {
		const hour = new Date().getHours()
		if (hour < 12) return 'Good morning'
		if (hour < 17) return 'Good afternoon'
		return 'Good evening'
	}

	if (authLoading) {
		return (
			<div className='min-h-screen bg-[#0a0a0f] flex items-center justify-center'>
				<Loader2 className='w-10 h-10 text-[#c9a227] animate-spin' />
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
					<div className='mb-8'>
						<p className='text-sm text-gray-500 mb-1'>
							{getGreeting()},
						</p>
						<h1 className='text-2xl sm:text-3xl font-bold'>
							Welcome back,{' '}
							<span className='text-[#c9a227]'>
								{user.firstName}
							</span>
						</h1>
						<p className='text-gray-500 text-sm mt-1'>
							Here&apos;s what&apos;s happening with your events
						</p>
					</div>

					{/* Stats */}
					<div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
						<div className='bg-[#111118] rounded-xl border border-white/[0.06] p-5 hover:border-[#c9a227]/20 transition'>
							<div className='flex items-center justify-between mb-3'>
								<div className='p-2 rounded-lg bg-[#c9a227]/10'>
									<Ticket className='w-4 h-4 text-[#c9a227]' />
								</div>
								<TrendingUp className='w-4 h-4 text-green-500' />
							</div>
							<p className='text-2xl font-bold'>
								{myTickets.length}
							</p>
							<p className='text-xs text-gray-500 mt-1'>
								My Tickets
							</p>
						</div>

						<div className='bg-[#111118] rounded-xl border border-white/[0.06] p-5 hover:border-purple-500/20 transition'>
							<div className='flex items-center justify-between mb-3'>
								<div className='p-2 rounded-lg bg-purple-500/10'>
									<Calendar className='w-4 h-4 text-purple-400' />
								</div>
								<Clock className='w-4 h-4 text-purple-400' />
							</div>
							<p className='text-2xl font-bold'>
								{upcomingEvents.length}
							</p>
							<p className='text-xs text-gray-500 mt-1'>
								Upcoming Events
							</p>
						</div>

						<div className='bg-[#111118] rounded-xl border border-white/[0.06] p-5 hover:border-emerald-500/20 transition'>
							<div className='flex items-center justify-between mb-3'>
								<div className='p-2 rounded-lg bg-emerald-500/10'>
									<CreditCard className='w-4 h-4 text-emerald-400' />
								</div>
							</div>
							<p className='text-2xl font-bold text-[#c9a227]'>
								$0.00
							</p>
							<p className='text-xs text-gray-500 mt-1'>
								Total Spent
							</p>
						</div>

						<div className='bg-[#111118] rounded-xl border border-white/[0.06] p-5 hover:border-blue-500/20 transition'>
							<div className='flex items-center justify-between mb-3'>
								<div className='p-2 rounded-lg bg-blue-500/10'>
									<Zap className='w-4 h-4 text-blue-400' />
								</div>
							</div>
							<button
								onClick={handleSwitchToHost}
								disabled={checkingHost}
								className='text-sm font-semibold text-purple-400 hover:text-purple-300 transition flex items-center gap-1'
							>
								{checkingHost ? (
									<Loader2 className='w-4 h-4 animate-spin' />
								) : (
									<>
										{hasHostProfile
											? 'Switch to Host'
											: 'Become a Host'}
										<ArrowRight className='w-3.5 h-3.5' />
									</>
								)}
							</button>
							<p className='text-xs text-gray-500 mt-1'>
								{hasHostProfile
									? 'Go to host dashboard'
									: 'Start hosting events'}
							</p>
						</div>
					</div>

					{/* Upcoming Events */}
					<div className='mb-8'>
						<div className='flex items-center justify-between mb-5'>
							<h2 className='text-lg font-semibold'>
								Upcoming Events
							</h2>
							<Link
								href='/events'
								className='text-sm text-[#c9a227] font-medium hover:underline flex items-center gap-1'
							>
								View all <ArrowRight className='w-3.5 h-3.5' />
							</Link>
						</div>

						{eventsLoading ? (
							<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
								{[1, 2, 3].map((i) => (
									<div
										key={i}
										className='bg-[#111118] rounded-xl border border-white/[0.06] overflow-hidden animate-pulse'
									>
										<div className='h-36 bg-white/[0.04]' />
										<div className='p-4 space-y-2'>
											<div className='h-4 bg-white/[0.06] rounded w-3/4' />
											<div className='h-3 bg-white/[0.04] rounded w-1/2' />
										</div>
									</div>
								))}
							</div>
						) : upcomingEvents.length > 0 ? (
							<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
								{upcomingEvents.map((event) => (
									<div
										key={event._id}
										className='group bg-[#111118] rounded-xl border border-white/[0.06] overflow-hidden hover:border-[#c9a227]/20 transition'
									>
										{event.banner ? (
											<div className='relative h-36 overflow-hidden'>
												<img
													src={event.banner}
													alt={event.title}
													className='w-full h-full object-cover group-hover:scale-105 transition duration-300'
												/>
												<div className='absolute inset-0 bg-gradient-to-t from-[#111118] via-transparent to-transparent' />
											</div>
										) : (
											<div className='h-36 bg-gradient-to-br from-[#c9a227]/10 to-[#111118] flex items-center justify-center'>
												<Calendar className='w-8 h-8 text-[#c9a227]/30' />
											</div>
										)}
										<div className='p-4'>
											<h3 className='font-semibold text-sm text-white mb-2 line-clamp-1'>
												{event.title}
											</h3>
											<div className='space-y-1.5 text-xs text-gray-500'>
												{event.date && (
													<div className='flex items-center gap-2'>
														<Calendar className='w-3.5 h-3.5 text-[#c9a227]/60' />
														{new Date(
															event.date,
														).toLocaleDateString(
															'en-US',
															{
																month: 'short',
																day: 'numeric',
																year: 'numeric',
															},
														)}
													</div>
												)}
												{event.venue && (
													<div className='flex items-center gap-2'>
														<MapPin className='w-3.5 h-3.5 text-[#c9a227]/60' />
														<span className='line-clamp-1'>
															{event.venue}
														</span>
													</div>
												)}
											</div>
											<Link
												href='/events'
												className='mt-3 w-full block text-center py-2 bg-[#c9a227] text-black text-xs font-semibold rounded-lg hover:bg-[#d4b84a] transition'
											>
												View Details
											</Link>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className='text-center py-12 bg-[#111118] rounded-xl border border-white/[0.06]'>
								<Search className='w-10 h-10 text-gray-700 mx-auto mb-3' />
								<p className='text-gray-500 text-sm mb-3'>
									No upcoming events yet
								</p>
								<Link
									href='/events'
									className='inline-block px-5 py-2 bg-[#c9a227] text-black text-sm font-semibold rounded-lg hover:bg-[#d4b84a] transition'
								>
									Browse Events
								</Link>
							</div>
						)}
					</div>

					{/* Quick Actions */}
					<div>
						<h2 className='text-lg font-semibold mb-5'>
							Quick Actions
						</h2>
						<div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
							<Link
								href='/events'
								className='flex flex-col items-center justify-center p-5 bg-[#111118] border border-white/[0.06] rounded-xl hover:border-[#c9a227]/20 transition group'
							>
								<div className='p-2.5 rounded-lg bg-[#c9a227]/10 mb-2.5 group-hover:bg-[#c9a227]/15 transition'>
									<Calendar className='w-5 h-5 text-[#c9a227]' />
								</div>
								<span className='text-xs font-medium text-gray-400 group-hover:text-white transition'>
									Browse Events
								</span>
							</Link>
							<Link
								href='/tickets'
								className='flex flex-col items-center justify-center p-5 bg-[#111118] border border-white/[0.06] rounded-xl hover:border-purple-500/20 transition group'
							>
								<div className='p-2.5 rounded-lg bg-purple-500/10 mb-2.5 group-hover:bg-purple-500/15 transition'>
									<Ticket className='w-5 h-5 text-purple-400' />
								</div>
								<span className='text-xs font-medium text-gray-400 group-hover:text-white transition'>
									My Tickets
								</span>
							</Link>
							<Link
								href='/dashboard/user/settings'
								className='flex flex-col items-center justify-center p-5 bg-[#111118] border border-white/[0.06] rounded-xl hover:border-blue-500/20 transition group'
							>
								<div className='p-2.5 rounded-lg bg-blue-500/10 mb-2.5 group-hover:bg-blue-500/15 transition'>
									<Zap className='w-5 h-5 text-blue-400' />
								</div>
								<span className='text-xs font-medium text-gray-400 group-hover:text-white transition'>
									Settings
								</span>
							</Link>
							<a
								href='https://t.me/Lofte3'
								target='_blank'
								rel='noopener noreferrer'
								className='flex flex-col items-center justify-center p-5 bg-[#111118] border border-white/[0.06] rounded-xl hover:border-emerald-500/20 transition group'
							>
								<div className='p-2.5 rounded-lg bg-emerald-500/10 mb-2.5 group-hover:bg-emerald-500/15 transition'>
									<Search className='w-5 h-5 text-emerald-400' />
								</div>
								<span className='text-xs font-medium text-gray-400 group-hover:text-white transition'>
									Support
								</span>
							</a>
						</div>
					</div>
				</div>
			</main>

			{/* Create Host Profile Modal */}
			{showHostModal && (
				<div className='fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
					<div className='bg-[#111118] border border-white/[0.08] rounded-2xl p-8 max-w-md w-full'>
						<div className='w-14 h-14 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-5'>
							<Zap className='w-7 h-7 text-purple-400' />
						</div>
						<h2 className='text-xl font-bold text-center mb-2'>
							Ready to Host Events?
						</h2>
						<p className='text-gray-400 text-sm text-center mb-6'>
							You don&apos;t have a host profile yet. Create one
							to start hosting and managing your events with
							LOFTE-3.
						</p>
						<div className='flex flex-col gap-3'>
							<button
								onClick={handleCreateHostProfile}
								disabled={checkingHost}
								className='w-full px-4 py-3 bg-[#c9a227] text-black font-bold rounded-lg hover:bg-[#d4b84a] disabled:opacity-50 transition text-sm'
							>
								{checkingHost
									? 'Setting up...'
									: 'Create Host Profile'}
							</button>
							<button
								onClick={() => setShowHostModal(false)}
								className='w-full px-4 py-3 bg-white/5 text-white border border-white/[0.08] rounded-lg hover:bg-white/10 transition text-sm'
							>
								Maybe Later
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
