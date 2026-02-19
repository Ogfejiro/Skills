// components/TicketModal.tsx - COMPLETE WORKING VERSION
'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Ticket, Loader, ExternalLink, X, Coins } from 'lucide-react'
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

  // Ticket options as per client requirements
  const ticketOptions = [
    {
      id: 'regular',
      name: 'Regular Ticket',
      priceUSD: 0,
      priceNGN: 0,
      features: ['Event Access', 'Basic Swag'],
      type: 'free' as const,
      description: 'Free admission to the main event',
    },
    {
      id: 'regular-shared',
      name: 'Regular + Shared Accommodation',
      priceUSD: 5,
      priceNGN: 5 * 1430,
      features: [
        'Event Access',
        'Shared Accommodation (1 night)',
        'Basic Swag',
        'Breakfast',
      ],
      type: 'paid' as const,
      description: 'Includes shared accommodation for one night',
    },
    {
      id: 'regular-single',
      name: 'Regular + Single Budget Accommodation',
      priceUSD: 9,
      priceNGN: 9 * 1430,
      features: [
        'Event Access',
        'Single Budget Accommodation (1 night)',
        'Basic Swag',
        'Breakfast',
      ],
      type: 'paid' as const,
      description: 'Private budget room for one night',
    },
    {
      id: 'vip',
      name: 'VIP Ticket',
      priceUSD: 6,
      priceNGN: 6 * 1430,
      features: [
        'VIP Access',
        'Priority Seating',
        'VIP Swag Pack',
        'Networking Session',
      ],
      type: 'paid' as const,
      description: 'Premium experience with exclusive access',
    },
    {
      id: 'vip-luxury',
      name: 'VIP + Luxury Accommodation',
      priceUSD: 29,
      priceNGN: 29 * 1430,
      features: [
        'VIP Access',
        'Luxury Accommodation (2 nights)',
        'All Meals',
        'Private Transport',
        'Premium Swag',
        'Backstage Access',
      ],
      type: 'paid' as const,
      description: 'Ultimate luxury experience',
    },
  ]

  const handleTicketSelect = (ticket: any) => {
    if (ticket.type === 'free') {
      alert(
        `You've selected: ${ticket.name}\n\nFree tickets will be sent to your email.`,
      )
      onClose()
      return
    }

    setSelectedTicket(ticket)
    setShowEmailModal(true)
  }

  // ✅ CORRECT handlePayment function as requested
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

      // This will get the mock Flutterwave URL
      const { paymentLink } = await paymentService.initiatePayment({
        amount,
        email: userEmail,
        userId: 'guest',
        ticketId: selectedTicket.id,
        ticketName: selectedTicket.name,
        quantity: 1,
      })

      console.log('🔄 Redirecting to:', paymentLink)

      // Redirect to Flutterwave mock page
      window.location.href = paymentLink
      
    } catch (error: any) {
      console.error('❌ Payment error:', error)
      alert(error.message || 'Payment failed. Please try again.')
    } finally {
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
                    1 USD = ₦1,430
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
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-bold text-white">{ticket.name}</h3>
                            {ticket.type === 'free' && (
                              <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                                FREE
                              </span>
                            )}
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
                        <div className="ml-4 text-right">
                          <div className={`text-2xl font-bold ${ticket.type === 'free' ? 'text-green-400' : 'text-gold'}`}>
                            {currency === 'NGN' ? '₦' : '$'}
                            {currency === 'NGN'
                              ? ticket.priceNGN === 0 ? '0' : ticket.priceNGN.toLocaleString()
                              : ticket.priceUSD === 0 ? '0' : ticket.priceUSD.toLocaleString()}
                          </div>
                          {ticket.type !== 'free' && (
                            <div className="text-sm text-gray-400">
                              {currency === 'NGN' ? `$${ticket.priceUSD}` : `₦${(ticket.priceUSD * 1430).toLocaleString()}`}
                            </div>
                          )}
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

      {/* Email Modal */}
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
                  <span className="text-gold font-bold text-3xl">
                    {currency === 'NGN' ? '₦' : '$'}
                    {currency === 'NGN'
                      ? selectedTicket.priceNGN.toLocaleString()
                      : selectedTicket.priceUSD.toLocaleString()}
                  </span>
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
                {/* Cancel Button */}
                <button
                  onClick={() => {
                    setShowEmailModal(false)
                    setUserEmail('')
                  }}
                  className="flex-1 py-4 border-2 border-gray-600 rounded-xl text-gray-300 font-bold hover:bg-gray-800 hover:border-gray-500 transition-all text-lg"
                >
                  Cancel
                </button>

                {/* Pay Now Button - WITH CORRECT HANDLEPAYMENT */}
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
                          : selectedTicket.priceUSD.toLocaleString()}
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