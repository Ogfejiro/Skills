'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import {
	Loader2,
	ArrowLeft,
	Calendar,
	MapPin,
	Users,
	Tag,
	Pencil,
	Trash2,
	X,
} from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import eventService, { Event } from '@/app/services/eventService'
import ticketService, { Ticket, TicketData } from '@/app/services/ticketService'

export default function ViewEventPage() {
	const router = useRouter()
	const params = useParams()
	const eventId = params.id as string
	const { token } = useAuth()

	const [loading, setLoading] = useState(true)
	const [ticketsLoading, setTicketsLoading] = useState(true)
	const [error, setError] = useState('')

	const [event, setEvent] = useState<Event | null>(null)
	const [tickets, setTickets] = useState<Ticket[]>([])

	const [showModal, setShowModal] = useState(false)
	const [editingTicket, setEditingTicket] = useState<Ticket | null>(null)
	const [creating, setProcessing] = useState(false)

	const [ticketForm, setTicketForm] = useState({
		title: '',
		description: '',
		price: '',
		quantity: '',
		currency: 'NGN',
		benefits: [''], // ✅ start with one input
	})

	const isEventLocked =
		event?.status === 'ended' || event?.status === 'cancelled'

	// Fetch event + tickets
	useEffect(() => {
		const fetchData = async () => {
			try {
				if (!token) throw new Error('Authentication required')

				const [eventRes, ticketRes] = await Promise.all([
					eventService.getEventById(eventId, token),
					ticketService.getEventTickets(eventId, token),
				])

				if (eventRes.success) setEvent(eventRes.data)
				if (ticketRes.success) setTickets(ticketRes.data)
			} catch (err) {
				setError('Failed to load')
			} finally {
				setLoading(false)
				setTicketsLoading(false)
			}
		}

		if (eventId && token) fetchData()
	}, [eventId, token])

	const openCreateModal = () => {
		setEditingTicket(null)

		setTicketForm({
			title: '',
			description: '',
			price: '',
			quantity: '',
			currency: 'NGN',
			benefits: [''],
		})

		setShowModal(true)
	}

	const openEditModal = (ticket: Ticket) => {
		setEditingTicket(ticket)

		setTicketForm({
			title: ticket.title,
			description: ticket.description || '',
			price: String(ticket.price),
			quantity: String(ticket.quantity),
			currency: ticket.currency || 'NGN',
			benefits:
				ticket.benefits && ticket.benefits.length > 0
					? ticket.benefits
					: [''],
		})

		setShowModal(true)
	}

	const handleSubmitTicket = async () => {
		if (!token) return

		setProcessing(true)
		try {
			const payload: TicketData = {
				title: ticketForm.title,
				description: ticketForm.description,
				price: Number(ticketForm.price),
				quantity: Number(ticketForm.quantity),
				benefits: ticketForm.benefits.filter((b) => b.trim() !== ''),
				currency: ticketForm.currency as 'NGN' | 'USD',
			}

			if (editingTicket) {
				const res = await ticketService.updateTicket(
					editingTicket._id,
					payload,
					token,
				)

				setTickets((prev) =>
					prev.map((t) =>
						t._id === editingTicket._id ? res.data : t,
					),
				)
			} else {
				const res = await ticketService.createTicket(
					eventId,
					payload,
					token,
				)
				setTickets((prev) => [...prev, res.data])
			}

			setShowModal(false)
		} catch (err) {
			console.error(err)
		} finally {
			setProcessing(false)
		}
	}

	const handleDelete = async (ticketId: string) => {
		if (!token) return
		if (!confirm('Delete ticket?')) return

		await ticketService.deleteTicket(ticketId, token)
		setTickets((prev) => prev.filter((t) => t._id !== ticketId))
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		})
	}

	const getStatusBadge = (status: string) => {
		return <span className='px-3 py-1 bg-gray-700 rounded'>{status}</span>
	}

	if (loading) {
		return (
			<main className='min-h-screen bg-black text-white'>
				<Navbar />
				<div className='flex items-center justify-center min-h-[60vh]'>
					<Loader2 className='w-12 h-12 text-gold animate-spin' />
				</div>
			</main>
		)
	}

	if (error || !event) {
		return (
			<main className='min-h-screen bg-black text-white'>
				<Navbar />
				<div className='container mx-auto px-4 pt-28 pb-12'>
					<Link
						href='/dashboard/host'
						className='flex items-center gap-2 text-gold hover:text-gold/80 transition mb-4'
					>
						<ArrowLeft className='w-4 h-4' /> Back to Dashboard
					</Link>
					<div className='p-6 border border-red-500/30 bg-red-500/10 rounded-lg text-red-400'>
						{error || 'Event not found'}
					</div>
				</div>
			</main>
		)
	}

	return (
		<main className='min-h-screen bg-black text-white'>
			<Navbar />
			<div className='container mx-auto px-4 pt-28 pb-12'>
				<Link
					href='/dashboard/host'
					className='flex items-center gap-2 text-gold mb-4'
				>
					<ArrowLeft className='w-4 h-4' />
					Back
				</Link>
			</div>
			{/* Event Banner */}
			{event.banner && (
				<div className='mb-8 rounded-xl overflow-hidden border border-gold/20'>
					<img
						src={event.banner}
						alt={event.title}
						className='w-full h-96 object-cover'
					/>
				</div>
			)}
			{/* Event Details Card */}
			<div className='bg-gray-900/50 border border-gold/20 rounded-xl p-8 space-y-6'>
				{/* Title and Status */}
				<div>
					<h1 className='text-4xl font-bold mb-4'>{event.title}</h1>
					<div className='flex items-center gap-3 flex-wrap'>
						{getStatusBadge(event.status)}
						{event.category && (
							<span className='inline-block px-3 py-1 text-sm bg-gray-800 text-gray-300 rounded-lg border border-gold/20'>
								{event.category}
							</span>
						)}
					</div>
				</div>

				{/* Key Information */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<div className='space-y-4'>
						<div className='flex items-start gap-3'>
							<Calendar className='w-5 h-5 text-gold flex-shrink-0 mt-1' />
							<div>
								<p className='text-gray-400 text-sm'>
									Date & Time
								</p>
								<p className='text-white'>
									{formatDate(event.date)}
								</p>
							</div>
						</div>
						<div className='flex items-start gap-3'>
							<MapPin className='w-5 h-5 text-gold flex-shrink-0 mt-1' />
							<div>
								<p className='text-gray-400 text-sm'>Venue</p>
								<p className='text-white'>{event.venue}</p>
							</div>
						</div>
						<div className='flex items-start gap-3'>
							<Users className='w-5 h-5 text-gold flex-shrink-0 mt-1' />
							<div>
								<p className='text-gray-400 text-sm'>
									Capacity
								</p>
								<p className='text-white'>
									{event.ticketsSold} / {event.capacity}{' '}
									attendees
								</p>
							</div>
						</div>
					</div>

					{/* Description */}
					<div>
						<p className='text-gray-400 text-sm mb-2'>
							Description
						</p>
						<p className='text-white whitespace-pre-wrap'>
							{event.description}
						</p>
					</div>
				</div>

				{/* Tags */}
				{event.tags && event.tags.length > 0 && (
					<div>
						<p className='text-gray-400 text-sm mb-3'>Tags</p>
						<div className='flex flex-wrap gap-2'>
							{event.tags.map((tag, index) => (
								<span
									key={index}
									className='inline-flex items-center gap-1 px-3 py-1 bg-gold/10 text-gold rounded-lg border border-gold/30 text-sm'
								>
									<Tag className='w-3 h-3' /> {tag}
								</span>
							))}
						</div>
					</div>
				)}

				{/* Action Buttons */}
				<div className='flex gap-4 pt-4'>
					<Link
						href={'/dashboard/events/${event._id}/edit'}
						className='flex-1 px-6 py-3 bg-gold text-black font-bold rounded-lg hover:opacity-90 transition text-center'
					>
						Edit Event
					</Link>
					<Link
						href='/dashboard/host'
						className='flex-1 px-6 py-3 border border-gold/30 rounded-lg hover:bg-gray-800 transition text-center'
					>
						Back to Dashboard
					</Link>
				</div>

				{/* ✅ NEW: TICKETS SECTION */}
				<div className='mt-8 bg-gray-900/50 border border-gold/20 rounded-xl p-8'>
					<div className='flex justify-between items-center mb-6'>
						<h2 className='text-2xl font-bold'>Tickets</h2>

						<button
							onClick={openCreateModal}
							disabled={isEventLocked}
							className='px-4 py-2 bg-gold text-black rounded-lg disabled:opacity-40'
						>
							+ Add Ticket
						</button>
					</div>

					{isEventLocked && (
						<p className='text-red-400 text-sm mb-4'>
							Event ended — ticket actions disabled
						</p>
					)}

					{ticketsLoading ? (
						<Loader2 className='animate-spin' />
					) : tickets.length === 0 ? (
						<p className='text-gray-400'>No tickets yet</p>
					) : (
						<div className='space-y-4'>
							{tickets.map((ticket) => (
								<div
									key={ticket._id}
									className='p-4 border border-gold/20 rounded-lg flex justify-between'
								>
									<div>
										<h3>{ticket.title}</h3>
										<p>₦{ticket.price}</p>
									</div>

									<div className='flex gap-3'>
										<Pencil
											onClick={() =>
												openEditModal(ticket)
											}
										/>
										<Trash2
											onClick={() =>
												handleDelete(ticket._id)
											}
										/>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>

			{/* ========================= */}
			{/* 🧾 MODAL */}
			{/* ========================= */}
			{showModal && (
				<div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50'>
					<div className='bg-gray-900 p-6 rounded-xl w-full max-w-md space-y-4 border border-gold/20'>
						{/* Header */}
						<div className='flex justify-between items-center'>
							<h2 className='text-xl font-bold'>Create Ticket</h2>
							<button onClick={() => setShowModal(false)}>
								<X />
							</button>
						</div>

						{/* Title */}
						<input
							placeholder='Title'
							value={ticketForm.title}
							onChange={(e) =>
								setTicketForm({
									...ticketForm,
									title: e.target.value,
								})
							}
							className='w-full px-4 py-2 bg-gray-800 rounded'
						/>

						{/* Description */}
						<textarea
							placeholder='Description'
							value={ticketForm.description}
							onChange={(e) =>
								setTicketForm({
									...ticketForm,
									description: e.target.value,
								})
							}
							className='w-full px-4 py-2 bg-gray-800 rounded'
						/>

						{/* ✅ Currency Selector */}
						<div>
							<label className='text-sm text-gray-400 mb-1 block'>
								Currency
							</label>
							<div className='flex gap-2'>
								{['NGN', 'USD'].map((cur) => (
									<button
										key={cur}
										type='button'
										onClick={() =>
											setTicketForm({
												...ticketForm,
												currency: cur,
											})
										}
										className={`flex-1 py-2 rounded-lg border transition ${
											ticketForm.currency === cur
												? 'bg-gold text-black border-gold'
												: 'bg-gray-800 text-gray-300 border-gray-700 hover:border-gold'
										}`}
									>
										{cur === 'NGN' ? '₦ Naira' : '$ USD'}
									</button>
								))}
							</div>
						</div>

						{/* Price */}
						<input
							type='number'
							placeholder={`Price (${ticketForm.currency})`}
							value={ticketForm.price}
							onChange={(e) =>
								setTicketForm({
									...ticketForm,
									price: e.target.value,
								})
							}
							className='w-full px-4 py-2 bg-gray-800 rounded'
						/>

						{/* Quantity */}
						<input
							type='number'
							placeholder='Quantity'
							value={ticketForm.quantity}
							onChange={(e) =>
								setTicketForm({
									...ticketForm,
									quantity: e.target.value,
								})
							}
							className='w-full px-4 py-2 bg-gray-800 rounded'
						/>

						{/* ========================= */}
						{/* ✅ Benefits Input (Dynamic) */}
						{/* ========================= */}
						<div>
							<label className='text-sm text-gray-400 mb-2 block'>
								Benefits
							</label>

							<div className='space-y-2'>
								{ticketForm.benefits.map(
									(benefit: string, index: number) => (
										<div key={index} className='flex gap-2'>
											<input
												type='text'
												placeholder={`Benefit ${index + 1}`}
												value={benefit}
												onChange={(e) => {
													const updated = [
														...ticketForm.benefits,
													]
													updated[index] =
														e.target.value
													setTicketForm({
														...ticketForm,
														benefits: updated,
													})
												}}
												className='flex-1 px-4 py-2 bg-gray-800 rounded'
											/>

											{/* Remove button */}
											<button
												type='button'
												onClick={() => {
													const updated =
														ticketForm.benefits.filter(
															(
																_: string,
																i: number,
															) => i !== index,
														)
													setTicketForm({
														...ticketForm,
														benefits: updated,
													})
												}}
												className='px-3 bg-red-500/20 text-red-400 rounded'
											>
												✕
											</button>
										</div>
									),
								)}
							</div>

							{/* Add Benefit Button */}
							<button
								type='button'
								onClick={() =>
									setTicketForm({
										...ticketForm,
										benefits: [...ticketForm.benefits, ''],
									})
								}
								className='mt-3 w-full py-2 border border-dashed border-gold/40 text-gold rounded-lg hover:bg-gold/10 transition'
							>
								+ Add Benefit
							</button>
						</div>

						{/* Submit */}
						<button
							onClick={handleSubmitTicket}
							disabled={creating}
							className='w-full py-2 bg-gold text-black rounded-lg'
						>
							{creating ? 'Creating...' : 'Create Ticket'}
						</button>
					</div>
				</div>
			)}
		</main>
	)
}
