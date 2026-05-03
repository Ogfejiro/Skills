export interface HostProfile {
	_id: string
	hostId: string
	role?: string
	email?: string
	phone?: string
	refId?: string
	firstName?: string
	lastName?: string
	profession?: string
	emailVerified?: boolean
	phoneVerified?: boolean
	address?: string
	organization?: string
	bankName?: string
	accountNo?: string
	accountName?: string
	walletAddress?: string
	walletType?: string
	walletSet: boolean
	balance: number
	revenue: number
	conversionRate: number
	socials?: {
		twitter?: string
		instagram?: string
		facebook?: string
		linkedin?: string
		website?: string
	}
	createdAt: string
	updatedAt: string
}

export interface UpdateProfileData {
	phone?: string
	refId?: string
	firstName?: string
	lastName?: string
	profession?: string
	address?: string
	organization?: string
	bankName?: string
	accountNo?: string
	accountName?: string
	conversionRate?: number
	socials?: {
		twitter?: string
		instagram?: string
		facebook?: string
		linkedin?: string
		website?: string
	}
}

export interface SetWalletData {
	walletAddress: string
	walletType: string
}

export interface ProfileResponse {
	success: boolean
	data: HostProfile
}

class HostProfileService {
	private baseUrl =
		process.env.NEXT_PUBLIC_API_URL || 'https://skills-k6pv.onrender.com'

	async getProfile(token: string): Promise<ProfileResponse> {
		try {
			console.log('👤 Fetching host profile')

			const response = await fetch(`${this.baseUrl}/api/host/profile`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			})

			if (!response.ok) {
				const error = await response.json()
				console.error('❌ Get profile error:', error)
				throw new Error(error.message || 'Failed to fetch profile')
			}

			const result = await response.json()
			console.log('✅ Profile fetched successfully:', result.data)
			return result
		} catch (error) {
			console.error('❌ Get profile service error:', error)
			throw error
		}
	}

	async updateProfile(
		data: UpdateProfileData,
		token: string,
	): Promise<ProfileResponse> {
		try {
			console.log('✏️ Updating host profile:', data)

			const response = await fetch(`${this.baseUrl}/api/host/profile`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(data),
			})

			if (!response.ok) {
				const error = await response.json()
				console.error('❌ Update profile error:', error)
				throw new Error(error.message || 'Failed to update profile')
			}

			const result = await response.json()
			console.log('✅ Profile updated successfully:', result.data)
			return result
		} catch (error) {
			console.error('❌ Update profile service error:', error)
			throw error
		}
	}

	async setWallet(
		data: SetWalletData,
		token: string,
	): Promise<ProfileResponse> {
		try {
			console.log('💰 Setting wallet:', data.walletType)

			const response = await fetch(`${this.baseUrl}/api/host/profile`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(data),
			})

			if (!response.ok) {
				const error = await response.json()
				console.error('❌ Set wallet error:', error)
				throw new Error(error.message || 'Failed to set wallet')
			}

			const result = await response.json()
			console.log('✅ Wallet set successfully')
			return result
		} catch (error) {
			console.error('❌ Set wallet service error:', error)
			throw error
		}
	}

	async requestWithdrawal(
		amount: number,
		token: string,
		options?: {
			method?: 'bank' | 'crypto'
			paymentInfo?: {
				bankName?: string
				accountName?: string
				accountNo?: string
				walletType?: string
				walletAddress?: string
			}
		},
	): Promise<{ success: boolean; message: string }> {
		try {
			console.log('💸 Requesting withdrawal:', amount)

			const response = await fetch(
				`${this.baseUrl}/api/host/withdrawal`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						amount,
						method: options?.method,
						paymentInfo: options?.paymentInfo,
					}),
				},
			)

			if (!response.ok) {
				const error = await response.json()
				console.error('❌ Withdrawal error:', error)
				throw new Error(error.message || 'Failed to request withdrawal')
			}

			const result = await response.json()
			console.log('✅ Withdrawal requested successfully')
			return result
		} catch (error) {
			console.error('❌ Withdrawal service error:', error)
			throw error
		}
	}
}

export default new HostProfileService()
