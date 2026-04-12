// components/TicketModal.tsx - REGISTRATION CLOSED VERSION (EVENT TODAY)
'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Ticket, X, Calendar, Clock, MapPin } from 'lucide-react'

interface TicketModalProps {
	isOpen: boolean
	onClose: () => void
}

export default function TicketModal({ isOpen, onClose }: TicketModalProps) {
	if (!isOpen) return null

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className='fixed inset-0 bg-black/90 backdrop-blur-sm z-[1000] flex items-center justify-center p-4'
					onClick={onClose}
				>
					<motion.div
						initial={{ opacity: 0, scale: 0.9, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.9, y: 20 }}
						className='bg-gradient-to-b from-gray-900 to-black border-2 border-gold/30 rounded-2xl max-w-md w-full shadow-2xl shadow-gold/20'
						onClick={(e) => e.stopPropagation()}
					>
						{/* Header */}
						<div className='p-6 border-b border-gold/20 bg-gray-900/50 flex justify-between items-center'>
							<h2 className='text-2xl font-bold text-gold'>
								Tickets
							</h2>
							<button
								onClick={onClose}
								className='p-2 hover:bg-gray-800 rounded-lg transition-colors'
							>
								<X className='w-6 h-6 text-gray-400' />
							</button>
						</div>

						{/* Main Content */}
						<div className='p-8 text-center'>
							{/* Event Day Icon */}
							<div className='w-24 h-24 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6'>
								<Calendar className='w-12 h-12 text-gold' />
							</div>

							{/* Title */}
							<h3 className='text-2xl font-bold text-white mb-3'>
								🎉 EVENT DAY! 🎉
							</h3>

							{/* Event Name */}
							<p className='text-lg font-semibold text-gold mb-2'>
								LOFTE-3 PROJECT HANGOUT/CT DINNER EVENT
							</p>

							{/* Event Date */}
							<div className='flex items-center justify-center gap-2 text-gray-300 mb-4'>
								<Calendar className='w-4 h-4' />
								<span>March 27, 2026</span>
								<Clock className='w-4 h-4 ml-2' />
								<span>11:00AM</span>
							</div>

							{/* Location */}
							<div className='flex items-center justify-center gap-2 text-gray-400 mb-6'>
								<MapPin className='w-4 h-4' />
								<span>Owerri, Nigeria</span>
							</div>

							{/* Registration Closed Message */}
							<div className='bg-gold/10 border border-gold/30 rounded-xl p-5 mb-6'>
								<p className='text-gray-300 font-medium mb-2'>
									Registration is now closed.
								</p>
								<p className='text-sm text-gray-400'>
									The event is happening today! If you have
									already registered, please check your email
									for your ticket.
								</p>
							</div>

							{/* Buttons */}
							<div className='flex flex-col gap-3'>
								<button
									onClick={onClose}
									className='w-full py-3 border border-gold text-gold rounded-lg hover:bg-gold/10 transition font-medium'
								>
									Close
								</button>
								<a
									href='https://t.me/Lofte3'
									target='_blank'
									rel='noopener noreferrer'
									className='w-full py-3 bg-gradient-to-r from-gold to-yellow-500 text-black font-bold rounded-lg hover:opacity-90 transition text-center'
								>
									Contact Support
								</a>
							</div>

							{/* Footer Note */}
							<p className='text-xs text-gray-500 mt-6'>
								For inquiries about the event, please reach out
								to our support team.
							</p>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
