'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Loader() {
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const hasLoaded = sessionStorage.getItem('hasLoadedBefore')
		if (hasLoaded) {
			setIsLoading(false)
			return
		}

		const timer = setTimeout(() => {
			setIsLoading(false)
			sessionStorage.setItem('hasLoadedBefore', 'true')
		}, 2800)

		return () => clearTimeout(timer)
	}, [])

	if (!isLoading) return null

	return (
		<AnimatePresence>
			{isLoading && (
				<motion.div
					key='loader'
					initial={{ opacity: 1 }}
					exit={{
						opacity: 0,
						transition: { duration: 0.6, ease: 'easeOut' },
					}}
					className='fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0f]'
					style={{ pointerEvents: 'auto' }}
				>
					{/* Subtle glow */}
					<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#c9a227]/5 rounded-full blur-[120px]' />

					{/* Logo */}
					<motion.div
						initial={{ opacity: 0, y: 12 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, ease: 'easeOut' }}
						className='relative z-10 text-center'
					>
						<h1 className='text-5xl md:text-6xl font-black tracking-tight'>
							<span className='text-white'>LO</span>
							<span className='text-[#c9a227]'>FTE</span>
							<span className='text-white'>-3</span>
						</h1>
						<motion.p
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.4 }}
							className='mt-3 text-sm tracking-[0.3em] text-gray-500 uppercase'
						>
							Events
						</motion.p>
					</motion.div>

					{/* Progress bar */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.5 }}
						className='relative z-10 mt-12 w-48'
					>
						<div className='h-[2px] bg-white/5 rounded-full overflow-hidden'>
							<motion.div
								className='h-full bg-[#c9a227]'
								initial={{ width: '0%' }}
								animate={{ width: '100%' }}
								transition={{
									duration: 2.2,
									ease: [0.25, 0.1, 0.25, 1],
								}}
							/>
						</div>
					</motion.div>

					{/* Bottom tagline */}
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 1 }}
						className='absolute bottom-10 text-gray-600 text-xs tracking-[0.2em] uppercase'
					>
						Exclusive &middot; Curated &middot; Unforgettable
					</motion.p>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
