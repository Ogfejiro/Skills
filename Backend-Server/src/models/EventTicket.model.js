import mongoose from 'mongoose'

const eventTicketSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    benefits: [
      {
        type: String,
      },
    ],
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    maxPerUser: {
      type: Number,
      default: 10,
    },
  },
  { timestamps: true },
)

eventTicketSchema.index({ eventId: 1 })
eventTicketSchema.index({ eventId: 1, sold: 1 })

const EventTicket = mongoose.model('EventTicket', eventTicketSchema)

export default EventTicket
