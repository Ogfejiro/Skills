// app/payment-status/page.tsx - KEEP THIS ONE, DELETE THE OTHER
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { paymentService } from '@/app/services/paymentService'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Loader, Ticket } from 'lucide-react'

export default function PaymentStatusPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading')
  const [message, setMessage] = useState('')

  const transaction_id = searchParams.get('transaction_id')
  const tx_ref = searchParams.get('tx_ref')

  useEffect(() => {
    const verifyPayment = async () => {
      if (!transaction_id || !tx_ref) {
        setStatus('failed')
        setMessage('Missing payment information')
        return
      }

      try {
        // Verify payment with backend
        await paymentService.verifyPayment({
          transaction_id,
          tx_ref,
        })

        setStatus('success')
        setMessage('Payment successful! Your tickets have been confirmed.')
      } catch (error: any) {
        setStatus('failed')
        setMessage(error.message || 'Payment verification failed')
      }
    }

    verifyPayment()
  }, [transaction_id, tx_ref])

  return (
    <div className='min-h-screen bg-black text-white flex items-center justify-center p-4'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='max-w-md w-full text-center'
      >
        {status === 'loading' && (
          <>
            <div className='w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6'>
              <Loader className='w-10 h-10 text-gold animate-spin' />
            </div>
            <h1 className='text-3xl font-bold mb-4'>Verifying Payment</h1>
            <p className='text-gray-400'>
              Please wait while we confirm your transaction...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className='w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6'>
              <CheckCircle className='w-10 h-10 text-green-500' />
            </div>
            <h1 className='text-3xl font-bold text-green-500 mb-4'>
              Payment Successful!
            </h1>
            <p className='text-gray-300 mb-8'>{message}</p>
            <p className='text-sm text-gray-400 mb-8'>
              Transaction Reference: {tx_ref}
            </p>
            <div className='space-y-3'>
              <Link
                href='/tickets'
                className='block w-full py-3 bg-gold text-black font-bold rounded-lg hover:opacity-90 transition-opacity'
              >
                View My Tickets
              </Link>
              <Link
                href='/'
                className='block w-full py-3 border border-gold text-gold rounded-lg hover:bg-gold/10 transition-colors'
              >
                Browse More Events
              </Link>
            </div>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className='w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6'>
              <XCircle className='w-10 h-10 text-red-500' />
            </div>
            <h1 className='text-3xl font-bold text-red-500 mb-4'>
              Payment Failed
            </h1>
            <p className='text-gray-300 mb-8'>{message}</p>
            <div className='space-y-3'>
              <button
                onClick={() => window.history.back()}
                className='block w-full py-3 bg-gold text-black font-bold rounded-lg hover:opacity-90 transition-opacity'
              >
                Try Again
              </button>
              <a
                href='https://t.me/Lofte3'
                target='_blank'
                rel='noopener noreferrer'
                className='block w-full py-3 border border-gold text-gold rounded-lg hover:bg-gold/10 transition-colors'
              >
                Contact Support
              </a>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}