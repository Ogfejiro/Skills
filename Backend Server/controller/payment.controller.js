import { flwClient } from '../config/flutterwave.js'
import Payment from '../models/payment.model.js'

export const initiatePayment = async (req, res) => {
  try {
    const { amount, email, userId } = req.body

    const tx_ref = 'tx-' + Date.now()

    await Payment.create({
      userId,
      tx_ref,
      amount,
      currency: 'NGN',
      status: 'pending',
      customerEmail: email,
    })

    const response = await flwClient.post('/payments', {
      tx_ref,
      amount,
      currency: 'NGN',
      redirect_url: `https://www.lofte.live/payment/confirm?ticket=${tx_ref}&currency=NGN&method=naira`,
      customer: { email },
      customizations: {
        title: 'Checkout Payment',
        description: 'Payment for order',
      },
    })

    res.json({
      paymentLink: response.data.data.link,
    })
  } catch (err) {
    console.log(err.response?.data || err.message)
    res.status(500).json({ error: 'Payment initialization failed' })
  }
}

export const paymentRedirect = async (req, res) => {
  try {
    const { transaction_id, tx_ref } = req.query

    return res.redirect(
      `${process.env.FRONTEND_URL}/payment-status?transaction_id=${transaction_id}&tx_ref=${tx_ref}`,
    )
  } catch (err) {
    res.status(500).json({ error: 'Redirect error' })
  }
}

export const verifyPayment = async (req, res) => {
  try {
    const { transaction_id, tx_ref } = req.body

    const response = await flwClient.get(
      `/transactions/${transaction_id}/verify`,
    )

    const data = response.data.data

    if (data.status !== 'successful') {
      return res.status(400).json({ error: 'Payment not successful' })
    }

    const paymentRecord = await Payment.findOne({ tx_ref })

    if (!paymentRecord) {
      return res.status(404).json({ error: 'Payment record not found' })
    }

    if (data.amount !== paymentRecord.amount) {
      return res.status(400).json({ error: 'Amount mismatch' })
    }

    if (data.currency !== paymentRecord.currency) {
      return res.status(400).json({ error: 'Currency mismatch' })
    }

    if (data.status !== 'successful') {
      return res.status(400).json({ error: 'Payment not successful' })
    }

    await Payment.findOneAndUpdate(
      { tx_ref },
      {
        status: 'successful',
        transactionId: transaction_id,
      },
    )

    res.json({ message: 'Payment verified successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Verification failed' })
  }
}

export const flutterwaveWebhook = async (req, res) => {
  try {
    const signature = req.headers['verif-hash']

    if (signature !== process.env.FLW_WEBHOOK_SECRET) {
      return res.sendStatus(401)
    }

    const payload = req.body

    if (payload.event === 'charge.completed') {
      const paymentData = payload.data

      if (paymentData.status === 'successful') {
        await Payment.findOneAndUpdate(
          { tx_ref: paymentData.tx_ref },
          {
            status: 'successful',
            transactionId: paymentData.id,
          },
        )
      }
    }

    res.sendStatus(200)
  } catch (error) {
    console.error('Webhook error:', error)
    res.status(500).json({ error: 'Webhook processing failed' })
  }
}
