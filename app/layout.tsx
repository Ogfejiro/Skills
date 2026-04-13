import type { Metadata, Viewport } from 'next'
import { MaxWidthWrapper, cn, ThemeProvider } from '@/lib'
import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google'
import { Toaster } from 'sonner'
import './globals.css'
import NextTopLoader from 'nextjs-toploader'
import { Header } from '@/components/reusables'
import Loader from '@/components/Loader'
import { AuthProvider } from '@/app/context/AuthContext'

export const metadata: Metadata = {
	title: 'LoFTE3 | Events',
	description: 'Exclusive events and experiences',
	icons: {
		icon: '/images/image0.jpeg',
	},
}

export const viewport: Viewport = {
	themeColor: '#000000',
	width: 'device-width',
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en' suppressHydrationWarning>
			<head>
				<link rel='icon' href='/images/image0.jpeg' type='image/jpeg' />
				<link rel='preconnect' href='https://fonts.googleapis.com' />
				<link
					rel='preconnect'
					href='https://fonts.gstatic.com'
					crossOrigin='anonymous'
				/>
				<link
					href='https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700;800&display=swap'
					rel='stylesheet'
				/>
			</head>
			<body
				className={cn(
					'm-auto min-h-screen bg-background bg-center bg-no-repeat scroll-smooth antialiased',
				)}
			>
				<AuthProvider>
					<ThemeProvider
						attribute='class'
						defaultTheme='dark'
						enableSystem
						disableTransitionOnChange
					>
						{/* Loading Screen - Shows first, then auto-hides */}
						<Loader />

						{/* Progress Bar */}
						<NextTopLoader
							color='#D4AF37'
							height={3}
							showSpinner={false}
							easing='ease'
							shadow='0 0 10px #D4AF37, 0 0 5px #D4AF37'
						/>

						{/* Your Header */}
						<Header />

						{/* Main Content */}
						<MaxWidthWrapper>{children}</MaxWidthWrapper>

						{/* Toast Notifications */}
						<Toaster
							position='top-right'
							expand={false}
							theme='dark'
							toastOptions={{
								style: {
									background: '#0a0a0a',
									border: '1px solid #D4AF37',
									color: '#fff',
								},
							}}
						/>

						{/* Analytics */}
						<GoogleAnalytics gaId='' />
						<GoogleTagManager gtmId='' />
					</ThemeProvider>
				</AuthProvider>
			</body>
		</html>
	)
}
