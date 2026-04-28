'use client'

import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
	Loader2,
	Save,
	User,
	Mail,
	Phone,
	Shield,
	CheckCircle,
	XCircle,
	ArrowLeft,
	Briefcase,
} from 'lucide-react'
import Link from 'next/link'
import DashboardSidebar from '@/components/DashboardSidebar'
import { toast } from 'sonner'

export default function UserSettingsPage() {
	const { user, isAuthenticated, loading: authLoading, token } = useAuth()
	const router = useRouter()
	const [saving, setSaving] = useState(false)

	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		profession: '',
	})

	useEffect(() => {
		if (!authLoading && !isAuthenticated) {
			router.push('/auth/login')
		} else if (user) {
			setFormData({
				firstName: user.firstName || '',
				lastName: user.lastName || '',
				email: user.email || '',
				phone: user.phone || '',
				profession: user.profession || '',
			})
		}
	}, [authLoading, isAuthenticated, user, router])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData((prev) => ({ ...prev, [name]: value }))
	}

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!token) {
			toast.error('Session expired. Please login again.')
			router.push('/auth/login')
			return
		}

		try {
			setSaving(true)

			const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://skills-k6pv.onrender.com'
			const response = await fetch(`${baseUrl}/api/auth/update-profile`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					firstName: formData.firstName,
					lastName: formData.lastName,
					phone: formData.phone,
					profession: formData.profession,
				}),
			})

			if (response.ok) {
				const data = await response.json()
				if (data.user) {
					localStorage.setItem('user', JSON.stringify(data.user))
				}
				toast.success('Profile updated successfully')
			} else {
				const error = await response.json()
				toast.error(error.message || 'Failed to update profile')
			}
		} catch (err: any) {
			toast.error(err.message || 'Something went wrong')
		} finally {
			setSaving(false)
		}
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
				<div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16 md:pt-8'>
					{/* Header */}
					<div className='flex items-center gap-3 mb-8'>
						<Link
							href='/dashboard/user'
							className='p-2 hover:bg-white/5 rounded-lg transition'
						>
							<ArrowLeft className='w-5 h-5 text-gray-400' />
						</Link>
						<div>
							<h1 className='text-2xl font-bold'>Profile Settings</h1>
							<p className='text-sm text-gray-500'>Manage your personal information</p>
						</div>
					</div>

					{/* Profile Avatar */}
					<div className='bg-[#111118] rounded-xl border border-white/[0.06] p-6 mb-6'>
						<div className='flex items-center gap-4'>
							<div className='w-16 h-16 bg-gradient-to-br from-[#c9a227] to-[#a8861e] rounded-full flex items-center justify-center text-black font-bold text-xl flex-shrink-0'>
								{user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
							</div>
							<div>
								<h3 className='font-semibold text-lg'>{user.firstName} {user.lastName}</h3>
								<p className='text-sm text-gray-500'>{user.email}</p>
								<div className='flex items-center gap-3 mt-2'>
									<span className='inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-[#c9a227]/15 text-[#c9a227]'>
										<User className='w-3 h-3' />
										{user.role || 'User'}
									</span>
									{user.emailVerified ? (
										<span className='inline-flex items-center gap-1 text-[11px] text-emerald-400'>
											<CheckCircle className='w-3 h-3' />
											Verified
										</span>
									) : (
										<span className='inline-flex items-center gap-1 text-[11px] text-yellow-500'>
											<XCircle className='w-3 h-3' />
											Not verified
										</span>
									)}
								</div>
							</div>
						</div>
					</div>

					{/* Profile Form */}
					<form onSubmit={handleSave}>
						<div className='bg-[#111118] rounded-xl border border-white/[0.06] p-6 mb-6'>
							<h2 className='text-base font-semibold mb-5 flex items-center gap-2'>
								<User className='w-4 h-4 text-[#c9a227]' />
								Personal Information
							</h2>

							<div className='space-y-5'>
								<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
									<div>
										<label className='block text-xs font-medium text-gray-400 mb-1.5'>First Name</label>
										<input
											type='text'
											name='firstName'
											value={formData.firstName}
											onChange={handleChange}
											className='w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#c9a227]/50 focus:ring-1 focus:ring-[#c9a227]/30 transition'
											placeholder='Your first name'
										/>
									</div>
									<div>
										<label className='block text-xs font-medium text-gray-400 mb-1.5'>Last Name</label>
										<input
											type='text'
											name='lastName'
											value={formData.lastName}
											onChange={handleChange}
											className='w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#c9a227]/50 focus:ring-1 focus:ring-[#c9a227]/30 transition'
											placeholder='Your last name'
										/>
									</div>
								</div>

								<div>
									<label className='block text-xs font-medium text-gray-400 mb-1.5 flex items-center gap-1.5'>
										<Mail className='w-3.5 h-3.5' />
										Email Address
									</label>
									<input
										type='email'
										name='email'
										value={formData.email}
										disabled
										className='w-full px-4 py-2.5 bg-white/[0.02] border border-white/[0.05] rounded-lg text-gray-500 text-sm cursor-not-allowed'
									/>
									<p className='text-[11px] text-gray-600 mt-1'>Email cannot be changed</p>
								</div>

								<div>
									<label className='block text-xs font-medium text-gray-400 mb-1.5 flex items-center gap-1.5'>
										<Phone className='w-3.5 h-3.5' />
										Phone Number
									</label>
									<input
										type='tel'
										name='phone'
										value={formData.phone}
										onChange={handleChange}
										className='w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#c9a227]/50 focus:ring-1 focus:ring-[#c9a227]/30 transition'
										placeholder='Your phone number'
									/>
								</div>

								<div>
									<label className='block text-xs font-medium text-gray-400 mb-1.5 flex items-center gap-1.5'>
										<Briefcase className='w-3.5 h-3.5' />
										Profession
									</label>
									<input
										type='text'
										name='profession'
										value={formData.profession}
										onChange={handleChange}
										className='w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#c9a227]/50 focus:ring-1 focus:ring-[#c9a227]/30 transition'
										placeholder='e.g., Software Engineer'
									/>
								</div>
							</div>
						</div>

						{/* Account Info */}
						<div className='bg-[#111118] rounded-xl border border-white/[0.06] p-6 mb-6'>
							<h2 className='text-base font-semibold mb-5 flex items-center gap-2'>
								<Shield className='w-4 h-4 text-[#c9a227]' />
								Account Information
							</h2>

							<div className='space-y-4'>
								<div className='flex items-center justify-between py-3 border-b border-white/[0.04]'>
									<div>
										<p className='text-sm font-medium'>Email Verification</p>
										<p className='text-xs text-gray-500 mt-0.5'>Your email verification status</p>
									</div>
									{user.emailVerified ? (
										<span className='inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'>
											<CheckCircle className='w-3.5 h-3.5' />
											Verified
										</span>
									) : (
										<span className='inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'>
											<XCircle className='w-3.5 h-3.5' />
											Pending
										</span>
									)}
								</div>

								<div className='flex items-center justify-between py-3 border-b border-white/[0.04]'>
									<div>
										<p className='text-sm font-medium'>Phone Verification</p>
										<p className='text-xs text-gray-500 mt-0.5'>Your phone verification status</p>
									</div>
									{user.phoneVerified ? (
										<span className='inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'>
											<CheckCircle className='w-3.5 h-3.5' />
											Verified
										</span>
									) : (
										<span className='inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'>
											<XCircle className='w-3.5 h-3.5' />
											Pending
										</span>
									)}
								</div>

								<div className='flex items-center justify-between py-3'>
									<div>
										<p className='text-sm font-medium'>Referral ID</p>
										<p className='text-xs text-gray-500 mt-0.5'>Your unique referral code</p>
									</div>
									<span className='text-sm font-mono text-[#c9a227]'>{user.refId || 'N/A'}</span>
								</div>
							</div>
						</div>

						{/* Save Button */}
						<div className='flex gap-3'>
							<Link
								href='/dashboard/user'
								className='px-6 py-2.5 text-sm font-medium text-gray-400 border border-white/[0.08] rounded-lg hover:text-white hover:border-white/20 transition'
							>
								Cancel
							</Link>
							<button
								type='submit'
								disabled={saving}
								className='flex-1 sm:flex-none px-8 py-2.5 bg-[#c9a227] text-black text-sm font-bold rounded-lg hover:bg-[#d4b84a] disabled:opacity-50 transition flex items-center justify-center gap-2'
							>
								{saving ? (
									<>
										<Loader2 className='w-4 h-4 animate-spin' />
										Saving...
									</>
								) : (
									<>
										<Save className='w-4 h-4' />
										Save Changes
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
