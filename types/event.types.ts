// types/event.types.ts
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  venue: string;
  bannerImage: string;
  galleryImages?: string[];
  ticketTypes: TicketType[];
  organizerId: string;
  organizerName: string;
  organizerEmail: string;
  organizerPhone?: string;
  status: 'pending' | 'review' | 'approved' | 'rejected' | 'published' | 'past';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentReference?: string;
  paymentAmount: number;
  featured: boolean;
  category: 'conference' | 'workshop' | 'party' | 'networking' | 'other';
  tags: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  rejectionReason?: string;
  views: number;
  ticketSales: number;
}

export interface TicketType {
  id: string;
  name: string;
  price: number;
  currency: 'NGN' | 'USD';
  quantity: number;
  sold: number;
  benefits: string[];
  description: string;
  maxPerOrder?: number;
  saleEnds?: string;
}

export interface EventReview {
  id: string;
  eventId: string;
  reviewerId: string;
  reviewerName: string;
  comments: string;
  status: 'pending' | 'approved' | 'changes_requested';
  requestedChanges?: string;
  reviewedAt?: string;
}