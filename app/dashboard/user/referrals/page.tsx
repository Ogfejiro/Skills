'use client'

import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
	Loader2,
	Copy,
	Check,
	Users,
	DollarSign,
	Gift,
	Share2,
	AlertCircle,
	Wallet,
	X,
} from 'lucide-react'
import DashboardSidebar from '@/components/DashboardSidebar'
import referralService, {
	Referee,
	Commission,
	ReferralOverview,
} from '@/app/services/referralService'
import { toast } from 'sonner'

type WithdrawalMethod = 'bank' | 'crypto'

export default function ReferralsPage() {
	const { user, isAuthenticated, loading: authLoading, token } = useAuth()
	const router = useRouter()

	const [loading, setLoading] = useState(true)
	const [overview, setOverview] = useState<ReferralOverview | null>(null)
	const [referees, setReferees] = useState<Referee[]>([])
	const [commissions, setCommissions] = useState<Commission[]>([])
	const [error, setError] = useState('')
	const [copiedField, setCopiedField] = useState<'id' | 'link' | null>(null)
	const [activeTab, setActiveTab] = useState<'list' | 'commissions'>('list')

	const [showWithdrawal, setShowWithdrawal] = useState(false)
	const [withdrawalMethod, setWithdrawalMethod] =
		useState<WithdrawalMethod>('bank')
	const [withdrawalAmount, setWithdrawalAmount] = useState('')
	const [withdrawing, setWithdrawing] = useState(false)
	const [bankDetails, setBankDetails] = useState({
		bankName: '',
		accountName: '',
		accountNo: '',
	})
	const [walletType, setWalletType] = useState('SOL')
	const [walletAddress, setWalletAddress] = useState('')

	const refId = overview?.refId || ''

	const referralLink =
		typeof window !== 'undefined' && refId
			? `${window.location.origin}/auth/register?ref=${refId}`
			: ''

	const currencySymbol = '$'
	const MIN_WITHDRAWAL_USD = 5

	const paidCommissions = commissions.filter((c) => c.status === 'rewarded')
	const pendingCommissions = commissions.filter(
		(c) => c.status !== 'rewarded',
	)

	useEffect(() => {
		if (authLoading) return

		if (!isAuthenticated) {
			router.push('/auth/login')
			return
		}

		const fetchReferralData = async () => {
			try {
				if (!token) return
				setLoading(true)
				setError('')

				const [overviewRes, refereesRes, commissionsRes] =
					await Promise.all([
						referralService.getMyOverview(token),
						referralService.getMyReferees(token, 1, 100),
						referralService.getMyCommissions(token, 1, 100),
					])

				setOverview(overviewRes)
				setReferees(refereesRes?.referees || [])
				setCommissions(commissionsRes?.entries || [])
			} catch (err: any) {
				setError(err?.message || 'Could not load referral data')
				setOverview(null)
				setReferees([])
				setCommissions([])
			} finally {
				setLoading(false)
			}
		}

		fetchReferralData()
	}, [authLoading, isAuthenticated, token])

	const copyToClipboard = async (text: string, field: 'id' | 'link') => {
		if (!text) return
		try {
			await navigator.clipboard.writeText(text)
			setCopiedField(field)
			setTimeout(() => setCopiedField(null), 2000)
			toast.success(
				field === 'id' ? 'Referral code copied' : 'Link copied',
			)
		} catch (err) {
			toast.error('Could not copy. Please copy manually.')
		}
	}

	const handleShare = async () => {
		if (!referralLink) return
		try {
			if (navigator.share) {
				await navigator.share({
					title: 'Join LOFTE-3',
					text: 'Sign up using my referral link!',
					url: referralLink,
				})
			} else {
				await copyToClipboard(referralLink, 'link')
			}
		} catch (err) {
			console.error('Share failed:', err)
		}
	}

	const openWithdrawalModal = () => {
		setWithdrawalAmount('')
		setWithdrawalMethod('bank')
		setBankDetails({ bankName: '', accountName: '', accountNo: '' })
		setWalletType('SOL')
		setWalletAddress('')
		setShowWithdrawal(true)
	}

	const handleWithdrawalSubmit = async () => {
		if (!token) {
			toast.error('Please sign in again')
			return
		}

		const amount = parseFloat(withdrawalAmount)

		if (!amount || amount <= 0) {
			toast.error('Enter a valid amount')
			return
		}

		if (amount < MIN_WITHDRAWAL_USD) {
			toast.error(`Minimum withdrawal is $${MIN_WITHDRAWAL_USD}`)
			return
		}

		if (amount > (overview?.referralWallet || 0)) {
			toast.error('Amount exceeds your earnings')
			return
		}

		if (withdrawalMethod === 'bank') {
			if (
				!bankDetails.bankName.trim() ||
				!bankDetails.accountName.trim() ||
				!bankDetails.accountNo.trim()
			) {
				toast.error('Fill in all bank details')
				return
			}
		} else {
			if (!walletAddress.trim()) {
				toast.error('Enter your wallet address')
				return
			}
			if (!walletType.trim()) {
				toast.error('Select a wallet type')
				return
			}
		}

		try {
			setWithdrawing(true)
			const res = await referralService.requestWithdrawal(
				{
					amount,
					method: withdrawalMethod,
					paymentInfo:
						withdrawalMethod === 'bank'
							? {
									bankName: bankDetails.bankName.trim(),
									accountName: bankDetails.accountName.trim(),
									accountNo: bankDetails.accountNo.trim(),
								}
							: {
									walletType: walletType.trim(),
									walletAddress: walletAddress.trim(),
								},
				},
				token,
			)

			if (res?.success) {
				toast.success(
					'Withdrawal requested! Funds usually arrive within 24-48 hours.',
				)
				setShowWithdrawal(false)
				// Refresh overview to show updated balance
				const updatedOverview =
					await referralService.getMyOverview(token)
				setOverview(updatedOverview)
			}
		} catch (err: any) {
			toast.error(err?.message || 'Failed to request withdrawal')
		} finally {
			setWithdrawing(false)
		}
	}

	if (authLoading || loading) {
		return (
			<div className='min-h-screen bg-[#0a0a0f] flex'>
				<DashboardSidebar />
				<div className='flex-1 flex items-center justify-center'>
					<Loader2 className='w-10 h-10 text-[#c9a227] animate-spin' />
				</div>
			</div>
		)
	}

	if (!user) return null

	return (
		<div className='min-h-screen bg-[#0a0a0f] text-white flex'>
			<DashboardSidebar />

			<main className='flex-1 min-h-screen'>
				<div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16 md:pt-8'>
					<div className='mb-8'>
						<div className='flex items-center gap-3 mb-2'>
							<Gift className='w-6 h-6 text-[#c9a227]' />
							<h1 className='text-2xl sm:text-3xl font-bold'>
								Referrals
							</h1>
						</div>
						<p className='text-sm text-gray-500'>
							Share your referral link or code and earn for every
							sign-up.
						</p>
					</div>

					{/* Referral Code + Earnings + Link */}
					<div className='bg-[#111118] rounded-xl border border-white/[0.06] p-5 sm:p-6 mb-6'>
						<div className='space-y-5'>
							<div>
								<p className='text-xs text-gray-500 mb-2'>
									Your Referral Code
								</p>
								<div className='flex flex-col lg:flex-row gap-3'>
									<div className='flex-1 flex items-center gap-2 bg-black/40 border border-white/[0.06] rounded-lg p-3'>
										<code className='flex-1 text-[#c9a227] font-mono text-sm truncate'>
											{refId || 'Not available'}
										</code>
										<button
											onClick={() =>
												copyToClipboard(refId, 'id')
											}
											disabled={!refId}
											className='flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-300 bg-white/5 hover:bg-white/10 rounded transition disabled:opacity-40'
											title='Copy code'
										>
											{copiedField === 'id' ? (
												<>
													<Check className='w-3.5 h-3.5 text-green-400' />
													Copied
												</>
											) : (
												<>
													<Copy className='w-3.5 h-3.5' />
													Copy code
												</>
											)}
										</button>
									</div>

									<div className='flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg px-4 py-3 lg:min-w-[200px]'>
										<DollarSign className='w-4 h-4 text-emerald-400 flex-shrink-0' />
										<div className='min-w-0'>
											<p className='text-[10px] uppercase tracking-wide text-gray-400'>
												Available
											</p>
											<p className='text-base font-bold text-emerald-300'>
												{currencySymbol}
												{(
													overview?.referralWallet ||
													0
												).toLocaleString()}
											</p>
										</div>
									</div>
								</div>
								<p className='text-[11px] text-gray-600 mt-1.5'>
									New users can paste this code into the
									Referral Code field at sign-up.
								</p>
							</div>

							<div>
								<p className='text-xs text-gray-500 mb-2'>
									Your Referral URL
								</p>
								<div className='flex items-center gap-2 bg-black/40 border border-white/[0.06] rounded-lg p-3'>
									<code className='flex-1 text-gray-300 font-mono text-xs truncate'>
										{referralLink ||
											'Sign in to view your link'}
									</code>
									<button
										onClick={() =>
											copyToClipboard(
												referralLink,
												'link',
											)
										}
										disabled={!referralLink}
										className='flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-300 bg-white/5 hover:bg-white/10 rounded transition disabled:opacity-40'
										title='Copy URL'
									>
										{copiedField === 'link' ? (
											<>
												<Check className='w-3.5 h-3.5 text-green-400' />
												Copied
											</>
										) : (
											<>
												<Copy className='w-3.5 h-3.5' />
												Copy URL
											</>
										)}
									</button>
								</div>
								<p className='text-[11px] text-gray-600 mt-1.5'>
									Anyone who opens this URL will land on
									sign-up with your code already filled in.
								</p>
							</div>
						</div>

						<div className='mt-5 flex flex-wrap gap-3'>
							<button
								onClick={handleShare}
								disabled={!referralLink}
								className='flex items-center justify-center gap-2 px-5 py-2.5 bg-[#c9a227] hover:bg-[#d4b84a] disabled:opacity-40 text-black font-semibold rounded-lg transition'
							>
								<Share2 className='w-4 h-4' />
								Share Link
							</button>

							<button
								onClick={openWithdrawalModal}
								disabled={(overview?.referralWallet || 0) <= 0}
								className='flex items-center justify-center gap-2 px-5 py-2.5 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10 disabled:opacity-40 disabled:cursor-not-allowed font-semibold rounded-lg transition'
							>
								<Wallet className='w-4 h-4' />
								Withdraw Earnings
							</button>
						</div>
					</div>

					{/* Stats */}
					<div className='grid grid-cols-2 gap-3 mb-6'>
						<div className='bg-[#111118] rounded-xl border border-white/[0.06] p-4'>
							<div className='flex items-center justify-between mb-2'>
								<p className='text-xs text-gray-500'>
									People Referred
								</p>
								<Users className='w-4 h-4 text-[#c9a227]' />
							</div>
							<p className='text-2xl font-bold'>
								{overview?.totalReferred || 0}
							</p>
						</div>

						<div className='bg-[#111118] rounded-xl border border-white/[0.06] p-4'>
							<div className='flex items-center justify-between mb-2'>
								<p className='text-xs text-gray-500'>
									Total Earned
								</p>
								<DollarSign className='w-4 h-4 text-emerald-400' />
							</div>
							<p className='text-2xl font-bold'>
								{currencySymbol}
								{(
									overview?.referralEarningsTotal || 0
								).toLocaleString()}
							</p>
						</div>
					</div>

					{/* List / Commissions Toggle */}
					<div className='bg-[#111118] rounded-xl border border-white/[0.06] overflow-hidden'>
						<div className='p-4 sm:p-5 border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
							<h2 className='text-lg font-semibold flex items-center gap-2'>
								<Users className='w-5 h-5 text-[#c9a227]' />
								{activeTab === 'list'
									? 'People You Referred'
									: 'Commissions Earned'}
							</h2>

							<div className='inline-flex bg-black/40 border border-white/[0.06] rounded-lg p-1'>
								<button
									onClick={() => setActiveTab('list')}
									className={`px-4 py-1.5 text-xs font-semibold rounded-md transition ${
										activeTab === 'list'
											? 'bg-[#c9a227] text-black'
											: 'text-gray-400 hover:text-white'
									}`}
								>
									Referrals
								</button>
								<button
									onClick={() => setActiveTab('commissions')}
									className={`px-4 py-1.5 text-xs font-semibold rounded-md transition ${
										activeTab === 'commissions'
											? 'bg-[#c9a227] text-black'
											: 'text-gray-400 hover:text-white'
									}`}
								>
									Commissions
								</button>
							</div>
						</div>

						{error &&
							referees.length === 0 &&
							commissions.length === 0 && (
								<div className='p-5 flex items-start gap-2 bg-yellow-500/5 border-b border-yellow-500/10'>
									<AlertCircle className='w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5' />
									<p className='text-xs text-yellow-300'>
										{error}
									</p>
								</div>
							)}

						{activeTab === 'list' ? (
							referees.length === 0 ? (
								<div className='p-12 text-center'>
									<Users className='w-10 h-10 text-gray-700 mx-auto mb-3' />
									<p className='text-gray-500 text-sm mb-1'>
										No referrals yet
									</p>
									<p className='text-gray-600 text-xs'>
										Share your link to start earning.
									</p>
								</div>
							) : (
								<div className='divide-y divide-white/[0.04]'>
									{referees.map((referee) => (
										<div
											key={referee.id}
											className='p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.02] transition'
										>
											<div className='min-w-0'>
												<p className='text-sm font-semibold text-white truncate'>
													{referee.firstName &&
													referee.lastName
														? `${referee.firstName} ${referee.lastName}`
														: referee.email}
												</p>
												{referee.email && (
													<p className='text-xs text-gray-500 truncate'>
														{referee.email}
													</p>
												)}
												<p className='text-[11px] text-gray-600 mt-0.5'>
													{new Date(
														referee.joinedAt,
													).toLocaleDateString(
														'en-US',
														{
															month: 'short',
															day: 'numeric',
															year: 'numeric',
														},
													)}
												</p>
											</div>
										</div>
									))}
								</div>
							)
						) : commissions.length === 0 ? (
							<div className='p-12 text-center'>
								<DollarSign className='w-10 h-10 text-gray-700 mx-auto mb-3' />
								<p className='text-gray-500 text-sm mb-1'>
									No commissions yet
								</p>
								<p className='text-gray-600 text-xs'>
									Earnings will appear here once your
									referrals make a purchase.
								</p>
							</div>
						) : (
							<div>
								<div className='grid grid-cols-2 gap-px bg-white/[0.04]'>
									<div className='bg-[#111118] p-4'>
										<p className='text-xs text-gray-500 mb-1'>
											Rewarded
										</p>
										<p className='text-base font-bold text-green-400'>
											{currencySymbol}
											{paidCommissions
												.reduce(
													(sum, c) =>
														sum + (c.amount || 0),
													0,
												)
												.toLocaleString()}
										</p>
									</div>
									<div className='bg-[#111118] p-4'>
										<p className='text-xs text-gray-500 mb-1'>
											Pending
										</p>
										<p className='text-base font-bold text-yellow-400'>
											{currencySymbol}
											{pendingCommissions
												.reduce(
													(sum, c) =>
														sum + (c.amount || 0),
													0,
												)
												.toLocaleString()}
										</p>
									</div>
								</div>

								<div className='divide-y divide-white/[0.04]'>
									{commissions.map((commission) => (
										<div
											key={commission.id}
											className='p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.02] transition'
										>
											<div className='min-w-0'>
												<p className='text-sm font-semibold text-white truncate'>
													{commission.referee
														? `${commission.referee.firstName || ''} ${commission.referee.lastName || ''}`.trim() ||
														  commission.referee
															.email
														: 'Unknown'}
												</p>
												<p className='text-[11px] text-gray-600 mt-0.5'>
													{new Date(
														commission.createdAt,
													).toLocaleDateString(
														'en-US',
														{
															month: 'short',
															day: 'numeric',
															year: 'numeric',
														},
													)}
												</p>
											</div>

											<div className='flex items-center gap-3'>
												<span
													className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${
														commission.status ===
														'rewarded'
															? 'bg-green-500/10 text-green-400 border-green-500/20'
															: commission.status ===
														  'qualified'
														? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
														: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
													}`}
												>
													{commission.status}
												</span>
												<p className='text-sm font-bold text-emerald-400'>
													$
													{(
														commission.amount || 0
													).toLocaleString()}
												</p>
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			</main>

			{/* Withdrawal Modal */}
			{showWithdrawal && (
				<div className='fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
					<div className='bg-[#111118] border border-white/[0.08] rounded-2xl p-6 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto'>
						<div className='flex justify-between items-center mb-1'>
							<h2 className='text-xl font-bold'>
								Withdraw Earnings
							</h2>
							<button
								onClick={() => setShowWithdrawal(false)}
								disabled={withdrawing}
								className='text-gray-400 hover:text-white'
							>
								<X className='w-5 h-5' />
							</button>
						</div>
						<p className='text-sm text-gray-500 mb-6'>
							Available:{' '}
							<span className='font-semibold text-emerald-400'>
								{currencySymbol}
								{(overview?.referralWallet || 0).toLocaleString()}
							</span>
						</p>

						<div className='space-y-4'>
							{/* Method */}
							<div>
								<label className='block text-xs font-medium text-gray-400 mb-2'>
									Withdrawal Method
								</label>
								<div className='grid grid-cols-2 gap-2'>
									<button
										type='button'
										onClick={() =>
											setWithdrawalMethod('bank')
										}
										className={`px-3 py-2 rounded-lg text-sm font-semibold border transition ${
											withdrawalMethod === 'bank'
												? 'bg-[#c9a227]/15 border-[#c9a227]/40 text-[#c9a227]'
												: 'border-white/[0.08] text-gray-400 hover:border-white/[0.15]'
										}`}
									>
										Bank Transfer
									</button>
									<button
										type='button'
										onClick={() =>
											setWithdrawalMethod('crypto')
										}
										className={`px-3 py-2 rounded-lg text-sm font-semibold border transition ${
											withdrawalMethod === 'crypto'
												? 'bg-[#c9a227]/15 border-[#c9a227]/40 text-[#c9a227]'
												: 'border-white/[0.08] text-gray-400 hover:border-white/[0.15]'
										}`}
									>
										Crypto (SOL)
									</button>
								</div>
							</div>

							{/* Amount */}
							<div>
								<label className='block text-xs font-medium text-gray-400 mb-1.5'>
									Amount (USD)
								</label>
								<div className='flex items-center gap-2'>
									<span className='text-gray-500 text-sm'>
										$
									</span>
									<input
										type='number'
										placeholder='50'
										value={withdrawalAmount}
										onChange={(e) =>
											setWithdrawalAmount(e.target.value)
										}
										disabled={withdrawing}
										className='flex-1 px-4 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#c9a227]/50 transition'
									/>
								</div>
								<p className='text-[11px] text-gray-600 mt-1.5'>
									Minimum: ${MIN_WITHDRAWAL_USD}
								</p>
							</div>

							{/* Bank Details */}
							{withdrawalMethod === 'bank' && (
								<div className='space-y-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]'>
									<div>
										<label className='block text-xs font-medium text-gray-400 mb-1.5'>
											Bank Name
										</label>
										<input
											type='text'
											value={bankDetails.bankName}
											onChange={(e) =>
												setBankDetails({
													...bankDetails,
													bankName: e.target.value,
												})
											}
											placeholder='e.g. Access Bank'
											disabled={withdrawing}
											className='w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#c9a227]/50'
										/>
									</div>
									<div>
										<label className='block text-xs font-medium text-gray-400 mb-1.5'>
											Account Name
										</label>
										<input
											type='text'
											value={bankDetails.accountName}
											onChange={(e) =>
												setBankDetails({
													...bankDetails,
													accountName: e.target.value,
												})
											}
											placeholder='Full name on the account'
											disabled={withdrawing}
											className='w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#c9a227]/50'
										/>
									</div>
									<div>
										<label className='block text-xs font-medium text-gray-400 mb-1.5'>
											Account Number
										</label>
										<input
											type='text'
											inputMode='numeric'
											value={bankDetails.accountNo}
											onChange={(e) =>
												setBankDetails({
													...bankDetails,
													accountNo: e.target.value,
												})
											}
											placeholder='10-digit account number'
											disabled={withdrawing}
											className='w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#c9a227]/50'
										/>
									</div>
								</div>
							)}

							{/* Crypto Wallet */}
							{withdrawalMethod === 'crypto' && (
								<div className='space-y-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]'>
									<div>
										<label className='block text-xs font-medium text-gray-400 mb-1.5'>
											Wallet Type
										</label>
										<select
											value={walletType}
											onChange={(e) =>
												setWalletType(e.target.value)
											}
											disabled={withdrawing}
											className='w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#c9a227]/50'
										>
											<option value='SOL'>
												Solana (SOL)
											</option>
											<option value='USDC'>
												USDC
											</option>
											<option value='USDT'>
												Tether (USDT)
											</option>
										</select>
									</div>
									<div>
										<label className='block text-xs font-medium text-gray-400 mb-1.5'>
											Wallet Address
										</label>
										<input
											type='text'
											value={walletAddress}
											onChange={(e) =>
												setWalletAddress(e.target.value)
											}
											placeholder='Your wallet address'
											disabled={withdrawing}
											className='w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white text-sm font-mono focus:outline-none focus:border-[#c9a227]/50'
										/>
									</div>
									<p className='text-[11px] text-gray-500'>
										Double-check your wallet address to
										avoid losing funds.
									</p>
								</div>
							)}

							<div className='p-3 rounded-lg bg-blue-500/5 border border-blue-500/10'>
								<p className='text-xs text-blue-400'>
									Withdrawals are typically processed within
									24–48 hours.
								</p>
							</div>
						</div>

						<div className='flex gap-3 mt-6'>
							<button
								onClick={() => setShowWithdrawal(false)}
								disabled={withdrawing}
								className='flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 border border-white/[0.08] hover:bg-white/5 transition disabled:opacity-50'
							>
								Cancel
							</button>
							<button
								onClick={handleWithdrawalSubmit}
								disabled={withdrawing}
								className='flex-1 px-4 py-2.5 rounded-lg text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition disabled:opacity-50 flex items-center justify-center gap-2'
							>
								{withdrawing ? (
									<>
										<Loader2 className='w-4 h-4 animate-spin' />
										Processing...
									</>
								) : (
									'Withdraw'
								)}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
