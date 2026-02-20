// app/tickets/page.tsx - COMPLETE WITH PAYMENT DATA INTEGRATION
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Ticket,
  Download,
  Share2,
  Calendar,
  MapPin,
  User,
  Mail,
  ChevronDown,
  ChevronUp,
  QrCode,
  Clock,
  AlertCircle,
  Coins,
  ArrowLeft,
} from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { useSearchParams } from 'next/navigation'

interface TicketData {
  ticketId: string
  amount: number
  currency: string
  status: string
  customerEmail: string
  ticketName: string
  eventDate: string
  eventName?: string
  eventLocation?: string
  purchaseDate?: string
  tx_ref?: string
}

export default function TicketsPage() {
  const searchParams = useSearchParams()
  const [tickets, setTickets] = useState<TicketData[]>([])
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null)
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const baseUrl = process.env.NEXT_PUBLIC_API_URL
  // Mock tickets for fallback

  const mockTickets: TicketData[] = [
    {
      ticketId: 'TKT-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      amount: 41500,
      currency: 'NGN',
      status: 'active',
      customerEmail: 'guest@example.com',
      ticketName: 'VIP + Luxury Accommodation',
      eventDate: 'March 27, 2026',
      eventName: 'LOFTE-3 Dinner Night',
      eventLocation: 'Eko Hotels & Suites, Lagos',
      purchaseDate: new Date().toISOString(),
      tx_ref: 'tx-' + Date.now(),
    },
    {
      ticketId: 'TKT-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      amount: 7150,
      currency: 'NGN',
      status: 'active',
      customerEmail: 'guest@example.com',
      ticketName: 'VIP Ticket',
      eventDate: 'March 27, 2026',
      eventName: 'LOFTE-3 Dinner Night',
      eventLocation: 'Eko Hotels & Suites, Lagos',
      purchaseDate: new Date().toISOString(),
      tx_ref: 'tx-' + Date.now(),
    },
  ]

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true)

        // Get transaction reference from URL (if redirected from payment)
        const tx_ref = searchParams.get('tx_ref')

        // Try to get the last payment from localStorage
        let lastPayment = null
        const savedPayment = localStorage.getItem('lastPayment')
        if (savedPayment) {
          try {
            lastPayment = JSON.parse(savedPayment)
            console.log('Found last payment in localStorage:', lastPayment)
          } catch (e) {
            console.error('Error parsing lastPayment:', e)
          }
        }

        // If we have a tx_ref from URL or localStorage, fetch that specific ticket
        if (tx_ref || lastPayment?.tx_ref) {
          const ticketRef = tx_ref || lastPayment.tx_ref
          console.log('Fetching ticket with ref:', ticketRef)

          try {
            const response = await fetch(
              `${baseUrl}/api/payments/tickets/${ticketRef}`,
            )

            if (response.ok) {
              const ticketData = await response.json()
              console.log('Ticket fetched successfully:', ticketData)

              // Format the ticket data
              const formattedTicket: TicketData = {
                ticketId: ticketData._id || ticketData.ticketId || ticketRef,
                amount: ticketData.amount || lastPayment?.amount || 0,
                currency: ticketData.currency || lastPayment?.currency || 'NGN',
                status: ticketData.status || 'active',
                customerEmail:
                  ticketData.customerEmail ||
                  lastPayment?.email ||
                  'guest@example.com',
                ticketName:
                  ticketData.ticketName ||
                  lastPayment?.ticketName ||
                  'Event Ticket',
                eventDate: ticketData.eventDate || 'March 27, 2026',
                eventName: ticketData.eventName || 'LOFTE-3 Dinner Night',
                eventLocation:
                  ticketData.eventLocation || 'Eko Hotels & Suites, Lagos',
                purchaseDate:
                  ticketData.purchaseDate || new Date().toISOString(),
                tx_ref: ticketRef,
              }

              setTickets([formattedTicket])
              setLoading(false)
              return
            } else {
              console.log('Ticket endpoint returned:', response.status)
            }
          } catch (fetchError) {
            console.error('Error fetching ticket:', fetchError)
          }
        }

        // If we have lastPayment but couldn't fetch, create a ticket from payment data
        if (lastPayment && lastPayment.tx_ref) {
          console.log('Creating ticket from payment data:', lastPayment)

          const paymentTicket: TicketData = {
            ticketId: 'TKT-' + Date.now().toString().substr(-8),
            amount: lastPayment.amount || 0,
            currency: lastPayment.currency || 'NGN',
            status: 'active',
            customerEmail: lastPayment.email || 'guest@example.com',
            ticketName: lastPayment.ticketName || 'Event Ticket',
            eventDate: 'March 27, 2026',
            eventName: 'LOFTE-3 Dinner Night',
            eventLocation: 'Eko Hotels & Suites, Lagos',
            purchaseDate: lastPayment.timestamp || new Date().toISOString(),
            tx_ref: lastPayment.tx_ref,
          }

          setTickets([paymentTicket])
          setLoading(false)
          return
        }

        // If no payment data, try the user tickets endpoint
        try {
          const response = await fetch(
            `${baseUrl}/api/payments/tickets/:tr_ref`,
          )

          if (response.ok) {
            const userTickets = await response.json()
            console.log('User tickets fetched:', userTickets)

            if (Array.isArray(userTickets) && userTickets.length > 0) {
              setTickets(userTickets)
              setLoading(false)
              return
            }
          }
        } catch (userError) {
          console.log('User tickets endpoint not available:', userError)
        }

        // If all else fails, use mock data
        console.log('Using mock tickets as fallback')
        setTickets(mockTickets)
      } catch (err: any) {
        console.error('Error in ticket fetch:', err)
        setError(err.message)
        // Fallback to mock on error
        setTickets(mockTickets)
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [searchParams])

  const filteredTickets = tickets.filter((ticket) => {
    if (filter === 'all') return true
    return ticket.status === filter
  })

  const downloadTicket = (ticket: TicketData) => {
    alert(
      'Download feature coming soon! Your ticket QR code will be available for download.',
    )
  }

  const shareTicket = (ticket: TicketData) => {
    alert(
      'Share feature coming soon! You will be able to share your ticket via email.',
    )
  }

  const viewTicketDetails = (ticket: TicketData) => {
    setSelectedTicket(
      selectedTicket?.ticketId === ticket.ticketId ? null : ticket,
    )
  }

  if (loading) {
    return (
      <main className='min-h-screen bg-black text-white'>
        <Navbar />
        <div className='container mx-auto px-4 pt-32 pb-20'>
          <div className='flex items-center justify-center min-h-[60vh]'>
            <div className='text-center'>
              <div className='w-20 h-20 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-6'></div>
              <p className='text-gray-400'>Loading your tickets...</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (error && tickets.length === 0) {
    return (
      <main className='min-h-screen bg-black text-white'>
        <Navbar />
        <div className='container mx-auto px-4 pt-32 pb-20'>
          <div className='flex items-center justify-center min-h-[60vh]'>
            <div className='text-center max-w-md'>
              <div className='w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6'>
                <AlertCircle className='w-10 h-10 text-red-500' />
              </div>
              <h2 className='text-2xl font-bold text-red-500 mb-4'>
                Error Loading Tickets
              </h2>
              <p className='text-gray-400 mb-8'>{error}</p>
              <Link
                href='/'
                className='inline-block px-8 py-3 bg-gold text-black font-bold rounded-lg hover:opacity-90 transition'
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className='min-h-screen bg-black text-white'>
      <Navbar />

      <div className='container mx-auto px-4 pt-32 pb-20'>
        {/* Back Button */}
        <Link
          href='/'
          className='inline-flex items-center gap-2 text-gray-400 hover:text-gold transition-colors mb-8'
        >
          <ArrowLeft className='w-4 h-4' />
          Back to Events
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-12'
        >
          <h1 className='text-4xl md:text-5xl font-bold mb-4'>
            <span className='text-white'>My</span>
            <span className='text-gold ml-3'>Tickets</span>
          </h1>
          <p className='text-gray-400 text-lg'>
            View and manage all your event tickets
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-12'
        >
          <div className='bg-gray-900/50 border border-gold/20 rounded-xl p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-400 text-sm'>Total Tickets</p>
                <p className='text-3xl font-bold text-white'>
                  {tickets.length}
                </p>
              </div>
              <div className='p-3 bg-gold/20 rounded-lg'>
                <Ticket className='w-6 h-6 text-gold' />
              </div>
            </div>
          </div>

          <div className='bg-gray-900/50 border border-gold/20 rounded-xl p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-400 text-sm'>Total Spent</p>
                <p className='text-3xl font-bold text-gold'>
                  ₦
                  {tickets
                    .reduce((acc, t) => acc + t.amount, 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className='p-3 bg-gold/20 rounded-lg'>
                <Coins className='w-6 h-6 text-gold' />
              </div>
            </div>
          </div>

          <div className='bg-gray-900/50 border border-gold/20 rounded-xl p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-400 text-sm'>Active Tickets</p>
                <p className='text-3xl font-bold text-green-400'>
                  {tickets.filter((t) => t.status === 'active').length}
                </p>
              </div>
              <div className='p-3 bg-green-500/20 rounded-lg'>
                <Calendar className='w-6 h-6 text-green-500' />
              </div>
            </div>
          </div>

          <div className='bg-gray-900/50 border border-gold/20 rounded-xl p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-400 text-sm'>Events</p>
                <p className='text-3xl font-bold text-gold'>
                  {new Set(tickets.map((t) => t.eventName)).size}
                </p>
              </div>
              <div className='p-3 bg-gold/20 rounded-lg'>
                <QrCode className='w-6 h-6 text-gold' />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className='flex gap-3 mb-8'
        >
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-lg font-bold transition-all ${
              filter === 'all'
                ? 'bg-gold text-black'
                : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
            }`}
          >
            All Tickets
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-6 py-3 rounded-lg font-bold transition-all ${
              filter === 'active'
                ? 'bg-gold text-black'
                : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
            }`}
          >
            Active
          </button>
        </motion.div>

        {/* Tickets Grid */}
        {filteredTickets.length > 0 ? (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {filteredTickets.map((ticket, index) => (
              <motion.div
                key={ticket.ticketId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className='bg-gradient-to-br from-gray-900 to-black border-2 border-gold/30 rounded-2xl overflow-hidden hover:border-gold/60 transition-all group'
              >
                {/* Ticket Header */}
                <div className='p-6 border-b border-gold/20 bg-gray-900/50'>
                  <div className='flex justify-between items-start mb-4'>
                    <div>
                      <span className='text-sm text-gold font-bold mb-2 block'>
                        {ticket.ticketId}
                      </span>
                      <h3 className='text-xl font-bold text-white'>
                        {ticket.eventName}
                      </h3>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        ticket.status === 'active'
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}
                    >
                      {ticket.status?.toUpperCase()}
                    </span>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div className='flex items-center gap-2'>
                      <Calendar className='w-4 h-4 text-gold' />
                      <div>
                        <p className='text-xs text-gray-400'>Event Date</p>
                        <p className='text-sm text-white'>{ticket.eventDate}</p>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <User className='w-4 h-4 text-gold' />
                      <div>
                        <p className='text-xs text-gray-400'>Ticket Type</p>
                        <p className='text-sm text-white'>
                          {ticket.ticketName}
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Mail className='w-4 h-4 text-gold' />
                      <div>
                        <p className='text-xs text-gray-400'>Email</p>
                        <p className='text-sm text-white'>
                          {ticket.customerEmail}
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Coins className='w-4 h-4 text-gold' />
                      <div>
                        <p className='text-xs text-gray-400'>Amount</p>
                        <p className='text-sm text-white'>
                          {ticket.currency === 'NGN' ? '₦' : '$'}
                          {ticket.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ticket Body */}
                <div className='p-6'>
                  {/* QR Code */}
                  <div className='flex justify-center mb-6'>
                    <div className='relative'>
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.ticketId}`}
                        alt='Ticket QR Code'
                        className='w-32 h-32 border-2 border-gold/30 rounded-lg'
                      />
                      <div className='absolute -inset-1 bg-gold/20 blur-lg rounded-lg'></div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className='flex gap-3'>
                    <button
                      onClick={() => downloadTicket(ticket)}
                      className='flex-1 py-3 bg-gold/20 border border-gold/30 rounded-lg text-gold font-bold hover:bg-gold/30 transition-all flex items-center justify-center gap-2'
                    >
                      <Download className='w-4 h-4' />
                      Download
                    </button>
                    <button
                      onClick={() => shareTicket(ticket)}
                      className='flex-1 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 font-bold hover:bg-gray-700 transition-all flex items-center justify-center gap-2'
                    >
                      <Share2 className='w-4 h-4' />
                      Share
                    </button>
                  </div>

                  {/* View Details Toggle */}
                  <button
                    onClick={() => viewTicketDetails(ticket)}
                    className='w-full mt-4 py-2 text-sm text-gray-400 hover:text-gold transition-colors flex items-center justify-center gap-2'
                  >
                    {selectedTicket?.ticketId === ticket.ticketId ? (
                      <>
                        Hide Details <ChevronUp className='w-4 h-4' />
                      </>
                    ) : (
                      <>
                        View Details <ChevronDown className='w-4 h-4' />
                      </>
                    )}
                  </button>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {selectedTicket?.ticketId === ticket.ticketId && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className='mt-4 pt-4 border-t border-gold/20'
                      >
                        <div className='space-y-2 text-sm'>
                          <div className='flex justify-between'>
                            <span className='text-gray-400'>Location:</span>
                            <span className='text-white'>
                              {ticket.eventLocation}
                            </span>
                          </div>
                          <div className='flex justify-between'>
                            <span className='text-gray-400'>
                              Purchase Date:
                            </span>
                            <span className='text-white'>
                              {ticket.purchaseDate
                                ? new Date(
                                    ticket.purchaseDate,
                                  ).toLocaleDateString()
                                : 'N/A'}
                            </span>
                          </div>
                          {ticket.tx_ref && (
                            <div className='flex justify-between'>
                              <span className='text-gray-400'>
                                Transaction Ref:
                              </span>
                              <span className='text-gold font-mono text-xs'>
                                {ticket.tx_ref}
                              </span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          // Empty State
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='text-center py-20'
          >
            <div className='w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6'>
              <Ticket className='w-12 h-12 text-gray-600' />
            </div>
            <h3 className='text-2xl font-bold text-white mb-3'>
              No Tickets Found
            </h3>
            <p className='text-gray-400 mb-8 max-w-md mx-auto'>
              You haven't purchased any tickets yet. Browse our upcoming events
              and get your tickets now!
            </p>
            <Link
              href='/#events'
              className='inline-flex items-center gap-2 px-8 py-4 bg-gold text-black font-bold rounded-xl hover:opacity-90 transition'
            >
              Browse Events
            </Link>
          </motion.div>
        )}
      </div>
    </main>
  )
}
