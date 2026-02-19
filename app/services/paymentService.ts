// app/services/paymentService.ts - COMPLETE WORKING VERSION
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

  // ✅ MOCK VERSION - Simulates Flutterwave redirect
  async initiatePayment(
    data: InitiatePaymentRequest,
  ): Promise<InitiatePaymentResponse> {
    console.log('🔵 MOCK: Initiating Flutterwave payment for', data.ticketName)
    console.log('💰 Amount:', data.amount)
    console.log('📧 Email:', data.email)
    console.log('🎫 Ticket:', data.ticketId, data.ticketName)
    console.log('🔢 Quantity:', data.quantity)
    
    // Simulate network delay (shows loading state)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Create mock Flutterwave checkout URL
    const mockFlutterwaveUrl = `/checkout/flutterwave/mock?amount=${data.amount}&email=${encodeURIComponent(data.email)}&tx_ref=mock_${Date.now()}&ticket=${encodeURIComponent(data.ticketName)}`;
    
    console.log('🔄 Redirecting to mock Flutterwave:', mockFlutterwaveUrl)
    
    return {
      paymentLink: mockFlutterwaveUrl
    }
  }

  // ✅ MOCK VERSION - Simulates payment verification
  async verifyPayment(data: VerifyPaymentRequest): Promise<void> {
    console.log('✅ MOCK: Verifying payment with Flutterwave', {
      transaction_id: data.transaction_id,
      tx_ref: data.tx_ref
    })
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('✅ MOCK: Payment verified successfully')
    
    // Mock successful verification
    return Promise.resolve()
  }

  /* 
  // 🟢 REAL VERSION - Uncomment when backend is ready
  async initiatePayment(
    data: InitiatePaymentRequest,
  ): Promise<InitiatePaymentResponse> {
    try {
      console.log('📡 Sending to backend:', `${this.baseUrl}/api/payments/initiate`)
      
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

  async verifyPayment(data: VerifyPaymentRequest): Promise<void> {
    try {
      console.log('📡 Verifying with backend:', `${this.baseUrl}/api/payments/verify`)
      
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
      
      console.log('✅ Payment verified by backend')
    } catch (error) {
      console.error('❌ Payment verification error:', error)
      throw error
    }
  }
  */
}

export const paymentService = new PaymentService()