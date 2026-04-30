'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import { Loader2, ArrowLeft, Upload } from 'lucide-react'
import Link from 'next/link'
import DashboardSidebar from '@/components/DashboardSidebar'
import eventService, { EventData } from '@/app/services/eventService'
import { toast } from 'sonner'

export default function CreateEventPage() {
	const router = useRouter()
	const { token, isAuthenticated, loading: authLoading, hostProfile: hostProfileCache } = useAuth()

	const [loading, setLoading] = useState(false)
	const [uploading, setUploading] = useState(false)
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')
	const [bannerPreview, setBannerPreview] = useState<string>('')

	const [formData, setFormData] = useState({
		title: '',
		description: '',
		date: '',
		venue: '',
		capacity: '',
		banner: '',
		category: '',
		tags: '',
		feeByUser: '',
	})

	// Check auth and host profile using cached context
	useEffect(() => {
		if (authLoading) return

		if (!isAuthenticated) {
			router.push('/auth/login')
			return
		}

		if (hostProfileCache.lastChecked > 0 && !hostProfileCache.hasProfile) {
			toast.error('You need a host profile to create events')
			router.push('/dashboard/host-settings?create=true')
		}
	}, [authLoading, isAuthenticated, hostProfileCache.lastChecked, hostProfileCache.hasProfile, router])

	const pageReady = !authLoading && isAuthenticated && hostProfileCache.hasProfile

	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		const { name, value } = e.target
		console.log(name, value)
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}))
	}

	// ✅ Cloudinary upload via eventService
	const handleBannerChange = async (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = e.target.files?.[0]
		if (!file) return

		setError('')
		setUploading(true)

		try {
			const imageUrl = await eventService.uploadBanner(file, token!)

			setBannerPreview(imageUrl)
			setFormData((prev) => ({
				...prev,
				banner: imageUrl,
			}))
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Image upload failed')
		} finally {
			setUploading(false)
		}
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setError('')
		setSuccess('')

		if (uploading) {
			setError('Please wait for image upload to finish')
			return
		}

		setLoading(true)

		try {
			// Validation
			if (
				!formData.title ||
				!formData.description ||
				!formData.date ||
				!formData.venue ||
				!formData.capacity ||
				!formData.banner ||
				!formData.category ||
				!formData.feeByUser
			) {
				throw new Error('All fields are required')
			}

			const capacityNum = parseInt(formData.capacity)
			if (capacityNum <= 5) {
				throw new Error('Event capacity must be greater than 5')
			}

			if (new Date(formData.date).getTime() < Date.now()) {
				throw new Error('Event date cannot be in the past')
			}

			if (!token) {
				throw new Error('Authentication required')
			}

			const eventData: EventData = {
				title: formData.title,
				description: formData.description,
				date: formData.date,
				venue: formData.venue,
				capacity: capacityNum,
				banner: formData.banner, // ✅ Cloudinary URL
				category: formData.category,
				feeByUser: formData.feeByUser,
				tags: formData.tags
					? formData.tags.split(',').map((tag) => tag.trim())
					: [],
			}

			const response = await eventService.createEvent(eventData, token)

			if (response.success) {
				toast.success('Event created successfully! It is now pending review.')

				setFormData({
					title: '',
					description: '',
					date: '',
					venue: '',
					capacity: '',
					banner: '',
					category: '',
					tags: '',
					feeByUser: '',
				})

				setBannerPreview('')

				setTimeout(() => {
					router.push('/dashboard/host')
				}, 1500)
			}
		} catch (err) {
			const errorMsg = err instanceof Error ? err.message : 'Failed to create event'
			setError(errorMsg)
			toast.error(errorMsg)
			console.error(err)
		} finally {
			setLoading(false)
		}
	}

	if (!pageReady) {
		return (
			<div className='min-h-screen bg-[#0a0a0f] flex items-center justify-center'>
				<div className='text-center'>
					<Loader2 className='w-10 h-10 text-[#c9a227] animate-spin mx-auto mb-3' />
					<p className='text-gray-500 text-sm'>Loading...</p>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-[#0a0a0f] text-white flex'>
			<DashboardSidebar />

			<main className='flex-1 min-h-screen'>
			<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16 md:pt-8'>
				{/* Header */}
				<div className='mb-8'>
					<Link
						href='/dashboard/host'
						className='flex items-center gap-2 text-[#c9a227] hover:text-[#c9a227]/80 transition mb-4'
					>
						<ArrowLeft className='w-4 h-4' />
						Back to Dashboard
					</Link>

					<h1 className='text-3xl md:text-4xl font-bold mb-2'>
						Create New Event
					</h1>
					<p className='text-gray-400'>
						Fill in the details below to create your event
					</p>
				</div>

				{/* Alerts */}
				{error && (
					<div className='mb-6 p-4 border border-red-500/30 bg-red-500/10 rounded-lg text-red-400'>
						{error}
					</div>
				)}

				{success && (
					<div className='mb-6 p-4 border border-green-500/30 bg-green-500/10 rounded-lg text-green-400'>
						{success}
					</div>
				)}

				{/* Form */}
				<form onSubmit={handleSubmit} className='max-w-2xl'>
					<div className='bg-[#111118] border border-white/[0.06] rounded-xl p-8 space-y-6'>
						{/* Title */}
						<div>
							<label className='block text-sm font-medium text-gray-300 mb-2'>
								Event Title *
							</label>
							<input
								type='text'
								name='title'
								value={formData.title}
								onChange={handleInputChange}
								className='w-full px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#c9a227]/50 focus:ring-1 focus:ring-[#c9a227]/30 transition'
								required
							/>
						</div>

						{/* Description */}
						<div>
							<label className='block text-sm font-medium text-gray-300 mb-2'>
								Event Description *
							</label>
							<textarea
								name='description'
								value={formData.description}
								onChange={handleInputChange}
								rows={4}
								className='w-full px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#c9a227]/50 focus:ring-1 focus:ring-[#c9a227]/30 transition'
								required
							/>
						</div>

						{/* Date & Venue */}
						<div className='grid md:grid-cols-2 gap-6'>
							<div>
								<label className='block text-sm font-medium text-gray-300 mb-2'>Date & Time *</label>
								<input
									type='datetime-local'
									name='date'
									value={formData.date}
									onChange={handleInputChange}
									className='w-full px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white text-sm focus:outline-none focus:border-[#c9a227]/50 focus:ring-1 focus:ring-[#c9a227]/30 transition'
									required
								/>
							</div>
							<div>
								<label className='block text-sm font-medium text-gray-300 mb-2'>Venue *</label>
								<input
									type='text'
									name='venue'
									value={formData.venue}
									onChange={handleInputChange}
									placeholder='Venue'
									className='w-full px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#c9a227]/50 focus:ring-1 focus:ring-[#c9a227]/30 transition'
									required
								/>
							</div>
						</div>

						{/* Capacity & Category */}
						<div className='grid md:grid-cols-2 gap-6'>
							<div>
								<label className='block text-sm font-medium text-gray-300 mb-2'>Capacity *</label>
								<input
									type='number'
									name='capacity'
									value={formData.capacity}
									onChange={handleInputChange}
									min='6'
									placeholder='Capacity (min 6)'
									className='w-full px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#c9a227]/50 focus:ring-1 focus:ring-[#c9a227]/30 transition'
									required
								/>
							</div>
							<div>
								<label className='block text-sm font-medium text-gray-300 mb-2'>Category *</label>
								<select
									name='category'
									value={formData.category}
									onChange={handleInputChange}
									className='w-full px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white text-sm focus:outline-none focus:border-[#c9a227]/50 focus:ring-1 focus:ring-[#c9a227]/30 transition'
									required
								>
									<option value=''>Select category</option>
									<option value='Technology'>Technology</option>
									<option value='Business'>Business</option>
									<option value='Entertainment'>Entertainment</option>
									<option value='Sports'>Sports</option>
									<option value='Education'>Education</option>
									<option value='Art & Culture'>Art & Culture</option>
									<option value='Social'>Social</option>
									<option value='Other'>Other</option>
								</select>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-300 mb-2'>Fee Handling *</label>
								<select
									name='feeByUser'
									value={formData.feeByUser || ''}
									onChange={handleInputChange}
									className='w-full px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white text-sm focus:outline-none focus:border-[#c9a227]/50 focus:ring-1 focus:ring-[#c9a227]/30 transition'
									required
								>
									<option value='' disabled>
										Payment Fee Should be paid by User?
									</option>
									<option value='true'>True</option>
									<option value='false'>
										False (I will Handle the fee)
									</option>
								</select>
							</div>
						</div>

						{/* Tags */}
						<div>
							<label className='block text-sm font-medium text-gray-300 mb-2'>Tags</label>
							<input
								type='text'
								name='tags'
								value={formData.tags}
								onChange={handleInputChange}
								placeholder='Tags (comma separated)'
								className='w-full px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#c9a227]/50 focus:ring-1 focus:ring-[#c9a227]/30 transition'
							/>
						</div>

						{/* Banner Upload */}
						<div>
							<label className='block text-sm font-medium text-gray-300 mb-2'>
								Event Banner *
							</label>

							{/* Hidden input */}
							<input
								id='banner-upload'
								type='file'
								accept='image/*'
								onChange={handleBannerChange}
								className='hidden'
							/>

							{/* Styled button */}
							<label
								htmlFor='banner-upload'
								className='flex items-center justify-center gap-2 w-full px-4 py-3
                          border border-white/[0.08] rounded-lg bg-white/[0.03]
                          text-gray-300 cursor-pointer
                          hover:border-[#c9a227]/30 hover:bg-white/[0.05] transition'
							>
								<Upload className='w-4 h-4 text-[#c9a227]' />
								<span>
									{uploading
										? 'Uploading...'
										: 'Choose Banner Image'}
								</span>
							</label>

							{/* Preview */}
							{bannerPreview && (
								<img
									src={bannerPreview}
									className='mt-4 h-40 w-full object-cover rounded-lg border border-white/[0.08]'
								/>
							)}
						</div>

						{/* Submit */}
						<button
							type='submit'
							disabled={loading || uploading}
							className='w-full py-3 bg-[#c9a227] text-black font-bold rounded-lg hover:bg-[#d4b84a] flex justify-center items-center gap-2 disabled:opacity-50 transition'
						>
							{loading ? (
								<>
									<Loader2 className='animate-spin w-4 h-4' />
									Creating...
								</>
							) : (
								'Create Event'
							)}
						</button>
					</div>
				</form>
			</div>
			</main>
		</div>
	)
}
