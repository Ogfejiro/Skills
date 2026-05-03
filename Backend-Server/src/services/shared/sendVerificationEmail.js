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

export async function sendWithdrawalAdminEmail(payload) {
	try {
		const {
			hostName,
			hostEmail,
			hostPhone,
			amount,
			method,
			paymentInfo,
			requestedAt,
		} = payload

		const isBank = method === 'bank'

		const paymentRows = isBank
			? `
				<tr><td><strong>Bank Name</strong></td><td>${paymentInfo.bankName || '-'}</td></tr>
				<tr><td><strong>Account Name</strong></td><td>${paymentInfo.accountName || '-'}</td></tr>
				<tr><td><strong>Account No</strong></td><td>${paymentInfo.accountNo || '-'}</td></tr>
			`
			: `
				<tr><td><strong>Wallet Type</strong></td><td>${paymentInfo.walletType || '-'}</td></tr>
				<tr><td><strong>Wallet Address</strong></td><td>${paymentInfo.walletAddress || '-'}</td></tr>
			`

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
				subject: `New Withdrawal Request - ₦${Number(amount).toLocaleString()}`,
				htmlContent: `
					<h2>New Withdrawal Request</h2>
					<p>A host has requested a withdrawal. Please review and process it within 24 hours.</p>
					<table style="border-collapse:collapse;width:100%;max-width:560px" cellpadding="8" border="1">
						<tr><td><strong>Host Name</strong></td><td>${hostName || '-'}</td></tr>
						<tr><td><strong>Host Email</strong></td><td>${hostEmail || '-'}</td></tr>
						<tr><td><strong>Host Phone</strong></td><td>${hostPhone || '-'}</td></tr>
						<tr><td><strong>Amount</strong></td><td>₦${Number(amount).toLocaleString()}</td></tr>
						<tr><td><strong>Method</strong></td><td>${isBank ? 'Bank Transfer' : 'Crypto'}</td></tr>
						${paymentRows}
						<tr><td><strong>Requested At</strong></td><td>${requestedAt}</td></tr>
					</table>
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

export async function sendWithdrawalUserEmail(payload) {
	try {
		const { customerEmail, hostName, amount, method, paymentInfo } = payload

		const isBank = method === 'bank'
		const destination = isBank
			? `${paymentInfo.bankName || ''} - ${paymentInfo.accountNo || ''} (${paymentInfo.accountName || ''})`
			: `${paymentInfo.walletType || ''} - ${paymentInfo.walletAddress || ''}`

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
				subject: 'Your withdrawal is being processed',
				htmlContent: `
					<p>Hello ${hostName || ''},</p>
					<p>We have received your withdrawal request of <strong>₦${Number(amount).toLocaleString()}</strong>.</p>
					<p>Your funds will be sent to:</p>
					<p><strong>${isBank ? 'Bank Account' : 'Crypto Wallet'}:</strong> ${destination}</p>
					<p>Your payment is being processed and will be ready within the next 24 hours.</p>
					<p>Thank you for using Lofte Events.</p>
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
