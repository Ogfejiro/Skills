import rateLimit from 'express-rate-limit'

export const authLimiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 15 minutes
	max: 5,
	message:
		'Too many login/register attempts from this IP, please try again after 15 minutes',
})
export const profileLimiter = rateLimit({
	windowMs: 10 * 60 * 1000,
	max: 50,
	message:
		'Too many post attempts from this IP, please try again after 10 minutes',
})
