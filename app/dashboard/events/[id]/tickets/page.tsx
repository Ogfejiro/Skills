'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import { Loader2, ArrowLeft, Plus, Edit, Trash2, X } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import ticketService, { Ticket, TicketData } from '@/app/services/ticketService'
import eventService, { Event } from '@/app/services/eventService'

export default function EventTicketsPage() {
	const router = useRouter()
	const params = useParams()
	const eventId = params.id as string
	const { token } = useAuth()
	const [loading, setLoading] = useState(true)
	const [submitting, setSubmitting] = useState(false)
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')
	const [event, setEvent] = useState<Event | null>(null)
	const [tickets, setTickets] = useState<Ticket[]>([])
	const [showForm, setShowForm] = useState(false)
	const [editingTicket, setEditingTicket] = useState<Ticket | null>(null)
	const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

	const [formData, setFormData] = useState({
		title: '',
		description: '',
		price: '',
		quantity: '',
		benefits: '',
		maxPerUser: '10',
	})

	// Fetch event and tickets
	useEffect(() => {
		const fetchData = async () => {
			try {
				if (!token) throw new Error('Authentication required')

				// Fetch event
				const eventResponse = await eventService.getEventById(
					eventId,
					token,
				)
				if (eventResponse.success) {
					setEvent(eventResponse.data)
				}

				// Fetch tickets
				const ticketsResponse = await ticketService.getEventTickets(
					eventId,
					token,
				)
				if (ticketsResponse.success) {
					setTickets(ticketsResponse.data)
				}
			} catch (err) {
				setError(
					err instanceof Error ? err.message : 'Failed to load data',
				)
				console.error('Error fetching data:', err)
			} finally {
				setLoading(false)
			}
		}

		if (eventId && token) {
			fetchData()
		}
	}, [eventId, token])

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}))
	}

	const resetForm = () => {
		setFormData({
			title: '',
			description: '',
			price: '',
			quantity: '',
			benefits: '',
			maxPerUser: '10',
		})
		setEditingTicket(null)
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setError('')
		setSuccess('')
		setSubmitting(true)

		try {
			// Validate required fields
			if (!formData.title || !formData.price || !formData.quantity) {
				throw new Error('Title, price, and quantity are required')
			}

			const price = parseFloat(formData.price)
			const quantity = parseInt(formData.quantity)
			const maxPerUser = parseInt(formData.maxPerUser)

			if (price < 0) throw new Error('Price cannot be negative')
			if (quantity <= 0)
				throw new Error('Quantity must be greater than 0')
			if (maxPerUser <= 0)
				throw new Error('Max per user must be greater than 0')

			if (!token) throw new Error('Authentication required')

			const ticketData: TicketData = {
				title: formData.title,
				description: formData.description || undefined,
				price,
				quantity,
				maxPerUser,
				currency: 'NGN',
				benefits: formData.benefits
					? formData.benefits
							.split('\n')
							.map((b) => b.trim())
							.filter((b) => b)
					: [],
			}

			if (editingTicket) {
				// Update ticket
				const response = await ticketService.updateTicket(
					editingTicket._id,
					ticketData,
					token,
				)
				setTickets(
					tickets.map((t) =>
						t._id === editingTicket._id ? response.data : t,
					),
				)
				setSuccess('Ticket updated successfully!')
			} else {
				// Create new ticket
				const response = await ticketService.createTicket(
					eventId,
					ticketData,
					token,
				)
				setTickets([...tickets, response.data])
				setSuccess('Ticket created successfully!')
			}

			resetForm()
			setShowForm(false)
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Failed to save ticket',
			)
			console.error('Error saving ticket:', err)
		} finally {
			setSubmitting(false)
		}
	}

	const handleDelete = async (ticketId: string) => {
		if (!window.confirm('Are you sure you want to delete this ticket?'))
			return

		try {
			setDeleteLoading(ticketId)
			if (!token) throw new Error('Authentication required')

			await ticketService.deleteTicket(ticketId, token)
			setTickets(tickets.filter((t) => t._id !== ticketId))
			setSuccess('Ticket deleted successfully!')
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Failed to delete ticket',
			)
		} finally {
			setDeleteLoading(null)
		}
	}

	const handleEdit = (ticket: Ticket) => {
		setEditingTicket(ticket)
		setFormData({
			title: ticket.title,
			description: ticket.description || '',
			price: ticket.price.toString(),
			quantity: ticket.quantity.toString(),
			benefits: ticket.benefits?.join('\n') || '',
			maxPerUser: ticket.maxPerUser?.toString() || '10',
		})
		setShowForm(true)
	}

	if (loading) {
		return (
			<main className='min-h-screen bg-black text-white'>
				<Navbar />
				<div className='flex items-center justify-center min-h-[60vh]'>
					<Loader2 className='w-12 h-12 text-gold animate-spin' />
					<p className='text-gray-400 ml-4'>Loading tickets...</p>
				</div>
			</main>
		)
	}

	if (!event) {
		return (
			<main className='min-h-screen bg-black text-white'>
				<Navbar />
				<div className='container mx-auto px-4 pt-28 pb-12'>
					<Link
						href='/dashboard/host'
						className='flex items-center gap-2 text-gold hover:text-gold/80 transition mb-4'
					>
						<ArrowLeft className='w-4 h-4' />
						Back to Dashboard
					</Link>
					<div className='p-6 border border-red-500/30 bg-red-500/10 rounded-lg text-red-400'>
						Event not found
					</div>
				</div>
			</main>
		)
	}

	return (
		<main className='min-h-screen bg-black text-white'>
			<Navbar />

			<div className='container mx-auto px-4 pt-28 pb-12'>
				{/* Header */}
				<div className='mb-8'>
					<Link
						href={`/dashboard/events/${eventId}`}
						className='flex items-center gap-2 text-gold hover:text-gold/80 transition mb-4'
					>
						<ArrowLeft className='w-4 h-4' />
						Back to Event
					</Link>
					<h1 className='text-3xl md:text-4xl font-bold mb-2'>
						Manage Tickets
					</h1>
					<p className='text-gray-400'>Event: {event.title}</p>
				</div>

				{/* Error Alert */}
				{error && (
					<div className='mb-6 p-4 border border-red-500/30 bg-red-500/10 rounded-lg text-red-400'>
						{error}
					</div>
				)}

				{/* Success Alert */}
				{success && (
					<div className='mb-6 p-4 border border-green-500/30 bg-green-500/10 rounded-lg text-green-400'>
						{success}
					</div>
				)}

				<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
					{/* Tickets List */}
					<div className='lg:col-span-2'>
						{tickets.length === 0 && !showForm ? (
							<div className='bg-gray-900/50 border border-gold/20 rounded-xl p-12 text-center'>
								<p className='text-gray-400 mb-4'>
									No tickets created yet
								</p>
								<button
									onClick={() => setShowForm(true)}
									className='inline-flex items-center gap-2 px-4 py-2 bg-gold text-black font-bold rounded-lg hover:opacity-90 transition'
								>
									<Plus className='w-4 h-4' />
									Create First Ticket
								</button>
							</div>
						) : (
							<>
								{tickets.length > 0 && (
									<div className='space-y-4'>
										{tickets.map((ticket) => (
											<div
												key={ticket._id}
												className='bg-gray-900/50 border border-gold/20 rounded-xl p-6'
											>
												<div className='flex items-start justify-between mb-3'>
													<div>
														<h3 className='text-lg font-bold text-white'>
															{ticket.title}
														</h3>
														{ticket.description && (
															<p className='text-gray-400 text-sm mt-1'>
																{
																	ticket.description
																}
															</p>
														)}
													</div>
													<div className='flex gap-2'>
														<button
															onClick={() =>
																handleEdit(
																	ticket,
																)
															}
															className='p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/40 transition'
															title='Edit Ticket'
														>
															<Edit className='w-4 h-4' />
														</button>
														<button
															onClick={() =>
																handleDelete(
																	ticket._id,
																)
															}
															disabled={
																deleteLoading ===
																ticket._id
															}
															className='p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/40 transition disabled:opacity-50'
															title='Delete Ticket'
														>
															{deleteLoading ===
															ticket._id ? (
																<Loader2 className='w-4 h-4 animate-spin' />
															) : (
																<Trash2 className='w-4 h-4' />
															)}
														</button>
													</div>
												</div>

												<div className='grid grid-cols-2 gap-4 mb-3 text-sm'>
													<div>
														<span className='text-gray-400'>
															Price:
														</span>
														<p className='text-gold font-semibold'>
															₦
															{ticket.price.toLocaleString()}
														</p>
													</div>
													<div>
														<span className='text-gray-400'>
															Available:
														</span>
														<p className='text-white font-semibold'>
															{ticket.quantity -
																ticket.sold}{' '}
															/ {ticket.quantity}
														</p>
													</div>
													<div>
														<span className='text-gray-400'>
															Sold:
														</span>
														<p className='text-green-400 font-semibold'>
															{ticket.sold}
														</p>
													</div>
													<div>
														<span className='text-gray-400'>
															Max per user:
														</span>
														<p className='text-white font-semibold'>
															{ticket.maxPerUser}
														</p>
													</div>
												</div>

												{ticket.benefits &&
													ticket.benefits.length >
														0 && (
														<div>
															<span className='text-gray-400 text-sm'>
																Benefits:
															</span>
															<ul className='mt-2 space-y-1'>
																{ticket.benefits.map(
																	(
																		benefit,
																		idx,
																	) => (
																		<li
																			key={
																				idx
																			}
																			className='text-gray-300 text-sm flex items-start gap-2'
																		>
																			<span className='text-gold'>
																				✓
																			</span>
																			{
																				benefit
																			}
																		</li>
																	),
																)}
															</ul>
														</div>
													)}
											</div>
										))}
									</div>
								)}

								{!showForm && (
									<div className='mt-6'>
										<button
											onClick={() => setShowForm(true)}
											className='w-full flex items-center justify-center gap-2 px-4 py-3 bg-gold text-black font-bold rounded-lg hover:opacity-90 transition'
										>
											<Plus className='w-4 h-4' />
											Add Another Ticket
										</button>
									</div>
								)}
							</>
						)}
					</div>

					{/* Create/Edit Ticket Form */}
					{showForm && (
						<div className='bg-gray-900/50 border border-gold/20 rounded-xl p-6 h-fit sticky top-28'>
							<div className='flex items-center justify-between mb-6'>
								<h2 className='text-xl font-bold'>
									{editingTicket
										? 'Edit Ticket'
										: 'Create Ticket'}
								</h2>
								<button
									onClick={() => {
										setShowForm(false)
										resetForm()
									}}
									className='p-1 hover:bg-gray-800 rounded'
								>
									<X className='w-5 h-5' />
								</button>
							</div>

							<form onSubmit={handleSubmit} className='space-y-4'>
								{/* Ticket Title */}
								<div>
									<label className='block text-sm font-medium mb-2'>
										Ticket Title *
									</label>
									<input
										type='text'
										name='title'
										value={formData.title}
										onChange={handleInputChange}
										placeholder='e.g., VIP Pass, General Admission'
										className='w-full px-3 py-2 bg-gray-800 border border-gold/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold transition text-sm'
										required
									/>
								</div>

								{/* Description */}
								<div>
									<label className='block text-sm font-medium mb-2'>
										Description
									</label>
									<textarea
										name='description'
										value={formData.description}
										onChange={handleInputChange}
										placeholder='Describe this ticket type'
										rows={2}
										className='w-full px-3 py-2 bg-gray-800 border border-gold/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold transition text-sm'
									/>
								</div>

								{/* Price */}
								<div>
									<label className='block text-sm font-medium mb-2'>
										Price (₦) *
									</label>
									<input
										type='number'
										name='price'
										value={formData.price}
										onChange={handleInputChange}
										placeholder='0'
										min='0'
										step='100'
										className='w-full px-3 py-2 bg-gray-800 border border-gold/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold transition text-sm'
										required
									/>
								</div>

								{/* Quantity */}
								<div>
									<label className='block text-sm font-medium mb-2'>
										Quantity *
									</label>
									<input
										type='number'
										name='quantity'
										value={formData.quantity}
										onChange={handleInputChange}
										placeholder='0'
										min='1'
										className='w-full px-3 py-2 bg-gray-800 border border-gold/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold transition text-sm'
										required
									/>
								</div>

								{/* Max Per User */}
								<div>
									<label className='block text-sm font-medium mb-2'>
										Max Per User
									</label>
									<input
										type='number'
										name='maxPerUser'
										value={formData.maxPerUser}
										onChange={handleInputChange}
										min='1'
										className='w-full px-3 py-2 bg-gray-800 border border-gold/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold transition text-sm'
									/>
								</div>

								{/* Benefits */}
								<div>
									<label className='block text-sm font-medium mb-2'>
										Benefits (one per line)
									</label>
									<textarea
										name='benefits'
										value={formData.benefits}
										onChange={handleInputChange}
										placeholder='Fast-track entry&#10;VIP lounge access&#10;Premium seat'
										rows={3}
										className='w-full px-3 py-2 bg-gray-800 border border-gold/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold transition text-sm'
									/>
								</div>

								{/* Submit Button */}
								<button
									type='submit'
									disabled={submitting}
									className='w-full flex items-center justify-center gap-2 px-4 py-2 bg-gold text-black font-bold rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm'
								>
									{submitting ? (
										<>
											<Loader2 className='w-4 h-4 animate-spin' />
											Saving...
										</>
									) : editingTicket ? (
										'Update Ticket'
									) : (
										'Create Ticket'
									)}
								</button>
							</form>
						</div>
					)}
				</div>
			</div>
		</main>
	)
}
