'use client'

import { useEffect, useRef, useState } from 'react'
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
	Bold,
	Italic,
	Underline,
	List,
	ListOrdered,
	Mail,
	Share2,
	Copy,
	Check,
	Download,
} from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import eventService, { Event } from '@/app/services/eventService'
import ticketService, { Ticket, TicketData } from '@/app/services/ticketService'
import eventEmailService, {
	EventEmail,
} from '@/app/services/eventEmailService'

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

	const [linkCopied, setLinkCopied] = useState(false)

	const [eventEmail, setEventEmail] = useState<EventEmail | null>(null)
	const [emailLoading, setEmailLoading] = useState(true)
	const [showEmailModal, setShowEmailModal] = useState(false)
	const [emailMode, setEmailMode] = useState<'create' | 'view' | 'edit'>(
		'create',
	)
	const [emailSubject, setEmailSubject] = useState('')
	const [emailHtml, setEmailHtml] = useState('')
	const [emailSaving, setEmailSaving] = useState(false)
	const editorRef = useRef<HTMLDivElement | null>(null)

	const [ticketForm, setTicketForm] = useState({
		title: '',
		description: '',
		price: '',
		quantity: '',
		currency: 'NGN',
		benefits: [''],
	})

	// Purchased Tickets Modal States
	const [showPurchasesModal, setShowPurchasesModal] = useState(false)
	const [purchasedTickets, setPurchasedTickets] = useState<any[]>([])
	const [purchasedTotalBought, setPurchasedTotalBought] = useState(0)
	const [purchasedTotalFiltered, setPurchasedTotalFiltered] = useState(0)
	const [purchasedLoading, setPurchasedLoading] = useState(false)
	const [purchasedPage, setPurchasedPage] = useState(1)
	const [purchasedTotalPages, setPurchasedTotalPages] = useState(1)
	const [purchasedSearch, setPurchasedSearch] = useState('')
	const [searchTerm, setSearchTerm] = useState('')
	const [purchasedTicketType, setPurchasedTicketType] = useState('')
	const [purchasedStartDate, setPurchasedStartDate] = useState('')
	const [purchasedEndDate, setPurchasedEndDate] = useState('')
	const [csvDownloading, setCsvDownloading] = useState(false)

	const fetchPurchasedTickets = async (pageNumber = 1) => {
		if (!token) return
		setPurchasedLoading(true)
		try {
			const res = await ticketService.getPurchasedTickets(eventId, token, {
				page: pageNumber,
				limit: 25,
				search: purchasedSearch,
				ticketType: purchasedTicketType,
				startDate: purchasedStartDate,
				endDate: purchasedEndDate,
			})
			if (res.success) {
				setPurchasedTickets(res.tickets)
				setPurchasedTotalBought(res.totalBought)
				setPurchasedTotalFiltered(res.pagination.total)
				setPurchasedPage(res.pagination.page)
				setPurchasedTotalPages(res.pagination.pages)
			}
		} catch (err) {
			console.error('Failed to load ticket purchases:', err)
		} finally {
			setPurchasedLoading(false)
		}
	}

	useEffect(() => {
		if (showPurchasesModal && token) {
			fetchPurchasedTickets(purchasedPage)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [showPurchasesModal, purchasedSearch, purchasedTicketType, purchasedStartDate, purchasedEndDate, token])

	const openPurchasesModal = () => {
		setSearchTerm('')
		setPurchasedSearch('')
		setPurchasedTicketType('')
		setPurchasedStartDate('')
		setPurchasedEndDate('')
		setPurchasedPage(1)
		setShowPurchasesModal(true)
	}

	const handleDownloadCSV = async () => {
		if (!token || !event) return
		setCsvDownloading(true)
		try {
			const res = await ticketService.getPurchasedTickets(eventId, token, {
				page: 1,
				limit: Math.max(10000, purchasedTotalFiltered || 0),
				search: purchasedSearch,
				ticketType: purchasedTicketType,
				startDate: purchasedStartDate,
				endDate: purchasedEndDate,
			})
			if (res.success && res.tickets) {
				const headers = ['Ticket ID', 'Attendee Email', 'Ticket Type', 'Quantity', 'Amount', 'Currency', 'Purchase Date', 'Status']
				const rows = res.tickets.map((ticket: any) => [
					ticket.ticketId || '',
					ticket.customerEmail || '',
					ticket.ticketName || '',
					ticket.quantity !== undefined ? ticket.quantity : 1,
					ticket.amount !== undefined ? ticket.amount : 0,
					ticket.currency || 'NGN',
					new Date(ticket.createdAt).toLocaleString(),
					ticket.status || ''
				])
				
				const csvContent = [
					headers.join(','),
					...rows.map((row: any[]) => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
				].join('\n')
				
				const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
				const url = URL.createObjectURL(blob)
				const link = document.createElement('a')
				link.setAttribute('href', url)
				link.setAttribute('download', `attendees_${event.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.csv`)
				document.body.appendChild(link)
				link.click()
				document.body.removeChild(link)
			}
		} catch (err) {
			console.error('Failed to export CSV:', err)
		} finally {
			setCsvDownloading(false)
		}
	}

	const isEventLocked =
		event?.status === 'ended' || event?.status === 'cancelled'

	// ✅ Fetch event + tickets (FIXED)
	useEffect(() => {
		const fetchData = async () => {
			try {
				if (!token) throw new Error('Authentication required')

				console.log('Fetching tickets for event:', eventId)

				const [eventRes, ticketRes, emailRes] = await Promise.all([
					eventService.getEventById(eventId, token),
					ticketService.getEventTickets(eventId, token),
					eventEmailService
						.getEventEmail(eventId, token)
						.catch(() => null),
				])

				if (emailRes) {
					setEventEmail(emailRes)
				}

				if (eventRes?.success && eventRes.data) {
					setEvent(eventRes.data)
					console.log('Event loaded:', eventRes.data)
				} else {
					setError('Event not found')
				}

				console.log('Ticket Response:', ticketRes)

				if (ticketRes?.success && Array.isArray(ticketRes.data)) {
					setTickets(ticketRes.data)
				} else {
					setTickets([])
				}
			} catch (err) {
				console.error('Fetch error:', err)
				setError('Failed to load')
				setTickets([]) // prevent UI from breaking
			} finally {
				setLoading(false)
				setTicketsLoading(false)
				setEmailLoading(false)
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
		if (!token) {
			alert('Authentication required')
			return
		}

		// Validation
		if (!ticketForm.title.trim()) {
			alert('Please enter ticket title')
			return
		}

		if (!ticketForm.price || Number(ticketForm.price) < 0) {
			alert('Please enter valid price')
			return
		}

		if (!ticketForm.quantity || Number(ticketForm.quantity) <= 0) {
			alert('Please enter quantity')
			return
		}

		setProcessing(true)
		try {
			const benefitsFiltered = ticketForm.benefits.filter(
				(b) => b.trim() !== '',
			)

			const payload: TicketData = {
				title: ticketForm.title.trim(),
				description: ticketForm.description.trim(),
				price: Number(ticketForm.price),
				quantity: Number(ticketForm.quantity),
				benefits:
					benefitsFiltered.length > 0 ? benefitsFiltered : [''],
				currency: ticketForm.currency as 'NGN' | 'USD',
			}

			console.log('Submitting ticket payload:', payload)

			if (editingTicket) {
				console.log('Updating ticket:', editingTicket._id)
				const res = await ticketService.updateTicket(
					editingTicket._id,
					payload,
					token,
				)

				if (res?.data) {
					console.log('Ticket updated successfully:', res.data)
					setTickets((prev) =>
						prev.map((t) =>
							t._id === editingTicket._id ? res.data : t,
						),
					)
					alert('Ticket updated successfully!')
				}
			} else {
				console.log('Creating new ticket for event:', eventId)
				const res = await ticketService.createTicket(
					eventId,
					payload,
					token,
				)

				if (res?.data) {
					console.log('Ticket created successfully:', res.data)
					setTickets((prev) => [...prev, res.data])
					alert('Ticket created successfully!')
				}
			}

			setShowModal(false)
			setTicketForm({
				title: '',
				description: '',
				price: '',
				quantity: '',
				currency: 'NGN',
				benefits: [''],
			})
		} catch (err: any) {
			console.error('Ticket error:', err)
			alert(err?.message || 'Failed to save ticket')
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

	useEffect(() => {
		if (
			showEmailModal &&
			(emailMode === 'create' || emailMode === 'edit') &&
			editorRef.current
		) {
			if (editorRef.current.innerHTML !== emailHtml) {
				editorRef.current.innerHTML = emailHtml
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [showEmailModal, emailMode])

	const openEmailModal = () => {
		if (eventEmail) {
			setEmailMode('view')
			setEmailSubject(eventEmail.subject)
			setEmailHtml(eventEmail.htmlContent)
		} else {
			setEmailMode('create')
			setEmailSubject('')
			setEmailHtml('')
		}
		setShowEmailModal(true)
	}

	const switchToEdit = () => {
		setEmailMode('edit')
		setEmailSubject(eventEmail?.subject || '')
		setEmailHtml(eventEmail?.htmlContent || '')
	}

	const execFormat = (command: string, value?: string) => {
		document.execCommand(command, false, value)
		if (editorRef.current) {
			setEmailHtml(editorRef.current.innerHTML)
			editorRef.current.focus()
		}
	}

	const handleSaveEmail = async () => {
		if (!token) {
			alert('Authentication required')
			return
		}
		const html = editorRef.current?.innerHTML ?? emailHtml
		if (!emailSubject.trim()) {
			alert('Please enter a subject')
			return
		}
		if (!html || html === '<br>' || !html.replace(/<[^>]*>/g, '').trim()) {
			alert('Please enter email content')
			return
		}

		setEmailSaving(true)
		try {
			if (emailMode === 'create') {
				await eventEmailService.createEventEmail(
					eventId,
					{
						subject: emailSubject.trim(),
						htmlContent: html,
						isEnabled: true,
					},
					token,
				)
				const fresh = await eventEmailService
					.getEventEmail(eventId, token)
					.catch(() => null)
				if (fresh) setEventEmail(fresh)
				setEmailHtml(html)
				setEmailMode('view')
				alert('Event email created successfully!')
			} else if (emailMode === 'edit') {
				const updated = await eventEmailService.updateEventEmail(
					eventId,
					{
						subject: emailSubject.trim(),
						htmlContent: html,
						isEnabled: eventEmail?.isEnabled ?? true,
					},
					token,
				)
				setEventEmail(updated)
				setEmailHtml(html)
				setEmailMode('view')
				alert('Event email updated successfully!')
			}
		} catch (err: any) {
			console.error('Email save error:', err)
			alert(err?.message || 'Failed to save event email')
		} finally {
			setEmailSaving(false)
		}
	}

	const handleCopyShareLink = async () => {
		if (typeof window === 'undefined') return
		const shareUrl = `${window.location.origin}/events/${eventId}`

		try {
			await navigator.clipboard.writeText(shareUrl)
			setLinkCopied(true)
			setTimeout(() => setLinkCopied(false), 2000)
		} catch (err) {
			console.error('Copy failed:', err)
			alert(`Copy this link:\n${shareUrl}`)
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

			<div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 space-y-8'>
				<Link
					href='/dashboard/host'
					className='inline-flex items-center gap-2 text-gold'
				>
					<ArrowLeft className='w-4 h-4' />
					Back
				</Link>

				{/* Event Banner */}
				{event.banner && (
					<div className='rounded-xl overflow-hidden border border-gold/20'>
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
							{getStatusBadge(event.status)}{' '}
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
										{' '}
										Date & Time{' '}
									</p>
									<p className='text-white'>
										{' '}
										{formatDate(event.date)}{' '}
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
										{' '}
										Capacity{' '}
									</p>
									<p className='text-white'>
										{' '}
										{event.ticketsSold} / {event.capacity}{' '}
										attendees{' '}
									</p>
								</div>
							</div>
						</div>

						{/* Description */}
						<div>
							<p className='text-gray-400 text-sm mb-2'>
								{' '}
								Description{' '}
							</p>
							<p className='text-white whitespace-pre-wrap'>
								{' '}
								{event.description}{' '}
							</p>
						</div>
					</div>

					{/* Tags */}
					{event.tags && event.tags.length > 0 && (
						<div>
							<p className='text-gray-400 text-sm mb-3'>Tags</p>
							<div className='flex flex-wrap gap-2'>
								{' '}
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
					<div className='flex gap-4 pt-4 flex-wrap'>
						<Link
							href={`/dashboard/events/${event._id}/edit`}
							className='flex-1 min-w-[160px] px-6 py-3 bg-gold text-black font-bold rounded-lg hover:opacity-90 transition text-center'
						>
							{' '}
							Edit Event{' '}
						</Link>
						<button
							onClick={openEmailModal}
							disabled={emailLoading}
							className='flex-1 min-w-[160px] px-6 py-3 border border-gold/30 rounded-lg hover:bg-gray-800 transition text-center flex items-center justify-center gap-2 disabled:opacity-50'
						>
							<Mail className='w-4 h-4' />
							{emailLoading
								? 'Loading...'
								: eventEmail
									? 'View Event Email'
									: 'Create Event Email'}
						</button>
						<button
							onClick={handleCopyShareLink}
							className='flex-1 min-w-[160px] px-6 py-3 border border-gold/30 rounded-lg hover:bg-gray-800 transition text-center flex items-center justify-center gap-2'
						>
							{linkCopied ? (
								<>
									<Check className='w-4 h-4 text-green-400' />
									Link Copied!
								</>
							) : (
								<>
									<Share2 className='w-4 h-4' />
									Copy Share Link
								</>
							)}
						</button>
					</div>

					<div className='mt-4 bg-black/40 border border-gold/10 rounded-lg p-3 flex items-center gap-2 text-sm'>
						<Copy className='w-4 h-4 text-gold flex-shrink-0' />
						<code className='text-gray-300 truncate flex-1'>
							{typeof window !== 'undefined'
								? `${window.location.origin}/events/${event._id}`
								: `/events/${event._id}`}
						</code>
					</div>
				</div>

				<div className='mt-8 bg-gray-900/50 border border-gold/20 rounded-xl p-8'>
					<div className='flex justify-between items-center mb-6 flex-wrap gap-4'>
						<h2 className='text-2xl font-bold'>Tickets</h2>

						<div className='flex gap-3'>
							<button
								onClick={openPurchasesModal}
								className='px-4 py-2 bg-gray-800 text-gold border border-gold/30 hover:bg-gray-700 font-semibold rounded-lg transition flex items-center gap-2'
							>
								View Sales
							</button>
							<button
								onClick={openCreateModal}
								disabled={isEventLocked}
								className='px-4 py-2 bg-gold text-black font-semibold rounded-lg disabled:opacity-40 transition'
							>
								+ Add Ticket
							</button>
						</div>
					</div>

					{ticketsLoading ? (
						<Loader2 className='animate-spin text-gold' />
					) : tickets.length === 0 ? (
						<p className='text-gray-400'>No tickets yet</p>
					) : (
						<div className='space-y-4'>
							{tickets.map((ticket) => (
								<div
									key={ticket._id}
									className='p-4 border border-gold/20 rounded-lg flex justify-between items-center bg-black/30 hover:border-gold/40 transition'
								>
									<div>
										<h3 className='font-bold text-white text-lg'>{ticket.title}</h3>
										<div className='flex items-center gap-4 mt-1 text-sm text-gray-400'>
											<span>
												Price: <span className='text-gold font-semibold'>{ticket.currency} {ticket.price.toLocaleString()}</span>
											</span>
											<span>•</span>
											<span>
												Sold: <span className='text-green-400 font-semibold'>{ticket.sold || 0}</span> / {ticket.quantity}
											</span>
										</div>
									</div>

									<div className='flex gap-3 text-gray-400'>
										<button
											onClick={() => openEditModal(ticket)}
											className='p-2 hover:bg-gray-800 hover:text-white rounded transition'
											title='Edit Ticket'
										>
											<Pencil className='w-4 h-4' />
										</button>
										<button
											onClick={() => handleDelete(ticket._id)}
											className='p-2 hover:bg-gray-800 hover:text-red-400 rounded transition'
											title='Delete Ticket'
										>
											<Trash2 className='w-4 h-4' />
										</button>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>

			{/* ✅ MODAL FIXED */}
			{showModal && (
				<div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50'>
					<div className='bg-gray-900 p-6 rounded-xl w-full max-w-md space-y-4 border border-gold/20 max-h-screen overflow-y-auto'>
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

						{/* Ticket Form Fields */}
						<div className='space-y-3'>
							{/* Title */}
							<div>
								<label className='block text-sm text-gray-300 mb-1'>
									Ticket Title
								</label>
								<input
									type='text'
									placeholder='e.g., VIP Pass'
									value={ticketForm.title}
									onChange={(e) =>
										setTicketForm({
											...ticketForm,
											title: e.target.value,
										})
									}
									className='w-full px-3 py-2 bg-gray-800 border border-gold/20 rounded text-white'
								/>
							</div>

							{/* Description */}
							<div>
								<label className='block text-sm text-gray-300 mb-1'>
									Description
								</label>
								<textarea
									placeholder='Ticket details'
									value={ticketForm.description}
									onChange={(e) =>
										setTicketForm({
											...ticketForm,
											description: e.target.value,
										})
									}
									className='w-full px-3 py-2 bg-gray-800 border border-gold/20 rounded text-white'
									rows={2}
								/>
							</div>

							{/* Price & Currency */}
							<div className='grid grid-cols-2 gap-2'>
								<div>
									<label className='block text-sm text-gray-300 mb-1'>
										Price
									</label>
									<input
										type='number'
										placeholder='0'
										value={ticketForm.price}
										onChange={(e) =>
											setTicketForm({
												...ticketForm,
												price: e.target.value,
											})
										}
										className='w-full px-3 py-2 bg-gray-800 border border-gold/20 rounded text-white'
									/>
								</div>
								<div>
									<label className='block text-sm text-gray-300 mb-1'>
										Currency
									</label>
									<select
										value={ticketForm.currency}
										onChange={(e) =>
											setTicketForm({
												...ticketForm,
												currency: e.target.value,
											})
										}
										className='w-full px-3 py-2 bg-gray-800 border border-gold/20 rounded text-white'
									>
										<option value='NGN'>NGN</option>
										<option value='USD'>USD</option>
									</select>
								</div>
							</div>

							{/* Quantity */}
							<div>
								<label className='block text-sm text-gray-300 mb-1'>
									Quantity Available
								</label>
								<input
									type='number'
									placeholder='0'
									value={ticketForm.quantity}
									onChange={(e) =>
										setTicketForm({
											...ticketForm,
											quantity: e.target.value,
										})
									}
									className='w-full px-3 py-2 bg-gray-800 border border-gold/20 rounded text-white'
								/>
							</div>

							{/* Benefits */}
							<div>
								<label className='block text-sm text-gray-300 mb-1'>
									Benefits (one per line)
								</label>
								{ticketForm.benefits.map((benefit, idx) => (
									<div key={idx} className='flex gap-2 mb-2'>
										<input
											type='text'
											placeholder='e.g., Early access'
											value={benefit}
											onChange={(e) => {
												const newBenefits = [
													...ticketForm.benefits,
												]
												newBenefits[idx] =
													e.target.value
												setTicketForm({
													...ticketForm,
													benefits: newBenefits,
												})
											}}
											className='flex-1 px-3 py-2 bg-gray-800 border border-gold/20 rounded text-white'
										/>
										{ticketForm.benefits.length > 1 && (
											<button
												onClick={() => {
													setTicketForm({
														...ticketForm,
														benefits:
															ticketForm.benefits.filter(
																(_, i) =>
																	i !== idx,
															),
													})
												}}
												className='px-3 py-2 bg-red-600 rounded text-white'
											>
												Remove
											</button>
										)}
									</div>
								))}
								<button
									onClick={() => {
										setTicketForm({
											...ticketForm,
											benefits: [
												...ticketForm.benefits,
												'',
											],
										})
									}}
									className='text-sm text-gold mt-1'
								>
									+ Add Benefit
								</button>
							</div>
						</div>

						<button
							onClick={handleSubmitTicket}
							disabled={creating}
							className='w-full py-2 bg-gold text-black rounded-lg font-bold disabled:opacity-50'
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

			{/* Event Email Modal */}
			{showEmailModal && (
				<div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4'>
					<div className='bg-gray-900 p-6 rounded-xl w-full max-w-2xl space-y-4 border border-gold/20 max-h-[90vh] overflow-y-auto'>
						<div className='flex justify-between items-center'>
							<h2 className='text-xl font-bold flex items-center gap-2'>
								<Mail className='w-5 h-5 text-gold' />
								{emailMode === 'create' && 'Create Event Email'}
								{emailMode === 'view' && 'Event Email'}
								{emailMode === 'edit' && 'Edit Event Email'}
							</h2>
							<button onClick={() => setShowEmailModal(false)}>
								<X />
							</button>
						</div>

						{emailMode === 'view' ? (
							<div className='space-y-4'>
								<div>
									<p className='text-sm text-gray-400 mb-1'>
										Subject
									</p>
									<p className='text-white font-semibold'>
										{eventEmail?.subject}
									</p>
								</div>
								<div>
									<p className='text-sm text-gray-400 mb-1'>
										Content
									</p>
									<div
										className='bg-gray-800 border border-gold/20 rounded p-4 text-white prose prose-invert max-w-none'
										dangerouslySetInnerHTML={{
											__html:
												eventEmail?.htmlContent || '',
										}}
									/>
								</div>
								<button
									onClick={switchToEdit}
									className='w-full py-2 bg-gold text-black rounded-lg font-bold flex items-center justify-center gap-2'
								>
									<Pencil className='w-4 h-4' /> Edit Email
								</button>
							</div>
						) : (
							<div className='space-y-3'>
								<div>
									<label className='block text-sm text-gray-300 mb-1'>
										Subject
									</label>
									<input
										type='text'
										placeholder='Email subject line'
										value={emailSubject}
										onChange={(e) =>
											setEmailSubject(e.target.value)
										}
										className='w-full px-3 py-2 bg-gray-800 border border-gold/20 rounded text-white'
									/>
								</div>

								<div>
									<label className='block text-sm text-gray-300 mb-1'>
										Email Content
									</label>
									<div className='border border-gold/20 rounded bg-gray-800'>
										<div className='flex flex-wrap gap-1 p-2 border-b border-gold/20'>
											<button
												type='button'
												onClick={() =>
													execFormat('bold')
												}
												className='p-2 hover:bg-gray-700 rounded'
												title='Bold'
											>
												<Bold className='w-4 h-4' />
											</button>
											<button
												type='button'
												onClick={() =>
													execFormat('italic')
												}
												className='p-2 hover:bg-gray-700 rounded'
												title='Italic'
											>
												<Italic className='w-4 h-4' />
											</button>
											<button
												type='button'
												onClick={() =>
													execFormat('underline')
												}
												className='p-2 hover:bg-gray-700 rounded'
												title='Underline'
											>
												<Underline className='w-4 h-4' />
											</button>
											<button
												type='button'
												onClick={() =>
													execFormat(
														'insertUnorderedList',
													)
												}
												className='p-2 hover:bg-gray-700 rounded'
												title='Bullet list'
											>
												<List className='w-4 h-4' />
											</button>
											<button
												type='button'
												onClick={() =>
													execFormat(
														'insertOrderedList',
													)
												}
												className='p-2 hover:bg-gray-700 rounded'
												title='Numbered list'
											>
												<ListOrdered className='w-4 h-4' />
											</button>
											<button
												type='button'
												onClick={() =>
													execFormat(
														'formatBlock',
														'h2',
													)
												}
												className='px-2 hover:bg-gray-700 rounded text-sm font-bold'
												title='Heading'
											>
												H2
											</button>
											<button
												type='button'
												onClick={() => {
													const url =
														prompt('Link URL:')
													if (url)
														execFormat(
															'createLink',
															url,
														)
												}}
												className='px-2 hover:bg-gray-700 rounded text-sm'
												title='Insert link'
											>
												Link
											</button>
											<button
												type='button'
												onClick={() =>
													execFormat(
														'removeFormat',
													)
												}
												className='px-2 hover:bg-gray-700 rounded text-sm'
												title='Clear formatting'
											>
												Clear
											</button>
										</div>
										<div
											ref={editorRef}
											contentEditable
											suppressContentEditableWarning
											dir='ltr'
											onInput={(e) =>
												setEmailHtml(
													(
														e.target as HTMLDivElement
													).innerHTML,
												)
											}
											className='min-h-[200px] p-3 text-white focus:outline-none prose prose-invert max-w-none text-left'
											style={{
												direction: 'ltr',
												unicodeBidi: 'plaintext',
											}}
										/>
									</div>
									<p className='text-xs text-gray-500 mt-1'>
										Use the toolbar to format text. You
										can include links, lists, and
										headings.
									</p>
								</div>

								<div className='flex gap-2'>
									{emailMode === 'edit' && (
										<button
											onClick={() => {
												setEmailMode('view')
												setEmailSubject(
													eventEmail?.subject || '',
												)
												setEmailHtml(
													eventEmail?.htmlContent ||
														'',
												)
											}}
											className='flex-1 py-2 border border-gold/30 rounded-lg'
										>
											Cancel
										</button>
									)}
									<button
										onClick={handleSaveEmail}
										disabled={emailSaving}
										className='flex-1 py-2 bg-gold text-black rounded-lg font-bold disabled:opacity-50'
									>
										{emailSaving
											? 'Saving...'
											: emailMode === 'create'
												? 'Create Email'
												: 'Save Changes'}
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			)}

			{/* Purchased Tickets Modal */}
			{showPurchasesModal && (
				<div className='fixed inset-0 bg-black/80 flex items-center justify-center z-50 md:p-4 p-0 animate-fadeIn'>
					<div className='bg-gray-900 border-0 md:border border-gold/30 rounded-none md:rounded-2xl w-full max-w-5xl h-full md:h-auto md:max-h-[90vh] overflow-hidden flex flex-col shadow-2xl'>
						{/* Modal Header */}
						<div className='p-4 md:p-6 border-b border-gold/20 flex justify-between items-center bg-gray-900/90'>
							<div>
								<h2 className='text-xl md:text-2xl font-bold text-white flex items-center gap-2'>
									<Users className='text-gold w-5 h-5 md:w-6 md:h-6' />
									Attendee List & Ticket Sales
								</h2>
								<p className='text-xs md:text-sm text-gray-400 mt-1'>
									Manage and track ticket sales for this event.
								</p>
							</div>
							<button
								onClick={() => setShowPurchasesModal(false)}
								className='text-gray-400 hover:text-white transition p-1.5 md:p-2 hover:bg-gray-800 rounded-full cursor-pointer'
							>
								<X className='w-5 h-5 md:w-6 md:h-6' />
							</button>
						</div>

						{/* Quick Stats Banner */}
						<div className='grid grid-cols-3 gap-2 md:gap-4 p-3 md:p-6 bg-black/40 border-b border-gold/10'>
							<div className='bg-gray-800/40 border border-gold/10 rounded-lg md:rounded-xl p-2.5 md:p-4'>
								<p className='text-[10px] md:text-xs text-gray-400 uppercase tracking-wider font-semibold'>
									<span className='hidden md:inline'>Total Tickets Sold (Overall)</span>
									<span className='md:hidden'>Total Sold</span>
								</p>
								<p className='text-lg md:text-2xl font-bold text-white mt-0.5 md:mt-1'>{purchasedTotalBought}</p>
							</div>
							<div className='bg-gray-800/40 border border-gold/10 rounded-lg md:rounded-xl p-2.5 md:p-4'>
								<p className='text-[10px] md:text-xs text-gray-400 uppercase tracking-wider font-semibold'>
									<span className='hidden md:inline'>Filtered Sales Count</span>
									<span className='md:hidden'>Filtered</span>
								</p>
								<p className='text-lg md:text-2xl font-bold text-gold mt-0.5 md:mt-1'>{purchasedTotalFiltered}</p>
							</div>
							<div className='bg-gray-800/40 border border-gold/10 rounded-lg md:rounded-xl p-2.5 md:p-4'>
								<p className='text-[10px] md:text-xs text-gray-400 uppercase tracking-wider font-semibold'>
									<span className='hidden md:inline'>Active Attendees</span>
									<span className='md:hidden'>Active</span>
								</p>
								<p className='text-lg md:text-2xl font-bold text-green-400 mt-0.5 md:mt-1'>
									{purchasedTickets.filter(t => t.status === 'active').length} <span className='text-[10px] md:text-xs font-normal text-gray-400'>/ pg</span>
								</p>
							</div>
						</div>

						{/* Filters Area */}
						<div className='p-3 md:p-6 border-b border-gold/10 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-black/10'>
							{/* Search Box */}
							<form
								onSubmit={(e) => {
									e.preventDefault();
									setPurchasedSearch(searchTerm);
									setPurchasedPage(1);
								}}
								className='flex gap-2 w-full lg:w-auto flex-1 lg:max-w-md'
							>
								<input
									type='text'
									placeholder='Search by Ticket ID, email, or name...'
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className='flex-1 bg-gray-800 border border-gold/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-gold'
								/>
								<button
									type='submit'
									className='px-4 py-2 bg-gold text-black font-semibold rounded-lg hover:opacity-90 transition text-sm cursor-pointer'
								>
									Search
								</button>
								{purchasedSearch && (
									<button
										type='button'
										onClick={() => {
											setSearchTerm('');
											setPurchasedSearch('');
											setPurchasedPage(1);
										}}
										className='px-3 py-2 bg-gray-800 border border-gold/20 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition text-sm cursor-pointer'
									>
										Clear
									</button>
								)}
							</form>

							{/* Select, Date Filters & Export */}
							<div className='flex flex-wrap gap-3 items-center justify-between sm:justify-start w-full lg:w-auto'>
								{/* Ticket Type Dropdown */}
								<select
									value={purchasedTicketType}
									onChange={(e) => {
										setPurchasedTicketType(e.target.value);
										setPurchasedPage(1);
									}}
									className='bg-gray-800 border border-gold/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold cursor-pointer'
								>
									<option value=''>All Ticket Types</option>
									{tickets.map((t) => (
										<option key={t._id} value={t.title}>
											{t.title}
										</option>
									))}
								</select>

								{/* Date Range Inputs */}
								<div className='flex items-center gap-2 bg-gray-800 border border-gold/20 rounded-lg px-2 py-1'>
									<input
										type='date'
										value={purchasedStartDate}
										onChange={(e) => {
											setPurchasedStartDate(e.target.value);
											setPurchasedPage(1);
										}}
										className='bg-transparent text-white text-xs focus:outline-none cursor-pointer'
										title='Start Date'
									/>
									<span className='text-gray-500 text-xs'>to</span>
									<input
										type='date'
										value={purchasedEndDate}
										onChange={(e) => {
											setPurchasedEndDate(e.target.value);
											setPurchasedPage(1);
										}}
										className='bg-transparent text-white text-xs focus:outline-none cursor-pointer'
										title='End Date'
									/>
									{(purchasedStartDate || purchasedEndDate) && (
										<button
											onClick={() => {
												setPurchasedStartDate('');
												setPurchasedEndDate('');
												setPurchasedPage(1);
											}}
											className='text-red-400 hover:text-red-300 text-xs px-1 font-bold cursor-pointer'
										>
											✕
										</button>
									)}
								</div>

								{/* Download CSV Button */}
								<button
									onClick={handleDownloadCSV}
									disabled={csvDownloading || purchasedTickets.length === 0}
									className='px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold rounded-lg transition text-sm flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer'
									title='Download Attendees List as CSV'
								>
									{csvDownloading ? (
										<>
											<Loader2 className='w-4 h-4 animate-spin' />
											<span>Exporting...</span>
										</>
									) : (
										<>
											<Download className='w-4 h-4' />
											<span>Download CSV</span>
										</>
									)}
								</button>
							</div>
						</div>

						{/* Main Content Area (Table) */}
						<div className='flex-1 overflow-y-auto p-3 md:p-6'>
							{purchasedLoading ? (
								<div className='flex flex-col items-center justify-center py-20 gap-3'>
									<Loader2 className='w-10 h-10 text-gold animate-spin' />
									<p className='text-sm text-gray-400'>Loading purchases...</p>
								</div>
							) : purchasedTickets.length === 0 ? (
								<div className='text-center py-20 bg-gray-800/20 border border-gold/10 rounded-xl'>
									<Users className='w-12 h-12 text-gray-600 mx-auto mb-3' />
									<p className='text-gray-400 font-medium'>No tickets purchased matching your filters.</p>
									{(purchasedSearch || purchasedTicketType || purchasedStartDate || purchasedEndDate) && (
										<button
											onClick={() => {
												setSearchTerm('');
												setPurchasedSearch('');
												setPurchasedTicketType('');
												setPurchasedStartDate('');
												setPurchasedEndDate('');
												setPurchasedPage(1);
											}}
											className='mt-4 text-sm text-gold hover:underline'
										>
											Reset all filters
										</button>
									)}
								</div>
							) : (
								<div className='border border-gold/15 rounded-xl overflow-hidden bg-black/20'>
									<div className='overflow-x-auto'>
										<table className='w-full text-left border-collapse min-w-[800px]'>
											<thead>
												<tr className='bg-gray-800/60 border-b border-gold/10 text-xs font-semibold text-gray-400 uppercase'>
													<th className='p-4'>Ticket ID</th>
													<th className='p-4'>Attendee Email</th>
													<th className='p-4'>Ticket Type</th>
													<th className='p-4 text-center'>Qty</th>
													<th className='p-4'>Amount</th>
													<th className='p-4'>Purchase Date</th>
													<th className='p-4'>Status</th>
												</tr>
											</thead>
											<tbody className='divide-y divide-gold/10 text-sm text-gray-300'>
												{purchasedTickets.map((ticket) => (
													<tr key={ticket._id} className='hover:bg-gray-800/30 transition-colors'>
														<td className='p-4 font-mono text-xs text-gold font-semibold selection:bg-gold/30 selection:text-white'>
															{ticket.ticketId}
														</td>
														<td className='p-4 text-white font-medium'>{ticket.customerEmail}</td>
														<td className='p-4'>
															<span className='inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gold/10 text-gold border border-gold/20'>
																{ticket.ticketName}
															</span>
														</td>
														<td className='p-4 text-center font-bold'>{ticket.quantity}</td>
														<td className='p-4 font-semibold text-white'>
															{ticket.amount === 0 ? (
																<span className='text-green-400 font-semibold uppercase text-xs'>Free</span>
															) : (
																`${ticket.currency || 'NGN'} ${(ticket.amount || 0).toLocaleString()}`
															)}
														</td>
														<td className='p-4 text-gray-400 text-xs'>
															{new Date(ticket.createdAt).toLocaleDateString('en-US', {
																month: 'short',
																day: 'numeric',
																year: 'numeric',
																hour: '2-digit',
																minute: '2-digit'
															})}
														</td>
														<td className='p-4'>
															<span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
																ticket.status === 'active' 
																	? 'bg-green-500/10 text-green-400 border-green-500/20' 
																	: 'bg-red-500/10 text-red-400 border-red-500/20'
															}`}>
																{ticket.status}
															</span>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</div>
							)}
						</div>

						{/* Modal Footer / Pagination */}
						{purchasedTotalPages > 1 && (
							<div className='p-4 md:p-6 border-t border-gold/20 flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-900/90'>
								<span className='text-xs text-gray-400'>
									Showing Page <strong className='text-white'>{purchasedPage}</strong> of <strong className='text-white'>{purchasedTotalPages}</strong>
								</span>
								<div className='flex flex-wrap items-center justify-center gap-2'>
									<button
										disabled={purchasedPage === 1 || purchasedLoading}
										onClick={() => {
											setPurchasedPage(purchasedPage - 1);
										}}
										className='px-3 py-1.5 bg-gray-800 border border-gold/20 rounded-lg hover:bg-gray-700 disabled:opacity-40 disabled:hover:bg-gray-800 transition text-xs font-medium text-white cursor-pointer'
									>
										Previous
									</button>
									
									{/* Numeric page buttons */}
									{Array.from({ length: purchasedTotalPages }, (_, i) => i + 1).map(pageNo => {
										if (
											purchasedTotalPages <= 5 ||
											pageNo === 1 ||
											pageNo === purchasedTotalPages ||
											Math.abs(pageNo - purchasedPage) <= 1
										) {
											return (
												<button
													key={pageNo}
													onClick={() => {
														setPurchasedPage(pageNo);
													}}
													className={`px-3 py-1.5 rounded-lg transition text-xs font-semibold cursor-pointer ${
														purchasedPage === pageNo
															? 'bg-gold text-black'
															: 'bg-gray-800 hover:bg-gray-700 text-white border border-gold/10'
													}`}
												>
													{pageNo}
												</button>
											);
										}
										if (pageNo === 2 || pageNo === purchasedTotalPages - 1) {
											return <span key={pageNo} className='text-gray-500 px-1 text-xs'>...</span>;
										}
										return null;
									})}

									<button
										disabled={purchasedPage === purchasedTotalPages || purchasedLoading}
										onClick={() => {
											setPurchasedPage(purchasedPage + 1);
										}}
										className='px-3 py-1.5 bg-gray-800 border border-gold/20 rounded-lg hover:bg-gray-700 disabled:opacity-40 disabled:hover:bg-gray-800 transition text-xs font-medium text-white cursor-pointer'
									>
										Next
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			)}
		</main>
	)
}
