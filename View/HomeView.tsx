'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import {
	Calendar,
	MapPin,
	Users,
	ArrowRight,
	Sparkles,
	ChevronRight,
	History,
	Coins,
	Home,
	Clock,
	Ticket,
	ExternalLink,
} from 'lucide-react'

import Link from 'next/link'
import Navbar from '@/components/Navbar'
import TicketModal from '@/components/TicketModal'

export default function HomePage() {
	const [isTicketModalOpen, setIsTicketModalOpen] = useState(false)

	const openLink = (link: string) => {
		if (link) window.open(link, '_blank')
	}

	const xAccountLink = 'https://x.com'
	const learnMoreLink = 'https://example.com/about'
	const calendlyLink = 'https://calendly.com'

	const eventImages = {
		mainParty: '/images/new.jpg',
		valentineEvent: '/images/valentine.jpg',
	}

	const featuredEvent = {
		title: 'LOFTE-3 Project Hangout & Dinner',
		date: 'March 27, 2026',
		location: 'Eko Hotels & Suites, Lagos',
		image: '/images/new.jpg',
		attendees: 500,
		description: 'An exclusive evening with Web3 elites',
	}

	return (
		<main className='min-h-screen bg-black text-white overflow-x-hidden'>
			<Navbar />

			<TicketModal
				isOpen={isTicketModalOpen}
				onClose={() => setIsTicketModalOpen(false)}
			/>

			{/* HERO */}
			<section className='relative min-h-screen flex items-center pt-20'>
				<div className='container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center'>
					{/* LEFT */}
					<div>
						<h1 className='text-5xl md:text-7xl font-bold mb-6'>
							Where Web3 Meets{' '}
							<span className='text-gold'>Reality</span>
						</h1>

						<p className='text-gray-300 mb-8'>
							Discover and join premium Web3 events across Africa.
						</p>

						<div className='flex gap-4'>
							<button
								onClick={() => setIsTicketModalOpen(true)}
								className='px-6 py-3 bg-gold text-black font-bold rounded-lg'
							>
								Get Tickets
							</button>

							<a
								href='#events'
								className='px-6 py-3 border border-gold text-gold rounded-lg'
							>
								Explore
							</a>
						</div>
					</div>

					{/* RIGHT IMAGE */}
					<div>
						<img
							src={featuredEvent.image}
							className='rounded-xl border border-gold'
						/>
					</div>
				</div>
			</section>

			{/* WELCOME SECTION (FIXED POSITION) */}
			<section id='home' className='py-20 text-center'>
				<h2 className='text-4xl md:text-6xl font-bold mb-6'>
					WELCOME TO LOFTE-3
				</h2>

				<p className='text-gray-400 max-w-2xl mx-auto mb-10'>
					Africa's leading Web3 IRL event platform.
				</p>

				<div className='flex justify-center gap-6 flex-wrap'>
					<div className='text-gold text-3xl flex items-center gap-2'>
						Crypto <Coins />
					</div>
					<div className='text-gold text-3xl flex items-center gap-2'>
						Beyond <Coins />
					</div>
					<div className='text-gold text-3xl'>Screen</div>
				</div>
			</section>

			{/* FEATURED EVENT */}
			<section id='featured' className='py-20'>
				<div className='container mx-auto px-4 max-w-4xl'>
					<div className='border border-gold p-8 rounded-xl'>
						<h3 className='text-3xl font-bold mb-4'>
							{featuredEvent.title}
						</h3>

						<p className='text-gray-400 mb-6'>
							{featuredEvent.description}
						</p>

						<div className='grid grid-cols-3 gap-4 mb-6 text-sm'>
							<div>{featuredEvent.date}</div>
							<div>{featuredEvent.location}</div>
							<div>{featuredEvent.attendees}+ Attendees</div>
						</div>

						<button
							onClick={() => setIsTicketModalOpen(true)}
							className='bg-gold text-black px-6 py-3 rounded-lg font-bold'
						>
							Get Tickets
						</button>
					</div>
				</div>
			</section>

			{/* UPCOMING EVENTS */}
			<section id='events' className='py-20'>
				<div className='container mx-auto px-4'>
					<h2 className='text-4xl font-bold text-center mb-16'>
						Upcoming Events
					</h2>

					<div className='grid md:grid-cols-2 gap-10'>
						<div className='border border-gold p-6 rounded-xl'>
							<h3 className='text-2xl font-bold mb-4'>
								LOFTE-3 Dinner Event
							</h3>

							<p className='text-gray-400 mb-6'>
								Premium Web3 networking dinner.
							</p>

							<div className='space-y-2 mb-6 text-sm'>
								<div className='flex items-center gap-2'>
									<Calendar className='w-4' /> March 27, 2026
								</div>
								<div className='flex items-center gap-2'>
									<MapPin className='w-4' /> Lagos
								</div>
							</div>

							<div className='flex gap-4'>
								<button
									onClick={() => setIsTicketModalOpen(true)}
									className='flex-1 border border-gold text-gold py-2 rounded-lg'
								>
									Tickets
								</button>

								<button
									onClick={() => openLink(calendlyLink)}
									className='flex-1 bg-gold text-black py-2 rounded-lg'
								>
									Sponsor
								</button>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className='py-20 text-center'>
				<h2 className='text-4xl font-bold mb-6'>
					Ready to Experience Web3?
				</h2>

				<button
					onClick={() => setIsTicketModalOpen(true)}
					className='px-10 py-4 bg-gold text-black font-bold rounded-lg'
				>
					Claim Tickets
				</button>
			</section>

			{/* PREVIOUS EVENTS */}
			<div className='text-center pb-20'>
				<Link href='/previous-events'>
					<button className='px-8 py-3 border border-gold text-gold rounded-full flex items-center gap-2 mx-auto'>
						<History className='w-4' />
						Previous Events
						<ChevronRight className='w-4' />
					</button>
				</Link>
			</div>
		</main>
	)
}
