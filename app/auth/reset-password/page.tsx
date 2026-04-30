'use client'

import React, { Suspense } from 'react'
import ResetPasswordContent from './reset-password-content'

export default function ResetPasswordPage() {
	return (
		<Suspense
			fallback={
				<div className='flex items-center justify-center min-h-screen'>
					Loading...
				</div>
			}
		>
			<ResetPasswordContent />
		</Suspense>
	)
}
