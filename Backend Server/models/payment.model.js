import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema(
  {
    userId: String,
    tx_ref: String,
    transactionId: String,
    amount: Number,
    currency: String,
    status: String,
    customerEmail: String,
  },
  { timestamps: true },
)

export default mongoose.model('Payment', paymentSchema)
