'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { 
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  AlertCircle,
  Eye,
  Trash2,
  MoreVertical
} from 'lucide-react';
import { showNotification } from '@/lib/showNotification';

interface Event {
  _id: string;
  title: string;
  date: string;
  venue: string;
  banner: string;
  description: string;
  capacity: number;
  category: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
  hostId: {
    firstName: string;
    lastName: string;
    email: string;
    organization: string;
  };
}

export default function AdminDashboard() {
  const { user, isAuthenticated, loading: authLoading, token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [currentAction, setCurrentAction] = useState<'approve' | 'reject' | null>(null);
  const [stats, setStats] = useState({
    totalPending: 0,
    viewingPage: 1,
    totalPages: 1
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    } else if (user && user.role !== 'Admin') {
      router.push('/dashboard/user');
    } else if (token) {
      fetchPendingEvents();
    }
  }, [authLoading, isAuthenticated, user, router, token]);

  const fetchPendingEvents = async (page = 1) => {
    try {
      setLoading(true);
      if (!token) throw new Error('No authentication token');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://skills-k6pv.onrender.com'}/api/events/admin/pending?page=${page}&limit=10`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch events');
      }

      const result = await response.json();
      setEvents(result.data.events || []);
      setStats({
        totalPending: result.data.totalEvents || 0,
        viewingPage: page,
        totalPages: result.data.totalPages || 1
      });
    } catch (err: any) {
      showNotification(err.message || 'Failed to load pending events', 'error');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveEvent = async (eventId: string) => {
    try {
      setActionLoading(true);
      setCurrentAction('approve');
      if (!token) throw new Error('No authentication token');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://skills-k6pv.onrender.com'}/api/events/admin/approve/${eventId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to approve event');
      }

      setEvents(events.filter(e => e._id !== eventId));
      setShowReviewModal(false);
      showNotification('Event approved successfully! It will now appear on the home page.', 'success');
      fetchPendingEvents(stats.viewingPage);
    } catch (err: any) {
      showNotification(err.message || 'Failed to approve event', 'error');
    } finally {
      setActionLoading(false);
      setCurrentAction(null);
    }
  };

  const handleRejectEvent = async (eventId: string) => {
    try {
      if (!rejectionReason.trim()) {
        showNotification('Please provide a reason for rejection', 'error');
        return;
      }

      setActionLoading(true);
      setCurrentAction('reject');
      if (!token) throw new Error('No authentication token');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://skills-k6pv.onrender.com'}/api/events/admin/reject/${eventId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ rejectionReason }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to reject event');
      }

      setEvents(events.filter(e => e._id !== eventId));
      setShowReviewModal(false);
      setRejectionReason('');
      showNotification('Event rejected. The host will be notified.', 'success');
      fetchPendingEvents(stats.viewingPage);
    } catch (err: any) {
      showNotification(err.message || 'Failed to reject event', 'error');
    } finally {
      setActionLoading(false);
      setCurrentAction(null);
    }
  };

  const openReviewModal = (event: Event, action: 'approve' | 'reject') => {
    setSelectedEvent(event);
    setCurrentAction(action);
    setRejectionReason('');
    setShowReviewModal(true);
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setSelectedEvent(null);
    setCurrentAction(null);
    setRejectionReason('');
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.hostId.firstName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="animate-spin text-blue-500 mx-auto mb-4" size={32} />
            <p className="text-gray-400">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'Admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-400">
            Review and manage pending events for the platform
          </p>
        </div>

        {/* Stats Card */}
        <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Pending Review</h2>
          <p className="text-4xl font-bold text-blue-400">{stats.totalPending}</p>
          <p className="text-gray-400 text-sm mt-2">Events awaiting approval</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search by event title, location, or host name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Events List */}
        {filteredEvents.length === 0 ? (
          <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-12 text-center">
            {events.length === 0 ? (
              <>
                <CheckCircle className="mx-auto mb-4 text-green-500" size={48} />
                <h3 className="text-xl font-bold text-white mb-2">All Caught Up!</h3>
                <p className="text-gray-400">No pending events to review at the moment</p>
              </>
            ) : (
              <>
                <AlertCircle className="mx-auto mb-4 text-yellow-500" size={48} />
                <h3 className="text-xl font-bold text-white mb-2">No Results</h3>
                <p className="text-gray-400">No events match your search query</p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <div
                key={event._id}
                className="bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden hover:border-neutral-700 transition-colors"
              >
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    {/* Event Info */}
                    <div className="sm:col-span-2">
                      <div className="flex gap-4">
                        {event.banner && (
                          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={event.banner}
                              alt={event.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                              }}
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white mb-1">
                            {event.title}
                          </h3>
                          <p className="text-sm text-gray-400 mb-1">{event.venue}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Clock size={14} />
                            {new Date(event.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Host Info */}
                    <div>
                      <p className="text-xs text-gray-400 mb-1">HOST</p>
                      <p className="text-white font-semibold">
                        {event.hostId.firstName} {event.hostId.lastName}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {event.hostId.email}
                      </p>
                    </div>

                    {/* Submission Date */}
                    <div>
                      <p className="text-xs text-gray-400 mb-1">SUBMITTED</p>
                      <p className="text-white font-semibold">
                        {new Date(event.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-xs text-gray-400">
                        {event.category}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-300 mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  {/* Event Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 py-4 border-t border-neutral-800 mb-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Capacity</p>
                      <p className="font-semibold text-white">{event.capacity} seats</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Category</p>
                      <p className="font-semibold text-white">{event.category}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Status</p>
                      <p className="font-semibold text-yellow-400">Pending Review</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => openReviewModal(event, 'approve')}
                      className="flex-1 min-w-[120px] px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors text-sm"
                    >
                      <CheckCircle size={16} />
                      Approve
                    </button>
                    <button
                      onClick={() => openReviewModal(event, 'reject')}
                      className="flex-1 min-w-[120px] px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors text-sm"
                    >
                      <XCircle size={16} />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {stats.totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <button
              onClick={() => fetchPendingEvents(Math.max(1, stats.viewingPage - 1))}
              disabled={stats.viewingPage === 1}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-400">
              Page {stats.viewingPage} of {stats.totalPages}
            </span>
            <button
              onClick={() => fetchPendingEvents(Math.min(stats.totalPages, stats.viewingPage + 1))}
              disabled={stats.viewingPage === stats.totalPages}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 rounded-lg border border-neutral-800 max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-white mb-4">
              {currentAction === 'approve' ? 'Approve Event' : 'Reject Event'}
            </h3>

            <div className="mb-6 p-4 bg-neutral-800 rounded-lg">
              <p className="text-sm text-white font-semibold mb-1">{selectedEvent.title}</p>
              <p className="text-xs text-gray-400">
                {selectedEvent.hostId.firstName} {selectedEvent.hostId.lastName}
              </p>
            </div>

            {currentAction === 'reject' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Reason for Rejection
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                  placeholder="Explain why you're rejecting this event..."
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={closeReviewModal}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (currentAction === 'approve') {
                    handleApproveEvent(selectedEvent._id);
                  } else {
                    handleRejectEvent(selectedEvent._id);
                  }
                }}
                disabled={actionLoading || (currentAction === 'reject' && !rejectionReason.trim())}
                className={`flex-1 px-4 py-2 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 ${
                  currentAction === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    {currentAction === 'approve' ? 'Approving...' : 'Rejecting...'}
                  </>
                ) : (
                  <>
                    {currentAction === 'approve' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    {currentAction === 'approve' ? 'Approve' : 'Reject'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}