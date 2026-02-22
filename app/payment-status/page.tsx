import { Suspense } from 'react'
import PaymentStatusPageComponent from './../../components/paymentPage'

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={<div>Loading payment details...</div>}>
      <PaymentStatusPageComponent/>
    </Suspense>
  )
}
