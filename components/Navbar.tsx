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
						? 'bg-black backdrop-blur-xl border-b border-gold/20 shadow-2xl shadow-gold/5'
						: 'bg-black/80 backdrop-blur-lg border-b border-gold/10'
				}`}
			>
				<div className='container mx-auto flex items-center justify-between'>
					{/* LOGO */}
					<div className='flex items-center gap-3'>
						<div className='relative'>
							<div className='relative w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-gold to-gold/70 rounded-xl flex items-center justify-center overflow-hidden'>
								<div className='relative w-8 h-8 md:w-10 md:h-10'>
									<Image
										src='/images/hds.jpg'
										alt='LOFTE-3 Logo'
										width={32}
										height={32}
										className='object-contain'
										priority
									/>
								</div>
							</div>
							<motion.div
								animate={{ rotate: 360 }}
								transition={{
									duration: 20,
									repeat: Infinity,
									ease: 'linear',
								}}
								className='absolute -inset-2 border border-gold/30 rounded-full'
							/>
						</div>
						<div>
							<div className='text-gold font-extrabold tracking-wider text-xl md:text-2xl'>
								<span className='text-white'>LO</span>FTE
								<span className='text-gold'>-3</span>
							</div>
							<p className='text-xs text-gray-400 tracking-wider'>
								WEB3 EVENTS
							</p>
						</div>
					</div>

					{/* DESKTOP NAV */}
					<div className='flex items-center gap-6'>
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
								className='flex items-center gap-2 px-4 py-2 rounded-lg text-sm uppercase tracking-wider text-gray-300 hover:text-gold hover:bg-gold/5 transition-all group relative'
							>
								<span className='opacity-60 group-hover:opacity-100 transition'>
									{item.icon}
								</span>
								{item.label}
								<span className='absolute bottom-0 left-1/2 w-0 h-0.5 bg-gold group-hover:w-8 group-hover:left-1/4 transition-all duration-300' />
							</a>
						))}

						{/* LIST EVENT BUTTON */}
						<button
							onClick={handleListEvent}
							className='flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gold to-yellow-500 text-black font-bold rounded-lg hover:shadow-lg hover:shadow-gold/30 transition-all text-sm uppercase tracking-wider group relative overflow-hidden'
						>
							<div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000' />
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
									className='flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gold/10 transition-all'
								>
									<div className='w-8 h-8 bg-gradient-to-br from-gold to-yellow-600 rounded-full flex items-center justify-center text-black font-bold text-sm'>
										{user.firstName.charAt(0)}
										{user.lastName.charAt(0)}
									</div>
									<span className='text-sm text-gold font-medium'>
										{user.firstName}
									</span>
								</button>

								{/* USER DROPDOWN MENU */}
								{showUserMenu && (
									<motion.div
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										className='absolute right-0 mt-2 w-48 bg-black border border-gold/20 rounded-lg shadow-lg shadow-gold/10 overflow-hidden z-50'
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
												onClick={() =>
													setShowUserMenu(false)
												}
											>
												<User className='w-4 h-4' />
												Dashboard
											</Link>

											<Link
												href='/dashboard/profile'
												className='flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-gold hover:bg-gold/10 transition-all'
												onClick={() =>
													setShowUserMenu(false)
												}
											>
												<User className='w-4 h-4' />
												Settings / Profile
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
						) : null}
					</div>
				</div>
			</nav>

			{/* MOBILE BOTTOM NAVIGATION */}
			<nav className='md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-gold/20 shadow-2xl shadow-gold/10'>
				<div className='flex items-center justify-around px-4 py-3'>
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
							className='flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all'
						>
							<div
								className={`p-2 rounded-full transition-all ${
									activeNav === item.id
										? 'bg-gold/20 border border-gold/30'
										: 'border border-transparent'
								}`}
							>
								<div
									className={`transition-all ${
										activeNav === item.id
											? 'text-gold'
											: 'text-gray-400'
									}`}
								>
									{item.icon}
								</div>
							</div>
							<span
								className={`text-xs mt-1 transition-all ${
									activeNav === item.id
										? 'text-gold font-medium'
										: 'text-gray-400'
								}`}
							>
								{item.label}
							</span>

							{activeNav === item.id && (
								<motion.div
									layoutId='activeIndicator'
									className='w-1 h-1 bg-gold rounded-full mt-1'
									transition={{
										type: 'spring',
										stiffness: 300,
										damping: 20,
									}}
								/>
							)}
						</a>
					))}

					{/* MOBILE LIST EVENT BUTTON */}
					<button
						onClick={handleListEvent}
						className='flex flex-col items-center justify-center px-3 py-2 relative'
					>
						<div className='p-2 rounded-full bg-gradient-to-r from-gold to-yellow-500 border border-gold/30'>
							<PlusCircle className='w-5 h-5 text-black' />
						</div>
						<span className='text-xs mt-1 text-gold font-medium'>
							List
						</span>

						{/* Live indicator - optional */}
						<div className='relative'>
							{isAuthenticated && user && (
								<button
									onClick={() =>
										setShowUserMenu(!showUserMenu)
									}
									className='flex items-center gap-2'
								>
									<div className='w-8 h-8 bg-gradient-to-br from-gold to-yellow-600 rounded-full flex items-center justify-center text-black font-bold text-sm'>
										{user.firstName.charAt(0)}
										{user.lastName.charAt(0)}
									</div>
								</button>
							)}

							{/* MOBILE USER DROPDOWN */}
							{showUserMenu && user && (
								<div className='absolute right-0 mt-2 w-48 bg-black border border-gold/20 rounded-lg shadow-lg shadow-gold/10 overflow-hidden z-50'>
									{/* USER INFO */}
									<div className='px-4 py-3 border-b border-gold/20'>
										<p className='text-sm font-medium text-white'>
											{user.firstName} {user.lastName}
										</p>
										<p className='text-xs text-gray-400'>
											{user.email}
										</p>
									</div>

									{/* MENU ITEMS */}
									<div className='py-2'>
										<Link
											href='/dashboard'
											className='flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-gold hover:bg-gold/10 transition-all'
											onClick={() =>
												setShowUserMenu(false)
											}
										>
											<User className='w-4 h-4' />
											Dashboard
										</Link>

										<Link
											href='/dashboard/profile'
											className='flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-gold hover:bg-gold/10 transition-all'
											onClick={() =>
												setShowUserMenu(false)
											}
										>
											<User className='w-4 h-4' />
											Settings / Profile
										</Link>

										<button
											onClick={handleLogout}
											className='w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all'
										>
											<LogOut className='w-4 h-4' />
											Logout
										</button>
									</div>
								</div>
							)}
						</div>
					</button>
				</div>
			</nav>

			{/* MOBILE TOP BAR */}
			<div className='md:hidden fixed top-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-lg border-b border-gold/10 py-3 px-4'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-3'>
						<div className='relative w-10 h-10 bg-gradient-to-br from-gold to-gold/70 rounded-xl flex items-center justify-center overflow-hidden'>
							<div className='relative w-8 h-8'>
								<Image
									src='/images/hds.jpg'
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
								WEB3 EVENTS
							</p>
						</div>
					</div>

					<div className='flex items-center gap-2'>
						<div className='px-2 py-1 rounded-full bg-red-500/20 border border-red-500/30'>
							<span className='text-xs text-red-400 font-bold'>
								LIVE
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Spacer for mobile bottom nav */}
			<div className='md:hidden h-35' />
		</>
	)
}
