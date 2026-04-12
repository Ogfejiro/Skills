import mongoose from 'mongoose'

const ticketSchema = new mongoose.Schema(
	{
		paymentId: {
			type: String,
			unique: true,
			required: true,
		},
		ticketId: { type: String, required: true, unique: true },
		tx_ref: { type: String, required: true, unique: true },
		amount: { type: Number, required: true },
		currency: { type: String },
		status: { type: String, required: true },
		quantity: { type: String, required: true },
		customerEmail: { type: String, required: true },
		ticketName: { type: String, required: true },
		eventDate: { type: Date },
		eventName: { type: String },
		location: { type: String },
	},
	{ timestamps: true },
)

const Ticket = mongoose.model('Ticket', ticketSchema)

export default Ticket
