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
		benefits: [''],
	})

	const isEventLocked =
		event?.status === 'ended' || event?.status === 'cancelled'

	// ✅ Fetch event + tickets (FIXED)
	useEffect(() => {
		const fetchData = async () => {
			try {
				if (!token) throw new Error('Authentication required')

				const [eventRes, ticketRes] = await Promise.all([
					eventService.getEventById(eventId, token),
					ticketService.getEventTickets(eventId, token),
				])

				if (eventRes?.success && eventRes.data) {
					setEvent(eventRes.data)
				} else {
					setError('Event not found')
				}

				// ✅ Always set tickets (even if empty)
				if (ticketRes?.success && Array.isArray(ticketRes.data)) {
					setTickets(ticketRes.data)
				} else {
					setTickets([]) // fallback instead of doing nothing
				}
			} catch (err) {
				console.error(err)
				setError('Failed to load')
				setTickets([]) // prevent UI from breaking
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

	// ✅ FIXED submit logic
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

				if (res?.data) {
					setTickets((prev) =>
						prev.map((t) =>
							t._id === editingTicket._id ? res.data : t,
						),
					)
				}
			} else {
				const res = await ticketService.createTicket(
					eventId,
					payload,
					token,
				)

				if (res?.data) {
					setTickets((prev) => [...prev, res.data])
				}
			}

			setShowModal(false)
		} catch (err) {
			console.error('Ticket error:', err)
		} finally {
			setProcessing(false)
		}
	}

	const handleDelete = async (ticketId: string) => {
		if (!token) return
		if (!confirm('Delete ticket?')) return

		try {
			await ticketService.deleteTicket(ticketId, token)
			setTickets((prev) => prev.filter((t) => t._id !== ticketId))
		} catch (err) {
			console.error(err)
		}
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
					<Link href='/dashboard/host'>Back</Link>
					<div>{error || 'Event not found'}</div>
				</div>
			</main>
		)
	}

	return (
		<main className='min-h-screen bg-black text-white'>
			<Navbar />

			{/* Event UI unchanged */}

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
									<p>
										{ticket.currency} {ticket.price}
									</p>
								</div>

								<div className='flex gap-3'>
									<Pencil
										onClick={() => openEditModal(ticket)}
									/>
									<Trash2
										onClick={() => handleDelete(ticket._id)}
									/>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* ✅ MODAL FIXED */}
			{showModal && (
				<div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50'>
					<div className='bg-gray-900 p-6 rounded-xl w-full max-w-md space-y-4 border border-gold/20'>
						<div className='flex justify-between items-center'>
							<h2 className='text-xl font-bold'>
								{editingTicket
									? 'Edit Ticket'
									: 'Create Ticket'}
							</h2>
							<button onClick={() => setShowModal(false)}>
								<X />
							</button>
						</div>

						{/* form unchanged */}

						<button
							onClick={handleSubmitTicket}
							disabled={creating}
							className='w-full py-2 bg-gold text-black rounded-lg'
						>
							{creating
								? editingTicket
									? 'Saving...'
									: 'Creating...'
								: editingTicket
									? 'Save Ticket'
									: 'Create Ticket'}
						</button>
					</div>
				</div>
			)}
		</main>
	)
}
