import mongoose from 'mongoose'

const ticketSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      required: true,
    },
    ticketId: { type: String, required: true, unique: true },
    tx_ref: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, required: true },
    customerEmail: { type: String, required: true },
  },
  { timestamps: true },
)
