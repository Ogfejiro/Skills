// app/dashboard/user/page.tsx - User Dashboard
'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, Ticket, Calendar, CreditCard, ExternalLink, MapPin, Bell, LogOut, Zap } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import eventService from '@/app/services/eventService';
import hostProfileService from '@/app/services/hostProfileService';
import { toast } from 'sonner';

export default function UserDashboard() {
  const { user, isAuthenticated, loading: authLoading, logout, token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [myTickets, setMyTickets] = useState<any[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [showHostModal, setShowHostModal] = useState(false);
  const [hostProfile, setHostProfile] = useState<any>(null);
  const [checkingHost, setCheckingHost] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    } else if (user && user.role === 'Host') {
      router.push('/dashboard/host');
    } else if (user && user.role === 'Admin') {
      router.push('/dashboard/admin');
    } else {
      loadDashboardData();
    }
  }, [authLoading, isAuthenticated, user, router]);

  const loadDashboardData = async () => {
    try {
      setEventsLoading(true);
      // Fetch upcoming events
      const res = await eventService.getPublicEvents(1, 3);
      if (res?.data?.events) {
        setUpcomingEvents(Array.isArray(res.data.events) ? res.data.events : []);
      }
      // TODO: Fetch user's tickets from ticket service
      setMyTickets([]);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setEventsLoading(false);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  const handleSwitchToHost = async () => {
    try {
      setCheckingHost(true);
      if (!token) {
        toast.error('Session expired. Please login again.');
        router.push('/auth/login');
        return;
      }

      const response = await hostProfileService.getProfile(token);
      if (response.success && response.data) {
        setHostProfile(response.data);
        router.push('/dashboard/host');
      } else {
        setShowHostModal(true);
      }
    } catch (error: any) {
      setShowHostModal(true);
    } finally {
      setCheckingHost(false);
    }
  };

  const handleCreateHostProfile = async () => {
    try {
      setCheckingHost(true);
      // Redirect to host settings to create profile
      router.push('/dashboard/host-settings?create=true');
    } catch (error: any) {
      toast.error('Failed to navigate to host setup');
    } finally {
      setCheckingHost(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-28 pb-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div className="mb-6 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              Welcome back, <span className="text-gold">{user?.firstName}</span>
            </h1>
            <p className="text-gray-400 text-lg">Manage your tickets and explore events</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSwitchToHost}
              disabled={checkingHost}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg transition font-semibold"
            >
              {checkingHost ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
              <span>Switch to Host</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full sm:w-auto flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 border border-gold/30 rounded-lg transition"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/20 rounded-xl p-6 hover:border-gold/40 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-300 font-semibold">My Tickets</span>
              <div className="p-3 bg-gold/20 rounded-lg">
                <Ticket className="w-5 h-5 text-gold" />
              </div>
            </div>
            <p className="text-4xl font-bold text-white">{myTickets.length}</p>
            <p className="text-sm text-gray-400 mt-2">Tickets booked</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-300 font-semibold">Upcoming Events</span>
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <p className="text-4xl font-bold text-white">{upcomingEvents.length}</p>
            <p className="text-sm text-gray-400 mt-2">Events to attend</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-xl p-6 hover:border-emerald-500/40 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-300 font-semibold">Total Spent</span>
              <div className="p-3 bg-emerald-500/20 rounded-lg">
                <CreditCard className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <p className="text-4xl font-bold text-gold">₦0.00</p>
            <p className="text-sm text-gray-400 mt-2">Lifetime spending</p>
          </div>
        </div>

        {/* User Info Card */}
        <div className="bg-gray-900/50 border border-gold/20 rounded-xl p-6 mb-12">
          <h2 className="text-xl font-bold text-gold mb-4">Profile Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-400">Full Name</label>
              <p className="text-lg font-semibold text-white mt-1">{user?.firstName} {user?.lastName}</p>
            </div>
            <div>
              <label className="text-sm text-gray-400">Email</label>
              <p className="text-lg font-semibold text-white mt-1">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm text-gray-400">Phone</label>
              <p className="text-lg font-semibold text-white mt-1">{user?.phone || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-400">Account Type</label>
              <p className="text-lg font-semibold text-gold mt-1">{user?.role || 'User'}</p>
            </div>
          </div>
        </div>

        {/* Upcoming Events Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Upcoming Events</h2>
          {eventsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-gold animate-spin" />
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <div key={event._id} className="bg-gray-900/50 border border-gold/20 rounded-xl overflow-hidden hover:border-gold/40 transition group">
                  {event.banner && (
                    <img
                      src={event.banner}
                      alt={event.title}
                      className="w-full h-40 object-cover group-hover:scale-105 transition duration-300"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-white mb-2">{event.title}</h3>
                    <div className="space-y-2 text-sm text-gray-400 mb-4">
                      {event.date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gold" />
                          {new Date(event.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      )}
                      {event.venue && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gold" />
                          {event.venue}
                        </div>
                      )}
                    </div>
                    <Link
                      href={`/#events`}
                      className="w-full block text-center py-2 bg-gold text-black font-semibold rounded-lg hover:bg-yellow-400 transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-900/50 rounded-xl border border-gold/20">
              <p className="text-gray-400 mb-4">No upcoming events yet</p>
              <Link
                href="/#events"
                className="inline-block px-6 py-2 bg-gold text-black font-semibold rounded-lg hover:bg-yellow-400 transition"
              >
                Browse Events
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-900/50 border border-gold/20 rounded-xl p-8">
          <h2 className="text-xl font-bold text-gold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/#events"
              className="flex flex-col items-center justify-center py-4 px-4 bg-gold/10 border border-gold/30 rounded-lg text-gold hover:bg-gold/20 hover:border-gold/50 transition duration-300"
            >
              <Calendar className="w-6 h-6 mb-2" />
              <span className="font-semibold text-sm">Browse Events</span>
            </Link>
            <Link
              href="/tickets"
              className="flex flex-col items-center justify-center py-4 px-4 bg-gold/10 border border-gold/30 rounded-lg text-gold hover:bg-gold/20 hover:border-gold/50 transition duration-300"
            >
              <Ticket className="w-6 h-6 mb-2" />
              <span className="font-semibold text-sm">My Tickets</span>
            </Link>
            <a
              href="https://t.me/Lofte3"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center py-4 px-4 bg-gold/10 border border-gold/30 rounded-lg text-gold hover:bg-gold/20 hover:border-gold/50 transition duration-300"
            >
              <Bell className="w-6 h-6 mb-2" />
              <span className="font-semibold text-sm">Support</span>
            </a>
            <button
              onClick={handleLogout}
              className="flex flex-col items-center justify-center py-4 px-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/20 hover:border-red-500/50 transition duration-300"
            >
              <LogOut className="w-6 h-6 mb-2" />
              <span className="font-semibold text-sm">Logout</span>
            </button>
          </div>
        </div>

        {/* Create Host Profile Modal */}
        {showHostModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gold/20 rounded-xl p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-gold mb-4">Ready to Host Events?</h2>
              <p className="text-gray-300 mb-6">
                You don't have a host profile yet. Create one to start hosting and managing your events with LOFTE-3. You'll be able to set up your wallet and event details in the next step.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleCreateHostProfile}
                  disabled={checkingHost}
                  className="w-full px-4 py-3 bg-gold text-black font-bold rounded-lg hover:bg-yellow-400 disabled:opacity-50 transition"
                >
                  {checkingHost ? 'Creating...' : 'Create Host Profile'}
                </button>
                <button
                  onClick={() => setShowHostModal(false)}
                  className="w-full px-4 py-3 bg-gray-800 text-white border border-gold/30 rounded-lg hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}