'use client'

import { useState, useEffect } from 'react'
import { Ticket, AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import TicketCard, { TicketCardData } from '@/components/TicketCard'
import { useSearchParams } from 'next/navigation'

interface TicketData extends TicketCardData {
	eventDate: string
}

export default function TicketsPage() {
	const searchParams = useSearchParams()
	const [tickets, setTickets] = useState<TicketData[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	const baseUrl = process.env.NEXT_PUBLIC_API_URL
	const tx_ref = searchParams.get('tx_ref')

	useEffect(() => {
		const fetchTicket = async () => {
			if (!tx_ref) {
				setLoading(false)
				setError('No ticket reference provided.')
				return
			}

			try {
				const response = await fetch(
					`${baseUrl}/api/payments/ticket/${tx_ref}`,
				)
				if (!response.ok) {
					const errData = await response.json()
					throw new Error(errData.error || 'Ticket not found')
				}

				const ticketData: TicketData = await response.json()
				setTickets([ticketData])
			} catch (err: any) {
				console.error('Error fetching ticket:', err)
				setError(err.message || 'Failed to load ticket')
			} finally {
				setLoading(false)
			}
		}

		fetchTicket()
	}, [tx_ref, baseUrl])

	if (loading) {
		return (
			<main className='min-h-screen bg-black text-white'>
				<Navbar />
				<div className='container mx-auto px-4 pt-24 md:pt-32 pb-20 text-center'>
					<div className='w-16 h-16 md:w-20 md:h-20 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4 md:mb-6'></div>
					<p className='text-sm md:text-base text-gray-400'>
						Loading your ticket...
					</p>
				</div>
			</main>
		)
	}

	if (error) {
		return (
			<main className='min-h-screen bg-black text-white'>
				<Navbar />
				<div className='container mx-auto px-4 pt-24 md:pt-32 pb-20 text-center'>
					<div className='w-16 h-16 md:w-20 md:h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6'>
						<AlertCircle className='w-8 h-8 md:w-10 md:h-10 text-red-500' />
					</div>
					<h2 className='text-xl md:text-2xl font-bold text-red-500 mb-2 md:mb-4'>
						Error Loading Ticket
					</h2>
					<p className='text-sm md:text-base text-gray-400 mb-6 md:mb-8 px-4'>
						{error}
					</p>
					<Link
						href='/'
						className='inline-block px-6 md:px-8 py-2 md:py-3 bg-gold text-black font-bold rounded-lg hover:opacity-90 transition text-sm md:text-base'
					>
						Back to Home
					</Link>
				</div>
			</main>
		)
	}

	return (
		<main className='min-h-screen bg-black text-white flex flex-col'>
			<Navbar />
			<div className='flex-1 overflow-y-auto'>
				<div className='container mx-auto px-4 pt-24 md:pt-32 pb-12 md:pb-20'>
					{/* Back Button */}
					<Link
						href='/'
						className='inline-flex items-center gap-1 md:gap-2 text-sm md:text-base text-gray-400 hover:text-gold transition-colors mb-6 md:mb-8'
					>
						<ArrowLeft className='w-3 h-3 md:w-4 md:h-4' />
						<span>Back to Events</span>
					</Link>

					{/* Tickets Grid */}
					{tickets.length > 0 ? (
						<div className='grid grid-cols-1 gap-6 md:gap-8'>
							{tickets.map((ticket) => (
								<TicketCard key={ticket.ticketId} ticket={ticket} />
							))}
						</div>
					) : (
						<div className='text-center py-12 md:py-20'>
							<Ticket className='w-12 h-12 md:w-16 md:h-16 text-gray-600 mx-auto mb-4 md:mb-6' />
							<h3 className='text-xl md:text-2xl font-bold text-white mb-2 md:mb-3'>
								No Tickets Found
							</h3>
							<p className='text-sm md:text-base text-gray-400 mb-6 md:mb-8 px-4'>
								You haven't purchased any tickets yet. Browse
								upcoming events to get your tickets.
							</p>
							<Link
								href='/'
								className='inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-gold text-black font-bold rounded-xl hover:opacity-90 transition text-sm md:text-base'
							>
								Browse Events
							</Link>
						</div>
					)}
				</div>
			</div>
		</main>
	)
}
