'use client';

import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Shield, 
  CheckCircle,
  ArrowLeft,
  Coins,
  Ticket,
  Calendar,
  Clock,
  MapPin,
  Lock,
  Users,
  Home,
  Star,
  Crown,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import CurrencySelector from '@/components/currencyselector';

export default function PaymentPage() {
  const [selectedTicket, setSelectedTicket] = useState<string>('regular');
  const [currency, setCurrency] = useState<'USD' | 'NGN'>('USD');
  const exchangeRate = 1430; // NGN per USD
  
  // Ticket options with prices in USD
  const ticketOptions = [
    {
      id: 'regular',
      name: 'Regular Ticket',
      price: 0,
      description: 'General admission access',
      benefits: ['Event Access', 'Basic Seating', 'Networking'],
      icon: <Ticket className="w-5 h-5" />
    },
    {
      id: 'regular-shared',
      name: 'Regular + Shared Accommodation',
      price: 5,
      description: 'Ticket with shared accommodation for one day',
      benefits: ['Event Access', 'Shared Room', 'Basic Amenities', '1 Night Stay'],
      icon: <Users className="w-5 h-5" />
    },
    {
      id: 'regular-single',
      name: 'Regular + Single Budget Accommodation',
      price: 9,
      description: 'Ticket with private budget accommodation',
      benefits: ['Event Access', 'Private Room', 'Basic Amenities', '1 Night Stay', 'Breakfast'],
      icon: <Home className="w-5 h-5" />
    },
    {
      id: 'vip',
      name: 'VIP Ticket',
      price: 6,
      description: 'Premium event experience',
      benefits: ['Priority Access', 'VIP Lounge', 'Premium Seating', 'Networking Session'],
      icon: <Star className="w-5 h-5" />
    },
    {
      id: 'vip-luxury',
      name: 'VIP + Luxury Accommodation',
      price: 29,
      description: 'VIP ticket with luxury accommodation',
      benefits: ['All VIP Benefits', 'Luxury Hotel Stay', 'Spa Access', 'Fine Dining', 'Concierge Service'],
      icon: <Crown className="w-5 h-5" />
    }
  ];

  // Calculate price in selected currency
  const calculatePrice = (priceUSD: number) => {
    if (currency === 'NGN') {
      return priceUSD * exchangeRate;
    }
    return priceUSD;
  };

  const selectedTicketData = ticketOptions.find(t => t.id === selectedTicket);
  const ticketPrice = selectedTicketData ? calculatePrice(selectedTicketData.price) : 0;
  const serviceFee = ticketPrice * 0.02;
  const processingFee = ticketPrice * (currency === 'USD' ? 0.01 : 0.02);
  const totalAmount = ticketPrice + serviceFee + processingFee;

  // Event details
  const eventDetails = {
    title: "LOFTE-3 Dinner Night",
    date: "March 27, 2026",
    time: "Scheduled on Ticket",
    location: "Scheduled on Ticket",
  };

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar />
      
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-24">
        <Link href="/#events">
          <motion.button
            whileHover={{ x: -5 }}
            className="flex items-center gap-2 text-gold mb-8 hover:text-gold/80 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Events
          </motion.button>
        </Link>
      </div>

      {/* Payment Section */}
      <section className="py-10 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="text-white">Select Your</span>
                <span className="gold-gradient ml-3">Ticket</span>
              </h1>
              <p className="text-gray-400 text-lg">
                Choose your preferred ticket package
              </p>
            </motion.div>

            {/* Currency Selector */}
            <div className="mb-8 flex justify-end">
              <CurrencySelector currency={currency} setCurrency={setCurrency} />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column: Ticket Selection */}
              <div className="lg:col-span-2">
                <div className="grid md:grid-cols-2 gap-6">
                  {ticketOptions.map((ticket) => (
                    <motion.div
                      key={ticket.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedTicket(ticket.id)}
                      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                        selectedTicket === ticket.id 
                        ? 'border-gold bg-gold/10' 
                        : 'border-gold/30 bg-black/30 hover:border-gold/50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="text-gold">
                              {ticket.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white">{ticket.name}</h3>
                          </div>
                          <p className="text-gray-400 text-sm mb-4">{ticket.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gold">
                            {currency === 'USD' ? '$' : '₦'}{calculatePrice(ticket.price).toFixed(currency === 'NGN' ? 0 : 2)}
                          </div>
                          {ticket.price > 0 && (
                            <div className="text-sm text-gray-500">
                              {currency === 'NGN' ? `$${ticket.price} USD` : `₦${(ticket.price * exchangeRate).toFixed(0)} NGN`}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Benefits */}
                      <ul className="space-y-2 mb-6">
                        {ticket.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-gray-300">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm">{benefit}</span>
                          </li>
                        ))}
                      </ul>

                      <button className={`w-full py-3 rounded-lg font-bold ${
                        selectedTicket === ticket.id
                        ? 'bg-gold text-black'
                        : 'bg-gold/20 text-gold hover:bg-gold/30'
                      }`}>
                        {selectedTicket === ticket.id ? 'Selected' : 'Select Ticket'}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right Column: Order Summary & Payment */}
              <div className="space-y-8">
                {/* Order Summary */}
                <div className="bg-black/50 rounded-2xl border border-gold/30 p-6">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <Ticket className="w-6 h-6 text-gold" />
                    Order Summary
                  </h3>
                  
                  {selectedTicketData && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-white font-bold">{selectedTicketData.name}</p>
                          <p className="text-gray-400 text-sm">1 × Ticket</p>
                        </div>
                        <p className="text-xl font-bold text-gold">
                          {currency === 'USD' ? '$' : '₦'}{ticketPrice.toFixed(currency === 'NGN' ? 0 : 2)}
                        </p>
                      </div>

                      <div className="h-px bg-gold/30 my-4"></div>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">LOFTE-3 Service Fee (2%)</span>
                          <span className="text-gray-300">
                            {currency === 'USD' ? '$' : '₦'}{serviceFee.toFixed(currency === 'NGN' ? 0 : 2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">
                            Processing Fee ({currency === 'USD' ? 'Coinbase 1%' : 'Paystack 2%'})
                          </span>
                          <span className="text-gray-300">
                            {currency === 'USD' ? '$' : '₦'}{processingFee.toFixed(currency === 'NGN' ? 0 : 2)}
                          </span>
                        </div>
                      </div>

                      <div className="h-px bg-gold/30 my-4"></div>

                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-white">Total</span>
                        <span className="text-2xl font-bold text-gold">
                          {currency === 'USD' ? '$' : '₦'}{totalAmount.toFixed(currency === 'NGN' ? 0 : 2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment Options */}
                <div className="bg-black/50 rounded-2xl border border-gold/30 p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Payment Method</h3>
                  
                  <div className="space-y-4">
                    {/* Crypto Payment */}
                    <Link href={`/payment/confirm?ticket=${selectedTicket}&currency=${currency}&method=crypto`}>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        className="w-full p-4 rounded-xl bg-gradient-to-r from-gold/20 to-gold/10 border border-gold text-gold font-bold hover:bg-gold/20 transition-all flex items-center justify-center gap-3"
                      >
                        <Coins className="w-6 h-6" />
                        Pay with Crypto (Coinbase)
                      </motion.button>
                    </Link>

                    {/* Naira Payment */}
                    <Link href={`/payment/confirm?ticket=${selectedTicket}&currency=${currency}&method=naira`}>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        className="w-full p-4 rounded-xl bg-gradient-to-r from-green-500/20 to-green-500/10 border border-green-500 text-green-500 font-bold hover:bg-green-500/20 transition-all flex items-center justify-center gap-3"
                      >
                        <CreditCard className="w-6 h-6" />
                        Pay with Naira (Paystack)
                      </motion.button>
                    </Link>
                  </div>

                  {/* Fee Notice */}
                  <div className="mt-6 p-4 rounded-lg bg-black/30 border border-gold/20">
                    <p className="text-sm text-gray-400">
                      <span className="text-gold font-bold">Note:</span> Total fees include:
                    </p>
                    <ul className="text-sm text-gray-400 mt-2 space-y-1">
                      <li>• 2% LOFTE-3 service fee</li>
                      <li>• 1% Coinbase processing fee (crypto)</li>
                      <li>• 2% Paystack fee (naira)</li>
                    </ul>
                  </div>
                </div>

                {/* Event Details */}
                <div className="bg-black/50 rounded-2xl border border-gold/30 p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Event Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gold" />
                      <span className="text-gray-300">{eventDetails.date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gold" />
                      <span className="text-gray-300">{eventDetails.time}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gold" />
                      <span className="text-gray-300">{eventDetails.location}</span>
                    </div>
                  </div>
                </div>

                {/* Security Info */}
                <div className="bg-black/50 rounded-2xl border border-gold/30 p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                    <Shield className="w-6 h-6 text-gold" />
                    Secure Payment
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: <Lock className="w-4 h-4" />, text: "Encrypted" },
                      { icon: <Shield className="w-4 h-4" />, text: "Secure" },
                      { icon: <CheckCircle className="w-4 h-4" />, text: "Verified" },
                      { icon: <Coins className="w-4 h-4" />, text: "Crypto" }
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-3 rounded-lg bg-black/30">
                        <div className="text-gold">{feature.icon}</div>
                        <span className="text-sm text-gray-300">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Need Help Section */}
            <div className="mt-12 text-center">
              <p className="text-gray-400 mb-4">
                Need assistance with your purchase?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="mailto:Lofte3@lofte.live">
                  <button className="px-6 py-3 rounded-full bg-black/30 border border-gold text-gold hover:bg-gold/10 transition">
                    Email Support
                  </button>
                </Link>
                <Link href="https://t.me/Lofte3" target="_blank">
                  <button className="px-6 py-3 rounded-full bg-black/30 border border-gold text-gold hover:bg-gold/10 transition">
                    Telegram Support
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}