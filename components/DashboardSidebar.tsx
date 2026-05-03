'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import {
	LayoutDashboard,
	Calendar,
	Ticket,
	Settings,
	LogOut,
	PlusCircle,
	DollarSign,
	Zap,
	ChevronLeft,
	ChevronRight,
	User,
	Home,
	BarChart3,
	Menu,
	X,
} from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface NavItem {
	label: string
	href: string
	icon: React.ReactNode
	badge?: string
}

export default function DashboardSidebar() {
	const { user, logout, hostProfile: hostProfileCache } = useAuth()
	const pathname = usePathname()
	const router = useRouter()
	const [collapsed, setCollapsed] = useState(false)
	const [mobileOpen, setMobileOpen] = useState(false)

	const isAdmin = user?.role === 'Admin'
	const hasHostProfile = hostProfileCache.hasProfile

	const userNavItems: NavItem[] = [
		{
			label: 'Dashboard',
			href: '/dashboard/user',
			icon: <LayoutDashboard className='w-5 h-5' />,
		},
		{
			label: 'Browse Events',
			href: '/events',
			icon: <Calendar className='w-5 h-5' />,
		},
		{
			label: 'My Tickets',
			href: '/tickets',
			icon: <Ticket className='w-5 h-5' />,
		},
		{
			label: 'Settings',
			href: '/dashboard/user/settings',
			icon: <Settings className='w-5 h-5' />,
		},
	]

	const hostNavItems: NavItem[] = [
		{
			label: 'Dashboard',
			href: '/dashboard/host',
			icon: <LayoutDashboard className='w-5 h-5' />,
		},
		{
			label: 'Create Event',
			href: '/dashboard/events/create',
			icon: <PlusCircle className='w-5 h-5' />,
		},
		{
			label: 'Browse Events',
			href: '/events',
			icon: <Calendar className='w-5 h-5' />,
		},
		{
			label: 'Settings',
			href: '/dashboard/host-settings',
			icon: <Settings className='w-5 h-5' />,
		},
	]

	const adminNavItems: NavItem[] = [
		{
			label: 'Dashboard',
			href: '/dashboard/admin',
			icon: <LayoutDashboard className='w-5 h-5' />,
		},
		{
			label: 'Browse Events',
			href: '/events',
			icon: <Calendar className='w-5 h-5' />,
		},
		{
			label: 'Settings',
			href: '/dashboard/user/settings',
			icon: <Settings className='w-5 h-5' />,
		},
	]

	const isOnHostDashboard =
		pathname.startsWith('/dashboard/host') ||
		pathname.startsWith('/dashboard/events') ||
		pathname.startsWith('/dashboard/host-settings')
	const navItems = isAdmin
		? adminNavItems
		: isOnHostDashboard && hasHostProfile
			? hostNavItems
			: userNavItems

	const handleLogout = () => {
		logout()
		toast.success('Logged out successfully')
		router.push('/')
	}

	const switchRole = () => {
		// If currently on host dashboard, switch to user
		if (pathname.startsWith('/dashboard/host')) {
			router.push('/dashboard/user')
		} else if (hasHostProfile) {
			// Has host profile - go to host dashboard
			router.push('/dashboard/host')
		} else {
			// No host profile - go to host settings to create one
			router.push('/dashboard/host-settings?create=true')
		}
	}

	const isActive = (href: string) => pathname === href

	const SidebarContent = () => (
		<div className='flex flex-col h-full'>
			{/* Logo */}
			<div className='p-4 border-b border-white/[0.06]'>
				<Link href='/' className='flex items-center gap-3'>
					<div className='relative w-9 h-9 bg-gradient-to-br from-[#c9a227] to-[#a8861e] rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0'>
						<Image
							src='/images/image0.jpeg'
							alt='LOFTE-3'
							width={28}
							height={28}
							className='object-contain'
							priority
						/>
					</div>
					{!collapsed && (
						<div className='text-lg font-black tracking-tight'>
							<span className='text-white'>LO</span>
							<span className='text-[#c9a227]'>FTE-3</span>
						</div>
					)}
				</Link>
			</div>

			{/* User info */}
			<div
				className={`p-4 border-b border-white/[0.06] ${collapsed ? 'flex justify-center' : ''}`}
			>
				{collapsed ? (
					<div className='w-9 h-9 bg-gradient-to-br from-[#c9a227] to-[#a8861e] rounded-full flex items-center justify-center text-black font-bold text-sm'>
						{user?.firstName?.charAt(0)}
						{user?.lastName?.charAt(0)}
					</div>
				) : (
					<div className='flex items-center gap-3'>
						<div className='w-10 h-10 bg-gradient-to-br from-[#c9a227] to-[#a8861e] rounded-full flex items-center justify-center text-black font-bold text-sm flex-shrink-0'>
							{user?.firstName?.charAt(0)}
							{user?.lastName?.charAt(0)}
						</div>
						<div className='min-w-0'>
							<p className='text-sm font-semibold text-white truncate'>
								{user?.firstName} {user?.lastName}
							</p>
							<p className='text-xs text-gray-500 truncate'>
								{user?.email}
							</p>
							<span className='inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-[#c9a227]/15 text-[#c9a227] border border-[#c9a227]/20'>
								{user?.role || 'User'}
							</span>
						</div>
					</div>
				)}
			</div>

			{/* Navigation */}
			<nav className='flex-1 p-3 space-y-1 overflow-y-auto'>
				{navItems.map((item) => (
					<Link
						key={item.href}
						href={item.href}
						onClick={() => setMobileOpen(false)}
						className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
							isActive(item.href)
								? 'bg-[#c9a227]/15 text-[#c9a227] border border-[#c9a227]/20'
								: 'text-gray-400 hover:text-white hover:bg-white/5'
						} ${collapsed ? 'justify-center' : ''}`}
						title={collapsed ? item.label : undefined}
					>
						<span className='flex-shrink-0'>{item.icon}</span>
						{!collapsed && <span>{item.label}</span>}
						{!collapsed && item.badge && (
							<span className='ml-auto px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#c9a227]/20 text-[#c9a227]'>
								{item.badge}
							</span>
						)}
					</Link>
				))}
			</nav>

			{/* Bottom actions */}
			<div className='p-3 border-t border-white/[0.06] space-y-1'>
				{/* Switch role */}
				{!isAdmin && (
					<button
						onClick={switchRole}
						className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 transition-all ${collapsed ? 'justify-center' : ''}`}
						title={
							collapsed
								? pathname.startsWith('/dashboard/host')
									? 'Switch to User'
									: hasHostProfile
										? 'Switch to Host'
										: 'Become a Host'
								: undefined
						}
					>
						<Zap className='w-5 h-5 flex-shrink-0' />
						{!collapsed && (
							<span>
								{pathname.startsWith('/dashboard/host')
									? 'Switch to User'
									: hasHostProfile
										? 'Switch to Host'
										: 'Become a Host'}
							</span>
						)}
					</button>
				)}

				{/* Home */}
				<Link
					href='/'
					className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all ${collapsed ? 'justify-center' : ''}`}
					title={collapsed ? 'Back to Home' : undefined}
				>
					<Home className='w-5 h-5 flex-shrink-0' />
					{!collapsed && <span>Back to Home</span>}
				</Link>

				{/* Logout */}
				<button
					onClick={handleLogout}
					className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all ${collapsed ? 'justify-center' : ''}`}
					title={collapsed ? 'Logout' : undefined}
				>
					<LogOut className='w-5 h-5 flex-shrink-0' />
					{!collapsed && <span>Logout</span>}
				</button>
			</div>

			{/* Collapse toggle - desktop only */}
			<button
				onClick={() => setCollapsed(!collapsed)}
				className='hidden md:flex items-center justify-center p-3 border-t border-white/[0.06] text-gray-500 hover:text-white transition-colors'
			>
				{collapsed ? (
					<ChevronRight className='w-4 h-4' />
				) : (
					<ChevronLeft className='w-4 h-4' />
				)}
			</button>
		</div>
	)

	return (
		<>
			{/* Mobile menu button */}
			<button
				onClick={() => setMobileOpen(true)}
				className='md:hidden fixed top-4 left-4 z-50 p-2 bg-[#111118] border border-white/[0.08] rounded-lg text-gray-400 hover:text-white transition'
			>
				<Menu className='w-5 h-5' />
			</button>

			{/* Mobile overlay */}
			{mobileOpen && (
				<div
					className='md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50'
					onClick={() => setMobileOpen(false)}
				>
					<div
						className='w-72 h-full bg-[#0a0a0f] border-r border-white/[0.06]'
						onClick={(e) => e.stopPropagation()}
					>
						<div className='absolute top-4 right-4'>
							<button
								onClick={() => setMobileOpen(false)}
								className='text-gray-400 hover:text-white'
							>
								<X className='w-5 h-5' />
							</button>
						</div>
						<SidebarContent />
					</div>
				</div>
			)}

			{/* Desktop sidebar */}
			<aside
				className={`hidden md:flex flex-col fixed left-0 top-0 h-screen bg-[#0a0a0f] border-r border-white/[0.06] z-40 transition-all duration-300 ${
					collapsed ? 'w-[72px]' : 'w-64'
				}`}
			>
				<SidebarContent />
			</aside>

			{/* Spacer for content */}
			<div
				className={`hidden md:block flex-shrink-0 transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-64'}`}
			/>
		</>
	)
}
