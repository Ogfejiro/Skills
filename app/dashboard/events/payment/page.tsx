// app/dashboard/events/payment/page.tsx
'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  CreditCard,
  Wallet,
  Bitcoin,
  ChevronLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function EventPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId');

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'crypto'>('card');
  const [processing, setProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  // Mock listing fee - in production, this would come from your backend
  const listingFee = 5000; // ₦5,000

  const handlePayment = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setPaymentComplete(true);
      
      // Redirect back to events page after 2 seconds
      setTimeout(() => {
        router.push('/dashboard/events?payment=success');
      }, 2000);
    }, 2000);
  };

  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your event has been submitted for review. You'll be notified once it's approved.
          </p>
          <Link
            href="/dashboard/events"
            className="inline-block px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            View My Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <Link
          href="/dashboard/events/create"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ChevronLeft size={20} />
          Back to Event Creation
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Payment Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">Complete Your Listing</h1>
            <p className="text-emerald-100">Pay the listing fee to submit your event for review</p>
          </div>

          {/* Payment Details */}
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h2>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Event Listing Fee</span>
                  <span className="text-xl font-bold text-gray-900">₦{listingFee.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-gray-900 font-semibold">Total</span>
                  <span className="text-2xl font-bold text-emerald-600">₦{listingFee.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Payment Method</h2>
              
              <div className="space-y-3">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`w-full flex items-center gap-4 p-4 border-2 rounded-xl transition-all ${
                    paymentMethod === 'card'
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-emerald-200'
                  }`}
                >
                  <div className={`p-3 rounded-lg ${
                    paymentMethod === 'card' ? 'bg-emerald-500' : 'bg-gray-100'
                  }`}>
                    <CreditCard className={`w-6 h-6 ${
                      paymentMethod === 'card' ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900">Card Payment</p>
                    <p className="text-sm text-gray-500">Pay with debit/credit card</p>
                  </div>
                  {paymentMethod === 'card' && (
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  )}
                </button>

                <button
                  onClick={() => setPaymentMethod('bank')}
                  className={`w-full flex items-center gap-4 p-4 border-2 rounded-xl transition-all ${
                    paymentMethod === 'bank'
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-emerald-200'
                  }`}
                >
                  <div className={`p-3 rounded-lg ${
                    paymentMethod === 'bank' ? 'bg-emerald-500' : 'bg-gray-100'
                  }`}>
                    <Wallet className={`w-6 h-6 ${
                      paymentMethod === 'bank' ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900">Bank Transfer</p>
                    <p className="text-sm text-gray-500">Pay via bank transfer</p>
                  </div>
                  {paymentMethod === 'bank' && (
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  )}
                </button>

                <button
                  onClick={() => setPaymentMethod('crypto')}
                  className={`w-full flex items-center gap-4 p-4 border-2 rounded-xl transition-all ${
                    paymentMethod === 'crypto'
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-emerald-200'
                  }`}
                >
                  <div className={`p-3 rounded-lg ${
                    paymentMethod === 'crypto' ? 'bg-emerald-500' : 'bg-gray-100'
                  }`}>
                    <Bitcoin className={`w-6 h-6 ${
                      paymentMethod === 'crypto' ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900">Crypto Payment</p>
                    <p className="text-sm text-gray-500">Pay with USDT, BTC, ETH</p>
                  </div>
                  {paymentMethod === 'crypto' && (
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  )}
                </button>
              </div>
            </div>

            {/* Payment Info */}
            <div className="mb-8 p-4 bg-blue-50 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">What happens next?</p>
                <p>After payment, your event will be submitted for review. Our team will review it within 24-48 hours. You'll be notified once it's approved and published.</p>
              </div>
            </div>

            {/* Payment Button */}
            <button
              onClick={handlePayment}
              disabled={processing}
              className="w-full py-4 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                'Pay Listing Fee'
              )}
            </button>

            <p className="text-xs text-center text-gray-500 mt-4">
              By completing this payment, you agree to our Terms of Service and Refund Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}