'use client';

import { motion } from 'framer-motion'
import {
	Twitter,
	MessageCircle,
	Mail,
	ChevronRight,
	Sparkles,
} from 'lucide-react'
import Link from 'next/link'

const Footer = () => {
	const currentYear = new Date().getFullYear()

	const links = {
		platform: [
			{ label: 'List Event', href: '/auth/register' },
			{ label: 'Browse Events', href: '/#featured' },
			{ label: 'Dashboard', href: '/dashboard' },
		],
		company: [
			{ label: 'About Us', href: '/#home' },
			{ label: 'Contact', href: 'mailto:support@lofte3.com' },
			{ label: 'Support', href: 'mailto:support@lofte3.com' },
		],
		legal: [
			{ label: 'Privacy Policy', href: '#' },
			{ label: 'Terms of Service', href: '#' },
			{ label: 'Code of Conduct', href: '#' },
		],
	}

	const socials = [
		{ icon: Twitter, href: 'https://x.com/lofte3_', label: 'Twitter' },
		{
			icon: MessageCircle,
			href: 'https://T.me/lofte_live',
			label: 'Telegram',
		},
		{ icon: Mail, href: 'mailto:support@lofte3.com', label: 'Email' },
	]

	return (
		<footer className='bg-black text-white border-t border-gold/10'>
			<div className='px-4 md:px-8 py-16'>
				<div className='container mx-auto'>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12'>
						{/* Brand */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							className='space-y-6'
						>
							<h2 className='text-3xl font-bold'>
								<span className='text-white'>LO</span>FTE
								<span className='text-gold'>-3</span>
							</h2>

							<p className='text-gray-400'>
								Africa's Premier Web3 Events platform.
							</p>

							<div className='flex gap-4'>
								{socials.map((social, i) => {
									const Icon = social.icon
									return (
										<motion.a
											key={i}
											href={social.href}
											target='_blank'
											rel='noopener noreferrer'
											whileHover={{ scale: 1.2 }}
											className='text-gray-400 hover:text-gold'
										>
											<Icon className='w-5 h-5' />
										</motion.a>
									)
								})}
							</div>
						</motion.div>

						{/* Platform */}
						<div>
							<h4 className='text-gold mb-4 font-bold'>
								Platform
							</h4>
							{links.platform.map((link, i) => (
								<Link
									key={i}
									href={link.href}
									className='block text-gray-400 hover:text-gold'
								>
									{link.label}
								</Link>
							))}
						</div>

						{/* Company */}
						<div>
							<h4 className='text-gold mb-4 font-bold'>
								Company
							</h4>
							{links.company.map((link, i) => (
								<a
									key={i}
									href={link.href}
									className='block text-gray-400 hover:text-gold'
								>
									{link.label}
								</a>
							))}
						</div>

						{/* CTA */}
						<div>
							<h4 className='text-gold mb-4 font-bold'>
								Stay Updated
							</h4>
							<motion.a
								href='https://x.com/lofte3_'
								target='_blank'
								whileHover={{ scale: 1.05 }}
								className='block bg-gold text-black px-4 py-2 rounded-lg text-center font-bold'
							>
								Follow Us
							</motion.a>
						</div>
					</div>

					<div className='border-t border-gray-800 pt-6 flex justify-between text-sm text-gray-400'>
						<p>© {currentYear} LOFTE-3</p>

						<div className='flex gap-4'>
							{links.legal.map((link, i) => (
								<a key={i} href={link.href}>
									{link.label}
								</a>
							))}
						</div>
					</div>
				</div>
			</div>
		</footer>
	)
}

export default Footer
