'use client'

import { useAuth } from '@/app/context/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
	Loader2,
	Save,
	ArrowLeft,
	Wallet,
	Globe,
	Twitter,
	Instagram,
	Facebook,
	Linkedin,
} from 'lucide-react'
import Link from 'next/link'
import DashboardSidebar from '@/components/DashboardSidebar'
import hostProfileService from '@/app/services/hostProfileService'
import { toast } from 'sonner'

export default function HostSettingsPage() {
	const {
		user,
		isAuthenticated,
		loading: authLoading,
		token,
		hostProfile: hostProfileCache,
		refreshHostProfile,
	} = useAuth()
	const router = useRouter()
	const searchParams = useSearchParams()
	const isCreating = searchParams.get('create') === 'true'

	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [hostProfile, setHostProfile] = useState<any>(null)
	const walletType: 'solana' = 'solana'

	const [formData, setFormData] = useState({
		organization: '',
		address: '',
		bankName: '',
		accountName: '',
		accountNo: '',
		walletAddress: '',
		conversionRate: 1400,
		socials: {
			twitter: '',
			instagram: '',
			facebook: '',
			linkedin: '',
			website: '',
		},
	})

	useEffect(() => {
		if (authLoading) return

		if (!isAuthenticated) {
			router.push('/auth/login')
			return
		}

		if (isCreating && hostProfileCache.hasProfile) {
			router.push('/dashboard/host')
			return
		}

		if (isCreating) {
			setLoading(false)
			return
		}

		if (hostProfileCache.hasProfile) {
			loadHostProfile()
			return
		}

		if (hostProfileCache.lastChecked > 0) {
			router.push('/dashboard/user')
			return
		}

		if (token) {
			refreshHostProfile()
		}
	}, [
		authLoading,
		isAuthenticated,
		token,
		isCreating,
		hostProfileCache.hasProfile,
		hostProfileCache.lastChecked,
	])

	const loadHostProfile = async () => {
		try {
			setLoading(true)
			const response = await hostProfileService.getProfile(token!)
			if (response.success && response.data) {
				setHostProfile(response.data)

				// Ensure socials object has all required fields as strings
				const socials = {
					twitter: response.data.socials?.twitter ?? '',
					instagram: response.data.socials?.instagram ?? '',
					facebook: response.data.socials?.facebook ?? '',
					linkedin: response.data.socials?.linkedin ?? '',
					website: response.data.socials?.website ?? '',
				}

				setFormData({
					organization: response.data.organization || '',
					address: response.data.address || '',
					bankName: response.data.bankName || '',
					accountName: response.data.accountName || '',
					accountNo: response.data.accountNo || '',
					walletAddress: response.data.walletAddress || '',
					conversionRate: response.data.conversionRate || 1400,
					socials,
				})
			}
		} catch (error: any) {
			toast.error('Failed to load host profile')
			if (!isCreating) {
				router.push('/dashboard/host')
			}
		} finally {
			setLoading(false)
		}
	}

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target
		if (name.startsWith('socials.')) {
			const field = name.split('.')[1]
			setFormData({
				...formData,
				socials: {
					...formData.socials,
					[field]: value,
				},
			})
		} else {
			setFormData({
				...formData,
				[name]:
					name === 'conversionRate'
						? parseFloat(value) || 1400
						: value,
			})
		}
	}

	const handleSaveProfile = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!token) {
			toast.error('Session expired. Please login again.')
			router.push('/auth/login')
			return
		}

		if (!formData.organization.trim()) {
			toast.error('Organization name is required')
			return
		}

		try {
			setSaving(true)
			const profileData = {
				organization: formData.organization,
				address: formData.address,
				bankName: formData.bankName,
				accountName: formData.accountName,
				accountNo: formData.accountNo,
				conversionRate: formData.conversionRate,
				socials: formData.socials,
			}

			if (isCreating) {
				const createPayload = formData.walletAddress
					? {
							...profileData,
							walletAddress: formData.walletAddress,
							walletType: walletType,
						}
					: profileData

				await hostProfileService.createProfile(
					createPayload,
					token,
				)
			} else {
				await hostProfileService.updateProfile(profileData, token)

				// Set wallet if it's new or changed
				if (formData.walletAddress) {
					await hostProfileService.setWallet(
						{
							walletAddress: formData.walletAddress,
							walletType: walletType,
						},
						token,
					)
				}
			}

			// Refresh the cached host profile so all pages get updated instantly
			await refreshHostProfile()

			toast.success(
				isCreating
					? 'Host profile created successfully!'
					: 'Profile updated successfully!',
			)

			if (isCreating) {
				setTimeout(() => {
					router.push('/dashboard/host')
				}, 1000)
			}
		} catch (error: any) {
			toast.error(error.message || 'Failed to save profile')
		} finally {
			setSaving(false)
		}
	}

	if (authLoading || loading) {
		return (
			<div className='min-h-screen bg-[#0a0a0f] flex items-center justify-center'>
				<Loader2 className='w-10 h-10 text-[#c9a227] animate-spin' />
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-[#0a0a0f] text-white flex'>
			<DashboardSidebar />

			<main className='flex-1 min-h-screen'>
				<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16 md:pt-8'>
					{/* Header */}
					<div className='mb-8 flex items-center gap-4'>
						<Link
							href={
								isCreating
									? '/dashboard/user'
									: '/dashboard/host'
							}
							className='p-2 hover:bg-gray-900 rounded-lg transition'
						>
							<ArrowLeft className='w-6 h-6' />
						</Link>
						<div>
							<h1 className='text-3xl md:text-4xl font-bold'>
								{isCreating
									? 'Create Host Profile'
									: 'Host Settings'}
							</h1>
							<p className='text-gray-400 mt-1'>
								Configure your hosting account and wallet
							</p>
						</div>
					</div>

					<form onSubmit={handleSaveProfile} className='max-w-4xl'>
						{/* Organization Section */}
						<div className='bg-[#111118] border border-white/[0.06] rounded-xl p-6 mb-6'>
							<h2 className='text-lg font-bold text-[#c9a227] mb-4'>
								Organization Information
							</h2>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								<div>
									<label className='block text-sm font-medium text-gray-300 mb-2'>
										Organization Name *
									</label>
									<input
										type='text'
										name='organization'
										value={formData.organization}
										onChange={handleInputChange}
										placeholder='Your organization name'
										className='w-full px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#c9a227]/50 focus:ring-1 focus:ring-[#c9a227]/30 transition'
									/>
								</div>
								<div>
									<label className='block text-sm font-medium text-gray-300 mb-2'>
										Address
									</label>
									<input
										type='text'
										name='address'
										value={formData.address}
										onChange={handleInputChange}
										placeholder='Business address'
										className='w-full px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#c9a227]/50 focus:ring-1 focus:ring-[#c9a227]/30 transition'
									/>
								</div>
							</div>
						</div>

						{/* Wallet Configuration Section */}
						<div className='bg-[#111118] border border-white/[0.06] rounded-xl p-6 mb-6'>
							<div className='flex items-center gap-3 mb-4'>
								<Wallet className='w-6 h-6 text-gold' />
								<h2 className='text-xl font-bold text-gold'>
									Wallet Configuration
								</h2>
							</div>

							<div className='space-y-6'>
								{/* Wallet Type (Solana only) */}
								<div>
									<label className='block text-sm font-medium text-gray-300 mb-3'>
										Wallet Type
									</label>
									<div className='p-4 rounded-lg border-2 border-[#c9a227] bg-[#c9a227]/10'>
										<div className='text-lg font-bold mb-1'>
											Solana (SOL)
										</div>
										<div className='text-sm text-gray-400'>
											All crypto withdrawals are processed
											in SOL.
										</div>
									</div>
								</div>

								{/* Wallet Address */}
								<div>
									<label className='block text-sm font-medium text-gray-300 mb-2'>
										Solana Wallet Address (Optional)
									</label>
									<input
										type='text'
										name='walletAddress'
										value={formData.walletAddress}
										onChange={handleInputChange}
										placeholder='Your Solana wallet address'
										className='w-full px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#c9a227]/50 focus:ring-1 focus:ring-[#c9a227]/30 transition font-mono text-sm'
									/>
									<p className='text-xs text-gray-500 mt-2'>
										Enter your Solana wallet address where
										payouts will be sent.
									</p>
								</div>

								{/* Conversion Rate */}
								<div>
									<label className='block text-sm font-medium text-gray-300 mb-2'>
										Conversion Rate (NGN per unit)
									</label>
									<input
										type='number'
										name='conversionRate'
										value={formData.conversionRate}
										onChange={handleInputChange}
										placeholder='1400'
										min='100'
										className='w-full px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#c9a227]/50 focus:ring-1 focus:ring-[#c9a227]/30 transition'
									/>
									<p className='text-xs text-gray-500 mt-2'>
										The exchange rate you'll use for
										converting payments
									</p>
								</div>
							</div>
						</div>

						{/* Bank Information Section */}
						<div className='bg-[#111118] border border-white/[0.06] rounded-xl p-6 mb-6'>
							<h2 className='text-lg font-bold text-[#c9a227] mb-4'>
								Bank Information (Optional)
							</h2>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								<div>
									<label className='block text-sm font-medium text-gray-300 mb-2'>
										Bank Name
									</label>
									<input
										type='text'
										name='bankName'
										value={formData.bankName}
										onChange={handleInputChange}
										placeholder='e.g., GTBank'
										className='w-full px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#c9a227]/50 focus:ring-1 focus:ring-[#c9a227]/30 transition'
									/>
								</div>
								<div>
									<label className='block text-sm font-medium text-gray-300 mb-2'>
										Account Name
									</label>
									<input
										type='text'
										name='accountName'
										value={formData.accountName}
										onChange={handleInputChange}
										placeholder='Account holder name'
										className='w-full px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#c9a227]/50 focus:ring-1 focus:ring-[#c9a227]/30 transition'
									/>
								</div>
								<div className='md:col-span-2'>
									<label className='block text-sm font-medium text-gray-300 mb-2'>
										Account Number
									</label>
									<input
										type='text'
										name='accountNo'
										value={formData.accountNo}
										onChange={handleInputChange}
										placeholder='Bank account number'
										className='w-full px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#c9a227]/50 focus:ring-1 focus:ring-[#c9a227]/30 transition'
									/>
								</div>
							</div>
						</div>

						{/* Social Links Section */}
						<div className='bg-[#111118] border border-white/[0.06] rounded-xl p-6 mb-6'>
							<div className='flex items-center gap-3 mb-4'>
								<Globe className='w-6 h-6 text-gold' />
								<h2 className='text-xl font-bold text-gold'>
									Social Links
								</h2>
							</div>

							<div className='space-y-4'>
								<div>
									<label className='block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2'>
										<Twitter className='w-4 h-4' />
										Twitter
									</label>
									<input
										type='text'
										name='socials.twitter'
										value={formData.socials.twitter}
										onChange={handleInputChange}
										placeholder='https://twitter.com/username'
										className='w-full px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#c9a227]/50 focus:ring-1 focus:ring-[#c9a227]/30 transition'
									/>
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2'>
										<Instagram className='w-4 h-4' />
										Instagram
									</label>
									<input
										type='text'
										name='socials.instagram'
										value={formData.socials.instagram}
										onChange={handleInputChange}
										placeholder='https://instagram.com/username'
										className='w-full px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#c9a227]/50 focus:ring-1 focus:ring-[#c9a227]/30 transition'
									/>
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2'>
										<Facebook className='w-4 h-4' />
										Facebook
									</label>
									<input
										type='text'
										name='socials.facebook'
										value={formData.socials.facebook}
										onChange={handleInputChange}
										placeholder='https://facebook.com/username'
										className='w-full px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#c9a227]/50 focus:ring-1 focus:ring-[#c9a227]/30 transition'
									/>
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2'>
										<Linkedin className='w-4 h-4' />
										LinkedIn
									</label>
									<input
										type='text'
										name='socials.linkedin'
										value={formData.socials.linkedin}
										onChange={handleInputChange}
										placeholder='https://linkedin.com/in/username'
										className='w-full px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#c9a227]/50 focus:ring-1 focus:ring-[#c9a227]/30 transition'
									/>
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2'>
										<Globe className='w-4 h-4' />
										Website
									</label>
									<input
										type='text'
										name='socials.website'
										value={formData.socials.website}
										onChange={handleInputChange}
										placeholder='https://yourwebsite.com'
										className='w-full px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#c9a227]/50 focus:ring-1 focus:ring-[#c9a227]/30 transition'
									/>
								</div>
							</div>
						</div>

						{/* Form Actions */}
						<div className='flex flex-col sm:flex-row gap-4'>
							<button
								type='button'
								onClick={() => router.back()}
								className='px-6 py-3 bg-white/5 border border-white/[0.08] rounded-lg hover:bg-white/10 transition font-semibold'
							>
								Cancel
							</button>
							<button
								type='submit'
								disabled={saving}
								className='flex-1 px-6 py-3 bg-[#c9a227] text-black rounded-lg hover:bg-[#d4b84a] disabled:opacity-50 transition font-bold flex items-center justify-center gap-2'
							>
								{saving ? (
									<>
										<Loader2 className='w-5 h-5 animate-spin' />
										Saving...
									</>
								) : (
									<>
										<Save className='w-5 h-5' />
										{isCreating
											? 'Create Host Profile'
											: 'Save Changes'}
									</>
								)}
							</button>
						</div>
					</form>
				</div>
			</main>
		</div>
	)
}
