// components/Events/EventCard.tsx
"use client";

import { Calendar, MapPin, Users, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface EventCardProps {
  event: any;
  currency: 'NGN' | 'USD';
  exchangeRate: number;
}

export default function EventCard({ event, currency, exchangeRate }: EventCardProps) {
  const formatPrice = (priceUSD: number) => {
    if (currency === 'NGN') {
      return `₦${(priceUSD * exchangeRate).toLocaleString()}`;
    }
    return `$${priceUSD}`;
  };

  const getCheapestTicket = () => {
    if (!event.tickets || event.tickets.length === 0) return formatPrice(0);
    const cheapest = Math.min(...event.tickets.map((t: any) => t.priceUSD));
    return formatPrice(cheapest);
  };

  const handleBuyTickets = () => {
    // Redirect to event detail page or open modal
    window.location.href = `/events/${event.id}`;
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group bg-black border border-gold/20 rounded-2xl overflow-hidden hover:border-gold/40 transition-all duration-300 hover:shadow-2xl hover:shadow-gold/10"
    >
      {/* Event Image */}
      <div className="relative h-48 bg-gradient-to-br from-gold/20 to-purple-500/20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-black/80 text-gold text-xs rounded-full border border-gold/30">
            {event.tickets?.length || 0} Options
          </span>
        </div>
        <div className="absolute bottom-4 left-4">
          <span className="px-3 py-1 bg-gold text-black text-xs font-bold rounded-full">
            From {getCheapestTicket()}
          </span>
        </div>
      </div>

      {/* Event Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 line-clamp-1 group-hover:text-gold transition-colors">
          {event.title}
        </h3>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        {/* Event Details */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-gold" />
            <span className="text-gray-300">
              {new Date(event.date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-gold" />
            <span className="text-gray-300">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-gold" />
            <span className="text-gray-300">
              {event.availableTickets} of {event.totalTickets} tickets left
            </span>
          </div>
        </div>

        {/* Ticket Options */}
        <div className="mb-6">
          <div className="text-sm text-gray-400 mb-2">Available Tickets:</div>
          <div className="flex flex-wrap gap-2">
            {event.tickets?.slice(0, 2).map((ticket: any) => (
              <span
                key={ticket.id}
                className="px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-lg text-sm"
              >
                {ticket.type}: {formatPrice(ticket.priceUSD)}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleBuyTickets}
            className="flex-1 py-3 bg-gradient-to-r from-gold to-gold/80 text-black font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            Buy Tickets
          </button>
          <button className="px-4 py-3 border border-gray-700 rounded-lg hover:bg-gray-900 transition-colors flex items-center justify-center">
            <ExternalLink className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}