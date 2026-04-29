'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, AlertCircle, Loader2, KeyRound } from 'lucide-react'
import { toast } from 'sonner'
import { authService } from '@/app/services/authService'

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [isSubmitted, setIsSubmitted] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!email.includes('@')) {
			toast.error('Please enter a valid email address')
			return
		}

		setIsLoading(true)

		try {
			await authService.forgotPassword(email)
			setIsSubmitted(true)
			toast.success('Password reset link sent to your email!')
		} catch (error: any) {
			toast.error(
				error.message || 'Failed to send reset email. Please try again.',
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
							<KeyRound className='w-6 h-6 text-gold' />
						</motion.div>

						<h1 className='text-3xl font-bold mb-2'>
							<span className='text-gold'>Forgot</span>
							<span className='text-white ml-2'>Password</span>
						</h1>
						<p className='text-gray-400 text-sm'>
							Enter your email and we&apos;ll send you a reset link
						</p>
					</motion.div>

					{isSubmitted ? (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
							className='text-center space-y-4'
						>
							<div className='p-4 bg-gold/5 border border-gold/20 rounded-lg'>
								<Mail className='w-10 h-10 text-gold mx-auto mb-3' />
								<p className='text-gray-300 text-sm'>
									If an account exists with{' '}
									<span className='text-gold font-medium'>
										{email}
									</span>
									, you&apos;ll receive a password reset link
									shortly.
								</p>
							</div>
							<p className='text-gray-500 text-xs'>
								Check your spam folder if you don&apos;t see the
								email.
							</p>
							<Link
								href='/auth/login'
								className='inline-block mt-4 text-gold hover:text-yellow-400 text-sm font-medium transition-colors'
							>
								Back to Login
							</Link>
						</motion.div>
					) : (
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
										onChange={(e) =>
											setEmail(e.target.value)
										}
										placeholder='you@example.com'
										required
										className='w-full pl-10 pr-4 py-3 bg-black/50 border border-gold/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition-all'
									/>
								</div>
							</motion.div>

							{/* Submit Button */}
							<motion.button
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.3 }}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								type='submit'
								disabled={isLoading}
								className='w-full py-3 mt-6 bg-gradient-to-r from-gold to-yellow-500 text-black font-bold rounded-lg hover:shadow-lg hover:shadow-gold/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2'
							>
								{isLoading ? (
									<>
										<Loader2 className='w-5 h-5 animate-spin' />
										Sending...
									</>
								) : (
									'Send Reset Link'
								)}
							</motion.button>
						</form>
					)}

					{/* Footer */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5, delay: 0.5 }}
						className='mt-6 pt-6 border-t border-gold/20 text-center'
					>
						<p className='text-gray-400 text-sm'>
							Remember your password?{' '}
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
						transition={{ duration: 0.5, delay: 0.6 }}
						className='mt-6 p-3 bg-gold/5 border border-gold/20 rounded-lg flex gap-2'
					>
						<AlertCircle className='w-5 h-5 text-gold flex-shrink-0 mt-0.5' />
						<p className='text-xs text-gray-300'>
							The reset link will expire after a short period.
							Make sure to use it promptly.
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
						<ArrowLeft className='w-4 h-4' />
						Back to Home
					</Link>
				</motion.div>
			</motion.div>
		</div>
	)
}
