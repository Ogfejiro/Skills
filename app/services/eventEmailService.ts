export interface EventEmailData {
	subject: string
	htmlContent: string
	isEnabled: boolean
}

export interface EventEmail {
	_id: string
	eventId: string | { _id: string; title?: string; date?: string; venue?: string; status?: string }
	hostId: string
	subject: string
	htmlContent: string
	isEnabled: boolean
	createdAt: string
	updatedAt: string
}

class EventEmailService {
	private baseUrl =
		process.env.NEXT_PUBLIC_API_URL || 'https://skills-k6pv.onrender.com'

	async createEventEmail(
		eventId: string,
		data: EventEmailData,
		token: string,
	): Promise<{ success: boolean; message: string }> {
		const response = await fetch(`${this.baseUrl}/api/email/${eventId}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(data),
		})

		if (!response.ok) {
			const error = await response.json().catch(() => ({}))
			throw new Error(error.message || 'Failed to create event email')
		}

		const result = await response.json()
		return { success: true, message: result.message }
	}

	async getEventEmail(
		eventId: string,
		token: string,
	): Promise<EventEmail | null> {
		const response = await fetch(`${this.baseUrl}/api/email/${eventId}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})

		if (response.status === 404) return null

		if (!response.ok) {
			const error = await response.json().catch(() => ({}))
			throw new Error(error.message || 'Failed to fetch event email')
		}

		return await response.json()
	}

	async updateEventEmail(
		eventId: string,
		data: Partial<EventEmailData>,
		token: string,
	): Promise<EventEmail> {
		const response = await fetch(`${this.baseUrl}/api/email/${eventId}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(data),
		})

		if (!response.ok) {
			const error = await response.json().catch(() => ({}))
			throw new Error(error.message || 'Failed to update event email')
		}

		return await response.json()
	}
}

export default new EventEmailService()
