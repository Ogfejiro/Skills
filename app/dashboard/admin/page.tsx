// app/dashboard/admin/page.tsx - Complete Admin Dashboard
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { 
  Home, 
  Calendar, 
  Settings, 
  HelpCircle,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Plus,
  Copy,
  Check,
  Key,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Users,
  MessageCircle,
  MoreVertical,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Mock data for events
const mockEvents = [
  {
    id: '1',
    title: 'LOFTE-3 Dinner Night',
    date: '2026-03-27',
    location: 'Eko Hotels & Suites, Lagos',
    bannerImage: '/images/new.jpg',
    status: 'published',
    paymentStatus: 'paid',
    ticketSales: 342,
    revenue: 1250000,
    views: 15420,
    createdAt: '2026-02-15'
  },
  {
    id: '2',
    title: 'METAMASK COMMUNITY BUILDERS NIGHT',
    date: '2026-03-14',
    location: 'Abuja, Nigeria',
    bannerImage: '/images/meta.jpg',
    status: 'past',
    paymentStatus: 'paid',
    ticketSales: 156,
    revenue: 450000,
    views: 8900,
    createdAt: '2026-02-20'
  },
  {
    id: '3',
    title: 'NFT Art Gala Night',
    date: '2026-04-05',
    location: 'Digital Gallery, Lagos',
    bannerImage: '/images/event2.jpg',
    status: 'review',
    paymentStatus: 'paid',
    ticketSales: 0,
    revenue: 0,
    views: 0,
    createdAt: '2026-02-25'
  },
  {
    id: '4',
    title: 'Crypto Trading Summit',
    date: '2026-05-10',
    location: 'Landmark Centre, Lagos',
    bannerImage: '/images/event3.jpg',
    status: 'pending',
    paymentStatus: 'pending',
    ticketSales: 0,
    revenue: 0,
    views: 0,
    createdAt: '2026-02-10'
  }
];

export default function AdminDashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState(mockEvents);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewComments, setReviewComments] = useState('');
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | 'changes'>('approve');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    } else if (user && user.role !== 'Admin') {
      router.push('/dashboard/user');
    } else {
      setLoading(false);
    }
  }, [authLoading, isAuthenticated, user, router]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock, label: 'Pending Payment' },
      review: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Eye, label: 'Under Review' },
      approved: { bg: 'bg-purple-100', text: 'text-purple-800', icon: CheckCircle, label: 'Approved' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle, label: 'Rejected' },
      published: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, label: 'Published' },
      past: { bg: 'bg-gray-100', text: 'text-gray-800', icon: Clock, label: 'Past Event' }
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

  const handleReview = (eventId: string, action: 'approve' | 'reject' | 'changes') => {
    setSelectedEvent(eventId);
    setReviewAction(action);
    setShowReviewModal(true);
  };

  const submitReview = () => {
    if (selectedEvent) {
      setEvents(prev => prev.map(event => 
        event.id === selectedEvent 
          ? { ...event, status: reviewAction === 'approve' ? 'published' : reviewAction === 'reject' ? 'rejected' : 'review' }
          : event
      ));
    }
    setShowReviewModal(false);
    setReviewComments('');
  };

  const stats = {
    totalEvents: events.length,
    publishedEvents: events.filter(e => e.status === 'published').length,
    pendingReview: events.filter(e => e.status === 'review').length,
    pendingPayment: events.filter(e => e.paymentStatus === 'pending').length,
    totalRevenue: events.reduce((sum, e) => sum + e.revenue, 0),
    totalTickets: events.reduce((sum, e) => sum + e.ticketSales, 0)
  };

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-black">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 text-gold animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading admin dashboard...</p>
        </div>
      </main>
    );
  }

  if (!user || user.role !== 'Admin') return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">Manage events, users, and platform settings</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.firstName?.charAt(0) || 'A'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
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

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search events by title or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                <option value="published">Published</option>
                <option value="past">Past Events</option>
              </select>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Filter size={18} />
                Filters
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
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Event</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date & Location</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Performance</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                          <img src={event.bannerImage} alt={event.title} className="w-full h-full object-cover" />
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
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <span className="truncate max-w-[200px]">{event.location}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(event.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Users size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-600">{event.ticketSales} tickets</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-600">₦{(event.revenue / 1000).toFixed(1)}k</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {event.status === 'review' && (
                          <button
                            onClick={() => handleReview(event.id, 'approve')}
                            className="p-1 text-green-600 hover:bg-green-50 rounded-lg"
                            title="Review Event"
                          >
                            <MessageCircle size={18} />
                          </button>
                        )}
                        <button className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg" title="View Details">
                          <Eye size={18} />
                        </button>
                        <button className="p-1 text-gray-600 hover:bg-gray-50 rounded-lg" title="Edit">
                          <Edit size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
                placeholder="Enter comments..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={submitReview}
                className={`flex-1 px-4 py-2 text-white rounded-lg ${
                  reviewAction === 'approve' ? 'bg-green-500 hover:bg-green-600' :
                  reviewAction === 'reject' ? 'bg-red-500 hover:bg-red-600' :
                  'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {reviewAction === 'approve' && 'Approve'}
                {reviewAction === 'reject' && 'Reject'}
                {reviewAction === 'changes' && 'Request Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}