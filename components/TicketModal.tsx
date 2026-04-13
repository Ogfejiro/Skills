// components/TicketModal.tsx
'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Ticket, X, Calendar, Clock, MapPin } from 'lucide-react'

interface TicketData {
	ticketId: string
	ticketName: string
	amount: number
	currency: string
	status: string
	customerEmail: string
	eventDate?: string
	eventName?: string
	eventLocation?: string
	purchaseDate?: string
}

interface TicketModalProps {
	isOpen: boolean
	onClose: () => void
	tickets?: TicketData[]
}

export default function TicketModal({ isOpen, onClose, tickets = [] }: TicketModalProps) {
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
						className='bg-gradient-to-b from-gray-900 to-black border-2 border-gold/30 rounded-2xl max-w-2xl w-full max-h-[80vh] shadow-2xl shadow-gold/20 flex flex-col'
						onClick={(e) => e.stopPropagation()}
					>
						{/* Header */}
						<div className='p-6 border-b border-gold/20 bg-gray-900/50 flex justify-between items-center flex-shrink-0'>
							<h2 className='text-2xl font-bold text-gold'>
								My Tickets ({tickets.length})
							</h2>
							<button
								onClick={onClose}
								className='p-2 hover:bg-gray-800 rounded-lg transition-colors'
							>
								<X className='w-6 h-6 text-gray-400' />
							</button>
						</div>

						{/* Main Content - Scrollable */}
						<div className='flex-1 overflow-y-auto p-6'>
							{tickets.length === 0 ? (
								<div className='text-center py-12'>
									{/* Event Day Icon */}
									<div className='w-24 h-24 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6'>
										<Ticket className='w-12 h-12 text-gold' />
									</div>

									{/* Title */}
									<h3 className='text-2xl font-bold text-white mb-3'>
										No Tickets Yet
									</h3>

									{/* Message */}
									<p className='text-gray-400 mb-6'>
										You haven't registered for any events yet.
									</p>

									{/* Action Button */}
									<button
										onClick={onClose}
										className='w-full py-3 border border-gold text-gold rounded-lg hover:bg-gold/10 transition font-medium'
									>
										Browse Events
									</button>
								</div>
							) : (
								<div className='space-y-4'>
									{tickets.map((ticket) => (
										<div
											key={ticket.ticketId}
											className='bg-gray-800/50 border border-gold/20 rounded-lg p-4 hover:border-gold/40 transition'
										>
											<div className='flex items-start justify-between mb-3'>
												<div className='flex-1'>
													<h3 className='text-lg font-bold text-gold mb-1'>
														{ticket.ticketName}
													</h3>
													<p className='text-sm text-gray-400'>
														{ticket.eventName || 'Event'}
													</p>
												</div>
												<span
													className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${
														ticket.status === 'paid'
															? 'bg-green-500/20 text-green-400 border border-green-500/30'
															: ticket.status === 'pending'
															? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
															: 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
													}`}
												>
													{ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
												</span>
											</div>

											<div className='space-y-2 text-sm text-gray-300 mb-3'>
												{ticket.eventDate && (
													<div className='flex items-center gap-2'>
														<Calendar className='w-4 h-4 text-gold' />
														<span>{new Date(ticket.eventDate).toLocaleDateString()}</span>
													</div>
												)}
												{ticket.eventLocation && (
													<div className='flex items-center gap-2'>
														<MapPin className='w-4 h-4 text-gold' />
														<span>{ticket.eventLocation}</span>
													</div>
												)}
												<div className='flex items-center gap-2'>
													<span className='font-semibold text-gold'>
														{ticket.currency} {ticket.amount}
													</span>
												</div>
												<div className='text-xs text-gray-500'>
													{ticket.customerEmail}
												</div>
											</div>

											<button className='w-full py-2 bg-gold/10 text-gold border border-gold/30 rounded hover:bg-gold/20 transition text-sm font-medium'>
												View Details
											</button>
										</div>
									))}
								</div>
							)}
						</div>

						{/* Footer - Always visible */}
						{tickets.length > 0 && (
							<div className='p-6 border-t border-gold/20 bg-gray-900/50 flex-shrink-0'>
								<button
									onClick={onClose}
									className='w-full py-3 border border-gold text-gold rounded-lg hover:bg-gold/10 transition font-medium'
								>
									Close
								</button>
							</div>
						)}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
