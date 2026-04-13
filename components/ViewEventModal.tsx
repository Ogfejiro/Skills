import { useState } from 'react'
import { Calendar, MapPin, X } from 'lucide-react'

interface Props {
	event: any
	isOpen: boolean
	onClose: () => void
	onGetTickets: (eventId: string) => void
}

const ViewEventModal = ({ event, isOpen, onClose, onGetTickets }: Props) => {
	if (!isOpen || !event) return null

	return (
		<div className='fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4'>
			{/* Modal */}
			<div className='relative w-full max-w-2xl max-h-[90vh] bg-[#10101e] rounded-2xl border border-white/10 flex flex-col overflow-hidden'>
				{/* Close Button */}
				<button
					onClick={onClose}
					className='absolute top-4 right-4 text-white/70 hover:text-white z-10'
				>
					<X size={20} />
				</button>

				{/* Banner (fixed height but NOT forced crop) */}
				{event.banner && (
					<div className='w-full bg-black flex justify-center items-center max-h-[280px] overflow-hidden'>
						<img
							src={event.banner}
							className='w-full h-full object-contain'
							alt='event banner'
						/>
					</div>
				)}

				{/* Scrollable Content */}
				<div className='p-5 lg:p-6 overflow-y-auto flex-1'>
					<h2 className='text-xl font-bold'>{event.title}</h2>

					<p className='text-gray-400 mt-3 whitespace-pre-wrap'>
						{event.description}
					</p>

					<div className='mt-5 text-sm text-gray-400 space-y-3'>
						<div className='flex gap-2 items-center'>
							<Calendar size={16} />
							{event.date
								? new Date(event.date).toLocaleString()
								: 'TBA'}
						</div>

						<div className='flex gap-2 items-center'>
							<MapPin size={16} />
							{event.venue || 'TBA'}
						</div>
					</div>
				</div>

				{/* Footer (always visible) */}
				<div className='p-5 border-t border-white/10'>
					<button
						onClick={() => onGetTickets(event._id)}
						className='w-full bg-[#c9a227] text-black py-3 rounded-md font-bold hover:opacity-90 transition'
					>
						Get Tickets
					</button>
				</div>
			</div>
		</div>
	)
}

export default ViewEventModal
