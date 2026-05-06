export interface Referee {
	id: string
	firstName: string
	lastName: string
	email: string
	joinedAt: string
}

export interface Commission {
	id: string
	amount: number
	currency: string
	status: 'pending' | 'qualified' | 'rewarded' | 'void'
	referee: {
		id: string
		firstName: string
		lastName: string
		email: string
	} | null
	createdAt: string
}

export interface ReferralOverview {
	refId: string
	referralWallet: number
	referralEarningsTotal: number
	totalReferred: number
}

export interface RefereeList {
	page: number
	limit: number
	total: number
	totalPages: number
	referees: Referee[]
}

export interface CommissionList {
	page: number
	limit: number
	total: number
	totalPages: number
	entries: Commission[]
}

export interface ReferralOverviewResponse {
	success?: boolean
	refId: string
	referralWallet: number
	referralEarningsTotal: number
	totalReferred: number
}

export interface ReferralWithdrawalPayload {
	amount: number
	method: 'bank' | 'crypto'
	paymentInfo: {
		bankName?: string
		accountName?: string
		accountNo?: string
		walletType?: string
		walletAddress?: string
	}
}

class ReferralService {
	private baseUrl =
		process.env.NEXT_PUBLIC_API_URL || 'https://skills-k6pv.onrender.com'

	async getMyOverview(token: string): Promise<ReferralOverviewResponse> {
		const response = await fetch(`${this.baseUrl}/api/referrals/me`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})

		if (!response.ok) {
			const error = await response.json().catch(() => ({}))
			throw new Error(
				error.message || 'Failed to fetch referral overview',
			)
		}

		return response.json()
	}

	async getMyReferees(
		token: string,
		page: number = 1,
		limit: number = 20,
	): Promise<RefereeList> {
		const params = new URLSearchParams({
			page: page.toString(),
			limit: limit.toString(),
		})

		const response = await fetch(
			`${this.baseUrl}/api/referrals/list?${params.toString()}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			},
		)

		if (!response.ok) {
			const error = await response.json().catch(() => ({}))
			throw new Error(error.message || 'Failed to fetch referees')
		}

		return response.json()
	}

	async getMyCommissions(
		token: string,
		page: number = 1,
		limit: number = 20,
	): Promise<CommissionList> {
		const params = new URLSearchParams({
			page: page.toString(),
			limit: limit.toString(),
		})

		const response = await fetch(
			`${this.baseUrl}/api/referrals/commissions?${params.toString()}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			},
		)

		if (!response.ok) {
			const error = await response.json().catch(() => ({}))
			throw new Error(error.message || 'Failed to fetch commissions')
		}

		return response.json()
	}

	async requestWithdrawal(
		payload: ReferralWithdrawalPayload,
		token: string,
	): Promise<{ success: boolean; message: string }> {
		const response = await fetch(`${this.baseUrl}/api/referrals/withdraw`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(payload),
		})

		if (!response.ok) {
			const error = await response.json().catch(() => ({}))
			throw new Error(error.message || 'Failed to request withdrawal')
		}

		return response.json()
	}
}

export default new ReferralService()
