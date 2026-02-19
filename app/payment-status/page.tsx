// app/payment-status/page.tsx
'use client'

import { Suspense, useEffect, useState } from 'react'
import PaymentStatusPage from '../../components/paymentPage'

export default function PaymentStatus() {
  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        {status === 'loading' && (
          <>
            <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader className="w-10 h-10 text-gold animate-spin" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Verifying Payment</h1>
            <p className="text-gray-400">Please wait while we confirm your transaction...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-green-500 mb-4">Payment Successful!</h1>
            <p className="text-gray-300 mb-8">{message}</p>
            
            {/* Transaction Reference */}
            <div className="bg-gray-900/50 border border-gold/20 rounded-xl p-4 mb-8">
              <p className="text-sm text-gray-400 mb-2">Transaction Reference</p>
              <p className="text-gold font-mono text-sm break-all">{tx_ref}</p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                href="/tickets"
                className="block w-full py-4 bg-gradient-to-r from-gold to-gold/80 text-black font-bold rounded-xl hover:shadow-lg hover:shadow-gold/30 transition-all flex items-center justify-center gap-2"
              >
                <Ticket className="w-5 h-5" />
                View My Tickets
              </Link>
              
              <Link
                href="/#events"
