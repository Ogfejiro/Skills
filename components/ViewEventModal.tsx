import { Calendar, MapPin, X, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
	event: any
	isOpen: boolean
	onClose: () => void
	onGetTickets: (eventId: string) => void
}

const ViewEventModal = ({ event, isOpen, onClose, onGetTickets }: Props) => {
	if (!isOpen || !event) return null

	const isLiveEvent = event.status === 'live'

	const handleGetTicketsClick = () => {
		if (!isLiveEvent) {
			toast.error('Tickets are only available for live events')
			return
		}

		onGetTickets(event._id)
	}

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

					{!isLiveEvent && (
						<div className='mt-5 rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-sm text-yellow-200 flex gap-2 items-start'>
							<AlertCircle
								size={16}
								className='shrink-0 mt-0.5 text-yellow-400'
							/>
							<span>
								This event is not currently live, so tickets are
								unavailable.
							</span>
						</div>
					)}
				</div>

				{/* Footer (always visible) */}
				<div className='p-5 border-t border-white/10'>
					<button
						onClick={handleGetTicketsClick}
						className={`w-full py-3 rounded-md font-bold transition ${
							isLiveEvent
								? 'bg-[#c9a227] text-black hover:opacity-90'
								: 'bg-white/10 text-gray-400 border border-white/10 hover:bg-white/15'
						}`}
					>
						{isLiveEvent ? 'Get Tickets' : 'Tickets Unavailable'}
					</button>
				</div>
			</div>
		</div>
	)
}

export default ViewEventModal
