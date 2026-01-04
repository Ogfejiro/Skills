'use client';

import { motion } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Users, 
  History,
  ArrowLeft,
  Sparkles,
  Coins,
  Home,
  ExternalLink
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function PreviousEventsPage() {
  const previousEvents = [
    {
      id: 1,
      title: "Afriverse CCFTC",
      description: "Hosted the groundbreaking Afriverse CCFTC (Crypto & Commodity Futures Trading Conference) event in Jos, Plateau State. This pioneering event brought together traders, investors, and crypto enthusiasts to explore the future of digital assets and commodity trading in Africa.",
      date: "November, 2025",
      location: "Jos, Nigeria",
      attendees: "300+",
      image: "/images/ctffct.jpg",
      link: "https://x.com/i/status/1993282618797048112", // Replace with your actual CCFTC link
      highlights: ["Trading Workshops", "Merch Giveaways", "Networking Sessions", "Market Analysis", "Commodity Trading Demos"]
    },
    {
      id: 2,
      title: "NFT Holders Games Weekend by THE Boiz",
      description: "An exclusive gaming extravaganza for NFT holders featuring competitive tournaments, strategic gameplay sessions, and premium networking opportunities. This event celebrated the intersection of gaming culture and blockchain technology.",
      date: "August, 2025",
      location: "Port Harcourt, Nigeria",
      attendees: "100+",
      image: "/images/dboys.jpg",
      link: "https://x.com/i/status/2007340472709296637", // Replace with your actual NFT Games link
      highlights: ["Gaming Tournaments", "Premium Catering", "Exclusive House Party", "NFT Holder Networking", "Prize Pool Events"]
    },
  ];

  // Function to open external link
  const openLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.2 }}
            transition={{ duration: 0.6 }}
            className="absolute top-20 left-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl"
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.2 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="absolute bottom-20 right-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-gold text-gold font-medium hover:bg-gold/10 transition cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="inline-block p-3 rounded-full bg-gold/10 border border-gold/20 mb-6"
            >
              <History className="w-12 h-12 text-gold" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="text-4xl md:text-6xl font-bold mb-4"
            >
              <span className="gold-gradient">Previous</span>
              <span className="text-white ml-3">Events</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="text-gray-400 text-lg max-w-2xl mx-auto"
            >
              Relive the memories from our past successful events across Africa
            </motion.p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-20"
          >
            {[
              { icon: <History className="w-6 h-6" />, value: "2", label: "Past Events" },
              { icon: <Users className="w-6 h-6" />, value: "500+", label: "Total Attendees" },
              { icon: <MapPin className="w-6 h-6" />, value: "2", label: "States" },
              { icon: <Sparkles className="w-6 h-6" />, value: "100%", label: "Success Rate" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className="text-center p-6 rounded-2xl bg-gold/5 border border-gold/10"
              >
                <div className="text-gold flex justify-center mb-3">
                  {stat.icon}
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-10 pb-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {previousEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <div className="bg-black/50 rounded-2xl overflow-hidden border border-gold/20 hover:border-gold/50 transition-all duration-300 h-full">
                  {/* Clickable Event Image - Each with its own link */}
                  <div className="relative h-48 overflow-hidden">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => event.link && openLink(event.link)}
                      className="w-full h-full cursor-pointer"
                    >
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      {/* Clickable overlay with external link icon */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
                        <motion.div
                          initial={{ scale: 0 }}
                          whileHover={{ scale: 1.1 }}
                          className="p-4 rounded-full bg-gold/20 backdrop-blur-sm border border-gold"
                        >
                          <ExternalLink className="w-6 h-6 text-gold" />
                        </motion.div>
                      </div>
                      
                      <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/80 backdrop-blur-sm border border-gold">
                        <span className="text-xs text-gold font-medium">PAST EVENT</span>
                      </div>
                    </motion.div>
                  </div>

                  {/* Event Content */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gold transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-gray-300 text-sm mb-4">
                        {event.description}
                      </p>
                    </div>

                    {/* Event Details */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-gold" />
                        <span className="text-sm text-gray-300">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-gold" />
                        <span className="text-sm text-gray-300">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-gold" />
                        <span className="text-sm text-gray-300">{event.attendees} attendees</span>
                      </div>
                    </div>

                    {/* Event Highlights */}
                    <div>
                      <h4 className="text-sm font-semibold text-gold mb-2">Highlights:</h4>
                      <div className="flex flex-wrap gap-2">
                        {event.highlights.map((highlight, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-xs text-gray-300"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* View More Button - Also clickable to external link */}
                    {event.link && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openLink(event.link)}
                        className="w-full mt-6 px-4 py-2 rounded-lg border border-gold text-gold text-sm font-medium hover:bg-gold/10 transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>View Video Highlight</span>
                        <ExternalLink className="w-3 h-3" />
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}