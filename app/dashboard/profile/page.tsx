'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import {
	Save,
	AlertCircle,
	CheckCircle,
	Loader2,
	Eye,
	EyeOff,
	ArrowLeft,
	User,
	Building2,
	Wallet,
	Globe,
	CreditCard,
	Shield,
	Twitter,
	Instagram,
	Facebook,
	Linkedin,
} from 'lucide-react'
import Link from 'next/link'
import DashboardSidebar from '@/components/DashboardSidebar'
import hostProfileService, {
	UpdateProfileData,
	SetWalletData,
} from '@/app/services/hostProfileService'
import { toast } from 'sonner'

interface SocialLinks {
	twitter?: string
	instagram?: string
	facebook?: string
	linkedin?: string
	website?: string
}

interface HostProfileData {
	_id: string
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
	conversionRate: number
	socials?: SocialLinks
}

export default function HostProfilePage() {
	const { user, isAuthenticated, loading: authLoading, token } = useAuth()
	const router = useRouter()
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [profile, setProfile] = useState<HostProfileData | null>(null)
	const [showWalletPassword, setShowWalletPassword] = useState(false)
	const [activeTab, setActiveTab] = useState('personal')

	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		profession: '',
		phone: '',
		role: '',
		refId: '',
		address: '',
		organization: '',
		bankName: '',
		accountNo: '',
		accountName: '',
		conversionRate: 1400,
		socials: {
			twitter: '',
			instagram: '',
			facebook: '',
			linkedin: '',
			website: '',
		},
	})

	const [walletData, setWalletData] = useState({
		walletAddress: '',
		walletType: 'crypto',
	})

	useEffect(() => {
		if (!authLoading && !isAuthenticated) {
			router.push('/auth/login')
		} else if (user && user.role !== 'Host' && user.role !== 'Admin') {
			router.push('/dashboard/user')
		} else if (token) {
			fetchProfile()
		}
	}, [authLoading, isAuthenticated, user, router, token])

	const fetchProfile = async () => {
		try {
			setLoading(true)
			if (!token) throw new Error('No authentication token')

			const response = await hostProfileService.getProfile(token)
			if (response.success && response.data) {
				setProfile(response.data)
				setFormData({
					firstName: response.data.firstName || '',
					lastName: response.data.lastName || '',
					profession: response.data.profession || '',
					phone: response.data.phone || '',
					role: response.data.role || '',
					refId: response.data.refId || '',
					address: response.data.address || '',
					organization: response.data.organization || '',
					bankName: response.data.bankName || '',
					accountNo: response.data.accountNo || '',
					accountName: response.data.accountName || '',
					conversionRate: response.data.conversionRate || 1400,
					socials: {
						twitter: response.data.socials?.twitter ?? '',
						instagram: response.data.socials?.instagram ?? '',
						facebook: response.data.socials?.facebook ?? '',
						linkedin: response.data.socials?.linkedin ?? '',
						website: response.data.socials?.website ?? '',
					},
				})
				if (response.data.walletAddress) {
					setWalletData({
						walletAddress: response.data.walletAddress,
						walletType: response.data.walletType || 'crypto',
					})
				}
			}
		} catch (err: any) {
			toast.error('Failed to load profile')
		} finally {
			setLoading(false)
		}
	}

	const handleFormChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
		section?: string,
	) => {
		const { name, value } = e.target

		if (section === 'socials') {
			setFormData((prev) => ({
				...prev,
				socials: { ...prev.socials, [name]: value },
			}))
		} else {
			setFormData((prev) => ({ ...prev, [name]: value }))
		}
	}

	const handleWalletChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target
		setWalletData((prev) => ({ ...prev, [name]: value }))
	}

	const handleSaveProfile = async () => {
		try {
			setSaving(true)
			if (!token) throw new Error('No authentication token')

			if (formData.accountName && !formData.accountNo) {
				throw new Error('Account number is required when account name is provided')
			}
			if (formData.accountName && !formData.bankName) {
				throw new Error('Bank name is required when account name is provided')
			}
			if (
				formData.accountName &&
				user?.firstName &&
				!formData.accountName.toLowerCase().includes(user.firstName.toLowerCase())
			) {
				throw new Error('Account name must match your profile name for security verification')
			}

			const response = await hostProfileService.updateProfile(formData, token)
			if (response.success) {
				setProfile(response.data)
				toast.success('Profile updated successfully')
			}
		} catch (err: any) {
			toast.error(err.message || 'Failed to save profile')
		} finally {
			setSaving(false)
		}
	}

	const handleSetWallet = async () => {
		try {
			setSaving(true)
			if (!walletData.walletAddress) throw new Error('Wallet address is required')
			if (!walletData.walletType) throw new Error('Wallet type is required')
			if (!token) throw new Error('No authentication token')

			const response = await hostProfileService.setWallet(walletData, token)
			if (response.success) {
				setProfile(response.data)
				toast.success('Wallet set successfully! Contact support to change it.')
			}
		} catch (err: any) {
			toast.error(err.message || 'Failed to set wallet')
		} finally {
			setSaving(false)
		}
	}

	const tabs = [
		{ id: 'personal', label: 'Personal', icon: <User className='w-4 h-4' /> },
		{ id: 'socials', label: 'Socials', icon: <Globe className='w-4 h-4' /> },
		{ id: 'bank', label: 'Bank', icon: <CreditCard className='w-4 h-4' /> },
		{ id: 'wallet', label: 'Wallet', icon: <Wallet className='w-4 h-4' /> },
	]

	if (authLoading || loading) {
		return (
			<div className='min-h-screen bg-[#0a0a0f] flex items-center justify-center'>
				<Loader2 className='w-10 h-10 text-[#c9a227] animate-spin' />
			</div>
		)
	}

	const inputClass = 'w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#c9a227]/50 focus:ring-1 focus:ring-[#c9a227]/30 transition'
	const labelClass = 'block text-xs font-medium text-gray-400 mb-1.5'

	return (
		<div className='min-h-screen bg-[#0a0a0f] text-white flex'>
			<DashboardSidebar />

			<main className='flex-1 min-h-screen'>
				<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16 md:pt-8'>
					{/* Header */}
					<div className='flex items-center gap-3 mb-6'>
						<Link href='/dashboard/host' className='p-2 hover:bg-white/5 rounded-lg transition'>
							<ArrowLeft className='w-5 h-5 text-gray-400' />
						</Link>
						<div>
							<h1 className='text-2xl font-bold'>Host Profile Settings</h1>
							<p className='text-sm text-gray-500'>Manage your profile, bank details, and wallet</p>
						</div>
					</div>

					{/* Tabs */}
					<div className='flex gap-1 mb-6 bg-[#111118] rounded-lg p-1 border border-white/[0.06] overflow-x-auto'>
						{tabs.map((tab) => (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition whitespace-nowrap ${
									activeTab === tab.id
										? 'bg-[#c9a227]/15 text-[#c9a227]'
										: 'text-gray-500 hover:text-white hover:bg-white/5'
								}`}
							>
								{tab.icon}
								{tab.label}
							</button>
						))}
					</div>

					{/* Personal Info Tab */}
					{activeTab === 'personal' && (
						<div className='bg-[#111118] rounded-xl border border-white/[0.06] p-6 space-y-5'>
							<h2 className='text-base font-semibold flex items-center gap-2 mb-4'>
								<User className='w-4 h-4 text-[#c9a227]' />
								Personal Information
							</h2>

							<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
								<div>
									<label className={labelClass}>First Name</label>
									<input type='text' name='firstName' value={formData.firstName} onChange={handleFormChange} placeholder='First name' className={inputClass} />
								</div>
								<div>
									<label className={labelClass}>Last Name</label>
									<input type='text' name='lastName' value={formData.lastName} onChange={handleFormChange} placeholder='Last name' className={inputClass} />
								</div>
							</div>

							<div>
								<label className={labelClass}>Email (Read-only)</label>
								<input type='email' disabled value={user?.email || ''} className={`${inputClass} opacity-50 cursor-not-allowed`} />
							</div>

							<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
								<div>
									<label className={labelClass}>Phone</label>
									<input type='tel' name='phone' value={formData.phone} onChange={handleFormChange} placeholder='Phone number' className={inputClass} />
								</div>
								<div>
									<label className={labelClass}>Profession</label>
									<input type='text' name='profession' value={formData.profession} onChange={handleFormChange} placeholder='Your profession' className={inputClass} />
								</div>
							</div>

							<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
								<div>
									<label className={labelClass}>Organization</label>
									<input type='text' name='organization' value={formData.organization} onChange={handleFormChange} placeholder='Organization name' className={inputClass} />
								</div>
								<div>
									<label className={labelClass}>Address</label>
									<input type='text' name='address' value={formData.address} onChange={handleFormChange} placeholder='Business address' className={inputClass} />
								</div>
							</div>

							<div>
								<label className={labelClass}>Conversion Rate (NGN per USD)</label>
								<input type='number' name='conversionRate' value={formData.conversionRate} onChange={handleFormChange} placeholder='1400' min='100' className={inputClass} />
							</div>

							{/* Verification Status */}
							<div className='p-4 bg-white/[0.02] rounded-lg border border-white/[0.04] space-y-3'>
								<div className='flex items-center justify-between'>
									<span className='text-sm text-gray-400'>Email Verified</span>
									{profile?.emailVerified ? (
										<span className='inline-flex items-center gap-1 text-xs text-emerald-400'><CheckCircle className='w-3.5 h-3.5' /> Yes</span>
									) : (
										<span className='inline-flex items-center gap-1 text-xs text-yellow-500'><AlertCircle className='w-3.5 h-3.5' /> No</span>
									)}
								</div>
								<div className='flex items-center justify-between'>
									<span className='text-sm text-gray-400'>Phone Verified</span>
									{profile?.phoneVerified ? (
										<span className='inline-flex items-center gap-1 text-xs text-emerald-400'><CheckCircle className='w-3.5 h-3.5' /> Yes</span>
									) : (
										<span className='inline-flex items-center gap-1 text-xs text-yellow-500'><AlertCircle className='w-3.5 h-3.5' /> No</span>
									)}
								</div>
							</div>
						</div>
					)}

					{/* Social Media Tab */}
					{activeTab === 'socials' && (
						<div className='bg-[#111118] rounded-xl border border-white/[0.06] p-6 space-y-5'>
							<h2 className='text-base font-semibold flex items-center gap-2 mb-4'>
								<Globe className='w-4 h-4 text-[#c9a227]' />
								Social Media Links
							</h2>

							{[
								{ name: 'twitter', label: 'Twitter / X', icon: <Twitter className='w-4 h-4' />, placeholder: '@yourhandle' },
								{ name: 'instagram', label: 'Instagram', icon: <Instagram className='w-4 h-4' />, placeholder: '@yourhandle' },
								{ name: 'facebook', label: 'Facebook', icon: <Facebook className='w-4 h-4' />, placeholder: 'Profile URL' },
								{ name: 'linkedin', label: 'LinkedIn', icon: <Linkedin className='w-4 h-4' />, placeholder: 'Profile URL' },
								{ name: 'website', label: 'Website', icon: <Globe className='w-4 h-4' />, placeholder: 'https://yoursite.com' },
							].map((social) => (
								<div key={social.name}>
									<label className={`${labelClass} flex items-center gap-1.5`}>
										{social.icon}
										{social.label}
									</label>
									<input
										type='text'
										name={social.name}
										value={(formData.socials as any)[social.name]}
										onChange={(e) => handleFormChange(e, 'socials')}
										placeholder={social.placeholder}
										className={inputClass}
									/>
								</div>
							))}
						</div>
					)}

					{/* Bank Tab */}
					{activeTab === 'bank' && (
						<div className='bg-[#111118] rounded-xl border border-white/[0.06] p-6 space-y-5'>
							<h2 className='text-base font-semibold flex items-center gap-2 mb-2'>
								<CreditCard className='w-4 h-4 text-[#c9a227]' />
								Bank Account Details
							</h2>
							<p className='text-xs text-gray-500 flex items-center gap-1.5'>
								<Shield className='w-3.5 h-3.5' />
								Account name must match your profile name for security
							</p>

							<div>
								<label className={labelClass}>Bank Name</label>
								<input type='text' name='bankName' value={formData.bankName} onChange={handleFormChange} placeholder='e.g., GTBank, Access Bank' className={inputClass} />
							</div>
							<div>
								<label className={labelClass}>Account Name</label>
								<input type='text' name='accountName' value={formData.accountName} onChange={handleFormChange} placeholder='Account holder name' className={inputClass} />
								<p className='text-[11px] text-gray-600 mt-1'>Profile name: {user?.firstName} {user?.lastName}</p>
							</div>
							<div>
								<label className={labelClass}>Account Number</label>
								<input type='text' name='accountNo' value={formData.accountNo} onChange={handleFormChange} placeholder='Account number' className={inputClass} />
							</div>
						</div>
					)}

					{/* Wallet Tab */}
					{activeTab === 'wallet' && (
						<div className='bg-[#111118] rounded-xl border border-white/[0.06] p-6 space-y-5'>
							<h2 className='text-base font-semibold flex items-center gap-2 mb-2'>
								<Wallet className='w-4 h-4 text-[#c9a227]' />
								Wallet Settings
							</h2>
							<p className='text-xs text-gray-500 flex items-center gap-1.5'>
								<AlertCircle className='w-3.5 h-3.5' />
								Wallet can only be set once. Contact support to change it.
							</p>

							{profile?.walletSet ? (
								<div className='p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-lg space-y-3'>
									<div className='flex items-center gap-2'>
										<CheckCircle className='w-5 h-5 text-emerald-400' />
										<span className='font-semibold text-emerald-400'>Wallet Active</span>
									</div>
									<div className='space-y-2 text-sm'>
										<div>
											<span className='text-gray-500'>Type:</span>{' '}
											<span className='text-white'>{walletData.walletType}</span>
										</div>
										<div>
											<span className='text-gray-500'>Address:</span>{' '}
											<span className='text-white font-mono text-xs break-all'>{walletData.walletAddress}</span>
										</div>
									</div>
									<p className='text-[11px] text-gray-500'>To change wallet settings, contact support.</p>
								</div>
							) : (
								<>
									<div>
										<label className={labelClass}>Wallet Type</label>
										<select
											name='walletType'
											value={walletData.walletType}
											onChange={handleWalletChange}
											className={inputClass}
										>
											<option value='crypto'>Cryptocurrency</option>
											<option value='bank'>Bank Transfer</option>
										</select>
									</div>

									<div>
										<label className={labelClass}>Wallet Address</label>
										<div className='relative'>
											<input
												type={showWalletPassword ? 'text' : 'password'}
												name='walletAddress'
												value={walletData.walletAddress}
												onChange={handleWalletChange}
												placeholder={walletData.walletType === 'crypto' ? 'Your crypto wallet address' : 'Your bank wallet address'}
												className={inputClass}
											/>
											<button
												type='button'
												onClick={() => setShowWalletPassword(!showWalletPassword)}
												className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition'
											>
												{showWalletPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
											</button>
										</div>
									</div>

									<button
										onClick={handleSetWallet}
										disabled={saving || !walletData.walletAddress}
										className='w-full px-4 py-2.5 bg-[#c9a227] text-black text-sm font-bold rounded-lg hover:bg-[#d4b84a] disabled:opacity-50 transition flex items-center justify-center gap-2'
									>
										{saving ? (
											<><Loader2 className='w-4 h-4 animate-spin' /> Setting Wallet...</>
										) : (
											<><Wallet className='w-4 h-4' /> Set Wallet</>
										)}
									</button>
								</>
							)}
						</div>
					)}

					{/* Save Button (for non-wallet tabs) */}
					{activeTab !== 'wallet' && (
						<div className='flex gap-3 mt-6'>
							<Link
								href='/dashboard/host'
								className='px-6 py-2.5 text-sm font-medium text-gray-400 border border-white/[0.08] rounded-lg hover:text-white hover:border-white/20 transition'
							>
								Cancel
							</Link>
							<button
								onClick={handleSaveProfile}
								disabled={saving}
								className='flex-1 sm:flex-none px-8 py-2.5 bg-[#c9a227] text-black text-sm font-bold rounded-lg hover:bg-[#d4b84a] disabled:opacity-50 transition flex items-center justify-center gap-2'
							>
								{saving ? (
									<><Loader2 className='w-4 h-4 animate-spin' /> Saving...</>
								) : (
									<><Save className='w-4 h-4' /> Save Changes</>
								)}
							</button>
						</div>
					)}
				</div>
			</main>
		</div>
	)
}
