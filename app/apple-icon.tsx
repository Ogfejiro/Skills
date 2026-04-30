import { ImageResponse } from 'next/og'

export const size = {
	width: 180,
	height: 180,
}
export const contentType = 'image/png'

export default function AppleIcon() {
	return new ImageResponse(
		(
			<div
				style={{
					fontSize: 80,
					background: '#0a0a0f',
					width: '100%',
					height: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					borderRadius: '36px',
					color: '#c9a227',
					fontWeight: 900,
					fontFamily: 'sans-serif',
				}}
			>
				L3
			</div>
		),
		{
			...size,
		},
	)
}
