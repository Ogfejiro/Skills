export async function sendVerificationEmail(
  customerEmail,
  amount,
  link,
  ticketName,
  tx_ref,
) {
  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          email: process.env.EMAIL_FROM,
          name: 'Lofte Web3 Events',
        },
        to: [{ email: customerEmail }],
        templateId: Number(process.env.BREVO_TEMPLATE_ID),
        params: {
          EMAIL: customerEmail,
          amount,
          link,
          ticketName,
          tx_ref,
        },
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      throw new Error(err)
    }

    return { success: true }
  } catch (error) {
    console.error('Brevo API Error:', error.message)
    return { success: false, error: error.message }
  }
}
