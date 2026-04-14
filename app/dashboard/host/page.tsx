// app/dashboard/host/page.tsx - Host Dashboard
'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, Calendar, DollarSign, PlusCircle, Settings, Edit, Trash2, Eye, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import eventService, { Event } from '@/app/services/eventService';
import hostProfileService, { HostProfile } from '@/app/services/hostProfileService';

interface HostStats {
  totalEvents: number;
  liveEvents: number;
  pendingEvents: number;
  totalEarnings: number;
  totalBalance: number;
  revenue: number;
}

export default function HostDashboard() {
  const { user, isAuthenticated, loading: authLoading, token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<HostStats>({
    totalEvents: 0,
    liveEvents: 0,
    pendingEvents: 0,
    totalEarnings: 0,
    totalBalance: 0,
    revenue: 0,
  });
  const [hostProfile, setHostProfile] = useState<HostProfile | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalLoading, setWithdrawalLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    } else if (user && user.role !== 'Host' && user.role !== 'Admin') {
      router.push('/dashboard/user');
    } else if (token) {
      fetchHostEvents();
    }
  }, [authLoading, isAuthenticated, user, router, token]);

  const fetchHostEvents = async () => {
    try {
      setLoading(true);
      if (!token) throw new Error('No authentication token');
      // Fetch events
      const response = await eventService.getHostEvents(token, 1, 100);
      if (response.success && response.data.events) {
        setEvents(response.data.events);
        
        // Calculate stats
        const liveCount = response.data.events.filter(e => e.status === 'live').length;
        const pendingCount = response.data.events.filter(e => e.status === 'draft' || e.status === 'Auditing').length;
        
        // Fetch host profile for balance and revenue
        if (!token) throw new Error('No authentication token');
        const profileResponse = await hostProfileService.getProfile(token);
        if (profileResponse.success && profileResponse.data) {
          setHostProfile(profileResponse.data);
          
          setStats({
            totalEvents: response.data.events.length,
            liveEvents: liveCount,
            pendingEvents: pendingCount,
            totalEarnings: 0, // Will be calculated if ticket data is available
            totalBalance: profileResponse.data.balance || 0,
            revenue: profileResponse.data.balance || 0, // Using balance as revenue for now
          });
        } else {
          setStats({
            totalEvents: response.data.events.length,
            liveEvents: liveCount,
            pendingEvents: pendingCount,
            totalEarnings: 0,
            totalBalance: 0,
            revenue: 0,
          });
        }
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    
    try {
      setDeleteLoading(eventId);
      if (!token) throw new Error('No authentication token');
      
      await eventService.deleteEvent(eventId, token);
      setEvents(events.filter(e => e._id !== eventId));
      setStats(prev => ({
        ...prev,
        totalEvents: prev.totalEvents - 1
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete event');
    } finally {
      setDeleteLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
            🔴 Live
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            ⏳ Draft
          </span>
        );
      case 'Auditing':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
            🔍 Auditing
          </span>
        );
      case 'ended':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-500/20 text-gray-400 border border-gray-500/30">
            ✓ Ended
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
            ✕ Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-500/20 text-gray-400 border border-gray-500/30">
            Unknown
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleWithdrawal = async () => {
    try {
      const amount = parseFloat(withdrawalAmount);

      // Validation
      if (!amount || amount <= 0) {
        alert('Please enter a valid amount');
        return;
      }

      if (amount < 5000) {
        alert('Minimum withdrawal amount is ₦5,000');
        return;
      }

      if (amount > stats.totalBalance) {
        alert(`Insufficient balance. Your balance is ₦${stats.totalBalance.toLocaleString()}`);
        return;
      }

      setWithdrawalLoading(true);
      if (!token) throw new Error('No authentication token');

      const response = await hostProfileService.requestWithdrawal(amount, token);
      
      if (response.success) {
        alert('Withdrawal request submitted successfully! You will receive your funds within 24-48 hours.');
        setShowWithdrawalModal(false);
        setWithdrawalAmount('');
        // Refresh profile to update balance
        fetchHostEvents();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process withdrawal';
      alert(`Error: ${errorMessage}`);
      console.error('Withdrawal error:', err);
    } finally {
      setWithdrawalLoading(false);
    }
  };

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
      
      <div className="container mx-auto px-4 pt-20 sm:pt-24 md:pt-28 pb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              Host Dashboard, <span className="text-gold">{user.firstName}</span>
            </h1>
          </div>
          <div className="flex gap-3 w-full sm:w-auto flex-col sm:flex-row">
            <button
              onClick={() => setShowWithdrawalModal(true)}
              className="px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
            >
              <DollarSign className="w-4 h-4" />
              Withdraw Funds
            </button>
            <Link
              href="/dashboard/events/create"
              className="px-4 py-2 bg-gold text-black font-bold rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Create Event
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-8">
          <div className="border border-gold/20 rounded-xl p-4 md:p-6 bg-gray-900/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-xs md:text-sm">Total Events</p>
              <Calendar className="w-4 h-4 md:w-5 md:h-5 text-gold" />
            </div>
            <p className="text-2xl md:text-3xl font-bold">{stats.totalEvents}</p>
          </div>

          <div className="border border-gold/20 rounded-xl p-4 md:p-6 bg-gray-900/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-xs md:text-sm">Live Events</p>
              <span className="text-green-400 text-lg">🔴</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold">{stats.liveEvents}</p>
          </div>

          <div className="border border-gold/20 rounded-xl p-4 md:p-6 bg-gray-900/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-xs md:text-sm">Pending</p>
              <Clock className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
            </div>
            <p className="text-2xl md:text-3xl font-bold">{stats.pendingEvents}</p>
          </div>

          <div className="border border-gold/20 rounded-xl p-4 md:p-6 bg-gray-900/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-xs md:text-sm">Total Balance</p>
              <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
            </div>
            <p className="text-2xl md:text-3xl font-bold">₦{(stats.totalBalance || 0).toLocaleString()}</p>
          </div>

          <div className="border border-gold/20 rounded-xl p-4 md:p-6 bg-gray-900/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-xs md:text-sm">Revenue</p>
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
            </div>
            <p className="text-2xl md:text-3xl font-bold">₦{(stats.revenue || 0).toLocaleString()}</p>
          </div>
        </div>

        {/* Events List */}
        <div className="bg-gray-900/50 border border-gold/20 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gold/20">
            <h2 className="text-xl font-bold">Your Events</h2>
          </div>

          {events.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-12 h-12 text-gold/50 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No events created yet</p>
              <Link
                href="/dashboard/events/create"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gold text-black font-bold rounded-lg hover:opacity-90 transition"
              >
                <PlusCircle className="w-4 h-4" />
                Create Your First Event
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gold/10">
              {events.map((event) => (
                <div key={event._id} className="p-4 sm:p-6 hover:bg-gray-800/50 transition">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6">
                    <div className="flex-1 w-full">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex-1">
                          <h3 className="text-base sm:text-lg font-bold text-white mb-2">{event.title}</h3>
                          <div className="space-y-1 text-xs sm:text-sm text-gray-400">
                            <p className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {formatDate(event.date)}
                            </p>
                            <p className="flex items-center gap-2">
                              📍 {event.venue}
                            </p>
                            <p className="flex items-center gap-2">
                              👥 Capacity: {event.capacity} attendees ({event.ticketsSold} sold)
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {getStatusBadge(event.status)}
                        {event.category && (
                          <span className="inline-block px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded">
                            {event.category}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 flex-wrap w-full sm:w-auto">
                      <Link
                        href={`/dashboard/events/${event._id}`}
                        className="flex items-center justify-center gap-1 flex-1 sm:flex-none px-2 py-2 sm:px-3 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/40 transition text-xs sm:text-sm"
                        title="View Event"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Link>
                      <Link
                        href={`/dashboard/events/${event._id}/edit`}
                        className="flex items-center justify-center gap-1 flex-1 sm:flex-none px-2 py-2 sm:px-3 bg-gold/20 text-gold rounded-lg hover:bg-gold/40 transition text-xs sm:text-sm"
                        title="Edit Event"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteEvent(event._id)}
                        disabled={deleteLoading === event._id}
                        className="flex items-center justify-center gap-1 flex-1 sm:flex-none px-2 py-2 sm:px-3 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/40 transition text-xs sm:text-sm disabled:opacity-50"
                        title="Delete Event"
                      >
                        {deleteLoading === event._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* WITHDRAWAL MODAL */}
        {showWithdrawalModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 md:p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-2">Withdraw Funds</h2>
              <p className="text-gray-400 text-sm mb-6">Your current balance: <span className="font-bold text-gold">₦{stats.totalBalance.toLocaleString()}</span></p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Withdrawal Amount</label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-lg">₦</span>
                    <input
                      type="number"
                      placeholder="5000"
                      value={withdrawalAmount}
                      onChange={(e) => setWithdrawalAmount(e.target.value)}
                      className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-gold focus:outline-none"
                      disabled={withdrawalLoading}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Minimum withdrawal: ₦5,000</p>
                </div>

                {withdrawalAmount && parseFloat(withdrawalAmount) < 5000 && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <p className="text-xs text-red-400">⚠️ Minimum withdrawal amount is ₦5,000</p>
                  </div>
                )}

                {withdrawalAmount && parseFloat(withdrawalAmount) > stats.totalBalance && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <p className="text-xs text-red-400">⚠️ Insufficient balance. Max available: ₦{stats.totalBalance.toLocaleString()}</p>
                  </div>
                )}

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                  <p className="text-xs text-blue-400"><strong>📝 Note:</strong> Withdrawals are processed within 24-48 hours to your registered bank account.</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowWithdrawalModal(false);
                    setWithdrawalAmount('');
                  }}
                  disabled={withdrawalLoading}
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWithdrawal}
                  disabled={withdrawalLoading || !withdrawalAmount || parseFloat(withdrawalAmount) < 5000 || parseFloat(withdrawalAmount) > stats.totalBalance}
                  className="flex-1 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {withdrawalLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <DollarSign className="w-4 h-4" />
                      Withdraw
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}