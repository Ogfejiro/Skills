import axios from 'axios'

const API_KEY = process.env.NOWPAYMENTS_API_KEY
const BASE_URL = process.env.NOWPAYMENTS_BASE_URL

const nowPaymentsApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'x-api-key': API_KEY,
    'Content-Type': 'application/json',
  },
})

class NowPaymentsService {
  async createPayment(data) {
    const response = await nowPaymentsApi.post('/payment', data)
    return response.data
  }

  async createInvoice(data) {
    const response = await nowPaymentsApi.post('/invoice', data)
    return response.data
  }

  async getPaymentStatus(paymentId) {
    const response = await nowPaymentsApi.get(`/payment/${paymentId}`)
    return response.data
  }
}

export default new NowPaymentsService()
