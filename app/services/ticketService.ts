export type Currency = 'NGN' | 'USD'

export interface TicketData {
	title: string
	description?: string
	price: number
	quantity: number
	benefits: string[] // ✅ REQUIRED now (matches backend)
	maxPerUser?: number
	currency: Currency // ✅ REQUIRED + supports both
}

export interface Ticket {
	_id: string
	eventId: string
	title: string
	description?: string
	price: number
	quantity: number
	benefits: string[]
	maxPerUser?: number
	currency: Currency // ✅ strict typing
	sold: number
	createdAt: string
	updatedAt: string
}

export interface CreateTicketResponse {
	status: string
	data: Ticket
}

export interface GetTicketsResponse {
	success: boolean
	data: Ticket[]
}

class TicketService {
	private baseUrl =
		process.env.NEXT_PUBLIC_API_URL || 'https://skills-k6pv.onrender.com'

	async createTicket(
		eventId: string,
		ticketData: TicketData,
		token: string,
	): Promise<CreateTicketResponse> {
		try {
			console.log('🎫 Creating ticket for event:', eventId)

			const response = await fetch(
				`${this.baseUrl}/api/tickets/${eventId}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(ticketData),
				},
			)

			if (!response.ok) {
				const error = await response.json()
				console.error('❌ Create ticket error:', error)
				throw new Error(error.message || 'Failed to create ticket')
			}

			const result = await response.json()
			console.log('✅ Ticket created successfully:', result.data)
			return result
		} catch (error) {
			console.error('❌ Create ticket service error:', error)
			throw error
		}
	}

	async getEventTickets(
		eventId: string,
		token: string,
	): Promise<GetTicketsResponse> {
		try {
			console.log('🎫 Fetching tickets for event:', eventId)

			const response = await fetch(
				`${this.baseUrl}/api/tickets/${eventId}`,
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
				console.error('❌ Get tickets error:', error)
				throw new Error(error.message || 'Failed to fetch tickets')
			}

			const result = await response.json()
			console.log('Full ticket response:', result)

			// Handle different backend response structures
			let ticketsData: Ticket[] = []

			if (Array.isArray(result)) {
				ticketsData = result
			} else if (result.data && Array.isArray(result.data)) {
				ticketsData = result.data
			} else if (result.tickets && Array.isArray(result.tickets)) {
				ticketsData = result.tickets
			}

			console.log('✅ Tickets fetched successfully:', ticketsData)

			return {
				success: true,
				data: ticketsData,
			}
		} catch (error) {
			console.error('❌ Get tickets service error:', error)
			throw error
		}
	}
	async getEventTicketsPublic(eventId: string): Promise<GetTicketsResponse> {
		try {
			console.log('🎫 Fetching tickets for event:', eventId)

			const response = await fetch(
				`${this.baseUrl}/api/tickets/${eventId}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				},
			)

			if (!response.ok) {
				const error = await response.json()
				console.error('❌ Get tickets error:', error)
				throw new Error(error.message || 'Failed to fetch tickets')
			}

			const result = await response.json()
			console.log('Full ticket response:', result)

			// Handle different backend response structures
			let ticketsData: Ticket[] = []

			if (Array.isArray(result)) {
				ticketsData = result
			} else if (result.data && Array.isArray(result.data)) {
				ticketsData = result.data
			} else if (result.tickets && Array.isArray(result.tickets)) {
				ticketsData = result.tickets
			}

			console.log('✅ Tickets fetched successfully:', ticketsData)

			return {
				success: true,
				data: ticketsData,
			}
		} catch (error) {
			console.error('❌ Get tickets service error:', error)
			throw error
		}
	}

	async updateTicket(
		ticketId: string,
		ticketData: Partial<TicketData>,
		token: string,
	): Promise<CreateTicketResponse> {
		try {
			console.log('✏️ Updating ticket:', ticketId)

			const response = await fetch(
				`${this.baseUrl}/api/tickets/${ticketId}`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(ticketData),
				},
			)

			if (!response.ok) {
				const error = await response.json()
				console.error('❌ Update ticket error:', error)
				throw new Error(error.message || 'Failed to update ticket')
			}

			const result = await response.json()
			console.log('✅ Ticket updated successfully:', result.data)
			return result
		} catch (error) {
			console.error('❌ Update ticket service error:', error)
			throw error
		}
	}

	async deleteTicket(
		ticketId: string,
		token: string,
	): Promise<{ success: boolean; message: string }> {
		try {
			console.log('🗑️ Deleting ticket:', ticketId)

			const response = await fetch(
				`${this.baseUrl}/api/tickets/${ticketId}`,
				{
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				},
			)

			if (!response.ok) {
				const error = await response.json()
				console.error('❌ Delete ticket error:', error)
				throw new Error(error.message || 'Failed to delete ticket')
			}

			console.log('✅ Ticket deleted successfully')

			return {
				success: true,
				message: 'Ticket deleted',
			}
		} catch (error) {
			console.error('❌ Delete ticket service error:', error)
			throw error
		}
	}
}

export default new TicketService()
