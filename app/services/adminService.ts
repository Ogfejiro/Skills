// app/services/adminService.ts - Admin API Service
export interface AdminEvent {
	_id: string
	title: string
	date: string
	venue: string
	status: 'draft' | 'Auditing' | 'live' | 'ended' | 'cancelled'
	category: string
	capacity: number
	ticketsSold: number
	totalRevenue: number
	banner?: string
	host: {
		_id: string
		name: string
		email: string
		organization: string
	}
}

export interface EventWithDetails extends AdminEvent {
	description: string
	banner: string
	ticketsAvailable: number
	ticketsRemaining: number
	totalTransactions: number
	ticketDetails: any[]
	createdAt: string
	updatedAt: string
}

export interface Analytics {
	totalEvents: number
	totalLiveEvents: number
	totalTicketsSold: number
	totalAmountEarned: number
	totalTransactions: number
	eventsByStatus: Record<string, number>
}

export interface GetAllEventsResponse {
	data: AdminEvent[]
	page: number
	limit: number
	Total: number
	totalEvents: number
	totalPages: number
}

export interface SearchEventsResponse {
	events: AdminEvent[]
	page: number
	limit: number
	total: number
	totalPages: number
}

class AdminService {
	private baseUrl =
		process.env.NEXT_PUBLIC_API_URL || 'https://skills-k6pv.onrender.com'

	/**
	 * Get all events with statistics
	 */
	async getAllEvents(
		page: number = 1,
		limit: number = 10,
		token: string,
	): Promise<GetAllEventsResponse> {
		try {
			console.log(
				`📊 Fetching admin events: page=${page}, limit=${limit}`,
			)

			const response = await fetch(
				`${this.baseUrl}/api/admin?page=${page}&limit=${limit}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				},
			)

			if (!response.ok) {
				const error = await response.json()
				throw new Error(error.message || 'Failed to fetch events')
			}

			const result = await response.json()
			console.log(`✅ Got ${result.data.events.length} events`)
			return result.data
		} catch (error) {
			console.error('❌ Error fetching admin events:', error)
			throw error
		}
	}

	/**
	 * Get platform analytics
	 */
	async getAnalytics(token: string): Promise<Analytics> {
		try {
			console.log('📈 Fetching platform analytics')

			const response = await fetch(
				`${this.baseUrl}/api/admin/stats/analytics`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				},
			)

			if (!response.ok) {
				const error = await response.json()
				throw new Error(error.message || 'Failed to fetch analytics')
			}

			const result = await response.json()
			console.log('✅ Analytics fetched successfully')
			return result.data
		} catch (error) {
			console.error('❌ Error fetching analytics:', error)
			throw error
		}
	}

	/**
	 * Update event status
	 */
	async updateEventStatus(
		eventId: string,
		newStatus: 'draft' | 'Auditing' | 'live' | 'ended' | 'cancelled',
		token: string,
	): Promise<EventWithDetails> {
		try {
			console.log(`🔄 Updating event ${eventId} status to ${newStatus}`)

			const response = await fetch(
				`${this.baseUrl}/api/admin/${eventId}/status`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ status: newStatus }),
				},
			)

			if (!response.ok) {
				const error = await response.json()
				throw new Error(
					error.message || 'Failed to update event status',
				)
			}

			const result = await response.json()
			console.log(`✅ Event status updated to ${newStatus}`)
			return result.data
		} catch (error) {
			console.error('❌ Error updating event status:', error)
			throw error
		}
	}

	/**
	 * Get detailed event information
	 */
	async getEventDetails(
		eventId: string,
		token: string,
	): Promise<EventWithDetails> {
		try {
			console.log(`📋 Fetching event details for ${eventId}`)

			const response = await fetch(
				`${this.baseUrl}/api/admin/${eventId}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				},
			)

			if (!response.ok) {
				const error = await response.json()
				throw new Error(
					error.message || 'Failed to fetch event details',
				)
			}

			const result = await response.json()
			console.log('✅ Event details fetched')
			return result.data
		} catch (error) {
			console.error('❌ Error fetching event details:', error)
			throw error
		}
	}

	/**
	 * Search events by title or status
	 */
	async searchEvents(
		searchTerm: string,
		page: number = 1,
		limit: number = 10,
		token: string,
	): Promise<SearchEventsResponse> {
		try {
			console.log(
				`🔍 Searching events: term="${searchTerm}", page=${page}, limit=${limit}`,
			)

			const response = await fetch(
				`${this.baseUrl}/api/admin/search?searchTerm=${encodeURIComponent(searchTerm)}&page=${page}&limit=${limit}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				},
			)

			if (!response.ok) {
				const error = await response.json()
				throw new Error(error.message || 'Search failed')
			}

			const result = await response.json()
			console.log(
				`✅ Search returned ${result.data.events.length} results`,
			)
			return result.data
		} catch (error) {
			console.error('❌ Error searching events:', error)
			throw error
		}
	}
}

export default new AdminService()
