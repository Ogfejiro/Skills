// components/TicketModal.tsx - WITH ALL FEATURES VISIBLE
'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Ticket,
  Loader,
  X,
  Percent,
  Users,
  TrendingUp,
  Wallet,
  Bitcoin,
  Check,
} from 'lucide-react'
import { paymentService } from '@/app/services/paymentService'

type CurrencyType = 'NGN' | 'USD'
type PaymentMethod = 'naira' | 'crypto'

interface TicketModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function TicketModal({ isOpen, onClose }: TicketModalProps) {
  const [currency, setCurrency] = useState<CurrencyType>('USD')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('crypto')
  const [loading, setLoading] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState('')
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [ticketsSold, setTicketsSold] = useState(342)

  // Exchange rate
  const exchangeRate = 1430

  // Ticket counter animation
  useEffect(() => {
    const interval = setInterval(() => {
      setTicketsSold((prev) => {
        if (prev < 1000) {
          const increment = Math.floor(Math.random() * 3) + 1
          return Math.min(prev + increment, 1000)
        }
        return prev
      })
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const ticketsRemaining = 1000 - ticketsSold
  const percentSold = (ticketsSold / 1000) * 100

  // Ticket options with all features
  const ticketOptions = [
    {
      id: 'regular',
      name: 'Regular Ticket',
      icon: '🎟️',
      priceUSD: 0.9,
      priceNGN: Math.round(0.9 * exchangeRate),
      originalUSD: 1.5,
      originalNGN: Math.round(1.5 * exchangeRate),
      features: [
        'Event Access',
        'Basic Seating',
        'Networking',
        'Complimentary Refreshments and Merch',
        'Red Carpet Access',
      ],
      description: 'Main event access with premium features',
    },
    {
      id: 'regular-accommodation',
      name: 'Regular + Accommodation',
      icon: '🏨',
      priceUSD: 9.99,
      priceNGN: Math.round(9.99 * exchangeRate),
      originalUSD: 16.65,
      originalNGN: Math.round(16.65 * exchangeRate),
      features: [
        'Event Access',
        'Basic Seating',
        'Networking',
        'Complimentary Refreshments and Merch',
        'Red Carpet Access',
        'Private Room Accommodation (1 night)',
      ],
      description: 'Includes private room accommodation',
    },
    {
      id: 'vip',
      name: 'VIP Ticket',
      icon: '⭐',
      priceUSD: 6.99,
      priceNGN: Math.round(6.99 * exchangeRate),
      originalUSD: 11.65,
      originalNGN: Math.round(11.65 * exchangeRate),
      features: [
        'Private Access and Networking Session',
        'Premium Seating',
        'Raffle Ticket for Exclusive Prizes',
        '3-Course Gourmet Dining Experience',
        'Red Carpet Professional Picture Session',
        'Premium Souvenir Package',
      ],
      description: 'Premium VIP experience with exclusive access',
    },
    {
      id: 'vip-luxury',
      name: 'VIP + Luxury Accommodation',
      icon: '👑',
      priceUSD: 29.99,
      priceNGN: Math.round(29.99 * exchangeRate),
      originalUSD: 49.98,
      originalNGN: Math.round(49.98 * exchangeRate),
      features: [
        'Private Access and Networking Session',
        'Premium Seating',
        'Raffle Ticket for Exclusive Prizes',
        '3-Course Gourmet Dining Experience',
        'Red Carpet Professional Picture Session',
        'Premium Souvenir Package',
        'Concierge Services',
        'Luxury Hotel Stay (1 night)',
      ],
      description: 'Ultimate luxury experience with concierge services',
    },
  ]

  const handleTicketSelect = (ticket: any) => {
    setSelectedTicket(ticket)
    setShowEmailModal(true)
  }

  const handlePayment = async () => {
    if (!selectedTicket || !userEmail) return

    setLoading(selectedTicket.id)

    try {
      const amount =
        currency === 'NGN' ? selectedTicket.priceNGN : selectedTicket.priceUSD

      if (paymentMethod === 'crypto') {
        console.log('💰 Processing CRYPTO payment for:', {
          ticket: selectedTicket.name,
          amount,
          email: userEmail,
        })

        const { paymentLink } = await paymentService.initiateCryptoPayment({
          amount,
          email: userEmail,
          userId: 'guest',
          ticketId: selectedTicket.id,
          ticketName: selectedTicket.name,
          quantity: 1,
        })

        window.location.href = paymentLink
      } else {
        console.log('💵 Processing NAIRA payment for:', {
          ticket: selectedTicket.name,
          amount,
          email: userEmail,
        })

        const { paymentLink } = await paymentService.initiatePayment({
          amount,
          email: userEmail,
          userId: 'guest',
          ticketId: selectedTicket.id,
          ticketName: selectedTicket.name,
          quantity: 1,
        })

        window.location.href = paymentLink
      }
    } catch (error: any) {
      console.error('❌ Payment error:', error)
      alert(error.message || 'Payment failed. Please try again.')
      setLoading(null)
      setShowEmailModal(false)
      setUserEmail('')
    }
  }

  const selectPaymentMethod = (method: PaymentMethod) => {
    setPaymentMethod(method)
    setCurrency(method === 'crypto' ? 'USD' : 'NGN')
  }

  if (!isOpen) return null

  return (
    <>
      {/* Main Modal */}
      <AnimatePresence>
        {isOpen && !showEmailModal && (
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
              className='bg-gradient-to-b from-gray-900 to-black border-2 border-gold/30 rounded-2xl max-w-2xl w-full max-h-[95vh] flex flex-col shadow-2xl shadow-gold/20'
              onClick={(e) => e.stopPropagation()}
            >
              {/* Fixed Header Section */}
              <div className='flex-shrink-0'>
                {/* 40% OFF Banner */}
                <div className='bg-gradient-to-r from-red-600 to-red-500 p-3 text-center border-b-2 border-gold'>
                  <div className='flex items-center justify-center gap-2 flex-wrap'>
                    <Percent className='w-5 h-5 text-white animate-pulse' />
                    <span className='text-xl md:text-2xl font-black text-white'>
                      40% OFF
                    </span>
                    <TrendingUp className='w-5 h-5 text-white animate-bounce' />
                    <span className='text-white/90 text-xs md:text-sm'>
                      FIRST 1000 TICKETS ONLY!
                    </span>
                  </div>
                </div>

                {/* Ticket Counter */}
                <div className='bg-gray-900 p-3 border-b border-gold/20'>
                  <div className='flex items-center justify-between mb-1'>
                    <div className='flex items-center gap-1'>
                      <Users className='w-4 h-4 text-gold' />
                      <span className='text-sm font-bold text-white'>
                        Early Bird Tickets
                      </span>
                    </div>
                    <span className='text-gold font-bold text-base'>
                      {ticketsRemaining} / 1000 left
                    </span>
                  </div>

                  <div className='w-full h-2 bg-gray-800 rounded-full overflow-hidden'>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentSold}%` }}
                      className='h-full bg-gradient-to-r from-gold to-yellow-500'
                    />
                  </div>

                  <p className='text-xs text-gray-400 mt-1 text-center'>
                    🔥 {ticketsSold} sold! Grab yours before price goes up
                  </p>
                </div>

                {/* Header */}
                <div className='p-3 border-b border-gold/20 bg-gray-900/50 flex justify-between items-center'>
                  <div>
                    <h2 className='text-xl font-bold text-gold'>
                      LOFTE-3 Tickets
                    </h2>
                    <p className='text-xs text-gray-400'>Select your ticket</p>
                  </div>
                  <button
                    onClick={onClose}
                    className='p-1 hover:bg-gray-800 rounded-lg'
                  >
                    <X className='w-5 h-5 text-gray-400' />
                  </button>
                </div>

                {/* Payment Method Selector */}
                <div className='p-3 border-b border-gold/10 bg-gray-900/30'>
                  <p className='text-xs text-gray-400 mb-2'>
                    Select Payment Method:
                  </p>
                  <div className='flex gap-2'>
                    <button
                      onClick={() => selectPaymentMethod('crypto')}
                      className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1 text-sm transition-all ${
                        paymentMethod === 'crypto'
                          ? 'bg-yellow-500/20 border border-yellow-500 text-yellow-400'
                          : 'bg-gray-800 border border-gray-700 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      <Bitcoin className='w-4 h-4' />
                      <span className='font-bold'>Crypto</span>
                    </button>
                    <button
                      onClick={() => selectPaymentMethod('naira')}
                      className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1 text-sm transition-all ${
                        paymentMethod === 'naira'
                          ? 'bg-green-500/20 border border-green-500 text-green-400'
                          : 'bg-gray-800 border border-gray-700 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      <span className='text-base'>🇳🇬</span>
                      <span className='font-bold'>Naira</span>
                    </button>
                  </div>
                </div>

                {/* Currency display */}
                <div className='px-3 py-2 border-b border-gold/10 bg-gray-900/30 flex justify-between items-center'>
                  <span className='text-xs text-gray-400'>
                    {paymentMethod === 'crypto'
                      ? 'Price in USD'
                      : 'Price in NGN'}
                  </span>
                  <span className='text-xs text-gray-500'>
                    1 USD = ₦{exchangeRate}
                  </span>
                </div>
              </div>

              {/* Scrollable Ticket Options - WITH ALL FEATURES SHOWING */}
              <div className='overflow-y-auto flex-1 p-3'>
                <div className='space-y-4 pb-4'>
                  {ticketOptions.map((ticket) => (
                    <motion.div
                      key={ticket.id}
                      whileHover={{ scale: 1.01 }}
                      className='p-4 border border-gold/20 rounded-xl bg-gray-900/30 cursor-pointer hover:border-gold/40 transition-all'
                      onClick={() => handleTicketSelect(ticket)}
                    >
                      <div className='flex flex-col gap-3'>
                        {/* Header with Icon and Price */}
                        <div className='flex items-start justify-between'>
                          <div className='flex items-center gap-2'>
                            <span className='text-2xl'>{ticket.icon}</span>
                            <div>
                              <h3 className='text-base font-bold text-white'>
                                {ticket.name}
                              </h3>
                              <p className='text-xs text-gray-400'>
                                {ticket.description}
                              </p>
                            </div>
                          </div>
                          <div className='text-right'>
                            <div className='text-xs text-gray-500 line-through'>
                              {paymentMethod === 'crypto' ? '$' : '₦'}
                              {paymentMethod === 'crypto'
                                ? ticket.originalUSD.toFixed(2)
                                : ticket.originalNGN.toLocaleString()}
                            </div>
                            <div className='text-lg font-bold text-gold'>
                              {paymentMethod === 'crypto' ? '$' : '₦'}
                              {paymentMethod === 'crypto'
                                ? ticket.priceUSD.toFixed(2)
                                : ticket.priceNGN.toLocaleString()}
                            </div>
                            <div className='text-xs text-green-400 font-bold'>
                              40% OFF
                            </div>
                          </div>
                        </div>

                        {/* ALL FEATURES - Fully visible */}
                        <div className='mt-2'>
                          <p className='text-xs text-gold mb-2 font-semibold'>
                            What's included:
                          </p>
                          <div className='grid grid-cols-1 gap-2'>
                            {ticket.features.map((feature, idx) => (
                              <div key={idx} className='flex items-start gap-2'>
                                <Check className='w-4 h-4 text-green-500 flex-shrink-0 mt-0.5' />
                                <span className='text-sm text-gray-300'>
                                  {feature}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Select button */}
                        <div className='mt-2 pt-2 border-t border-gray-800'>
                          <button className='w-full py-2 bg-gold/20 border border-gold/30 rounded-lg text-gold text-sm font-bold hover:bg-gold/30 transition-all'>
                            Select Ticket
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className='flex-shrink-0 p-3 border-t border-gold/10 bg-gray-900/30'>
                <p className='text-xs text-gray-400 text-center'>
                  {paymentMethod === 'crypto'
                    ? '🔐 Secure crypto payment via USDT • '
                    : '🔐 Secure payments by Flutterwave • '}
                  <a
                    href='https://t.me/Lofte3'
                    className='text-gold hover:underline'
                  >
                    Support
                  </a>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email Modal */}
      <AnimatePresence>
        {showEmailModal && selectedTicket && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/95 backdrop-blur-md z-[1100] flex items-center justify-center p-4'
            onClick={() => {
              setShowEmailModal(false)
              setUserEmail('')
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className='bg-gradient-to-b from-gray-900 to-black border-2 border-gold rounded-2xl max-w-md w-full p-6 shadow-2xl shadow-gold/30'
              onClick={(e) => e.stopPropagation()}
            >
              <div className='text-center mb-6'>
                <div className='w-16 h-16 bg-gradient-to-br from-gold to-gold/60 rounded-full flex items-center justify-center mx-auto mb-3'>
                  <Ticket className='w-8 h-8 text-black' />
                </div>
                <h3 className='text-2xl font-bold text-gold mb-1'>
                  {paymentMethod === 'crypto'
                    ? 'Crypto Payment'
                    : 'Complete Purchase'}
                </h3>
                <p className='text-xs text-gray-400'>
                  Enter your email to receive tickets
                </p>
              </div>

              <div className='mb-4 p-4 bg-gray-800/70 border border-gold/30 rounded-xl'>
                <div className='flex justify-between mb-2 pb-2 border-b border-gray-700'>
                  <span className='text-xs text-gray-400'>Ticket:</span>
                  <span className='text-sm font-bold text-white'>
                    {selectedTicket.name}
                  </span>
                </div>
                <div className='flex justify-between mb-2'>
                  <span className='text-xs text-gray-400'>Payment:</span>
                  <span
                    className={`text-xs font-bold ${paymentMethod === 'crypto' ? 'text-yellow-400' : 'text-green-400'}`}
                  >
                    {paymentMethod === 'crypto'
                      ? 'USDT (Crypto)'
                      : 'Naira (Flutterwave)'}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-xs text-gray-400'>Amount:</span>
                  <div className='text-right'>
                    <div className='text-xs text-gray-500 line-through'>
                      {paymentMethod === 'crypto' ? '$' : '₦'}
                      {paymentMethod === 'crypto'
                        ? selectedTicket.originalUSD.toFixed(2)
                        : selectedTicket.originalNGN.toLocaleString()}
                    </div>
                    <span className='text-gold font-bold text-xl'>
                      {paymentMethod === 'crypto' ? '$' : '₦'}
                      {paymentMethod === 'crypto'
                        ? selectedTicket.priceUSD.toFixed(2)
                        : selectedTicket.priceNGN.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className='mb-4'>
                <input
                  type='email'
                  placeholder='Your email'
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className='w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:border-gold focus:outline-none'
                  required
                />
              </div>

              <div className='flex gap-3'>
                <button
                  onClick={() => {
                    setShowEmailModal(false)
                    setUserEmail('')
                  }}
                  className='flex-1 py-3 border border-gray-600 rounded-lg text-gray-300 text-sm font-bold hover:bg-gray-800 transition-all'
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayment}
                  disabled={
                    !userEmail ||
                    !userEmail.includes('@') ||
                    loading === selectedTicket.id
                  }
                  className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
                    paymentMethod === 'crypto'
                      ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                      : 'bg-gradient-to-r from-gold to-yellow-500 text-black'
                  }`}
                >
                  {loading === selectedTicket.id ? (
                    <>
                      <Loader className='w-4 h-4 animate-spin' />
                      Processing...
                    </>
                  ) : paymentMethod === 'crypto' ? (
                    'Pay with Crypto'
                  ) : (
                    'Pay Now'
                  )}
                </button>
              </div>

              <p className='text-xs text-gray-500 text-center mt-4'>
                {paymentMethod === 'crypto'
                  ? 'You will be redirected to complete your crypto payment'
                  : 'You will be redirected to Flutterwave secure checkout'}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
