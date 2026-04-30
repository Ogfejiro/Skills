export async function sendVerificationEmail(
	customerEmail,
	ticketName,
	link,
	title,
	venue,
	date,
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
					name: 'Lofte Events',
				},
				to: [{ email: customerEmail }],
				templateId: Number(process.env.BREVO_TEMPLATE_ID),
				params: {
					EMAIL: customerEmail,
					TICKET: ticketName,
					link: link,
					TITLE: title,
					VENUE: venue,
					DATE: date,
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
					name: 'Lofte Events',
				},
				to: [{ email: process.env.EMAIL_FROM }],
				templateId: Number(process.env.BREVO_TEMPLATE_ID_EVENT),
				params: {
					TITTLE: title,
					EMAIL: customerEmail,
					date: date,
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

export async function sendPasswordResetEmail(customerEmail, resetLink) {
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
					name: 'Lofte Events',
				},
				to: [{ email: customerEmail }],
				subject: 'Reset your password',
				htmlContent: `
					<p>Hello,</p>
					<p>We received a request to reset your password.</p>
					<p><a href="${resetLink}">Click here to continue</a></p>
					<p>If you did not request this, you can ignore this email.</p>
				`,
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

// Send custom host email content (from EventEmail template)
export async function sendCustomHostEmail(
	customerEmail,
	subject,
	htmlContent,
	hostName = 'Lofte Events',
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
					name: hostName,
				},
				to: [{ email: customerEmail }],
				subject,
				htmlContent,
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
