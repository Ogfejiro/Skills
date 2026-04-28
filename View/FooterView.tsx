'use client'

import { Twitter, MessageCircle, Mail } from 'lucide-react'
import Link from 'next/link'

const Footer = () => {
	const currentYear = new Date().getFullYear()

	const links = {
		platform: [
			{ label: 'List Event', href: '/auth/register' },
			{ label: 'Browse Events', href: '/events' },
			{ label: 'Dashboard', href: '/dashboard' },
		],
		company: [
			{ label: 'About Us', href: '/#home' },
			{ label: 'Contact', href: 'mailto:support@lofte3.com' },
			{ label: 'Support', href: 'mailto:support@lofte3.com' },
		],
		legal: [
			{ label: 'Privacy', href: '#' },
			{ label: 'Terms', href: '#' },
			{ label: 'Code of Conduct', href: '#' },
		],
	}

	const socials = [
		{ icon: Twitter, href: 'https://x.com/lofte3_', label: 'Twitter' },
		{ icon: MessageCircle, href: 'https://T.me/lofte_live', label: 'Telegram' },
		{ icon: Mail, href: 'mailto:support@lofte3.com', label: 'Email' },
	]

	return (
		<footer className='bg-[#0a0a0f] text-white border-t border-white/[0.06]'>
			<div className='max-w-6xl mx-auto px-4 md:px-8 py-14'>
				<div className='grid grid-cols-2 md:grid-cols-4 gap-8 mb-12'>
					{/* Brand */}
					<div className='col-span-2 md:col-span-1'>
						<h2 className='text-2xl font-black tracking-tight'>
							<span className='text-white'>LO</span>
							<span className='text-[#c9a227]'>FTE-3</span>
						</h2>
						<p className='text-gray-500 text-sm mt-2 leading-relaxed'>
							The premier events platform.
						</p>
						<div className='flex gap-3 mt-5'>
							{socials.map((social, i) => {
								const Icon = social.icon
								return (
									<a
										key={i}
										href={social.href}
										target='_blank'
										rel='noopener noreferrer'
										aria-label={social.label}
										className='w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-[#c9a227] hover:bg-[#c9a227]/10 transition-colors'
									>
										<Icon className='w-3.5 h-3.5' />
									</a>
								)
							})}
						</div>
					</div>

					{/* Platform */}
					<div>
						<h4 className='text-xs font-semibold text-gray-400 tracking-wider uppercase mb-4'>
							Platform
						</h4>
						<div className='space-y-2.5'>
							{links.platform.map((link, i) => (
								<Link
									key={i}
									href={link.href}
									className='block text-sm text-gray-500 hover:text-[#c9a227] transition-colors'
								>
									{link.label}
								</Link>
							))}
						</div>
					</div>

					{/* Company */}
					<div>
						<h4 className='text-xs font-semibold text-gray-400 tracking-wider uppercase mb-4'>
							Company
						</h4>
						<div className='space-y-2.5'>
							{links.company.map((link, i) => (
								<a
									key={i}
									href={link.href}
									className='block text-sm text-gray-500 hover:text-[#c9a227] transition-colors'
								>
									{link.label}
								</a>
							))}
						</div>
					</div>

					{/* Stay Updated */}
					<div>
						<h4 className='text-xs font-semibold text-gray-400 tracking-wider uppercase mb-4'>
							Stay Updated
						</h4>
						<a
							href='https://x.com/lofte3_'
							target='_blank'
							rel='noopener noreferrer'
							className='inline-block bg-[#c9a227] text-black px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#d4b84a] transition-colors'
						>
							Follow Us
						</a>
					</div>
				</div>

				<div className='border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row justify-between gap-4 text-xs text-gray-600'>
					<p>&copy; {currentYear} LOFTE-3. All rights reserved.</p>
					<div className='flex gap-5'>
						{links.legal.map((link, i) => (
							<a
								key={i}
								href={link.href}
								className='hover:text-gray-400 transition-colors'
							>
								{link.label}
							</a>
						))}
					</div>
				</div>
			</div>
		</footer>
	)
}

export default Footer
