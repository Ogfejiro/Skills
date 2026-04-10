'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { Loader2, ArrowLeft, Upload } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import eventService, { EventData } from '@/app/services/eventService';

export default function CreateEventPage() {
  const router = useRouter();
  const { token } = useAuth();

  const [loading, setLoading] = useState(false);
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Cloudinary upload via eventService
  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setUploading(true);

    try {
      const imageUrl = await eventService.uploadBanner(file);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (uploading) {
      setError('Please wait for image upload to finish');
      return;
    }

    setLoading(true);

    try {
      // Validation
      if (
        !formData.title ||
        !formData.description ||
        !formData.date ||
        !formData.venue ||
        !formData.capacity ||
        !formData.banner ||
        !formData.category
      ) {
        throw new Error('All fields are required');
      }

      const capacityNum = parseInt(formData.capacity);
      if (capacityNum <= 5) {
        throw new Error('Event capacity must be greater than 5');
      }

      if (new Date(formData.date).getTime() < Date.now()) {
        throw new Error('Event date cannot be in the past');
      }

      if (!token) {
        throw new Error('Authentication required');
      }

      const eventData: EventData = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        venue: formData.venue,
        capacity: capacityNum,
        banner: formData.banner, // ✅ Cloudinary URL
        category: formData.category,
        tags: formData.tags
          ? formData.tags.split(',').map((tag) => tag.trim())
          : [],
      };

      const response = await eventService.createEvent(eventData, token);

      if (response.success) {
        setSuccess('Event created successfully! It is now pending review.');

        setFormData({
          title: '',
          description: '',
          date: '',
          venue: '',
          capacity: '',
          banner: '',
          category: '',
          tags: '',
        });

        setBannerPreview('');

        setTimeout(() => {
          router.push('/dashboard/host');
        }, 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Create New Event
          </h1>
          <p className="text-gray-400">
            Fill in the details below to create your event
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 border border-red-500/30 bg-red-500/10 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 border border-green-500/30 bg-green-500/10 rounded-lg text-green-400">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-2xl">
          <div className="bg-gray-900/50 border border-gold/20 rounded-xl p-8 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm mb-2">Event Title *</label>
              <input
                type="text"
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

            {/* Date & Venue */}
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
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleInputChange}
                placeholder="Venue"
                className="px-4 py-2 bg-gray-800 border border-gold/30 rounded-lg"
                required
              />
            </div>

            {/* Capacity & Category */}
            <div className="grid md:grid-cols-2 gap-6">
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                min="6"
                placeholder="Capacity"
                className="px-4 py-2 bg-gray-800 border border-gold/30 rounded-lg"
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
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="Tags (comma separated)"
              className="w-full px-4 py-2 bg-gray-800 border border-gold/30 rounded-lg"
            />

            {/* Banner Upload */}
            <div>
              <label className="block text-sm mb-2">Event Banner *</label>

              <input
                type="file"
                accept="image/*"
                onChange={handleBannerChange}
                className="mb-2"
                required
              />

              {uploading && (
                <p className="text-sm text-gray-400">Uploading image...</p>
              )}

              {bannerPreview && (
                <img
                  src={bannerPreview}
                  alt="Banner preview"
                  className="mt-4 h-40 w-full object-cover rounded-lg"
                />
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || uploading}
              className="w-full py-3 bg-gold text-black rounded-lg flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" />
                  Creating...
                </>
              ) : (
                'Create Event'
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}