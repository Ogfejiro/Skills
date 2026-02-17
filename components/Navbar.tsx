// components/Navbar.tsx - WITH FLUTTERWAVE INTEGRATION
'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Calendar,
  Users,
  Home,
  Ticket,
  ExternalLink,
  ChevronDown,
  Loader,
} from 'lucide-react'
import Image from 'next/image'
import { paymentService } from '@/app/services/paymentService'
import { useRouter } from 'next/navigation'
type CurrencyType = 'NGN' | 'USD'

export default function Navbar() {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [activeNav, setActiveNav] = useState('home')
  const [showPaymentOptions, setShowPaymentOptions] = useState(false)
  const [currency, setCurrency] = useState<CurrencyType>('NGN') // Default to NGN for Flutterwave
  const [loading, setLoading] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState('')
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState('email')

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowPaymentOptions(false)
      }
    }

    if (showPaymentOptions) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showPaymentOptions])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)

      const sections = ['home', 'events']
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })

      if (currentSection) {
        setActiveNav(currentSection)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home className='w-5 h-5' />,
      href: '#home',
    },
    {
      id: 'events',
      label: 'Events',
      icon: <Calendar className='w-5 h-5' />,
      href: '#events',
    },
    {
      id: 'why-attend',
      label: 'Why Attend',
      icon: <Sparkles className='w-5 h-5' />,
      href: '#why-attend',
    },
    {
      id: 'waitlist',
      label: 'Waitlist',
      icon: <Users className='w-5 h-5' />,
      href: 'https://forms.gle/gwhB683FptSMNsE39',
      external: true,
    },
  ]

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

  const handleGetTickets = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowPaymentOptions(!showPaymentOptions)
  }

  const handleTicketSelect = (ticket: any) => {
    if (ticket.type === 'free') {
      // For free tickets, just show confirmation
      alert(
        `You've selected: ${ticket.name}\n\nFree tickets will be sent to your email.`,
      )
      setShowPaymentOptions(false)
      return
    }

    // For paid tickets, ask for email
    setSelectedTicket(ticket)
    setShowEmailModal(true)
    setShowPaymentOptions(false)
  }

  const handlePayment = async () => {
    if (!selectedTicket || !userEmail) return

    setLoading(selectedTicket.id)

    try {
      const amount =
        currency === 'NGN' ? selectedTicket.priceNGN : selectedTicket.priceUSD

      // Step 1: Initiate payment with backend
      const { paymentLink } = await paymentService.initiatePayment({
        amount,
        email: userEmail,
        userId: 'guest', // Will be replaced with actual userId if user is logged in
        ticketId: selectedTicket.id,
        ticketName: selectedTicket.name,
        quantity: 1,
      })

      // Step 2: Redirect to Flutterwave payment link
      // The paymentLink will look like: https://checkout.flutterwave.com/...
      window.location.href = paymentLink
    } catch (error: any) {
      alert(error.message || 'Payment failed. Please try again.')
    } finally {
      setLoading(null)
      setShowEmailModal(false)
      setUserEmail('')
    }
  }

  const toggleCurrency = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrency(currency === 'NGN' ? 'USD' : 'NGN')
  }

  return (
    <>
      {/* DESKTOP NAVBAR */}
      <nav
        className={`hidden md:block fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl px-6 py-3 transition-all duration-300
        ${
          scrolled
            ? 'bg-black backdrop-blur-xl border border-gold/20 shadow-2xl shadow-gold/5'
            : 'bg-black/40 backdrop-blur-lg border border-gold/10'
        } rounded-2xl`}
      >
        <div className='container mx-auto flex items-center justify-between'>
          {/* LOGO */}
          <div className='flex items-center gap-3'>
            <div className='relative'>
              <div className='relative w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-gold to-gold/70 rounded-xl flex items-center justify-center overflow-hidden'>
                <div className='relative w-8 h-8 md:w-10 md:h-10'>
                  <Image
                    src='/images/hds.jpg'
                    alt='LOFTE-3 Logo'
                    width={32}
                    height={32}
                    className='object-contain'
                    priority
                  />
                </div>
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className='absolute -inset-2 border border-gold/30 rounded-full'
              />
            </div>
            <div>
              <div className='text-gold font-extrabold tracking-wider text-xl md:text-2xl'>
                <span className='text-white'>LO</span>FTE
                <span className='text-gold'>-3</span>
              </div>
              <p className='text-xs text-gray-400 tracking-wider'>
                WEB3 EVENTS
              </p>
            </div>
          </div>

          {/* DESKTOP NAV */}
          <div className='flex items-center gap-6'>
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                className='flex items-center gap-2 px-4 py-2 rounded-lg text-sm uppercase tracking-wider text-gray-300 hover:text-gold hover:bg-gold/5 transition-all group relative'
              >
                <span className='opacity-60 group-hover:opacity-100 transition'>
                  {item.icon}
                </span>
                {item.label}
                <span className='absolute bottom-0 left-1/2 w-0 h-0.5 bg-gold group-hover:w-8 group-hover:left-1/4 transition-all duration-300' />
              </a>
            ))}

            {/* CURRENCY SELECTOR */}
            <div className='flex items-center gap-2 border-l border-gold/20 pl-6'>
              <button
                onClick={toggleCurrency}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${'bg-gold/20 border border-gold/30 text-gold'}`}
              >
                {currency === 'USD' ? (
                  <>
                    <span className='text-lg'>$</span>
                    <span className='text-sm'>USD</span>
                  </>
                ) : (
                  <>
                    <span className='text-lg'>🇳🇬</span>
                    <span className='text-sm'>NGN</span>
                  </>
                )}
                <ChevronDown className='w-4 h-4' />
              </button>
            </div>

            {/* GET TICKETS BUTTON WITH DROPDOWN */}
            <div className='relative' ref={dropdownRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetTickets}
                className='flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold via-gold/90 to-gold/80 text-black font-bold rounded-xl hover:shadow-lg hover:shadow-gold/30 transition-all duration-300 group relative overflow-hidden'
              >
                <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000' />

                <Ticket className='w-5 h-5' />
                <span className='tracking-wider'>GET TICKETS</span>

                {/* Live indicator */}
                <div className='absolute -right-1 -top-1 flex items-center gap-1'>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className='w-2 h-2 bg-red-500 rounded-full'
                  />
                  <span className='text-[10px] text-red-500 font-bold'>
                    LIVE
                  </span>
                </div>
              </motion.button>

              {/* PAYMENT OPTIONS DROPDOWN */}
              <AnimatePresence>
                {showPaymentOptions && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className='absolute top-full right-0 mt-2 w-96 bg-black border border-gold/20 rounded-xl shadow-2xl shadow-gold/10 overflow-hidden z-50'
                  >
                    {/* Dropdown Header */}
                    <div className='p-4 border-b border-gold/10 bg-gray-900/30'>
                      <div className='flex justify-between items-center'>
                        <div>
                          <h3 className='font-bold text-lg text-gold'>
                            LOFTE-3 Tickets
                          </h3>
                          <p className='text-sm text-gray-400'>
                            Main Event Tickets
                          </p>
                        </div>
                        <div className='flex items-center gap-2'>
                          <span className='text-sm text-gray-400'>
                            Powered by:
                          </span>
                          <span className='px-2 py-1 rounded text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30'>
                            Flutterwave
                          </span>
                        </div>
                      </div>

                      {/* Currency Info */}
                      <div className='mt-3 flex items-center justify-between'>
                        <span className='text-sm text-gray-400'>
                          1 USD = ₦1,430
                        </span>
                        <button
                          onClick={toggleCurrency}
                          className='text-sm text-gold hover:text-gold/80 transition-colors flex items-center gap-1'
                        >
                          Switch to {currency === 'NGN' ? 'USD' : 'NGN'}
                          <ExternalLink className='w-3 h-3' />
                        </button>
                      </div>
                    </div>

                    {/* Ticket Options */}
                    <div className='max-h-96 overflow-y-auto'>
                      {ticketOptions.map((ticket) => (
                        <div
                          key={ticket.id}
                          className='p-4 border-b border-gray-800 hover:bg-gray-900/30 cursor-pointer transition-colors group'
                          onClick={() => handleTicketSelect(ticket)}
                        >
                          <div className='flex justify-between items-start'>
                            <div className='flex-1'>
                              <div className='flex items-center gap-2 mb-1'>
                                <h4 className='font-bold text-white group-hover:text-gold transition-colors'>
                                  {ticket.name}
                                </h4>
                                {ticket.type === 'free' && (
                                  <span className='px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full'>
                                    FREE
                                  </span>
                                )}
                              </div>
                              <p className='text-sm text-gray-400 mb-2'>
                                {ticket.description}
                              </p>
                              <div className='space-y-1'>
                                {ticket.features.map((feature, idx) => (
                                  <div
                                    key={idx}
                                    className='flex items-center gap-2 text-sm text-gray-300'
                                  >
                                    <div className='w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0' />
                                    <span>{feature}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className='ml-4 text-right'>
                              <div
                                className={`text-2xl font-bold ${
                                  ticket.type === 'free'
                                    ? 'text-green-400'
                                    : 'text-gold'
                                }`}
                              >
                                {currency === 'NGN' ? '₦' : '$'}
                                {currency === 'NGN'
                                  ? ticket.priceNGN === 0
                                    ? '0'
                                    : ticket.priceNGN.toLocaleString()
                                  : ticket.priceUSD === 0
                                    ? '0'
                                    : ticket.priceUSD.toLocaleString()}
                              </div>
                              {ticket.type !== 'free' && (
                                <div className='text-sm text-gray-400'>
                                  {currency === 'NGN'
                                    ? `$${ticket.priceUSD}`
                                    : `₦${(ticket.priceUSD * 1430).toLocaleString()}`}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className='mt-3'>
                            <button
                              className='w-full py-2 bg-gradient-to-r from-gold to-gold/80 text-black font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2'
                              disabled={loading === ticket.id}
                            >
                              {loading === ticket.id ? (
                                <>
                                  <Loader className='w-4 h-4 animate-spin' />
                                  Processing...
                                </>
                              ) : ticket.type === 'free' ? (
                                'Get Free Ticket'
                              ) : (
                                `Pay with Flutterwave`
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Dropdown Footer */}
                    <div className='p-4 bg-gray-900/30 border-t border-gold/10'>
                      <div className='text-sm text-gray-400'>
                        <p className='mb-2'>
                          • Secure payments powered by Flutterwave
                        </p>
                        <p className='mb-2'>
                          • Cards, Bank Transfer, USSD, Mobile Money
                        </p>
                        <p>
                          • Need help?{' '}
                          <a
                            href='https://t.me/Lofte3'
                            className='text-gold hover:underline'
                          >
                            Contact Telegram Support
                          </a>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className='md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-gold/20 shadow-2xl shadow-gold/10'>
        <div className='flex items-center justify-around px-4 py-3'>
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
              onClick={() => !item.external && setActiveNav(item.id)}
              className='flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all'
            >
              <div
                className={`p-2 rounded-full transition-all ${
                  activeNav === item.id
                    ? 'bg-gold/20 border border-gold/30'
                    : 'border border-transparent'
                }`}
              >
                <div
                  className={`transition-all ${
                    activeNav === item.id ? 'text-gold' : 'text-gray-400'
                  }`}
                >
                  {item.icon}
                </div>
              </div>
              <span
                className={`text-xs mt-1 transition-all ${
                  activeNav === item.id
                    ? 'text-gold font-medium'
                    : 'text-gray-400'
                }`}
              >
                {item.label}
              </span>

              {activeNav === item.id && (
                <motion.div
                  layoutId='activeIndicator'
                  className='w-1 h-1 bg-gold rounded-full mt-1'
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                />
              )}
            </a>
          ))}

          {/* MOBILE GET TICKETS BUTTON */}
          <button
            onClick={handleGetTickets}
            className='flex flex-col items-center justify-center px-3 py-2 relative'
          >
            <div className='p-2 rounded-full bg-gradient-to-r from-gold to-gold/80 border border-gold/30'>
              <Ticket className='w-5 h-5 text-black' />
            </div>
            <span className='text-xs mt-1 text-gold font-medium'>Tickets</span>

            <div className='absolute top-0 right-2'>
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className='w-1.5 h-1.5 bg-red-500 rounded-full'
              />
            </div>
          </button>
        </div>
      </nav>

      {/* MOBILE TOP BAR */}
      <div className='md:hidden fixed top-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-lg border-b border-gold/10 py-3 px-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='relative w-10 h-10 bg-gradient-to-br from-gold to-gold/70 rounded-xl flex items-center justify-center overflow-hidden'>
              <div className='relative w-8 h-8'>
                <Image
                  src='/images/hds.jpg'
                  alt='LoFT3 Logo'
                  width={32}
                  height={32}
                  className='object-contain'
                  priority
                />
              </div>
            </div>
            <div>
              <div className='text-gold font-extrabold tracking-wider text-xl'>
                <span className='text-white'>LO</span>FTE
                <span className='text-gold'>-3</span>
              </div>
              <p className='text-xs text-gray-400 tracking-wider'>
                WEB3 EVENTS
              </p>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <button
              onClick={toggleCurrency}
              className={`px-3 py-1 rounded-lg flex items-center gap-1 bg-gold/20 border border-gold/30 text-gold`}
            >
              {currency === 'USD' ? '$' : '₦'}
              <ChevronDown className='w-3 h-3' />
            </button>
            <div className='px-2 py-1 rounded-full bg-red-500/20 border border-red-500/30'>
              <span className='text-xs text-red-400 font-bold'>LIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for mobile bottom nav */}
      <div className='md:hidden h-20' />

      {/* EMAIL MODAL */}
      {/* EMAIL MODAL */}
      <AnimatePresence>
        {showEmailModal && selectedTicket && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/90 backdrop-blur-sm z-[1000] flex items-center justify-center p-4'
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
              className='bg-gradient-to-b from-gray-900 to-black border-2 border-gold/30 rounded-2xl max-w-md w-full p-8 shadow-2xl shadow-gold/20'
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with gold accent */}
              <div className='text-center mb-6'>
                <div className='w-16 h-16 bg-gradient-to-br from-gold to-gold/60 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <Ticket className='w-8 h-8 text-black' />
                </div>
                <h3 className='text-3xl font-bold text-gold mb-2'>
                  Complete Purchase
                </h3>
                <p className='text-gray-400'>
                  Enter your email to receive tickets and payment confirmation
                </p>
              </div>

              {/* Ticket Summary Card */}
              <div className='mb-6 p-5 bg-gray-800/50 border border-gold/20 rounded-xl'>
                <div className='flex justify-between items-center mb-3 pb-3 border-b border-gray-700'>
                  <span className='text-gray-400 font-medium'>
                    Ticket Type:
                  </span>
                  <span className='text-white font-bold text-lg'>
                    {selectedTicket.name}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-400 font-medium'>Amount:</span>
                  <span className='text-gold font-bold text-2xl'>
                    {currency === 'NGN' ? '₦' : '$'}
                    {currency === 'NGN'
                      ? selectedTicket.priceNGN.toLocaleString()
                      : selectedTicket.priceUSD.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Email Input */}
              <div className='mb-8'>
                <label className='block text-gray-300 font-medium mb-2'>
                  Email Address <span className='text-gold'>*</span>
                </label>
                <input
                  type='email'
                  placeholder='you@example.com'
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className='w-full p-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-gold focus:outline-none transition-all'
                  required
                />
                <p className='text-xs text-gray-500 mt-2'>
                  We'll send your tickets and payment receipt to this email
                </p>
              </div>

              {/* Buttons */}
              {/* Buttons */}
              <div className='flex flex-col sm:flex-row gap-3'>
                {/* Cancel */}
                <button
                  onClick={() => {
                    setShowEmailModal(false)
                    setUserEmail('')
                  }}
                  className='flex-1 py-4 border-2 border-gray-700 rounded-xl text-gray-300 font-bold hover:bg-gray-800 hover:border-gray-600 transition-all'
                >
                  Cancel
                </button>

                {/* Proceed Button */}
                <button
                  onClick={handlePayment} // make sure you have a step state
                  disabled={
                    !userEmail ||
                    !userEmail.includes('@') ||
                    !userEmail.includes('.')
                  }
                  className={`flex-1 py-4 bg-gray-700 text-white font-bold rounded-xl transition-all ${
                    !userEmail ||
                    !userEmail.includes('@') ||
                    !userEmail.includes('.')
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-gray-600 hover:scale-105'
                  }`}
                >
                  Proceed
                </button>

                {/* Pay Now */}
                <button
                  onClick={handlePayment}
                  disabled={loading === selectedTicket.id}
                  className='flex-1 py-4 bg-gradient-to-r from-gold to-gold/80 text-black font-bold rounded-xl hover:shadow-lg hover:shadow-gold/30 transition-all flex items-center justify-center gap-2 hover:scale-105'
                >
                  {loading === selectedTicket.id ? (
                    <>
                      <Loader className='w-5 h-5 animate-spin' />
                      Processing...
                    </>
                  ) : (
                    <>
                      <span>Pay Now</span>
                      <span className='text-sm opacity-80'>
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
              <div className='mt-6 pt-4 border-t border-gray-800'>
                <div className='flex items-center justify-center gap-2 text-sm text-gray-500'>
                  <span className='flex items-center gap-1'>
                    <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                    Secure SSL
                  </span>
                  <span className='w-1 h-1 bg-gray-600 rounded-full'></span>
                  <span className='flex items-center gap-1'>
                    <span>🔒</span>
                    Encrypted
                  </span>
                  <span className='w-1 h-1 bg-gray-600 rounded-full'></span>
                  <span>Flutterwave</span>
                </div>
                <p className='text-xs text-center text-gray-600 mt-3'>
                  By proceeding, you agree to our Terms of Service and Privacy
                  Policy
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
