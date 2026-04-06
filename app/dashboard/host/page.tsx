// app/dashboard/host/page.tsx - Host Dashboard
'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, Calendar, DollarSign, PlusCircle, Settings } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function HostDashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    } else if (user && user.role !== 'Host' && user.role !== 'Admin') {
      router.push('/dashboard/user');
    } else {
      setLoading(false);
    }
  }, [authLoading, isAuthenticated, user, router]);

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-black">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 text-gold animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading host dashboard...</p>
        </div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-28 pb-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              Host Dashboard, <span className="text-gold">{user.firstName}</span>
            </h1>
            <p className="text-gray-400 mt-1">Manage your events and earnings</p>
          </div>
          <Link
            href="/dashboard/events/create"
            className="flex items-center gap-2 px-4 py-2 bg-gold text-black font-bold rounded-lg hover:opacity-90 transition"
          >
            <PlusCircle className="w-4 h-4" />
            Create Event
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900/50 border border-gold/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Total Events</span>
              <Calendar className="w-5 h-5 text-gold" />
            </div>
            <p className="text-3xl font-bold text-white">0</p>
          </div>
          <div className="bg-gray-900/50 border border-gold/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Total Earnings</span>
              <DollarSign className="w-5 h-5 text-gold" />
            </div>
            <p className="text-3xl font-bold text-gold">₦0</p>
          </div>
          <div className="bg-gray-900/50 border border-gold/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Pending Withdrawals</span>
              <Settings className="w-5 h-5 text-gold" />
            </div>
            <p className="text-3xl font-bold text-white">₦0</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-900/50 border border-gold/20 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/dashboard/events"
              className="text-center py-3 bg-gold/10 border border-gold/30 rounded-lg text-gold hover:bg-gold/20 transition"
            >
              My Events
            </Link>
            <Link
              href="/dashboard/events/create"
              className="text-center py-3 bg-gold/10 border border-gold/30 rounded-lg text-gold hover:bg-gold/20 transition"
            >
              Create Event
            </Link>
            <Link
              href="/dashboard/host/settings"
              className="text-center py-3 bg-gold/10 border border-gold/30 rounded-lg text-gold hover:bg-gold/20 transition"
            >
              Payout Settings
            </Link>
            <button
              onClick={() => window.open('https://t.me/Lofte3', '_blank')}
              className="text-center py-3 bg-gold/10 border border-gold/30 rounded-lg text-gold hover:bg-gold/20 transition"
            >
              Support
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}