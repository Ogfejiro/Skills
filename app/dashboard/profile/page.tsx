'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
	Save,
	AlertCircle,
	CheckCircle,
	Loader2,
	Eye,
	EyeOff,
	X,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import hostProfileService, { UpdateProfileData, SetWalletData } from '@/app/services/hostProfileService';
import { showNotification } from '@/lib/showNotification';

interface SocialLinks {
	twitter?: string;
	instagram?: string;
	facebook?: string;
	linkedin?: string;
	website?: string;
}

interface HostProfileData {
	_id: string;
	address?: string;
	organization?: string;
	bankName?: string;
	accountNo?: string;
	accountName?: string;
	walletAddress?: string;
	walletType?: string;
	walletSet: boolean;
	balance: number;
	conversionRate: number;
	socials?: SocialLinks;
}

export default function HostProfilePage() {
	const { user, isAuthenticated, loading: authLoading, token } = useAuth();
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [profile, setProfile] = useState<HostProfileData | null>(null);
	const [showWalletPassword, setShowWalletPassword] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const [formData, setFormData] = useState({
		address: '',
		organization: '',
		bankName: '',
		accountNo: '',
		accountName: '',
		conversionRate: 1400,
		socials: {
			twitter: '',
			instagram: '',
			facebook: '',
			linkedin: '',
			website: '',
		},
	});

	const [walletData, setWalletData] = useState({
		walletAddress: '',
		walletType: 'crypto', // or 'bank'
	});

	useEffect(() => {
		if (!authLoading && !isAuthenticated) {
			router.push('/auth/login');
		} else if (user && user.role !== 'Host') {
			router.push('/dashboard/user');
		} else if (token) {
			fetchProfile();
		}
	}, [authLoading, isAuthenticated, user, router, token]);

	const fetchProfile = async () => {
		try {
			setLoading(true);
			setError('');
			if (!token) throw new Error('No authentication token');

			const response = await hostProfileService.getProfile(token);
			if (response.success && response.data) {
				setProfile(response.data);
				setFormData({
					address: response.data.address || '',
					organization: response.data.organization || '',
					bankName: response.data.bankName || '',
					accountNo: response.data.accountNo || '',
					accountName: response.data.accountName || '',
					conversionRate: response.data.conversionRate || 1400,
					socials: response.data.socials || {
						twitter: '',
						instagram: '',
						facebook: '',
						linkedin: '',
						website: '',
					},
				});
				if (response.data.walletAddress) {
					setWalletData({
						walletAddress: response.data.walletAddress,
						walletType: response.data.walletType || 'crypto',
					});
				}
			}
		} catch (err: any) {
			setError(err.message || 'Failed to load profile');
			showNotification('Error loading profile', 'error');
		} finally {
			setLoading(false);
		}
	};

	const handleFormChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
		section?: string
	) => {
		const { name, value } = e.target;

		if (section === 'socials') {
			setFormData((prev) => ({
				...prev,
				socials: {
					...prev.socials,
					[name]: value,
				},
			}));
		} else {
			setFormData((prev) => ({
				...prev,
				[name]: value,
			}));
		}
	};

	const handleWalletChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setWalletData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSaveProfile = async () => {
		try {
			setSaving(true);
			setError('');

			if (!token) throw new Error('No authentication token');

			// Validate account details if accountName is provided
			if (formData.accountName && !formData.accountNo) {
				throw new Error('Account number is required when account name is provided');
			}

			if (formData.accountName && !formData.bankName) {
				throw new Error('Bank name is required when account name is provided');
			}

			// Validate that account name matches profile name
			if (
				formData.accountName &&
				user?.firstName &&
				!formData.accountName.toLowerCase().includes(user.firstName.toLowerCase())
			) {
				throw new Error(
					'Account name must match your profile name for security verification'
				);
			}

			const response = await hostProfileService.updateProfile(formData, token);

			if (response.success) {
				setProfile(response.data);
				setSuccess('Profile updated successfully!');
				showNotification('Profile updated successfully', 'success');
				setTimeout(() => setSuccess(''), 3000);
			}
		} catch (err: any) {
			const errorMsg = err.message || 'Failed to save profile';
			setError(errorMsg);
			showNotification(errorMsg, 'error');
		} finally {
			setSaving(false);
		}
	};

	const handleSetWallet = async () => {
		try {
			setSaving(true);
			setError('');

			if (!walletData.walletAddress) {
				throw new Error('Wallet address is required');
			}

			if (!walletData.walletType) {
				throw new Error('Wallet type is required');
			}

			if (!token) throw new Error('No authentication token');

			const response = await hostProfileService.setWallet(walletData, token);

			if (response.success) {
				setProfile(response.data);
				setSuccess('Wallet set successfully! (Can only be changed by support)');
				showNotification(
					'Wallet set successfully! You can only change this by contacting support.',
					'success'
				);
				setTimeout(() => setSuccess(''), 3000);
			}
		} catch (err: any) {
			const errorMsg = err.message || 'Failed to set wallet';
			setError(errorMsg);
			showNotification(errorMsg, 'error');
		} finally {
			setSaving(false);
		}
	};

	if (authLoading || loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Loader2 className="animate-spin text-blue-500" size={32} />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-black">
			<Navbar />

		<div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-8 py-6 sm:py-8">
			<div className="mb-6 sm:mb-8">
				<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
					Host Profile Settings
				</h1>
				<p className="text-sm sm:text-base text-gray-400">
						Manage your profile information, bank details, social media, and wallet settings
					</p>
				</div>

				{error && (
				<div className="mb-6 p-3 sm:p-4 bg-red-500/20 border border-red-500 rounded-lg flex items-start gap-2 sm:gap-3">
					<AlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={18} />
					<div className="flex-1">
						<h3 className="text-red-400 font-semibold text-sm">Error</h3>
						<p className="text-red-300 text-xs sm:text-sm">{error}</p>
						</div>
					</div>
				)}

				{success && (
				<div className="mb-6 p-3 sm:p-4 bg-green-500/20 border border-green-500 rounded-lg flex items-start gap-2 sm:gap-3">
					<CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={18} />
					<div className="flex-1">
						<h3 className="text-green-400 font-semibold text-sm">Success</h3>
						<p className="text-green-300 text-xs sm:text-sm">{success}</p>
						</div>
					</div>
				)}

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
				{/* Personal Information Section */}
				<div className="bg-neutral-900 rounded-lg p-4 sm:p-6 border border-neutral-800">
					<h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Personal Information</h2>

					<div className="space-y-3 sm:space-y-4">
							<div>
							<label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
								Organization / Business Name
							</label>
							<input
								type="text"
								name="organization"
								value={formData.organization}
								onChange={handleFormChange}
								placeholder="Your organization name"
								className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
							</div>

							<div>
							<label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
								Address
							</label>
							<input
								type="text"
								name="address"
								value={formData.address}
								onChange={handleFormChange}
								placeholder="Your address"
								className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
							</div>

							<div>
							<label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
								Conversion Rate (NGN per USD)
							</label>
							<input
								type="number"
								name="conversionRate"
								value={formData.conversionRate}
								onChange={handleFormChange}
								placeholder="1400"
								min="100"
								className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
								/>
							</div>
						</div>
					</div>

					{/* Social Media Links Section */}
				<div className="bg-neutral-900 rounded-lg p-4 sm:p-6 border border-neutral-800">
					<h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Social Media Links</h2>

					<div className="space-y-3 sm:space-y-4">
							<div>
							<label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
								Twitter / X
							</label>
							<input
								type="text"
								name="twitter"
								value={formData.socials.twitter}
								onChange={(e) => handleFormChange(e, 'socials')}
								placeholder="@yourhandle"
								className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">
									Instagram
								</label>
								<input
									type="text"
									name="instagram"
									value={formData.socials.instagram}
									onChange={(e) => handleFormChange(e, 'socials')}
									placeholder="@yourhandle"
									className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">
									Facebook
								</label>
								<input
									type="text"
									name="facebook"
									value={formData.socials.facebook}
									onChange={(e) => handleFormChange(e, 'socials')}
									placeholder="Your profile URL"
									className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">
									LinkedIn
								</label>
								<input
									type="text"
									name="linkedin"
									value={formData.socials.linkedin}
									onChange={(e) => handleFormChange(e, 'socials')}
									placeholder="Your profile URL"
									className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">
									Website
								</label>
								<input
									type="url"
									name="website"
									value={formData.socials.website}
									onChange={(e) => handleFormChange(e, 'socials')}
									placeholder="https://yourwebsite.com"
									className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
								/>
							</div>
						</div>
					</div>

					{/* Bank Account Details Section */}
					<div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
						<h2 className="text-xl font-bold text-white mb-6">Bank Account Details</h2>
						<p className="text-xs text-gray-400 mb-4">
							⚠️ Account name must match your profile name for security verification
						</p>

						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">
									Bank Name
								</label>
								<input
									type="text"
									name="bankName"
									value={formData.bankName}
									onChange={handleFormChange}
									placeholder="e.g., GTBank, Access Bank"
									className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">
									Account Name
								</label>
								<input
									type="text"
									name="accountName"
									value={formData.accountName}
									onChange={handleFormChange}
									placeholder="Your bank account holder name"
									className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
								/>
								<p className="text-xs text-gray-400 mt-1">
									Your profile name: {user?.firstName} {user?.lastName}
								</p>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">
									Account Number
								</label>
								<input
									type="text"
									name="accountNo"
									value={formData.accountNo}
									onChange={handleFormChange}
									placeholder="Your account number"
									className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
								/>
							</div>
						</div>
					</div>

					{/* Wallet Settings Section */}
					<div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
						<h2 className="text-xl font-bold text-white mb-6">Wallet Settings</h2>
						<p className="text-xs text-gray-400 mb-4">
							⚠️ Wallet can only be set once. Contact support to change it.
						</p>

						{profile?.walletSet ? (
							<div className="space-y-4">
								<div className="p-4 bg-green-500/10 border border-green-500/50 rounded-lg">
									<p className="text-green-400 font-semibold mb-2">✓ Wallet Already Set</p>
									<p className="text-sm text-gray-300 mb-3">
										<strong>Wallet Type:</strong> {walletData.walletType}
									</p>
									<p className="text-sm text-gray-300 break-all">
										<strong>Wallet Address:</strong> {walletData.walletAddress}
									</p>
									<p className="text-xs text-gray-400 mt-4">
										To change your wallet settings, please contact our support team.
									</p>
								</div>
							</div>
						) : (
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-300 mb-2">
										Wallet Type
									</label>
									<select
										name="walletType"
										value={walletData.walletType}
										onChange={handleWalletChange}
										disabled={profile?.walletSet}
										className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
									>
										<option value="crypto">Cryptocurrency</option>
										<option value="bank">Bank Transfer</option>
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-300 mb-2">
										Wallet Address
									</label>
									<input
										type={showWalletPassword ? 'text' : 'password'}
										name="walletAddress"
										value={walletData.walletAddress}
										onChange={handleWalletChange}
										disabled={profile?.walletSet}
										placeholder={
											walletData.walletType === 'crypto'
												? 'Enter your cryptocurrency wallet address'
												: 'Enter your bank account or wallet address'
										}
										className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
									/>
									{!profile?.walletSet && (
										<button
											onClick={() => setShowWalletPassword(!showWalletPassword)}
											className="mt-2 text-xs text-gray-400 hover:text-gray-300 flex items-center gap-1"
										>
											{showWalletPassword ? (
												<>
													<EyeOff size={14} /> Hide
												</>
											) : (
												<>
													<Eye size={14} /> Show
												</>
											)}
										</button>
									)}
								</div>

								{!profile?.walletSet && (
									<button
										onClick={handleSetWallet}
										disabled={saving || !walletData.walletAddress}
										className="w-full mt-4 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
									>
										{saving ? (
											<>
												<Loader2 className="animate-spin" size={16} /> Setting Wallet...
											</>
										) : (
											<>
												<Save size={16} /> Set Wallet
											</>
										)}
									</button>
								)}
							</div>
						)}
					</div>
				</div>

				{/* Save Button */}
				<div className="mt-8 flex gap-4">
					<button
						onClick={handleSaveProfile}
						disabled={saving}
						className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
					>
						{saving ? (
							<>
								<Loader2 className="animate-spin" size={16} /> Saving...
							</>
						) : (
							<>
								<Save size={16} /> Save Changes
							</>
						)}
					</button>

					<button
						onClick={() => router.back()}
						className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
					>
						<X size={16} /> Cancel
					</button>
				</div>
			</div>
		</div>
	);
}
