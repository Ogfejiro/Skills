export interface Referral {
	_id: string
	refereeName?: string
	refereeEmail?: string
	amountEarned: number
	currency?: 'USD' | 'NGN'
	status?: 'pending' | 'paid'
	createdAt: string
}

export interface ReferralSummary {
	refId: string
	totalReferrals: number
	totalEarned: number
	currency: 'USD' | 'NGN'
	referrals: Referral[]
}

export interface ReferralResponse {
	success: boolean
	data: ReferralSummary
}

export interface ReferralWithdrawalPayload {
	amount: number
	method: 'bank' | 'crypto'
	paymentInfo: {
		bankName?: string
		accountName?: string
		accountNo?: string
		walletAddress?: string
	}
}

class ReferralService {
	private baseUrl =
		process.env.NEXT_PUBLIC_API_URL || 'https://skills-k6pv.onrender.com'

	async getMyReferrals(token: string): Promise<ReferralResponse> {
		const response = await fetch(`${this.baseUrl}/api/referrals`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})

		if (!response.ok) {
			const error = await response.json().catch(() => ({}))
			throw new Error(error.message || 'Failed to fetch referrals')
		}

		return response.json()
	}

	async requestWithdrawal(
		payload: ReferralWithdrawalPayload,
		token: string,
	): Promise<{ success: boolean; message: string }> {
		const response = await fetch(
			`${this.baseUrl}/api/referrals/withdrawal`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(payload),
			},
		)

		if (!response.ok) {
			const error = await response.json().catch(() => ({}))
			throw new Error(error.message || 'Failed to request withdrawal')
		}

		return response.json()
	}
}

export default new ReferralService()
