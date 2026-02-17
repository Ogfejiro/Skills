// services/paymentService.ts
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
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || ''

  async initiatePayment(
    data: InitiatePaymentRequest,
  ): Promise<InitiatePaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/payments/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: data.amount,
          email: data.email,
          userId: data.userId,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Payment initialization failed')
      }

      return await response.json()
    } catch (error) {
      console.error('Payment initiation error:', error)
      throw error
    }
  }

  async verifyPayment(data: VerifyPaymentRequest): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/payments/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Payment verification failed')
      }
    } catch (error) {
      console.error('Payment verification error:', error)
      throw error
    }
  }
}

export const paymentService = new PaymentService()
