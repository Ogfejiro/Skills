'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Coins, 
  CreditCard, 
  Ticket, 
  Mail,
  Download,
  Share2,
  Home,
  Calendar,
  Clock,
  MapPin,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

const ticketOptions = {
  regular: { name: 'Regular Ticket', price: 0 },
  'regular-shared': { name: 'Regular + Shared Accommodation', price: 5 },
  'regular-single': { name: 'Regular + Single Budget Accommodation', price: 9 },
  vip: { name: 'VIP Ticket', price: 6 },
  'vip-luxury': { name: 'VIP + Luxury Accommodation', price: 29 }
};

// Main content component that uses useSearchParams
function PaymentConfirmationContent() {
  const searchParams = useSearchParams();
  
  const ticketId = searchParams.get('ticket');
  const currency = searchParams.get('currency');
  const method = searchParams.get('method');

  if (!ticketId || !currency || !method) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white mb-4">Invalid Order</h2>
        <p className="text-gray-400 mb-8">Missing order details. Please go back and try again.</p>
        <Link href="/payment">
          <button className="px-8 py-3 rounded-full bg-gold text-black font-bold hover:bg-gold/90 transition">
            Back to Tickets
          </button>
        </Link>
      </div>
    );
  }

  const ticket = ticketOptions[ticketId as keyof typeof ticketOptions];
  if (!ticket) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white mb-4">Invalid Ticket Type</h2>
        <p className="text-gray-400 mb-8">Please select a valid ticket type.</p>
        <Link href="/payment">
          <button className="px-8 py-3 rounded-full bg-gold text-black font-bold hover:bg-gold/90 transition">
            Back to Tickets
          </button>
        </Link>
      </div>
    );
  }

  const exchangeRate = 1430;
  const price = currency === 'NGN' ? ticket.price * exchangeRate : ticket.price;
  const fees = price * 0.03;
  const total = price + fees;

  const orderDetails = {
    ticket: ticket.name,
    currency,
    method,
    price,
    fees,
    total,
    orderId: `LOFTE-${Date.now().toString().slice(-8)}`,
    date: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    status: 'completed'
  };

  return (
    <>
      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="w-24 h-24 rounded-full bg-green-500/20 border-4 border-green-500 flex items-center justify-center mx-auto mb-8"
      >
        <CheckCircle className="w-12 h-12 text-green-500" />
      </motion.div>

      {/* Success Message */}
      <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
      <p className="text-gray-400 text-lg mb-8">
        Your tickets have been confirmed. Check your email for details.
      </p>

      {/* Order Summary */}
      <div className="bg-black/50 rounded-2xl border border-gold/30 p-8 mb-8 text-left">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Order Confirmation</h2>
            <p className="text-gray-400">Order #{orderDetails.orderId}</p>
            <p className="text-gray-500 text-sm mt-1">{orderDetails.date}</p>
          </div>
          <div className="px-4 py-2 rounded-full bg-green-500/20 border border-green-500">
            <span className="text-green-500 font-bold">PAID</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-black/30">
              <p className="text-gray-400 text-sm">Ticket Type</p>
              <p className="text-white font-bold">{orderDetails.ticket}</p>
            </div>
            <div className="p-4 rounded-xl bg-black/30">
              <p className="text-gray-400 text-sm">Total Paid</p>
              <p className="text-2xl font-bold text-gold">
                {orderDetails.currency === 'USD' ? '$' : '₦'}
                {orderDetails.total.toFixed(orderDetails.currency === 'NGN' ? 0 : 2)}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gold/5 border border-gold/20">
            <h3 className="font-bold text-white mb-3 flex items-center gap-2">
              <Ticket className="w-5 h-5" />
              Ticket Details
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gold" />
                <span className="text-gray-300">March 27, 2026</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gold" />
                <span className="text-gray-300">Scheduled on Ticket</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gold" />
                <span className="text-gray-300">Scheduled on Ticket</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-black/30">
            <h3 className="font-bold text-white mb-3">Payment Method</h3>
            <div className="flex items-center gap-3">
              {orderDetails.method === 'crypto' ? (
                <>
                  <Coins className="w-6 h-6 text-gold" />
                  <div>
                    <p className="text-white">Paid with Cryptocurrency</p>
                    <p className="text-gray-400 text-sm">via Coinbase Commerce</p>
                  </div>
                </>
              ) : (
                <>
                  <CreditCard className="w-6 h-6 text-green-500" />
                  <div>
                    <p className="text-white">Paid with Naira</p>
                    <p className="text-gray-400 text-sm">via Paystack</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-r from-gold/10 to-gold/5 border border-gold/30">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-gold font-bold mb-1">✓ Confirmation Sent</p>
                <p className="text-gray-400 text-sm">
                  Your ticket confirmation and event details have been sent to your email.
                  You will also receive a GETDP link for digital ticket access.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/" className="flex-1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-4 rounded-xl bg-gold text-black font-bold hover:bg-gold/90 transition flex items-center justify-center gap-3"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </motion.button>
        </Link>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 py-4 rounded-xl bg-black/30 border border-gold text-gold font-bold hover:bg-gold/10 transition flex items-center justify-center gap-3"
        >
          <Download className="w-5 h-5" />
          Download Ticket
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 py-4 rounded-xl bg-black/30 border border-gold text-gold font-bold hover:bg-gold/10 transition flex items-center justify-center gap-3"
        >
          <Share2 className="w-5 h-5" />
          Share Event
        </motion.button>
      </div>

      {/* Support Info */}
      <div className="mt-12 p-6 rounded-xl bg-black/30 border border-gold/20">
        <h3 className="font-bold text-white mb-3 flex items-center gap-2">
          <Mail className="w-5 h-5 text-gold" />
          Need Help?
        </h3>
        <p className="text-gray-400 mb-4">
          Contact our support team for any questions about your ticket.
        </p>
        <div className="text-sm text-gray-500 space-y-1">
          <p className="flex items-center gap-2">
            <span>📧</span>
            <span>Email: Lofte3@lofte.live</span>
          </p>
          <p className="flex items-center gap-2">
            <span>📱</span>
            <span>Telegram: T.me/Lofte3</span>
          </p>
        </div>
      </div>

      {/* Next Steps */}
      <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-gold/10 to-gold/5 border border-gold/30">
        <h3 className="font-bold text-white mb-3">What Happens Next?</h3>
        <ol className="text-gray-400 text-sm space-y-2 ml-4 list-decimal">
          <li>You will receive an email confirmation within 5 minutes</li>
          <li>Your digital ticket will be available for download</li>
          <li>Event reminders will be sent 24 hours before the event</li>
          <li>All event updates will be communicated via email</li>
        </ol>
      </div>
    </>
  );
}

// Loading component
function LoadingSpinner() {
  return (
    <div className="text-center py-20">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="inline-block mb-6"
      >
        <Loader2 className="w-12 h-12 text-gold" />
      </motion.div>
      <h2 className="text-2xl font-bold text-white mb-4">Processing Your Order</h2>
      <p className="text-gray-400">Please wait while we confirm your payment...</p>
    </div>
  );
}

// Main page component with Suspense
export default function PaymentConfirmationPage() {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          <Suspense fallback={<LoadingSpinner />}>
            <PaymentConfirmationContent />
          </Suspense>
        </motion.div>
      </div>
    </main>
  );
}