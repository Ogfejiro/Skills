export async function sendVerificationEmail(customerEmail, ticketName, link) {
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
					Ticket: ticketName,
					link,
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

// Send Host create Event
export async function sendEventEmail(customerEmail, title, date) {
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
				to: [{ email: process.env.EMAIL_FROM }],
				templateId: Number(process.env.BREVO_TEMPLATE_ID_EVENT),
				params: {
					EMAIL: customerEmail,
					title,
					date,
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
