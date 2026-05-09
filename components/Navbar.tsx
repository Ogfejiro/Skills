// components/Navbar.tsx - UPDATED WITH LIST EVENT BUTTON
'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
	Sparkles,
	Calendar,
	Users,
	Home,
	PlusCircle,
	LogOut,
	User,
	Search,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'

export default function Navbar() {
	const [scrolled, setScrolled] = useState(false)
	const [activeNav, setActiveNav] = useState('home')
	const [showUserMenu, setShowUserMenu] = useState(false)
	const { user, logout, isAuthenticated } = useAuth()
	const router = useRouter()

	const handleLogout = () => {
		logout()
		setShowUserMenu(false)
		router.push('/')
	}

	const handleListEvent = () => {
		if (!isAuthenticated) {
			router.push('/auth/register')
		} else if (user?.role === 'Host') {
			router.push('/dashboard/host')
		} else if (user?.role === 'Admin') {
			router.push('/dashboard/admin')
		} else {
			router.push('/dashboard/user')
		}
	}

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 40)

			const sections = ['home', 'events']
			const currentSection = sections.find((section) => {
				const element = document.getElementById(section)
				if (element) {
					const rect = element.getBoundingClientRect()
					return rect.top <= 100 && rect.bottom >= 100
				}
				return false
			})

			if (currentSection) {
				setActiveNav(currentSection)
			}
		}

		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	const navItems = [
		{
			id: 'home',
			label: 'Home',
			icon: <Home className='w-5 h-5' />,
			href: '/#home',
		},
		{
			id: 'events',
			label: 'Events',
			icon: <Calendar className='w-5 h-5' />,
			href: '#/events',
		},
		{
			id: 'why-attend',
			label: 'Why Attend',
			icon: <Sparkles className='w-5 h-5' />,
			href: '#/why-attend',
		},
		{
			id: 'verify-ticket',
			label: 'Find Ticket',
			icon: <Search className='w-5 h-5' />,
			href: '/verify-ticket',
		},
		{
			id: 'waitlist',
			label: 'Learn More',
			icon: <Users className='w-5 h-5' />,
			href: 'https://x.com/lofte3_?s=11',
			external: true,
		},
	]

	return (
		<>
			{/* DESKTOP NAVBAR */}
			<nav
				className={`hidden md:block sticky top-0 z-50 w-full px-6 py-3 transition-all duration-300
				${
					scrolled
						? 'bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/[0.06]'
						: 'bg-[#0a0a0f]/80 backdrop-blur-lg border-b border-white/[0.04]'
				}`}
			>
				<div className='container mx-auto flex items-center justify-between'>
					{/* LOGO */}
					<Link href='/' className='flex items-center gap-3'>
						<div className='relative w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-[#c9a227] to-[#a8861e] rounded-lg flex items-center justify-center overflow-hidden'>
							<Image
								src='/images/image0.jpeg'
								alt='LOFTE-3 Logo'
								width={32}
								height={32}
								className='object-contain w-7 h-7 md:w-8 md:h-8'
								priority
							/>
						</div>
						<div>
							<div className='text-xl md:text-2xl font-black tracking-tight'>
								<span className='text-white'>LO</span>
								<span className='text-[#c9a227]'>FTE-3</span>
							</div>
						</div>
					</Link>

					{/* DESKTOP NAV */}
					<div className='flex items-center gap-1'>
						{navItems.map((item) => (
							<a
								key={item.id}
								href={item.href}
								target={item.external ? '_blank' : undefined}
								rel={
									item.external
										? 'noopener noreferrer'
										: undefined
								}
								className='px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white transition-colors'
							>
								{item.label}
							</a>
						))}

						{/* LIST EVENT BUTTON */}
						<button
							onClick={handleListEvent}
							className='flex items-center gap-2 px-5 py-2 bg-[#c9a227] text-black font-semibold rounded-lg hover:bg-[#d4b84a] transition-colors text-sm'
						>
							<PlusCircle className='w-4 h-4' />
							<span>List Event</span>
						</button>

						{/* USER MENU */}
						{isAuthenticated && user ? (
							<div className='relative'>
								<button
									onClick={() =>
										setShowUserMenu(!showUserMenu)
									}
									className='flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors'
								>
									<div className='w-7 h-7 bg-[#c9a227] rounded-full flex items-center justify-center text-black font-bold text-xs'>
										{user.firstName.charAt(0)}
										{user.lastName.charAt(0)}
									</div>
									<span className='text-sm text-gray-300 font-medium'>
										{user.firstName}
									</span>
								</button>

								{/* USER DROPDOWN MENU */}
								{showUserMenu && (
									<motion.div
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										className='absolute right-0 mt-2 w-48 bg-[#111118] border border-white/[0.08] rounded-lg shadow-xl overflow-hidden z-50'
									>
										<div className='px-4 py-3 border-b border-white/[0.06]'>
											<p className='text-sm font-medium text-white'>
												{user.firstName} {user.lastName}
											</p>
											<p className='text-xs text-gray-500'>
												{user.email}
											</p>
										</div>

										<div className='py-1'>
											<Link
												href='/dashboard'
												className='flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors'
												onClick={() =>
													setShowUserMenu(false)
												}
											>
												<User className='w-4 h-4' />
												Dashboard
											</Link>

											<Link
												href={user.role === 'Host' ? '/dashboard/profile' : '/dashboard/user/settings'}
												className='flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors'
												onClick={() =>
													setShowUserMenu(false)
												}
											>
												<User className='w-4 h-4' />
												Settings
											</Link>

											<button
												onClick={handleLogout}
												className='w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400/80 hover:text-red-400 hover:bg-red-500/5 transition-colors'
											>
												<LogOut className='w-4 h-4' />
												Logout
											</button>
										</div>
									</motion.div>
								)}
							</div>
						) : null}
					</div>
				</div>
			</nav>

			{/* MOBILE BOTTOM NAVIGATION */}
			<nav className='md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-lg border-t border-white/[0.06]'>
				<div className='flex items-center justify-around px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]'>
					{navItems.map((item) => (
						<a
							key={item.id}
							href={item.href}
							target={item.external ? '_blank' : undefined}
							rel={
								item.external
									? 'noopener noreferrer'
									: undefined
							}
							onClick={() =>
								!item.external && setActiveNav(item.id)
							}
							className='flex flex-col items-center justify-center px-3 py-1.5'
						>
							<div
								className={`transition-colors ${
									activeNav === item.id
										? 'text-[#c9a227]'
										: 'text-gray-500'
								}`}
							>
								{item.icon}
							</div>
							<span
								className={`text-[10px] mt-1 ${
									activeNav === item.id
										? 'text-[#c9a227] font-medium'
										: 'text-gray-500'
								}`}
							>
								{item.label}
							</span>
						</a>
					))}

					{/* MOBILE LIST EVENT BUTTON */}
					<button
						onClick={handleListEvent}
						className='flex flex-col items-center justify-center px-3 py-1.5'
					>
						<div className='w-10 h-10 rounded-full bg-[#c9a227] flex items-center justify-center -mt-4 shadow-lg shadow-[#c9a227]/20'>
							<PlusCircle className='w-5 h-5 text-black' />
						</div>
						<span className='text-[10px] mt-1 text-[#c9a227] font-medium'>
							List
						</span>
					</button>
				</div>
			</nav>

			{/* MOBILE TOP BAR */}
			<div className='md:hidden fixed top-0 left-0 right-0 z-40 bg-[#0a0a0f]/95 backdrop-blur-lg border-b border-white/[0.06] py-3 px-4'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-3'>
						<div className='relative w-10 h-10 bg-gradient-to-br from-gold to-gold/70 rounded-xl flex items-center justify-center overflow-hidden'>
							<div className='relative w-8 h-8'>
								<Image
									src='/images/image0.jpeg'
									alt='LoFT3 Logo'
									width={32}
									height={32}
									className='object-contain'
									priority
								/>
							</div>
						</div>
						<div>
							<div className='text-gold font-extrabold tracking-wider text-xl'>
								<span className='text-white'>LO</span>FTE
								<span className='text-gold'>-3</span>
							</div>
							<p className='text-xs text-gray-400 tracking-wider'>
								EVENTS
							</p>
						</div>
					</div>

					{/* User profile or login */}
					<div className='flex items-center gap-2'>
						{isAuthenticated && user ? (
							<button
								onClick={() =>
									setShowUserMenu(!showUserMenu)
								}
								className='flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/20'
							>
								<div className='w-7 h-7 bg-gradient-to-br from-gold to-yellow-600 rounded-full flex items-center justify-center text-black font-bold text-xs'>
									{user.firstName.charAt(0)}
									{user.lastName.charAt(0)}
								</div>
								<span className='text-sm text-gold font-medium max-w-[80px] truncate'>
									{user.firstName}
								</span>
							</button>
						) : (
							<Link
								href='/auth/login'
								className='px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-sm text-gold font-medium'
							>
								Sign In
							</Link>
						)}
					</div>
				</div>

				{/* Mobile user dropdown */}
				{showUserMenu && isAuthenticated && user && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className='absolute right-4 top-16 w-48 bg-black border border-gold/20 rounded-lg shadow-lg shadow-gold/10 overflow-hidden z-50'
					>
						<div className='px-4 py-3 border-b border-gold/20'>
							<p className='text-sm font-medium text-white'>
								{user.firstName} {user.lastName}
							</p>
							<p className='text-xs text-gray-400'>
								{user.email}
							</p>
						</div>
						<div className='py-2'>
							<Link
								href='/dashboard'
								className='flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-gold hover:bg-gold/10 transition-all'
								onClick={() => setShowUserMenu(false)}
							>
								<User className='w-4 h-4' />
								Dashboard
							</Link>
							<Link
								href={user.role === 'Host' ? '/dashboard/profile' : '/dashboard/user/settings'}
								className='flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-gold hover:bg-gold/10 transition-all'
								onClick={() => setShowUserMenu(false)}
							>
								<User className='w-4 h-4' />
								Profile
							</Link>
							<button
								onClick={handleLogout}
								className='w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all'
							>
								<LogOut className='w-4 h-4' />
								Logout
							</button>
						</div>
					</motion.div>
				)}
			</div>

			{/* Spacer for mobile bottom nav */}
			<div className='md:hidden h-20' />
		</>
	)
}
