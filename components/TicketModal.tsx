// components/TicketModal.tsx - WITH 40% DISCOUNT AND TICKET COUNTER
'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Ticket, Loader, X, Percent, Users, TrendingUp } from 'lucide-react'
import { paymentService } from '@/app/services/paymentService'

type CurrencyType = 'NGN' | 'USD'

interface TicketModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function TicketModal({ isOpen, onClose }: TicketModalProps) {
  const [currency, setCurrency] = useState<CurrencyType>('NGN')
  const [loading, setLoading] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState('')
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [ticketsSold, setTicketsSold] = useState(342) // Starting point
  const [showTimer, setShowTimer] = useState(true)

  // Exchange rate
  const exchangeRate = 1430

  // Ticket counter animation
  useEffect(() => {
    if (showTimer) {
      // Simulate tickets selling
      const interval = setInterval(() => {
        setTicketsSold(prev => {
          if (prev < 1000) {
            // Random increment between 1-3 tickets
            const increment = Math.floor(Math.random() * 3) + 1
            return Math.min(prev + increment, 1000)
          }
          clearInterval(interval)
          return prev
        })
      }, 8000) // Update every 8 seconds

      return () => clearInterval(interval)
    }
  }, [showTimer])

  const ticketsRemaining = 1000 - ticketsSold
  const percentSold = (ticketsSold / 1000) * 100

  // Calculate original prices (before 40% discount)
  const calculateOriginalPrice = (discountedPrice: number) => {
    return Math.round(discountedPrice / 0.6) // discounted price is 60% of original (40% off)
  }

  // Updated ticket options with original prices for strikethrough
  const ticketOptions = [
    {
      id: 'regular',
      name: 'Regular Ticket',
      priceUSD: 0.9,
      priceNGN: Math.round(0.9 * exchangeRate), // ₦1,287 (discounted)
      originalUSD: 1.5,
      originalNGN: Math.round(1.5 * exchangeRate), // ₦2,145 (original)
      icon: '🎟️',
      features: [
        'Event Access',
        'Basic Seating',
        'Networking',
        'Complimentary Refreshments and Merch',
        'Red Carpet Access'
      ],
      description: 'Main event access with premium features',
    },
    {
      id: 'regular-accommodation',
      name: 'Regular + Accommodation',
      priceUSD: 9.99,
      priceNGN: Math.round(9.99 * exchangeRate), // ₦14,286 (discounted)
      originalUSD: 16.65,
      originalNGN: Math.round(16.65 * exchangeRate), // ₦23,810 (original)
      icon: '🏨',
      features: [
        'Event Access',
        'Basic Seating',
        'Networking',
        'Complimentary Refreshments and Merch',
        'Red Carpet Access',
        'Private Room Accommodation (1 night)',
        
      ],
      description: 'Includes private room accommodation for one night',
    },
    {
      id: 'vip',
      name: 'VIP Ticket',
      priceUSD: 6.99,
      priceNGN: Math.round(6.99 * exchangeRate), // ₦9,996 (discounted)
      originalUSD: 11.65,
      originalNGN: Math.round(11.65 * exchangeRate), // ₦16,660 (original)
      icon: '⭐',
      features: [
        'Private acecess and Networking session',
        'Premium Seating',
        'Raffle Ticket for Exclusive Prizes',
        '3-course gourmet dinning experience',
        'Red carpet professional picture session',
        'Premium souvenir package',
    
      ],
      description: 'Premium VIP experience with exclusive access',
    },
    {
      id: 'vip-luxury',
      name: 'VIP + Luxury Accommodation',
      priceUSD: 29.99,
      priceNGN: Math.round(29.99 * exchangeRate), // ₦42,886 (discounted)
      originalUSD: 49.98,
      originalNGN: Math.round(49.98 * exchangeRate), // ₦71,477 (original)
      icon: '👑',
      features: [
        'Private acecess and Networking session',
        'Premium Seating',
        'Raffle Ticket for Exclusive Prizes',
        '3-course gourmet dinning experience',
        'Red carpet professional picture session',
        'Premium souvenir package',
        'Conceirge services',
        'Luxury hotel stay'
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
      const amount = currency === 'NGN' ? selectedTicket.priceNGN : selectedTicket.priceUSD

      console.log('🎫 Processing payment for:', {
        ticket: selectedTicket.name,
        amount,
        currency,
        email: userEmail
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
      
    } catch (error: any) {
      console.error('❌ Payment error:', error)
      alert(error.message || 'Payment failed. Please try again.')
      setLoading(null)
      setShowEmailModal(false)
      setUserEmail('')
    }
  }

  const toggleCurrency = () => {
    setCurrency(currency === 'NGN' ? 'USD' : 'NGN')
  }

  if (!isOpen) return null

  return (
    <>
      {/* Main Modal Overlay */}
      <AnimatePresence>
        {isOpen && !showEmailModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[1000] flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-gradient-to-b from-gray-900 to-black border-2 border-gold/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl shadow-gold/20"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with Discount Banner */}
              <div className="relative">
                {/* 40% OFF Banner */}
                <div className="bg-gradient-to-r from-red-600 to-red-500 p-4 text-center border-b-2 border-gold">
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Percent className="w-6 h-6 text-white animate-pulse" />
                      <span className="text-2xl md:text-3xl font-black text-white">40% OFF</span>
                      <TrendingUp className="w-6 h-6 text-white animate-bounce" />
                    </div>
                    <span className="text-white/90 text-sm md:text-base">
                      FOR FIRST 1000 TICKETS ONLY!
                    </span>
                  </div>
                </div>

                {/* Ticket Counter Bar */}
                <div className="bg-gray-900 p-4 border-b border-gold/20">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-gold" />
                      <span className="text-white font-bold">Early Bird Tickets</span>
                    </div>
                    <span className="text-gold font-bold text-lg">
                      {ticketsRemaining} / 1000 left
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentSold}%` }}
                      transition={{ duration: 1 }}
                      className="h-full bg-gradient-to-r from-gold to-yellow-500"
                    />
                  </div>
                  
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    🔥 {ticketsSold} tickets already sold! Grab yours before price goes up
                  </p>
                </div>

                {/* Header */}
                <div className="p-6 border-b border-gold/20 bg-gray-900/50 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gold">LOFTE-3 Tickets</h2>
                    <p className="text-sm text-gray-400">Select your ticket option for the Main Event</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Currency Selector */}
              <div className="p-4 border-b border-gold/10 bg-gray-900/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">Pay with:</span>
                    <div className="flex gap-2">
                      <button
                        onClick={toggleCurrency}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                          currency === 'NGN'
                            ? 'bg-gold/20 border border-gold/30 text-gold'
                            : 'bg-gray-800 text-gray-400'
                        }`}
                      >
                        <span>🇳🇬</span>
                        <span>NGN</span>
                      </button>
                      <button
                        onClick={toggleCurrency}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                          currency === 'USD'
                            ? 'bg-gold/20 border border-gold/30 text-gold'
                            : 'bg-gray-800 text-gray-400'
                        }`}
                      >
                        <span>$</span>
                        <span>USD</span>
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    1 USD = ₦{exchangeRate.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Ticket Options - Scrollable */}
              <div className="overflow-y-auto p-4 max-h-[60vh]">
                <div className="space-y-4">
                  {ticketOptions.map((ticket) => (
                    <motion.div
                      key={ticket.id}
                      whileHover={{ scale: 1.02 }}
                      className="p-5 border border-gold/20 rounded-xl bg-gray-900/30 cursor-pointer hover:border-gold/40 transition-all"
                      onClick={() => handleTicketSelect(ticket)}
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">{ticket.icon}</span>
                            <h3 className="text-lg font-bold text-white">{ticket.name}</h3>
                          </div>
                          <p className="text-sm text-gray-400 mb-3">{ticket.description}</p>
                          <div className="space-y-1">
                            {ticket.features.map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                                <div className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="text-right md:ml-4">
                          {/* Original Price (Strikethrough) */}
                          <div className="text-sm text-gray-500 line-through">
                            {currency === 'NGN' ? '₦' : '$'}
                            {currency === 'NGN'
                              ? ticket.originalNGN.toLocaleString()
                              : ticket.originalUSD.toFixed(2)}
                          </div>
                          {/* Discounted Price */}
                          <div className="text-2xl font-bold text-gold">
                            {currency === 'NGN' ? '₦' : '$'}
                            {currency === 'NGN'
                              ? ticket.priceNGN.toLocaleString()
                              : ticket.priceUSD.toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-400">
                            {currency === 'NGN' 
                              ? `~$${ticket.priceUSD.toFixed(2)}` 
                              : `~₦${ticket.priceNGN.toLocaleString()}`}
                          </div>
                          <div className="mt-1 text-xs font-bold text-green-400">
                            40% OFF
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gold/10 bg-gray-900/30">
                <div className="text-sm text-gray-400">
                  <p className="mb-2">• Secure payments powered by Flutterwave</p>
                  <p className="mb-2">• Cards, Bank Transfer, USSD, Mobile Money</p>
                  <p>
                    Need help?{' '}
                    <a href="https://t.me/Lofte3" className="text-gold hover:underline" target="_blank" rel="noopener noreferrer">
                      Contact Telegram Support
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email Modal - Keep existing email modal code */}
      <AnimatePresence>
        {showEmailModal && selectedTicket && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-[1100] flex items-center justify-center p-4"
            onClick={() => {
              setShowEmailModal(false)
              setUserEmail('')
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-gradient-to-b from-gray-900 to-black border-2 border-gold rounded-2xl max-w-md w-full p-8 shadow-2xl shadow-gold/30"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-gold to-gold/60 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-gold/30">
                  <Ticket className="w-10 h-10 text-black" />
                </div>
                <h3 className="text-3xl font-bold text-gold mb-2">
                  Complete Purchase
                </h3>
                <p className="text-gray-400">
                  Enter your email to receive tickets and payment confirmation
                </p>
              </div>

              {/* Ticket Summary */}
              <div className="mb-6 p-5 bg-gray-800/70 border border-gold/30 rounded-xl">
                <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-700">
                  <span className="text-gray-400 font-medium">Ticket:</span>
                  <span className="text-white font-bold text-lg">{selectedTicket.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-medium">Amount:</span>
                  <div className="text-right">
                    {/* Original price */}
                    <div className="text-sm text-gray-500 line-through">
                      {currency === 'NGN' ? '₦' : '$'}
                      {currency === 'NGN'
                        ? selectedTicket.originalNGN.toLocaleString()
                        : selectedTicket.originalUSD.toFixed(2)}
                    </div>
                    {/* Discounted price */}
                    <span className="text-gold font-bold text-3xl">
                      {currency === 'NGN' ? '₦' : '$'}
                      {currency === 'NGN'
                        ? selectedTicket.priceNGN.toLocaleString()
                        : selectedTicket.priceUSD.toFixed(2)}
                    </span>
                    <div className="text-xs text-green-400 font-bold">
                      40% OFF
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Input */}
              <div className="mb-8">
                <label className="block text-gray-300 font-semibold mb-2">
                  Email Address <span className="text-gold text-lg">*</span>
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full p-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-gold focus:outline-none transition-all text-lg"
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  We'll send your tickets and payment receipt to this email
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => {
                    setShowEmailModal(false)
                    setUserEmail('')
                  }}
                  className="flex-1 py-4 border-2 border-gray-600 rounded-xl text-gray-300 font-bold hover:bg-gray-800 hover:border-gray-500 transition-all text-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayment}
                  disabled={!userEmail || !userEmail.includes('@') || !userEmail.includes('.') || loading === selectedTicket.id}
                  className="flex-1 py-4 bg-gradient-to-r from-gold to-yellow-500 text-black font-extrabold rounded-xl hover:shadow-xl hover:shadow-gold/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  {loading === selectedTicket.id ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay Now</span>
                      <span className="bg-black/20 px-3 py-1 rounded-lg">
                        {currency === 'NGN' ? '₦' : '$'}
                        {currency === 'NGN'
                          ? selectedTicket.priceNGN.toLocaleString()
                          : selectedTicket.priceUSD.toFixed(2)}
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* Payment Info */}
              <div className="mt-6 pt-4 border-t border-gray-800">
                <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Secure SSL
                  </span>
                  <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                  <span className="flex items-center gap-1">
                    <span>🔒</span>
                    Encrypted
                  </span>
                  <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                  <span className="text-gold">Flutterwave</span>
                </div>
                <p className="text-xs text-center text-gray-600 mt-3">
                  By proceeding, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}