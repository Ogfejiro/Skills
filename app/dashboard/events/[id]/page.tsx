'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { Loader2, ArrowLeft, Calendar, MapPin, Users, Tag } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import eventService, { Event } from '@/app/services/eventService';

export default function ViewEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [event, setEvent] = useState<Event | null>(null);

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (!token) throw new Error('Authentication required');
        
        const response = await eventService.getEventById(eventId, token);
        if (response.success && response.data) {
          setEvent(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load event');
        console.error('Error fetching event:', err);
      } finally {
        setLoading(false);
      }
    };

    if (eventId && token) {
      fetchEvent();
    }
  }, [eventId, token]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
            🔴 Live
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            ⏳ Draft
          </span>
        );
      case 'Auditing':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
            🔍 Auditing
          </span>
        );
      case 'ended':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gray-500/20 text-gray-400 border border-gray-500/30">
            ✓ Ended
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
            ✕ Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gray-500/20 text-gray-400 border border-gray-500/30">
            Unknown
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 text-gold animate-spin" />
          <p className="text-gray-400 ml-4">Loading event details...</p>
        </div>
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="container mx-auto px-4 pt-28 pb-12">
          <Link
            href="/dashboard/host"
            className="flex items-center gap-2 text-gold hover:text-gold/80 transition mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="p-6 border border-red-500/30 bg-red-500/10 rounded-lg text-red-400">
            {error || 'Event not found'}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="container mx-auto px-4 pt-28 pb-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/host"
            className="flex items-center gap-2 text-gold hover:text-gold/80 transition mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>

        {/* Event Banner */}
        {event.banner && (
          <div className="mb-8 rounded-xl overflow-hidden border border-gold/20">
            <img 
              src={event.banner} 
              alt={event.title}
              className="w-full h-96 object-cover"
            />
          </div>
        )}

        {/* Event Details Card */}
        <div className="bg-gray-900/50 border border-gold/20 rounded-xl p-8 space-y-6">
          {/* Title and Status */}
          <div>
            <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
            <div className="flex items-center gap-3 flex-wrap">
              {getStatusBadge(event.status)}
              {event.category && (
                <span className="inline-block px-3 py-1 text-sm bg-gray-800 text-gray-300 rounded-lg border border-gold/20">
                  {event.category}
                </span>
              )}
            </div>
          </div>

          {/* Key Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                <div>
                  <p className="text-gray-400 text-sm">Date & Time</p>
                  <p className="text-white">{formatDate(event.date)}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                <div>
                  <p className="text-gray-400 text-sm">Venue</p>
                  <p className="text-white">{event.venue}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                <div>
                  <p className="text-gray-400 text-sm">Capacity</p>
                  <p className="text-white">{event.ticketsSold} / {event.capacity} attendees</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-gray-400 text-sm mb-2">Description</p>
              <p className="text-white whitespace-pre-wrap">{event.description}</p>
            </div>
          </div>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div>
              <p className="text-gray-400 text-sm mb-3">Tags</p>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, index) => (
                  <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-gold/10 text-gold rounded-lg border border-gold/30 text-sm">
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Link
              href={`/dashboard/events/${event._id}/edit`}
              className="flex-1 px-6 py-3 bg-gold text-black font-bold rounded-lg hover:opacity-90 transition text-center"
            >
              Edit Event
            </Link>
            <Link
              href="/dashboard/host"
              className="flex-1 px-6 py-3 border border-gold/30 rounded-lg hover:bg-gray-800 transition text-center"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
