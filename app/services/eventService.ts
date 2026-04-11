export interface EventData {
  title: string;
  description: string;
  date: string;
  venue: string;
  capacity: number;
  banner: string;
  category: string;
  tags?: string[];
}

export interface Event extends EventData {
  _id: string;
  hostId: string;
  status: 'draft' | 'Auditing' | 'live' | 'ended' | 'cancelled';
  ticketsSold: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventResponse {
  success: boolean;
  message: string;
  data: Event;
}

export interface GetHostEventsResponse {
  success: boolean;
  data: {
    events: Event[];
    total: number;
    page: number;
    limit: number;
  };
}

class EventService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://skills-k6pv.onrender.com';

  async createEvent(data: EventData, token: string): Promise<CreateEventResponse> {
    try {
      console.log('📝 Creating event:', data);

      const response = await fetch(`${this.baseUrl}/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ Create event error:', error);
        throw new Error(error.message || 'Failed to create event');
      }

      const result = await response.json();
      console.log('✅ Event created successfully:', result.data);
      return result;
    } catch (error) {
      console.error('❌ Create event service error:', error);
      throw error;
    }
  }

  // Upload banner to Cloudinary
  async uploadBanner(file: File, token: string): Promise<string> {
    try {
      console.log('☁️ Uploading image to Cloudinary...');

      // 1. Get signature (AUTH REQUIRED)
      const sigRes = await fetch(
        `${this.baseUrl}/api/events/cloudinary-signature`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!sigRes.ok) {
        const err = await sigRes.json();
        console.error('❌ Signature error:', err);
        throw new Error('Failed to get upload signature');
      }

      const data = await sigRes.json();

      const {
        signature,
        timestamp,
        apiKey,
        cloudName,
        folder = 'event_banner',
      } = data;

      // 2. Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);
      formData.append('folder', folder);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!uploadRes.ok) {
        const error = await uploadRes.json();
        console.error('❌ Cloudinary error:', error);
        throw new Error('Image upload failed');
      }

      const uploaded = await uploadRes.json();

      console.log('✅ Uploaded:', uploaded.secure_url);

      return uploaded.secure_url;
    } catch (error) {
      console.error('❌ Upload banner error:', error);
      throw error;
    }
  }
  async getHostEvents(token: string, page: number = 1, limit: number = 10): Promise<GetHostEventsResponse> {
    try {
      console.log('📖 Fetching host events:', { page, limit });

      const response = await fetch(`${this.baseUrl}/api/events/host?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ Get host events error:', error);
        throw new Error(error.message || 'Failed to fetch events');
      }

      const result = await response.json();
      console.log('✅ Host events fetched successfully:', result.data);
      return result;
    } catch (error) {
      console.error('❌ Get host events service error:', error);
      throw error;
    }
  }

  async getEventById(eventId: string, token: string): Promise<{ success: boolean; data: Event }> {
    try {
      console.log('📖 Fetching event:', eventId);

      const response = await fetch(`${this.baseUrl}/api/events/${eventId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ Get event error:', error);
        throw new Error(error.message || 'Failed to fetch event');
      }

      const result = await response.json();
      console.log('✅ Event fetched successfully:', result.data);
      return result;
    } catch (error) {
      console.error('❌ Get event service error:', error);
      throw error;
    }
  }

  async updateEvent(eventId: string, data: Partial<EventData>, token: string): Promise<CreateEventResponse> {
    try {
      console.log('✏️ Updating event:', eventId, data);

      const response = await fetch(`${this.baseUrl}/api/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ Update event error:', error);
        throw new Error(error.message || 'Failed to update event');
      }

      const result = await response.json();
      console.log('✅ Event updated successfully:', result.data);
      return result;
    } catch (error) {
      console.error('❌ Update event service error:', error);
      throw error;
    }
  }

  async deleteEvent(eventId: string, token: string): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🗑️ Deleting event:', eventId);

      const response = await fetch(`${this.baseUrl}/api/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ Delete event error:', error);
        throw new Error(error.message || 'Failed to delete event');
      }

      const result = await response.json();
      console.log('✅ Event deleted successfully');
      return result;
    } catch (error) {
      console.error('❌ Delete event service error:', error);
      throw error;
    }
  }
}

export default new EventService();
