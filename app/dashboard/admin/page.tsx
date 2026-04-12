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
		<div className='min-h-screen bg-black'>
			<Navbar />

			<div className='max-w-7xl mx-auto px-4 py-8'>
				<h1 className='text-3xl font-bold text-white mb-6'>
					Admin Dashboard
				</h1>

				{/* EVENTS */}
				{filteredEvents.length === 0 ? (
					<div className='text-gray-400 text-center py-12'>
						No events found
					</div>
				) : (
					filteredEvents.map((event) => (
						<div
							key={event._id}
							className='bg-neutral-900 p-4 rounded-lg mb-4'
						>
							<h2 className='text-white font-bold'>
								{event.title}
							</h2>
							<p className='text-gray-400'>{event.venue}</p>

							<span
								className={`text-xs px-2 py-1 rounded ${
									STATUS_COLORS[event.status]
								}`}
							>
								{event.status}
							</span>
						</div>
					))
				)}
			</div>
		</div>
	)
}
