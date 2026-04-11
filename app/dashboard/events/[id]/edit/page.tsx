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

  // Fetch event
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
      } finally {
        setLoading(false);
      }
    };

    if (eventId && token) fetchEvent();
  }, [eventId, token]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Cloudinary upload
  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!token) {
    setError('Authentication required');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const imageUrl = await eventService.uploadBanner(file, token!);

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

    setSubmitting(true);

    try {
      if (
        !formData.title ||
        !formData.description ||
        !formData.date ||
        !formData.venue ||
        !formData.capacity ||
        !formData.category
      ) {
        throw new Error('All fields are required');
      }

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
        banner: formData.banner, // ✅ Cloudinary URL
        category: formData.category,
        tags: formData.tags
          ? formData.tags.split(',').map((tag) => tag.trim())
          : [],
      };

      const response = await eventService.updateEvent(eventId, eventData, token);

      if (response.success) {
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
        <div className="mb-8">
          <Link
            href="/dashboard/host"
            className="flex items-center gap-2 text-gold mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <h1 className="text-3xl font-bold mb-2">Edit Event</h1>
        </div>

        {error && <div className="mb-4 text-red-400">{error}</div>}
        {success && <div className="mb-4 text-green-400">{success}</div>}

        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
          <input name="title" value={formData.title} onChange={handleInputChange} required />
          <textarea name="description" value={formData.description} onChange={handleInputChange} required />

          {/* Banner */}
          <div>
            <input type="file" accept="image/*" onChange={handleBannerChange} />

            {uploading && (
              <p className="text-sm text-gray-400 mt-2">Uploading image...</p>
            )}

            {bannerPreview && (
              <img src={bannerPreview} className="mt-3 h-40 rounded-lg" />
            )}
          </div>

          <button
            type="submit"
            disabled={submitting || uploading}
            className="bg-gold px-6 py-3 rounded-lg"
          >
            {submitting ? 'Updating...' : 'Update Event'}
          </button>
        </form>
      </div>
    </main>
  );
}