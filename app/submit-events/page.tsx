'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Calendar, 
  MapPin, 
  Ticket, 
  Users,
  CreditCard,
  Coins,
  Landmark,
  Wallet,
  Clock,
  CheckCircle,
  AlertCircle,
  Mail,
  Phone,
  User
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function SubmitEventPage() {
  const [formData, setFormData] = useState({
    // Event Details
    eventTitle: '',
    eventDescription: '',
    eventDate: '',
    eventTime: '',
    eventLocation: '',
    eventBanner: null as File | null,
    
    // Ticket Details
    ticketPrice: '',
    ticketCurrency: 'USD',
    ticketQuantity: '',
    ticketDescription: '',
    
    // Organizer Contact (Admin only)
    organizerEmail: '',
    organizerPhone: '',
    cryptoWallet: '',
    bankAccount: '',
    bankName: '',
    accountName: '',
    
    // Settlement Options
    settlementFrequency: 'weekly',
    settlementType: 'crypto',
    
    // Consent
    consentServiceFee: false,
    consentDataSharing: false,
    consentTerms: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, eventBanner: e.target.files![0] }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.consentServiceFee || !formData.consentDataSharing || !formData.consentTerms) {
      alert('Please agree to all terms and conditions');
      return;
    }

    // Submit form data to backend
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formDataToSend.append(key, value.toString());
      }
    });

    if (formData.eventBanner) {
      formDataToSend.append('banner', formData.eventBanner);
    }

    try {
      const response = await fetch('/api/events/submit', {
        method: 'POST',
        body: formDataToSend
      });

      if (response.ok) {
        alert('Event submitted successfully! You will be contacted shortly.');
        // Reset form
        setFormData({
          eventTitle: '',
          eventDescription: '',
          eventDate: '',
          eventTime: '',
          eventLocation: '',
          eventBanner: null,
          ticketPrice: '',
          ticketCurrency: 'USD',
          ticketQuantity: '',
          ticketDescription: '',
          organizerEmail: '',
          organizerPhone: '',
          cryptoWallet: '',
          bankAccount: '',
          bankName: '',
          accountName: '',
          settlementFrequency: 'weekly',
          settlementType: 'crypto',
          consentServiceFee: false,
          consentDataSharing: false,
          consentTerms: false
        });
      } else {
        alert('Error submitting event. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting event. Please try again.');
    }
  };

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">Submit Your</span>
              <span className="gold-gradient ml-3">Event</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Host your event on LOFTE-3 platform
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Event Details */}
            <div className="bg-black/50 rounded-2xl border border-gold/30 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Calendar className="w-6 h-6 text-gold" />
                Event Details
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Event Title *</label>
                    <input
                      type="text"
                      name="eventTitle"
                      value={formData.eventTitle}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-black/30 border border-gray-700 focus:border-gold focus:outline-none"
                      placeholder="Enter event title"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Event Date *</label>
                    <input
                      type="date"
                      name="eventDate"
                      value={formData.eventDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-black/30 border border-gray-700 focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Event Time *</label>
                    <input
                      type="time"
                      name="eventTime"
                      value={formData.eventTime}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-black/30 border border-gray-700 focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Event Location *</label>
                    <input
                      type="text"
                      name="eventLocation"
                      value={formData.eventLocation}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-black/30 border border-gray-700 focus:border-gold focus:outline-none"
                      placeholder="Venue address"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Event Banner *</label>
                    <div className="border-2 border-dashed border-gold/30 rounded-lg p-8 text-center hover:border-gold/50 transition">
                      <input
                        type="file"
                        id="banner-upload"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                        required
                      />
                      <label htmlFor="banner-upload" className="cursor-pointer">
                        <Upload className="w-12 h-12 text-gold mx-auto mb-4" />
                        <p className="text-gray-400">Click to upload banner image</p>
                        <p className="text-gray-500 text-sm mt-2">Recommended: 1200x600px</p>
                        {formData.eventBanner && (
                          <p className="text-green-500 text-sm mt-2">
                            ✓ {formData.eventBanner.name}
                          </p>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-gray-300 mb-2">Event Description *</label>
                <textarea
                  name="eventDescription"
                  value={formData.eventDescription}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-black/30 border border-gray-700 focus:border-gold focus:outline-none"
                  placeholder="Describe your event in detail..."
                />
              </div>
            </div>

            {/* Section 2: Ticket Details */}
            <div className="bg-black/50 rounded-2xl border border-gold/30 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Ticket className="w-6 h-6 text-gold" />
                Ticket Details
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2">Ticket Price *</label>
                  <div className="flex">
                    <select
                      name="ticketCurrency"
                      value={formData.ticketCurrency}
                      onChange={handleInputChange}
                      className="px-4 py-3 rounded-l-lg bg-black/30 border border-gray-700 border-r-0 focus:outline-none"
                    >
                      <option value="USD">$ USD</option>
                      <option value="NGN">₦ NGN</option>
                    </select>
                    <input
                      type="number"
                      name="ticketPrice"
                      value={formData.ticketPrice}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 rounded-r-lg bg-black/30 border border-gray-700 focus:border-gold focus:outline-none"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Available Tickets *</label>
                  <input
                    type="number"
                    name="ticketQuantity"
                    value={formData.ticketQuantity}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-4 py-3 rounded-lg bg-black/30 border border-gray-700 focus:border-gold focus:outline-none"
                    placeholder="e.g., 499"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Settlement Frequency</label>
                  <select
                    name="settlementFrequency"
                    value={formData.settlementFrequency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-black/30 border border-gray-700 focus:border-gold focus:outline-none"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-gray-300 mb-2">Ticket Description</label>
                <textarea
                  name="ticketDescription"
                  value={formData.ticketDescription}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg bg-black/30 border border-gray-700 focus:border-gold focus:outline-none"
                  placeholder="Describe what attendees get with this ticket..."
                />
              </div>
            </div>

            {/* Section 3: Organizer Contact (Admin Only) */}
            <div className="bg-black/50 rounded-2xl border border-gold/30 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <User className="w-6 h-6 text-gold" />
                Organizer Contact (For Admin Only)
                <span className="text-sm text-gray-400 font-normal">This information is only visible to administrators</span>
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2">Email *</label>
                  <input
                    type="email"
                    name="organizerEmail"
                    value={formData.organizerEmail}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-black/30 border border-gray-700 focus:border-gold focus:outline-none"
                    placeholder="organizer@example.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="organizerPhone"
                    value={formData.organizerPhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-black/30 border border-gray-700 focus:border-gold focus:outline-none"
                    placeholder="+234 800 000 0000"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-gray-300 mb-4">Settlement Type *</label>
                <div className="flex gap-4">
                  <label className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.settlementType === 'crypto' 
                    ? 'border-gold bg-gold/10' 
                    : 'border-gray-700 bg-black/30 hover:border-gold/50'
                  }`}>
                    <input
                      type="radio"
                      name="settlementType"
                      value="crypto"
                      checked={formData.settlementType === 'crypto'}
                      onChange={handleInputChange}
                      className="hidden"
                    />
                    <div className="flex items-center gap-3">
                      <Coins className="w-6 h-6 text-gold" />
                      <div>
                        <p className="font-bold text-white">Crypto Settlement</p>
                        <p className="text-sm text-gray-400">Receive payments in cryptocurrency</p>
                      </div>
                    </div>
                  </label>

                  <label className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.settlementType === 'naira' 
                    ? 'border-gold bg-gold/10' 
                    : 'border-gray-700 bg-black/30 hover:border-gold/50'
                  }`}>
                    <input
                      type="radio"
                      name="settlementType"
                      value="naira"
                      checked={formData.settlementType === 'naira'}
                      onChange={handleInputChange}
                      className="hidden"
                    />
                    <div className="flex items-center gap-3">
                      <Landmark className="w-6 h-6 text-gold" />
                      <div>
                        <p className="font-bold text-white">Naira Settlement</p>
                        <p className="text-sm text-gray-400">Receive payments to bank account</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Settlement Details */}
              <div className="mt-6 grid md:grid-cols-2 gap-6">
                {formData.settlementType === 'crypto' ? (
                  <div>
                    <label className="block text-gray-300 mb-2">Crypto Wallet Address *</label>
                    <input
                      type="text"
                      name="cryptoWallet"
                      value={formData.cryptoWallet}
                      onChange={handleInputChange}
                      required={formData.settlementType === 'crypto'}
                      className="w-full px-4 py-3 rounded-lg bg-black/30 border border-gray-700 focus:border-gold focus:outline-none"
                      placeholder="0x..."
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-gray-300 mb-2">Bank Name *</label>
                      <input
                        type="text"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleInputChange}
                        required={formData.settlementType === 'naira'}
                        className="w-full px-4 py-3 rounded-lg bg-black/30 border border-gray-700 focus:border-gold focus:outline-none"
                        placeholder="Bank name"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Account Number *</label>
                      <input
                        type="text"
                        name="bankAccount"
                        value={formData.bankAccount}
                        onChange={handleInputChange}
                        required={formData.settlementType === 'naira'}
                        className="w-full px-4 py-3 rounded-lg bg-black/30 border border-gray-700 focus:border-gold focus:outline-none"
                        placeholder="Account number"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Account Name *</label>
                      <input
                        type="text"
                        name="accountName"
                        value={formData.accountName}
                        onChange={handleInputChange}
                        required={formData.settlementType === 'naira'}
                        className="w-full px-4 py-3 rounded-lg bg-black/30 border border-gray-700 focus:border-gold focus:outline-none"
                        placeholder="Account holder name"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Section 4: Terms & Consent */}
            <div className="bg-black/50 rounded-2xl border border-gold/30 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Terms & Conditions</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-black/30">
                  <input
                    type="checkbox"
                    id="consentServiceFee"
                    name="consentServiceFee"
                    checked={formData.consentServiceFee}
                    onChange={handleCheckboxChange}
                    className="mt-1 text-gold"
                  />
                  <div>
                    <label htmlFor="consentServiceFee" className="font-bold text-white cursor-pointer">
                      Service Fee Consent *
                    </label>
                    <p className="text-gray-400 text-sm mt-1">
                      I agree to a 2% LOFTE-3 service fee on all ticket sales, plus payment processing fees 
                      (1% for crypto payments via Coinbase, or 2% for Naira payments via Paystack).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-black/30">
                  <input
                    type="checkbox"
                    id="consentDataSharing"
                    name="consentDataSharing"
                    checked={formData.consentDataSharing}
                    onChange={handleCheckboxChange}
                    className="mt-1 text-gold"
                  />
                  <div>
                    <label htmlFor="consentDataSharing" className="font-bold text-white cursor-pointer">
                      Data Sharing Consent *
                    </label>
                    <p className="text-gray-400 text-sm mt-1">
                      I consent that attendee lists with important details will be sent to their provided email addresses.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-black/30">
                  <input
                    type="checkbox"
                    id="consentTerms"
                    name="consentTerms"
                    checked={formData.consentTerms}
                    onChange={handleCheckboxChange}
                    className="mt-1 text-gold"
                  />
                  <div>
                    <label htmlFor="consentTerms" className="font-bold text-white cursor-pointer">
                      Terms & Conditions *
                    </label>
                    <p className="text-gray-400 text-sm mt-1">
                      I agree to the LOFTE-3 Terms of Service and understand that:
                    </p>
                    <ul className="text-gray-400 text-sm mt-2 space-y-1 ml-4 list-disc">
                      <li>Event approval is subject to review</li>
                      <li>Settlement receipts will be sent to my email</li>
                      <li>Contact: T.me/Lofte3 or partnerships@lofte.live</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-12 py-4 rounded-full bg-gradient-to-r from-gold to-gold/90 text-black font-bold text-lg hover:shadow-2xl hover:shadow-gold/30 transition-all"
                disabled={!formData.consentServiceFee || !formData.consentDataSharing || !formData.consentTerms}
              >
                Submit Event for Review
              </motion.button>
              
              <p className="text-gray-400 text-sm mt-4">
                After submission, you'll be contacted at {formData.organizerEmail || 'your email'}
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Need help? Contact: T.me/Lofte3 or email partnerships@lofte.live
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </main>
  );
}