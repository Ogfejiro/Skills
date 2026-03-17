import axios from 'axios'

export const flwClient = axios.create({
  baseURL: 'https://api.flutterwave.com/v3',
  headers: {
    Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
})
