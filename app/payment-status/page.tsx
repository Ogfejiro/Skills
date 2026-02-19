// app/payment-status/page.tsx
'use client'

import { Suspense, useEffect, useState } from 'react'
import PaymentStatusPage from '../../components/paymentPage'

export default function PaymentStatus() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen bg-black text-white flex items-center justify-center'>
          Loading payment status...
        </div>
      }
    >
      <PaymentStatusPage />
    </Suspense>
  )
}
