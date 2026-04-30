'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
	Lock,
	ArrowLeft,
	AlertCircle,
	Loader2,
	ShieldCheck,
	CheckCircle2,
} from 'lucide-react'
import { toast } from 'sonner'
import { authService } from '@/app/services/authService'

export default function ResetPasswordContent() {
	const searchParams = useSearchParams()
	const router = useRouter()
	const token = searchParams.get('token')

	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [isVerifying, setIsVerifying] = useState(true)
	const [isTokenValid, setIsTokenValid] = useState(false)
	const [isSuccess, setIsSuccess] = useState(false)
	const [verifiedToken, setVerifiedToken] = useState('')

	useEffect(() => {
		const verifyToken = async () => {
			if (!token) {
				setIsVerifying(false)
				return
			}

			try {
				const result = await authService.verifyResetToken(token)
				setIsTokenValid(true)
				setVerifiedToken(result.token)
			} catch (error: any) {
				toast.error(error.message || 'Invalid or expired reset link')
				setIsTokenValid(false)
			} finally {
				setIsVerifying(false)
			}
		}

		verifyToken()
	}, [token])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (password.length < 6) {
			toast.error('Password must be at least 6 characters')
			return
		}

		if (password !== confirmPassword) {
			toast.error('Passwords do not match')
			return
		}

		setIsLoading(true)

		try {
			await authService.resetPassword(
				verifiedToken,
				password,
				confirmPassword,
			)
			setIsSuccess(true)
			toast.success('Password reset successfully!')
			setTimeout(() => {
				router.push('/auth/login')
			}, 3000)
		} catch (error: any) {
			toast.error(
				error.message || 'Failed to reset password. Please try again.',
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
							<ShieldCheck className='w-6 h-6 text-gold' />
						</motion.div>

						<h1 className='text-3xl font-bold mb-2'>
							<span className='text-gold'>Reset</span>
							<span className='text-white ml-2'>Password</span>
						</h1>
						<p className='text-gray-400 text-sm'>
							Enter your new password below
						</p>
					</motion.div>

					{isVerifying ? (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className='text-center py-8'
						>
							<Loader2 className='w-8 h-8 text-gold animate-spin mx-auto mb-3' />
							<p className='text-gray-400 text-sm'>
								Verifying your reset link...
							</p>
						</motion.div>
					) : !token || !isTokenValid ? (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className='text-center space-y-4'
						>
							<div className='p-4 bg-red-500/5 border border-red-500/20 rounded-lg'>
								<AlertCircle className='w-10 h-10 text-red-400 mx-auto mb-3' />
								<p className='text-gray-300 text-sm'>
									{!token
										? 'No reset token found. Please request a new password reset link.'
										: 'This reset link is invalid or has expired. Please request a new one.'}
								</p>
							</div>
							<Link
								href='/auth/forgot-password'
								className='inline-block mt-4 py-2.5 px-6 bg-gradient-to-r from-gold to-yellow-500 text-black font-bold rounded-lg hover:shadow-lg hover:shadow-gold/20 transition-all text-sm'
							>
								Request New Link
							</Link>
						</motion.div>
					) : isSuccess ? (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className='text-center space-y-4'
						>
							<div className='p-4 bg-green-500/5 border border-green-500/20 rounded-lg'>
								<CheckCircle2 className='w-10 h-10 text-green-400 mx-auto mb-3' />
								<p className='text-gray-300 text-sm'>
									Your password has been reset successfully!
									Redirecting to login...
								</p>
							</div>
						</motion.div>
					) : (
						<form onSubmit={handleSubmit} className='space-y-5'>
							{/* New Password */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.2 }}
							>
								<label className='block text-sm font-medium text-gray-300 mb-2'>
									New Password
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

							{/* Confirm Password */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.3 }}
							>
								<label className='block text-sm font-medium text-gray-300 mb-2'>
									Confirm New Password
								</label>
								<div className='relative'>
									<Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/50' />
									<input
										type='password'
										value={confirmPassword}
										onChange={(e) =>
											setConfirmPassword(e.target.value)
										}
										placeholder='••••••••'
										required
										className='w-full pl-10 pr-4 py-3 bg-black/50 border border-gold/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition-all'
									/>
								</div>
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
										Resetting...
									</>
								) : (
									'Reset Password'
								)}
							</motion.button>
						</form>
					)}

					{/* Info Box */}
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.6 }}
						className='mt-6 p-3 bg-gold/5 border border-gold/20 rounded-lg flex gap-2'
					>
						<AlertCircle className='w-5 h-5 text-gold flex-shrink-0 mt-0.5' />
						<p className='text-xs text-gray-300'>
							Your new password must be at least 6 characters
							long.
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
