'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { Loader2, ArrowLeft, Upload } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import eventService, { EventData } from '@/app/services/eventService';

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  const { token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

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

  // -------------------------
  // FETCH EVENT
  // -------------------------
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (!token) throw new Error('Authentication required');

        const res = await eventService.getEventById(eventId, token);

        if (res.success && res.data) {
          const event = res.data;

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
      } finally {
        setLoading(false);
      }
    };

    if (eventId && token) fetchEvent();
  }, [eventId, token]);

  // -------------------------
  // INPUT HANDLER
  // -------------------------
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // -------------------------
  // CLOUDINARY UPLOAD (same as create page)
  // -------------------------
  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    setError('');
    setUploading(true);

    try {
      const imageUrl = await eventService.uploadBanner(file, token);

      setBannerPreview(imageUrl);
      setFormData((prev) => ({
        ...prev,
        banner: imageUrl,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  // -------------------------
  // SUBMIT UPDATE
  // -------------------------
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (uploading) {
      setError('Please wait for image upload to finish');
      return;
    }

    setSubmitting(true);

    try {
      const capacityNum = parseInt(formData.capacity);

      if (!formData.title || !formData.description || !formData.date || !formData.venue || !formData.category) {
        throw new Error('All fields are required');
      }

      if (capacityNum <= 5) {
        throw new Error('Event capacity must be greater than 5');
      }

      if (!token) throw new Error('Authentication required');

      const payload: Partial<EventData> = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        venue: formData.venue,
        capacity: capacityNum,
        banner: formData.banner,
        category: formData.category,
        tags: formData.tags
          ? formData.tags.split(',').map((t) => t.trim())
          : [],
      };

      const res = await eventService.updateEvent(eventId, payload, token);

      if (res.success) {
        setSuccess('Event updated successfully!');

        setTimeout(() => {
          router.push('/dashboard/host');
        }, 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update event');
    } finally {
      setSubmitting(false);
    }
  };

  // -------------------------
  // LOADING UI
  // -------------------------
  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-10 h-10 text-gold animate-spin" />
        </div>
      </main>
    );
  }

  // -------------------------
  // UI (MATCHES CREATE PAGE STYLE)
  // -------------------------
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="container mx-auto px-4 pt-28 pb-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard/host" className="flex items-center gap-2 text-gold mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Edit Event
          </h1>
          <p className="text-gray-400">
            Update your event details
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg">
            {success}
          </div>
        )}

        {/* FORM (same structure as create page) */}
        <form onSubmit={handleSubmit} className="max-w-2xl">
          <div className="bg-gray-900/50 border border-gold/20 rounded-xl p-8 space-y-6">

            {/* Title */}
            <div>
              <label className="block text-sm mb-2">Event Title *</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gold/30 rounded-lg"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm mb-2">Event Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 bg-gray-800 border border-gold/30 rounded-lg"
                required
              />
            </div>

            {/* Date + Venue */}
            <div className="grid md:grid-cols-2 gap-6">
              <input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="px-4 py-2 bg-gray-800 border border-gold/30 rounded-lg"
                required
              />

              <input
                name="venue"
                value={formData.venue}
                onChange={handleInputChange}
                className="px-4 py-2 bg-gray-800 border border-gold/30 rounded-lg"
                required
              />
            </div>

            {/* Capacity + Category */}
            <div className="grid md:grid-cols-2 gap-6">
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                className="px-4 py-2 bg-gray-800 border border-gold/30 rounded-lg"
                min={6}
                required
              />

              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="px-4 py-2 bg-gray-800 border border-gold/30 rounded-lg"
                required
              >
                <option value="">Select category</option>
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

            {/* Tags */}
            <input
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="Tags (comma separated)"
              className="w-full px-4 py-2 bg-gray-800 border border-gold/30 rounded-lg"
            />

            {/* Banner */}
            <div>
              <label className="block text-sm mb-2">Event Banner</label>

              {/* Hidden input */}
              <input
                id="banner-upload"
                type="file"
                accept="image/*"
                onChange={handleBannerChange}
                className="hidden"
              />

              {/* Styled button */}
              <label
                htmlFor="banner-upload"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 
                          border border-gold/30 rounded-lg bg-gray-800 
                          text-gray-200 cursor-pointer 
                          hover:border-gold hover:bg-gray-700 transition"
              >
                <Upload className="w-4 h-4 text-gold" />
                <span>{uploading ? 'Uploading...' : 'Choose Banner Image'}</span>
              </label>

              {/* Preview */}
              {bannerPreview && (
                <img
                  src={bannerPreview}
                  className="mt-4 h-40 w-full object-cover rounded-lg border border-gold/20"
                />
              )}
            </div>

            {/* Submit */}
            <button
              disabled={submitting || uploading}
              className="w-full py-3 bg-gold text-black rounded-lg flex items-center justify-center gap-2"
            >
              {submitting ? 'Updating...' : 'Update Event'}
            </button>

          </div>
        </form>
      </div>
    </main>
  );
}