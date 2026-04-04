// app/dashboard/events/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar,
  MapPin,
  Clock,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock as ClockIcon,
  DollarSign,
  Users,
  TrendingUp,
  Download,
  MoreVertical,
  Copy,
  Share2,
  Star,
  MessageCircle
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface DashboardEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  bannerImage: string;
  status: 'pending' | 'review' | 'approved' | 'rejected' | 'published' | 'past';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  ticketSales: number;
  revenue: number;
  views: number;
  createdAt: string;
}

export default function EventsDashboard() {
  const [events, setEvents] = useState<DashboardEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewComments, setReviewComments] = useState('');
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | 'changes'>('approve');

  // Mock data for demonstration
  useEffect(() => {
    const mockEvents: DashboardEvent[] = [
      {
        id: '1',
        title: 'LOFTE-3 Dinner Night',
        date: '2026-03-27',
        location: 'Eko Hotels & Suites, Lagos',
        bannerImage: '/images/event1.jpg',
        status: 'published',
        paymentStatus: 'paid',
        ticketSales: 342,
        revenue: 1250000,
        views: 15420,
        createdAt: '2026-02-15'
      },
      {
        id: '2',
        title: 'NFT Art Gala Night',
        date: '2026-04-05',
        location: 'Digital Gallery, Lagos',
        bannerImage: '/images/event2.jpg',
        status: 'review',
        paymentStatus: 'paid',
        ticketSales: 0,
        revenue: 0,
        views: 0,
        createdAt: '2026-02-20'
      },
      {
        id: '3',
        title: 'Web3 Developers Conference',
        date: '2026-05-10',
        location: 'Virtual Event',
        bannerImage: '/images/event3.jpg',
        status: 'pending',
        paymentStatus: 'pending',
        ticketSales: 0,
        revenue: 0,
        views: 0,
        createdAt: '2026-02-25'
      },
      {
        id: '4',
        title: 'Crypto Trading Summit',
        date: '2026-03-15',
        location: 'Landmark Centre, Lagos',
        bannerImage: '/images/event4.jpg',
        status: 'rejected',
        paymentStatus: 'refunded',
        ticketSales: 0,
        revenue: 0,
        views: 0,
        createdAt: '2026-02-10'
      }
    ];

    setTimeout(() => {
      setEvents(mockEvents);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: ClockIcon, label: 'Pending Payment' },
      review: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Eye, label: 'Under Review' },
      approved: { bg: 'bg-purple-100', text: 'text-purple-800', icon: CheckCircle, label: 'Approved' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle, label: 'Rejected' },
      published: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, label: 'Published' },
      past: { bg: 'bg-gray-100', text: 'text-gray-800', icon: ClockIcon, label: 'Past Event' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon size={12} />
        {config.label}
      </span>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">Paid</span>;
      case 'pending':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pending</span>;
      case 'refunded':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs">Refunded</span>;
      default:
        return null;
    }
  };

  const handleReview = (eventId: string, action: 'approve' | 'reject' | 'changes') => {
    setSelectedEvent(eventId);
    setReviewAction(action);
    setShowReviewModal(true);
  };

  const submitReview = () => {
    // API call to submit review
    console.log('Review submitted:', { eventId: selectedEvent, action: reviewAction, comments: reviewComments });
    setShowReviewModal(false);
    setReviewComments('');
    // Update events list
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalEvents: events.length,
    publishedEvents: events.filter(e => e.status === 'published').length,
    pendingReview: events.filter(e => e.status === 'review').length,
    pendingPayment: events.filter(e => e.paymentStatus === 'pending').length,
    totalRevenue: events.reduce((sum, e) => sum + e.revenue, 0),
    totalTickets: events.reduce((sum, e) => sum + e.ticketSales, 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Event Management</h1>
              <p className="text-sm text-gray-500">Create, manage, and review your events</p>
            </div>
            <Link
              href="/dashboard/events/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              <Plus size={20} />
              <span>Create New Event</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-500 mb-1">Total Events</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-500 mb-1">Published</p>
            <p className="text-2xl font-bold text-green-600">{stats.publishedEvents}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-500 mb-1">Under Review</p>
            <p className="text-2xl font-bold text-blue-600">{stats.pendingReview}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-500 mb-1">Pending Payment</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pendingPayment}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-emerald-600">₦{(stats.totalRevenue / 1000).toFixed(1)}k</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-500 mb-1">Tickets Sold</p>
            <p className="text-2xl font-bold text-purple-600">{stats.totalTickets}</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search events by title or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending Payment</option>
                <option value="review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="published">Published</option>
                <option value="rejected">Rejected</option>
                <option value="past">Past Events</option>
              </select>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Filter size={18} />
                <span className="hidden sm:inline">More Filters</span>
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Events Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Event</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Location</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Performance</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <Calendar size={48} className="text-gray-300 mb-3" />
                        <p className="text-lg font-medium text-gray-700 mb-1">No events found</p>
                        <p className="text-sm text-gray-500 mb-4">Create your first event to get started</p>
                        <Link
                          href="/dashboard/events/create"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                        >
                          <Plus size={18} />
                          Create Event
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            {event.bannerImage && (
                              <img
                                src={event.bannerImage}
                                alt={event.title}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{event.title}</p>
                            <p className="text-xs text-gray-500">ID: {event.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Calendar size={14} />
                            <span>{new Date(event.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <MapPin size={14} />
                            <span className="truncate max-w-[200px]">{event.location}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(event.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {getPaymentStatusBadge(event.paymentStatus)}
                          <p className="text-xs text-gray-500">
                            ₦{(event.revenue / 1000).toFixed(1)}k
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Users size={14} className="text-gray-400" />
                            <span className="text-sm text-gray-600">{event.ticketSales} tickets</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Eye size={14} className="text-gray-400" />
                            <span className="text-sm text-gray-600">{event.views.toLocaleString()} views</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(event.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {event.status === 'review' && (
                            <button
                              onClick={() => handleReview(event.id, 'approve')}
                              className="p-1 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Review Event"
                            >
                              <MessageCircle size={18} />
                            </button>
                          )}
                          <Link
                            href={`/dashboard/events/${event.id}`}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </Link>
                          <Link
                            href={`/dashboard/events/${event.id}/edit`}
                            className="p-1 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            title="Edit Event"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                            title="More options"
                          >
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredEvents.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredEvents.length}</span> of{' '}
                <span className="font-medium">{filteredEvents.length}</span> events
              </p>
              <div className="flex gap-2">
                <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50">
                  <ChevronLeft size={16} />
                </button>
                <button className="w-8 h-8 flex items-center justify-center bg-emerald-500 text-white rounded-lg">
                  1
                </button>
                <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50">
                  2
                </button>
                <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50">
                  3
                </button>
                <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {reviewAction === 'approve' && 'Approve Event'}
              {reviewAction === 'reject' && 'Reject Event'}
              {reviewAction === 'changes' && 'Request Changes'}
            </h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {reviewAction === 'approve' && 'Approval Comments (Optional)'}
                {reviewAction === 'reject' && 'Reason for Rejection'}
                {reviewAction === 'changes' && 'Changes Required'}
              </label>
              <textarea
                value={reviewComments}
                onChange={(e) => setReviewComments(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder={
                  reviewAction === 'approve' ? 'Add any comments...' :
                  reviewAction === 'reject' ? 'Explain why this event is being rejected...' :
                  'List the changes needed for this event...'
                }
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitReview}
                className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
                  reviewAction === 'approve' ? 'bg-green-500 hover:bg-green-600' :
                  reviewAction === 'reject' ? 'bg-red-500 hover:bg-red-600' :
                  'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {reviewAction === 'approve' && 'Approve Event'}
                {reviewAction === 'reject' && 'Reject Event'}
                {reviewAction === 'changes' && 'Request Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}