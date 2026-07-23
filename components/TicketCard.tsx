'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
	Download,
	Share2,
	Calendar,
	User,
	Coins,
	MapPin,
	CheckCircle,
	AlertCircle,
} from 'lucide-react'
import { toPng } from 'html-to-image'
import { showNotification } from '@/lib/showNotification'

export interface TicketCardData {
	ticketId: string
	eventName?: string
	eventDate?: string
	location?: string
	customerEmail: string
	ticketName: string
	amount: number
	currency: string
	status: string
	tx_ref?: string
	purchaseDate?: string
}

interface TicketCardProps {
	ticket: TicketCardData
	/** Show the large VERIFIED/INVALID stamp (used on the Find Ticket page). */
	showVerificationStamp?: boolean
}

/**
 * The actual ticket visual. Rendered twice by TicketCard:
 *  - variant="responsive": what the user sees (landscape on desktop, stacked on mobile)
 *  - variant="landscape":  hidden, always-landscape clone captured for the download image
 * Keeping both in sync guarantees the downloaded PNG matches the on-site ticket.
 */
function TicketVisual({
	ticket,
	showVerificationStamp,
	variant,
}: TicketCardProps & { variant: 'responsive' | 'landscape' }) {
	const isLandscape = variant === 'landscape'

	const containerClass = isLandscape
		? 'flex flex-row w-[900px] bg-[#0c0c14] border border-gold/30 rounded-3xl overflow-hidden shadow-2xl relative'
		: 'flex flex-col md:flex-row bg-[#0c0c14] border border-gold/30 rounded-3xl overflow-hidden shadow-2xl relative transition-all duration-300 hover:border-gold/60'

	return (
		<div className={containerClass}>
			{/* Glow effects */}
			<div className='absolute -top-12 -left-12 w-48 h-48 bg-gold/5 rounded-full blur-3xl pointer-events-none'></div>
			<div className='absolute -bottom-12 -right-12 w-48 h-48 bg-gold/5 rounded-full blur-3xl pointer-events-none'></div>

			{/* LEFT SECTION: Main Ticket Details */}
			<div className='flex-1 p-6 md:p-8 flex flex-col justify-between relative min-w-0'>
				{/* Branding & Status */}
				<div className='flex justify-between items-center mb-6 gap-3'>
					<div className='flex items-center gap-2'>
						<div className='w-2 h-2 rounded-full bg-gold animate-pulse'></div>
						<span className='text-xs md:text-sm font-bold tracking-widest text-gold uppercase'>
							LOFTE ADMISSION PASS
						</span>
					</div>
					<span
						className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
							ticket.status === 'active'
								? 'bg-green-500/10 text-green-400 border border-green-500/20'
								: 'bg-red-500/10 text-red-400 border border-red-500/20'
						}`}
					>
						{ticket.status}
					</span>
				</div>

				{/* Event Name */}
				<div className='mb-6 md:mb-8'>
					<h3 className='text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight'>
						{ticket.eventName || 'Event'}
					</h3>
				</div>

				{/* Ticket Meta Info Grid */}
				<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 text-sm mb-6'>
					<div className='flex items-start gap-3'>
						<Calendar className='w-5 h-5 text-gold flex-shrink-0 mt-0.5' />
						<div>
							<p className='text-xs text-gray-400 uppercase tracking-wider font-semibold'>
								Date & Time
							</p>
							<p className='text-white font-medium mt-0.5'>
								{ticket.eventDate || 'N/A'}
							</p>
						</div>
					</div>

					<div className='flex items-start gap-3'>
						<MapPin className='w-5 h-5 text-gold flex-shrink-0 mt-0.5' />
						<div>
							<p className='text-xs text-gray-400 uppercase tracking-wider font-semibold'>
								Venue
							</p>
							<p className='text-white font-medium mt-0.5 break-words'>
								{ticket.location || 'No location specified'}
							</p>
						</div>
					</div>

					<div className='flex items-start gap-3'>
						<User className='w-5 h-5 text-gold flex-shrink-0 mt-0.5' />
						<div>
							<p className='text-xs text-gray-400 uppercase tracking-wider font-semibold'>
								Attendee
							</p>
							<p className='text-white font-medium mt-0.5 truncate'>
								{ticket.customerEmail}
							</p>
						</div>
					</div>

					<div className='flex items-start gap-3'>
						<Coins className='w-5 h-5 text-gold flex-shrink-0 mt-0.5' />
						<div>
							<p className='text-xs text-gray-400 uppercase tracking-wider font-semibold'>
								Ticket Class & Price
							</p>
							<p className='text-white font-bold mt-0.5 flex items-center gap-1.5'>
								<span className='px-2 py-0.5 bg-gold/10 text-gold rounded border border-gold/25 text-xs font-semibold uppercase'>
									{ticket.ticketName}
								</span>
								<span className='text-gold'>
									{ticket.currency === 'NGN' ? '₦' : '$'}
									{Number(ticket.amount || 0).toLocaleString()}
								</span>
							</p>
						</div>
					</div>
				</div>

				{/* Purchase timestamp & Tx Ref */}
				<div className='text-[10px] text-gray-500 uppercase tracking-wider border-t border-white/5 pt-4 flex flex-col sm:flex-row justify-between gap-2'>
					<div className='flex items-center gap-1'>
						<span>LOFTE PASS</span>
						{ticket.tx_ref && (
							<>
								<span>•</span>
								<span className='font-mono text-gray-400 text-[9px] lowercase break-all'>
									REF: {ticket.tx_ref}
								</span>
							</>
						)}
					</div>
					<span>
						PURCHASED:{' '}
						{ticket.purchaseDate
							? new Date(ticket.purchaseDate).toLocaleDateString()
							: new Date().toLocaleDateString()}
					</span>
				</div>
			</div>

			{/* TICKET DIVIDER */}
			<div
				className={`relative flex items-center justify-center ${
					isLandscape ? 'flex-col' : 'md:flex-col py-4 md:py-0'
				}`}
			>
				{isLandscape ? (
					<>
						<div className='absolute -top-4 w-8 h-8 bg-black rounded-full border border-gold/30 z-10'></div>
						<div className='absolute -bottom-4 w-8 h-8 bg-black rounded-full border border-gold/30 z-10'></div>
						<div className='w-[1px] h-[80%] border-r border-dashed border-gold/30'></div>
					</>
				) : (
					<>
						{/* Desktop Circular Cutouts (Top and Bottom) */}
						<div className='hidden md:block absolute -top-4 w-8 h-8 bg-black rounded-full border border-gold/30 z-10'></div>
						<div className='hidden md:block absolute -bottom-4 w-8 h-8 bg-black rounded-full border border-gold/30 z-10'></div>
						{/* Mobile Circular Cutouts (Left and Right) */}
						<div className='md:hidden absolute -left-4 w-8 h-8 bg-black rounded-full border border-gold/30 z-10'></div>
						<div className='md:hidden absolute -right-4 w-8 h-8 bg-black rounded-full border border-gold/30 z-10'></div>
						{/* Perforation Line */}
						<div className='w-full md:w-[1px] h-[1px] md:h-[80%] border-t md:border-t-0 md:border-r border-dashed border-gold/30'></div>
					</>
				)}
			</div>

			{/* RIGHT SECTION: Stub / QR */}
			<div
				className={`p-6 md:p-8 flex flex-col items-center justify-between bg-black/40 relative ${
					isLandscape ? 'w-80' : 'w-full md:w-80'
				}`}
			>
				<div className='flex flex-col items-center flex-1 justify-center w-full'>
					<div className='relative p-3 bg-white rounded-2xl shadow-inner mb-4'>
						<img
							src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.ticketId}`}
							alt='Ticket QR Code'
							crossOrigin='anonymous'
							className='w-32 h-32 md:w-36 md:h-36 rounded-lg'
						/>
					</div>

					{showVerificationStamp && (
						<div
							className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 font-black uppercase text-sm tracking-widest mb-4 ${
								ticket.status === 'active'
									? 'bg-green-500/10 text-green-400 border-green-500/40 rotate-[-3deg]'
									: 'bg-red-500/10 text-red-400 border-red-500/40 rotate-[3deg]'
							}`}
						>
							{ticket.status === 'active' ? (
								<>
									<CheckCircle className='w-4 h-4' />
									<span>VERIFIED</span>
								</>
							) : (
								<>
									<AlertCircle className='w-4 h-4' />
									<span>INVALID</span>
								</>
							)}
						</div>
					)}

					<span className='font-mono text-xs text-gold/80 font-semibold uppercase tracking-widest bg-gold/5 border border-gold/15 rounded px-2.5 py-1 mb-2'>
						{ticket.ticketId}
					</span>
					<p className='text-[10px] text-gray-400 uppercase tracking-widest font-semibold text-center'>
						{showVerificationStamp
							? 'TICKET VERIFICATION SYSTEM'
							: 'PRESENT QR CODE AT ENTRY'}
					</p>
				</div>
			</div>
		</div>
	)
}

export default function TicketCard({
	ticket,
	showVerificationStamp = false,
}: TicketCardProps) {
	// Hidden, always-landscape node that we rasterize for the download.
	const captureRef = useRef<HTMLDivElement>(null)
	const [downloading, setDownloading] = useState(false)

	const fileName = `lofte-ticket-${ticket.ticketId}.png`

	const downloadTicket = async () => {
		if (!captureRef.current || downloading) return
		setDownloading(true)
		try {
			const dataUrl = await toPng(captureRef.current, {
				pixelRatio: 2, // crisp, high-resolution export
				cacheBust: true,
				backgroundColor: '#000000',
			})
			const link = document.createElement('a')
			link.download = fileName
			link.href = dataUrl
			link.click()
			showNotification({ type: 'success', message: 'Ticket downloaded' })
		} catch (err) {
			console.error('Failed to download ticket:', err)
			showNotification({
				type: 'error',
				message: 'Could not download ticket. Please try again.',
			})
		} finally {
			setDownloading(false)
		}
	}

	const shareTicket = async () => {
		const shareUrl =
			typeof window !== 'undefined' ? window.location.href : ''
		const shareData = {
			title: `LOFTE Ticket — ${ticket.eventName || 'Event'}`,
			text: `Here is my ticket for ${ticket.eventName || 'the event'}.`,
			url: shareUrl,
		}
		try {
			if (typeof navigator !== 'undefined' && navigator.share) {
				await navigator.share(shareData)
			} else if (
				typeof navigator !== 'undefined' &&
				navigator.clipboard &&
				shareUrl
			) {
				await navigator.clipboard.writeText(shareUrl)
				showNotification({
					type: 'success',
					message: 'Ticket link copied to clipboard',
				})
			} else {
				showNotification({
					type: 'info',
					message: 'Sharing is not supported on this device',
				})
			}
		} catch (err: any) {
			if (err?.name !== 'AbortError') {
				console.error('Failed to share ticket:', err)
			}
		}
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className='relative max-w-4xl mx-auto w-full group'
		>
			{/* Visible, responsive ticket */}
			<TicketVisual
				ticket={ticket}
				showVerificationStamp={showVerificationStamp}
				variant='responsive'
			/>

			{/* Actions (excluded from the downloaded image) */}
			<div className='flex gap-2.5 mt-4 max-w-md mx-auto'>
				<button
					onClick={downloadTicket}
					disabled={downloading}
					className='flex-1 py-2.5 bg-gold text-black rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 text-xs md:text-sm shadow-lg shadow-gold/10 disabled:opacity-60 disabled:cursor-not-allowed'
				>
					{downloading ? (
						<>
							<div className='w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin' />
							<span>Preparing…</span>
						</>
					) : (
						<>
							<Download className='w-4 h-4' />
							<span>Download</span>
						</>
					)}
				</button>
				<button
					onClick={shareTicket}
					className='flex-1 py-2.5 bg-gray-900 border border-gold/25 text-gold rounded-xl font-bold hover:bg-gold/10 transition-all flex items-center justify-center gap-2 text-xs md:text-sm'
				>
					<Share2 className='w-4 h-4' />
					<span>Share</span>
				</button>
			</div>

			{/* Off-screen landscape clone used only for the download capture */}
			<div
				aria-hidden='true'
				style={{
					position: 'absolute',
					top: 0,
					left: '-10000px',
					pointerEvents: 'none',
				}}
			>
				<div ref={captureRef}>
					<TicketVisual
						ticket={ticket}
						showVerificationStamp={showVerificationStamp}
						variant='landscape'
					/>
				</div>
			</div>
		</motion.div>
	)
}
