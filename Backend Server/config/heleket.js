import axios from 'axios'
import crypto from 'crypto'

const BASE_URL = process.env.HELEKET_BASE_URL
const API_KEY = process.env.HELEKET_API_KEY
const MERCHANT_UUID = process.env.HELEKET_MERCHANT_UUID

export const heleketService = async (payload = {}) => {
  const jsonData = JSON.stringify(payload)

  const base64 = Buffer.from(jsonData).toString('base64')

  const sign = crypto
    .createHash('md5')
    .update(base64 + API_KEY)
    .digest('hex')

  const headers = {
    'Content-Type': 'application/json',
    merchant: MERCHANT_UUID,
    sign: sign,
  }

  const response = await axios.post(`${BASE_URL}/v1/payment`, payload, {
    headers,
  })

  return response.data
}
