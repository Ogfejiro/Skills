import { Suspense } from 'react'
import TicketsPage from '@/components/Ticket-page'

export default function TicketsPageWrapper() {
  return (
    <Suspense fallback={<div>Loading tickets...</div>}>
      <TicketsPage />
    </Suspense>
  )
}
