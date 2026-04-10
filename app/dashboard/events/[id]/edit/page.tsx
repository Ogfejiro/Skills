'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { Loader2, ArrowLeft, Upload } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import eventService, { EventData, Event } from '@/app/services/eventService';

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [bannerPreview, setBannerPreview] = useState<string>('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    venue: '',
    capacity: '',
    banner: '',
    category: '',
    tags: '',
  });

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (!token) throw new Error('Authentication required');
        
        const response = await eventService.getEventById(eventId, token);
        if (response.success && response.data) {
          const event = response.data;
          setFormData({
            title: event.title,
            description: event.description,
            date: event.date,
            venue: event.venue,
            capacity: event.capacity.toString(),
            banner: event.banner || '',
            category: event.category,
            tags: event.tags?.join(', ') || '',
          });
          setBannerPreview(event.banner || '');
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setBannerPreview(result);
        setFormData(prev => ({
          ...prev,
          banner: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.date || !formData.venue || !formData.capacity || !formData.category) {
        throw new Error('All fields are required');
      }

      // Validate capacity
      const capacityNum = parseInt(formData.capacity);
      if (capacityNum <= 5) {
        throw new Error('Event capacity must be greater than 5');
      }

      if (!token) {
        throw new Error('Authentication required');
      }

      const eventData: Partial<EventData> = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        venue: formData.venue,
        capacity: capacityNum,
        banner: formData.banner,
        category: formData.category,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
      };

      const response = await eventService.updateEvent(eventId, eventData, token);

      if (response.success) {
        setSuccess('Event updated successfully!');

        // Redirect to host dashboard after 2 seconds
        setTimeout(() => {
          router.push('/dashboard/host');
        }, 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update event');
      console.error('Error updating event:', err);
    } finally {
      setSubmitting(false);
    }
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
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Edit Event</h1>
          <p className="text-gray-400">Update your event details</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 border border-red-500/30 bg-red-500/10 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mb-6 p-4 border border-green-500/30 bg-green-500/10 rounded-lg text-green-400">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-2xl">
          <div className="bg-gray-900/50 border border-gold/20 rounded-xl p-8 space-y-6">
            {/* Event Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Event Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Tech Conference 2026"
                className="w-full px-4 py-2 bg-gray-800 border border-gold/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold transition"
                required
              />
            </div>

            {/* Event Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Event Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your event in detail..."
                rows={4}
                className="w-full px-4 py-2 bg-gray-800 border border-gold/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold transition"
                required
              />
            </div>

            {/* Event Date and Venue */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Event Date *</label>
                <input
                  type="datetime-local"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-800 border border-gold/30 rounded-lg text-white focus:outline-none focus:border-gold transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Venue/Location *</label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleInputChange}
                  placeholder="e.g., Lagos Convention Centre"
                  className="w-full px-4 py-2 bg-gray-800 border border-gold/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold transition"
                  required
                />
              </div>
            </div>

            {/* Capacity and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Event Capacity *</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  placeholder="Minimum 6 attendees"
                  min="6"
                  className="w-full px-4 py-2 bg-gray-800 border border-gold/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-800 border border-gold/30 rounded-lg text-white focus:outline-none focus:border-gold transition"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Technology">Technology</option>
                  <option value="Business">Business</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Sports">Sports</option>
                  <option value="Education">Education</option>
                  <option value="Art & Culture">Art & Culture</option>
                  <option value="Social">Social</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="e.g., tech, innovation, networking"
                className="w-full px-4 py-2 bg-gray-800 border border-gold/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold transition"
              />
            </div>

            {/* Banner Image */}
            <div>
              <label className="block text-sm font-medium mb-2">Event Banner Image</label>
              <div className="border-2 border-dashed border-gold/30 rounded-lg p-6 text-center cursor-pointer hover:border-gold transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerChange}
                  className="hidden"
                  id="banner-input"
                />
                <label htmlFor="banner-input" className="cursor-pointer">
                  {bannerPreview ? (
                    <div>
                      <img src={bannerPreview} alt="Banner preview" className="w-full h-48 object-cover rounded-lg mb-2" />
                      <p className="text-gold text-sm">Click to change image</p>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 text-gold mx-auto mb-2" />
                      <p className="text-gray-300">Click to upload or drag and drop</p>
                      <p className="text-gray-500 text-sm">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gold text-black font-bold rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating Event...
                  </>
                ) : (
                  'Update Event'
                )}
              </button>
              <Link
                href="/dashboard/host"
                className="flex-1 flex items-center justify-center px-6 py-3 border border-gold/30 rounded-lg hover:bg-gray-800 transition"
              >
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
