'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Ticket,
  Download,
  Share2,
  Calendar,
  User,
  Mail,
  Coins,
  QrCode,
  AlertCircle,
  ArrowLeft,
  MapPin,
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
        const response = await fetch(`${baseUrl}/api/payments/ticket/${tx_ref}`)
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

  const toggleTicketDetails = (ticket: TicketData) => {
    setSelectedTicket(
      selectedTicket?.ticketId === ticket.ticketId ? null : ticket,
    )
  }

  if (loading) {
    return (
      <main className='min-h-screen bg-black text-white'>
        <Navbar />
        <div className='container mx-auto px-4 pt-24 md:pt-32 pb-20 text-center'>
          <div className='w-16 h-16 md:w-20 md:h-20 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4 md:mb-6'></div>
          <p className='text-sm md:text-base text-gray-400'>Loading your ticket...</p>
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
          <p className='text-sm md:text-base text-gray-400 mb-6 md:mb-8 px-4'>{error}</p>
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
              <motion.div
                key={ticket.ticketId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='bg-gradient-to-br from-gray-900 to-black border-2 border-gold/30 rounded-xl md:rounded-2xl overflow-hidden hover:border-gold/60 transition-all group'
              >
                {/* Ticket Header */}
                <div className='p-4 md:p-6 border-b border-gold/20 bg-gray-900/50'>
                  <div className='flex flex-col sm:flex-row justify-between items-start gap-3 mb-4'>
                    <div className='w-full sm:w-auto'>
                      <span className='text-xs md:text-sm text-gold font-bold mb-1 md:mb-2 block break-all'>
                        {ticket.ticketId}
                      </span>
                      <h3 className='text-lg md:text-xl font-bold text-white'>
                        {ticket.eventName}
                      </h3>
                    </div>
                    <span
                      className={`px-2 md:px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                        ticket.status === 'active'
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}
                    >
                      {ticket.status?.toUpperCase()}
                    </span>
                  </div>

                  {/* Ticket Details Grid - Responsive */}
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4'>
                    <div className='flex items-center gap-2 md:gap-3'>
                      <Calendar className='w-4 h-4 md:w-5 md:h-5 text-gold flex-shrink-0' />
                      <div className='min-w-0 flex-1'>
                        <p className='text-xs text-gray-400'>Event Date</p>
                        <p className='text-xs md:text-sm text-white truncate'>{ticket.eventDate}</p>
                      </div>
                    </div>
                    
                    <div className='flex items-center gap-2 md:gap-3'>
                      <User className='w-4 h-4 md:w-5 md:h-5 text-gold flex-shrink-0' />
                      <div className='min-w-0 flex-1'>
                        <p className='text-xs text-gray-400'>Ticket Type</p>
                        <p className='text-xs md:text-sm text-white truncate'>
                          {ticket.ticketName}
                        </p>
                      </div>
                    </div>
                    
                    <div className='flex items-center gap-2 md:gap-3'>
                      <Mail className='w-4 h-4 md:w-5 md:h-5 text-gold flex-shrink-0' />
                      <div className='min-w-0 flex-1'>
                        <p className='text-xs text-gray-400'>Email</p>
                        <p className='text-xs md:text-sm text-white truncate'>
                          {ticket.customerEmail}
                        </p>
                      </div>
                    </div>
                    
                    <div className='flex items-center gap-2 md:gap-3'>
                      <Coins className='w-4 h-4 md:w-5 md:h-5 text-gold flex-shrink-0' />
                      <div className='min-w-0 flex-1'>
                        <p className='text-xs text-gray-400'>Amount</p>
                        <p className='text-xs md:text-sm text-white font-bold'>
                          {ticket.currency === 'NGN' ? '₦' : '$'}
                          {ticket.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ticket Body */}
                <div className='p-4 md:p-6'>
                  {/* QR Code - Responsive */}
                  <div className='flex justify-center mb-4 md:mb-6'>
                    <div className='relative'>
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.ticketId}`}
                        alt='Ticket QR Code'
                        className='w-24 h-24 md:w-32 md:h-32 border-2 border-gold/30 rounded-lg'
                      />
                      <div className='absolute inset-0 bg-gold/5 rounded-lg'></div>
                    </div>
                  </div>

                  {/* Actions - Stack on mobile, side by side on larger screens */}
                  <div className='flex flex-col sm:flex-row gap-2 md:gap-3'>
                    <button
                      onClick={() => downloadTicket(ticket)}
                      className='flex-1 py-2 md:py-3 bg-gold/20 border border-gold/30 rounded-lg text-gold font-bold hover:bg-gold/30 transition-all flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm'
                    >
                      <Download className='w-3 h-3 md:w-4 md:h-4' /> 
                      <span>Download</span>
                    </button>
                    <button
                      onClick={() => shareTicket(ticket)}
                      className='flex-1 py-2 md:py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 font-bold hover:bg-gray-700 transition-all flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm'
                    >
                      <Share2 className='w-3 h-3 md:w-4 md:h-4' /> 
                      <span>Share</span>
                    </button>
                  </div>

                  {/* View Details Button */}
                  <button
                    onClick={() => toggleTicketDetails(ticket)}
                    className='w-full mt-3 md:mt-4 py-2 text-xs md:text-sm text-gray-400 hover:text-gold transition-colors flex items-center justify-center gap-1 md:gap-2'
                  >
                    {selectedTicket?.ticketId === ticket.ticketId
                      ? 'Hide Details ↑'
                      : 'View Details ↓'}
                  </button>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {selectedTicket?.ticketId === ticket.ticketId && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className='mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gold/20'
                      >
                        <div className='space-y-2 text-xs md:text-sm'>
                          <div className='flex flex-col sm:flex-row sm:justify-between gap-1'>
                            <span className='text-gray-400'>Location:</span>
                            <span className='text-white break-words'>
                              {ticket.eventLocation || 'Eko Hotels & Suites, Lagos'}
                            </span>
                          </div>
                          <div className='flex flex-col sm:flex-row sm:justify-between gap-1'>
                            <span className='text-gray-400'>Purchase Date:</span>
                            <span className='text-white'>
                              {ticket.purchaseDate
                                ? new Date(
                                    ticket.purchaseDate,
                                  ).toLocaleDateString()
                                : new Date().toLocaleDateString()}
                            </span>
                          </div>
                          {ticket.tx_ref && (
                            <div className='flex flex-col sm:flex-row sm:justify-between gap-1'>
                              <span className='text-gray-400'>Transaction Ref:</span>
                              <span className='text-gold font-mono text-xs break-all'>
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
          <div className='text-center py-12 md:py-20'>
            <Ticket className='w-12 h-12 md:w-16 md:h-16 text-gray-600 mx-auto mb-4 md:mb-6' />
            <h3 className='text-xl md:text-2xl font-bold text-white mb-2 md:mb-3'>
              No Tickets Found
            </h3>
            <p className='text-sm md:text-base text-gray-400 mb-6 md:mb-8 px-4'>
              You haven't purchased any tickets yet. Browse upcoming events to
              get your tickets.
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