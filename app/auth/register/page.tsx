'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
	UserPlus,
	Mail,
	Lock,
	Phone,
	User,
	AlertCircle,
	Loader2,
	ArrowLeft,
} from 'lucide-react'
import { toast } from 'sonner'

export default function RegisterPage() {
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		password: '',
		confirmPassword: '',
	})
	const [isLoading, setIsLoading] = useState(false)
	const { register, isAuthenticated } = useAuth()
	const router = useRouter()

	useEffect(() => {
		if (isAuthenticated) {
			router.push('/dashboard/user')
		}
	}, [isAuthenticated, router])

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}))
	}

	const validateForm = () => {
		if (!formData.firstName.trim()) {
			toast.error('First name is required')
			return false
		}
		if (!formData.lastName.trim()) {
			toast.error('Last name is required')
			return false
		}
		if (!formData.email.includes('@')) {
			toast.error('Valid email is required')
			return false
		}
		if (formData.phone.length < 10) {
			toast.error('Phone number must be at least 10 digits')
			return false
		}
		if (formData.password.length < 6) {
			toast.error('Password must be at least 6 characters')
			return false
		}
		if (formData.password !== formData.confirmPassword) {
			toast.error('Passwords do not match')
			return false
		}
		return true
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!validateForm()) {
			return
		}

		setIsLoading(true)

		try {
			await register({
				firstName: formData.firstName,
				lastName: formData.lastName,
				email: formData.email,
				phone: formData.phone,
				password: formData.password,
			})

			toast.success('Registration successful! Redirecting to dashboard...')
			setTimeout(() => {
				router.push('/dashboard/user')
			}, 1500)
		} catch (error: any) {
			toast.error(
				error.message || 'Registration failed. Please try again.',
			)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className='min-h-screen bg-black text-white overflow-x-hidden flex items-center justify-center px-4 py-20 md:py-8'>
			{/* Background Effects */}
			<div className='absolute inset-0 overflow-hidden pointer-events-none'>
				<motion.div
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 0.2 }}
					transition={{ duration: 0.6 }}
					className='absolute top-20 left-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl'
				/>
				<motion.div
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 0.2 }}
					transition={{ duration: 0.6, delay: 0.15 }}
					className='absolute bottom-20 right-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl'
				/>
			</div>

			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5 }}
				className='relative z-10 w-full max-w-md'
			>
				{/* Card */}
				<div className='bg-black/40 backdrop-blur-xl border border-gold/20 rounded-2xl p-5 sm:p-8 shadow-2xl shadow-gold/5'>
					{/* Header */}
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.1 }}
						className='text-center mb-6'
					>
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ type: 'spring', stiffness: 200 }}
							className='inline-block p-3 rounded-full bg-gold/10 border border-gold/30 mb-4'
						>
							<UserPlus className='w-6 h-6 text-gold' />
						</motion.div>

						<h1 className='text-3xl font-bold mb-2'>
							<span className='text-gold'>Create</span>
							<span className='text-white ml-2'>Account</span>
						</h1>
						<p className='text-gray-400 text-sm'>
							Join LOFTE-3 to start listing events
						</p>
					</motion.div>

					{/* Form */}
					<form onSubmit={handleSubmit} className='space-y-3'>
						{/* Name Row */}
						<div className='grid grid-cols-2 gap-3'>
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.15 }}
							>
								<label className='block text-xs font-medium text-gray-300 mb-1'>
									First Name
								</label>
								<div className='relative'>
									<User className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/50' />
									<input
										type='text'
										name='firstName'
										value={formData.firstName}
										onChange={handleChange}
										placeholder='John'
										className='w-full pl-9 pr-3 py-2 bg-black/50 border border-gold/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all text-sm'
									/>
								</div>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.16 }}
							>
								<label className='block text-xs font-medium text-gray-300 mb-1'>
									Last Name
								</label>
								<div className='relative'>
									<User className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/50' />
									<input
										type='text'
										name='lastName'
										value={formData.lastName}
										onChange={handleChange}
										placeholder='Doe'
										className='w-full pl-9 pr-3 py-2 bg-black/50 border border-gold/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all text-sm'
									/>
								</div>
							</motion.div>
						</div>

						{/* Email */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.2 }}
						>
							<label className='block text-xs font-medium text-gray-300 mb-1'>
								Email Address
							</label>
							<div className='relative'>
								<Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/50' />
								<input
									type='email'
									name='email'
									value={formData.email}
									onChange={handleChange}
									placeholder='you@example.com'
									className='w-full pl-9 pr-3 py-2 bg-black/50 border border-gold/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all text-sm'
								/>
							</div>
						</motion.div>

						{/* Phone */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.25 }}
						>
							<label className='block text-xs font-medium text-gray-300 mb-1'>
								Phone Number
							</label>
							<div className='relative'>
								<Phone className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/50' />
								<input
									type='tel'
									name='phone'
									value={formData.phone}
									onChange={handleChange}
									placeholder='+234...'
									className='w-full pl-9 pr-3 py-2 bg-black/50 border border-gold/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all text-sm'
								/>
							</div>
						</motion.div>

						{/* Password */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.35 }}
						>
							<label className='block text-xs font-medium text-gray-300 mb-1'>
								Password
							</label>
							<div className='relative'>
								<Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/50' />
								<input
									type='password'
									name='password'
									value={formData.password}
									onChange={handleChange}
									placeholder='••••••••'
									className='w-full pl-9 pr-3 py-2 bg-black/50 border border-gold/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all text-sm'
								/>
							</div>
						</motion.div>

						{/* Confirm Password */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.4 }}
						>
							<label className='block text-xs font-medium text-gray-300 mb-1'>
								Confirm Password
							</label>
							<div className='relative'>
								<Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/50' />
								<input
									type='password'
									name='confirmPassword'
									value={formData.confirmPassword}
									onChange={handleChange}
									placeholder='••••••••'
									className='w-full pl-9 pr-3 py-2 bg-black/50 border border-gold/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all text-sm'
								/>
							</div>
						</motion.div>

						{/* Submit Button */}
						<motion.button
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.45 }}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							type='submit'
							disabled={isLoading}
							className='w-full py-2.5 mt-4 bg-gradient-to-r from-gold to-yellow-500 text-black font-bold rounded-lg hover:shadow-lg hover:shadow-gold/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm'
						>
							{isLoading ? (
								<>
									<Loader2 className='w-4 h-4 animate-spin' />
									Creating account...
								</>
							) : (
								<>
									<UserPlus className='w-4 h-4' />
									Create Account
								</>
							)}
						</motion.button>
					</form>

					{/* Footer */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5, delay: 0.5 }}
						className='mt-4 pt-4 border-t border-gold/20 text-center'
					>
						<p className='text-gray-400 text-xs'>
							Already have an account?
							<Link
								href='/auth/login'
								className='text-gold hover:text-yellow-400 font-medium transition-colors'
							>
								Login here
							</Link>
						</p>
					</motion.div>

					{/* Info Box */}
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.55 }}
						className='mt-4 p-2.5 bg-gold/5 border border-gold/20 rounded-lg flex gap-2'
					>
						<AlertCircle className='w-4 h-4 text-gold flex-shrink-0 mt-0.5' />
						<p className='text-xs text-gray-300'>
							Secure registration. Your data is encrypted and
							never shared.
						</p>
					</motion.div>
				</div>

				{/* Back to Home */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.6 }}
					className='mt-6 text-center'
				>
					<Link
						href='/'
						className='text-gray-400 hover:text-gold text-sm transition-colors inline-flex items-center gap-1'
					>
						<ArrowLeft className='w-4 h-4' />
						Back to Home
					</Link>
				</motion.div>
			</motion.div>
		</div>
	)
}
