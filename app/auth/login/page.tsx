'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { LogIn, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const { login, isAuthenticated, hostProfile: hostProfileCache } = useAuth()
	const router = useRouter()

	useEffect(() => {
		if (isAuthenticated) {
			routeAfterLogin()
		}
	}, [isAuthenticated, router])

	const routeAfterLogin = () => {
		const userStr = localStorage.getItem('user')
		if (userStr) {
			const user = JSON.parse(userStr)
			if (user.role === 'Admin') {
				router.push('/dashboard/admin')
			} else if (user.role === 'Host' || hostProfileCache.hasProfile) {
				router.push('/dashboard/host')
			} else {
				router.push('/dashboard/user')
			}
		} else {
			router.push('/dashboard/user')
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)

		try {
			await login(email, password)
			toast.success('Login successful!')
			// Route based on role - host profile check happens in context
			routeAfterLogin()
		} catch (error: any) {
			toast.error(
				error.message || 'Login failed. Please check your credentials.',
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
						className='text-center mb-8'
					>
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ type: 'spring', stiffness: 200 }}
							className='inline-block p-3 rounded-full bg-gold/10 border border-gold/30 mb-4'
						>
							<LogIn className='w-6 h-6 text-gold' />
						</motion.div>

						<h1 className='text-3xl font-bold mb-2'>
							<span className='text-gold'>Welcome</span>
							<span className='text-white ml-2'>Back</span>
						</h1>
						<p className='text-gray-400 text-sm'>
							Login to access your dashboard
						</p>
					</motion.div>

					{/* Form */}
					<form onSubmit={handleSubmit} className='space-y-5'>
						{/* Email */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.2 }}
						>
							<label className='block text-sm font-medium text-gray-300 mb-2'>
								Email Address
							</label>
							<div className='relative'>
								<Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/50' />
								<input
									type='email'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder='you@example.com'
									required
									className='w-full pl-10 pr-4 py-3 bg-black/50 border border-gold/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition-all'
								/>
							</div>
						</motion.div>

						{/* Password */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.3 }}
						>
							<label className='block text-sm font-medium text-gray-300 mb-2'>
								Password
							</label>
							<div className='relative'>
								<Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/50' />
								<input
									type='password'
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									placeholder='••••••••'
									required
									className='w-full pl-10 pr-4 py-3 bg-black/50 border border-gold/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition-all'
								/>
							</div>
						</motion.div>

						{/* Forgot Password */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.5, delay: 0.35 }}
							className='text-right'
						>
							<Link
								href='/auth/forgot-password'
								className='text-sm text-gold hover:text-yellow-400 transition-colors'
							>
								Forgot Password?
							</Link>
						</motion.div>

						{/* Submit Button */}
						<motion.button
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.4 }}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							type='submit'
							disabled={isLoading}
							className='w-full py-3 mt-6 bg-gradient-to-r from-gold to-yellow-500 text-black font-bold rounded-lg hover:shadow-lg hover:shadow-gold/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2'
						>
							{isLoading ? (
								<>
									<Loader2 className='w-5 h-5 animate-spin' />
									Logging in...
								</>
							) : (
								<>
									<LogIn className='w-5 h-5' />
									Login
								</>
							)}
						</motion.button>
					</form>

					{/* Footer */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5, delay: 0.5 }}
						className='mt-6 pt-6 border-t border-gold/20 text-center'
					>
						<p className='text-gray-400 text-sm'>
							Don't have an account?
							<Link
								href='/auth/register'
								className='text-gold hover:text-yellow-400 font-medium transition-colors'
							>
								Register here
							</Link>
						</p>
					</motion.div>

					{/* Info Box */}
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.6 }}
						className='mt-6 p-3 bg-gold/5 border border-gold/20 rounded-lg flex gap-2'
					>
						<AlertCircle className='w-5 h-5 text-gold flex-shrink-0 mt-0.5' />
						<p className='text-xs text-gray-300'>
							Use your registered email and password to access
							your event management dashboard.
						</p>
					</motion.div>
				</div>

				{/* Back to Home */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.7 }}
					className='mt-6 text-center'
				>
					<Link
						href='/'
						className='text-gray-400 hover:text-gold text-sm transition-colors inline-flex items-center gap-1'
					>
						← Back to Home
					</Link>
				</motion.div>
			</motion.div>
		</div>
	)
}
