export const validateEnvironment = () => {
	const requiredEnvVars = [
		'MONGODB_URI',
		'ACCESS_TOKEN_SECRET',
		'REFRESH_TOKEN_SECRET',
		'ACCESS_JWT_EXPIRES_IN',
		'REFRESH_JWT_EXPIRES_IN',
		'FRONTEND_URL',
		'PORT',
		'NODE_ENV',
		'FLW_SECRET_KEY',
		'FLW_PUBLIC_KEY',
		'FLW_WEBHOOK_SECRET',
		'BREVO_API_KEY',
		'EMAIL_FROM',
		'BREVO_TEMPLATE_ID',
		'BREVO_TEMPLATE_ID_EVENT',
		'RESET_PASSWORD_TOKEN_SECRET',
		'RESET_PASSWORD_JWT_EXPIRES_IN',
		'CLOUDINARY_CLOUD_NAME',
		'CLOUDINARY_API_KEY',
		'CLOUDINARY_API_SECRET',
		'NOWPAYMENTS_API_KEY',
		'NOWPAYMENTS_IPN_SECRET',
	]

	const missing = []

	for (const envVar of requiredEnvVars) {
		if (!process.env[envVar]) {
			missing.push(envVar)
		}
	}

	if (missing.length > 0) {
		console.error('Missing required environment variables:')
		missing.forEach((env) => console.error(`   - ${env}`))
		process.exit(1)
	}

	console.log('All required environment variables are set')
}
