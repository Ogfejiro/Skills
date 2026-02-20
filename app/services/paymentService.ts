// app/services/paymentService.ts - LIVE BACKEND VERSION
export interface InitiatePaymentRequest {
  amount: number
  email: string
  userId?: string
  ticketId: string
  ticketName: string
  quantity: number
}

export interface InitiatePaymentResponse {
  paymentLink: string
}

export interface VerifyPaymentRequest {
  transaction_id: string
  tx_ref: string
}

class PaymentService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL

  // 🟢 REAL VERSION - CONNECTED TO BACKEND
  async initiatePayment(
    data: InitiatePaymentRequest,
  ): Promise<InitiatePaymentResponse> {
    try {
      console.log(
        '📡 Sending to backend:',
        `${this.baseUrl}/api/payments/initiate`,
      )
      console.log('📡 Request data:', {
        amount: data.amount,
        email: data.email,
        userId: data.userId,
        ticketName: data.ticketName,
      })

      const response = await fetch(`${this.baseUrl}/api/payments/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: data.amount,
          email: data.email,
          userId: data.userId,
          ticketName: data.ticketName,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('❌ Backend error:', error)
        throw new Error(error.error || 'Payment initialization failed')
      }

      const result = await response.json()
      console.log('📡 Backend response:', result)

      return result
    } catch (error) {
      console.error('❌ Payment initiation error:', error)
      throw error
    }
  }

  // 🟢 REAL VERSION - CONNECTED TO BACKEND
  async verifyPayment(
    data: VerifyPaymentRequest,
  ): Promise<{ success: boolean }> {
    try {
      console.log(
        '📡 Verifying with backend:',
        `${this.baseUrl}/api/payments/verify`,
      )
      console.log('📡 Verification data:', data)

      const response = await fetch(`${this.baseUrl}/api/payments/verify`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const text = await response.text()

      // Safely parse JSON, fallback to error if HTML returned
      let json
      try {
        json = JSON.parse(text)
      } catch {
        console.error('Non-JSON response from backend:', text)
        throw new Error('Backend did not return JSON')
      }

      if (!response.ok) {
        throw new Error(json.error || 'Payment verification failed')
      }

      return json
    } catch (error) {
      console.error('❌ Payment verification error:', error)
      throw error
    }
  }
}

export const paymentService = new PaymentService()
