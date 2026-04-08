'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Calendar, MapPin, Users, ArrowRight, Sparkles, ChevronRight, History, Coins, Home, Clock, Ticket, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import TicketModal from '@/components/TicketModal';

export default function HomePage() {
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  
  const openLink = (link: string) => {
    if (link) {
      window.open(link, '_blank');
    }
  };

  const xAccountLink = 'https://x.com';
  const learnMoreLink = 'https://example.com/about';
  const calendlyLink = 'https://calendly.com';

  const eventImages = {
    mainParty: '/images/new.jpg',
    valentineEvent: '/images/valentine.jpg',
  };
  
  const featuredEvent = {
    id: 1,
    title: 'LOFTE-3 Project Hangout & Dinner',
    date: 'March 27, 2026',
    location: 'Eko Hotels & Suites, Lagos',
    image: '/images/new.jpg',
    attendees: 500,
    description: 'An exclusive evening with Web3 elites'
  };

  const platformStats = [
    { label: 'Events Today', value: '♾️' },
    { label: 'Active Members', value: '10K+' },
    { label: 'Across Africa', value: '♾️' },
  ];

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar />

      <TicketModal 
        isOpen={isTicketModalOpen} 
        onClose={() => setIsTicketModalOpen(false)} 
      />

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-20 md:pt-0 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.15 }}
            transition={{ duration: 0.8 }}
            className="absolute top-0 right-0 w-96 h-96 bg-gold/40 rounded-full blur-3xl"
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="absolute bottom-0 left-0 w-96 h-96 bg-gold/30 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* LEFT: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-block mb-6"
              >
                <span className="px-4 py-2 rounded-full bg-gold/10 border border-gold/30 text-gold text-sm font-medium">
                  ✨ Premium Event Platform
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              >
                Where Web3 Meets 
                <span className="text-gold"> Reality</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-300 mb-8 max-w-lg leading-relaxed"
              >
                Discover, list, and join unforgettable Web3 events across Africa. Connect with innovators, founders, and community leaders in exclusive IRL experiences.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <button
                  onClick={() => setIsTicketModalOpen(true)}
                  className="group px-8 py-4 bg-gradient-to-r from-gold to-yellow-500 text-black font-bold rounded-lg hover:shadow-xl hover:shadow-gold/40 transition-all flex items-center justify-center gap-2"
                >
                  Get Tickets Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <a
                  href="#featured"
                  className="px-8 py-4 border-2 border-gold text-gold font-bold rounded-lg hover:bg-gold/10 transition-all flex items-center justify-center gap-2"
                >
                  Explore Events
                  <ArrowRight className="w-5 h-5" />
                </a>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-gold/20"
              >
                {platformStats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-3xl font-bold text-gold mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* RIGHT: Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden border-2 border-gold/30 shadow-2xl shadow-gold/20">
                <img
                  src={featuredEvent.image}
                  alt="Featured Event"
                  className="w-full h-96 md:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                
                {/* Event Info Card */}
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="absolute bottom-0 left-0 right-0 p-6 bg-black/80 backdrop-blur-md"
                >
                  <h3 className="text-xl font-bold mb-3">{featuredEvent.title}</h3>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gold" />
                      {featuredEvent.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gold" />
                      {featuredEvent.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gold" />
                      {featuredEvent.attendees}+ Attendees
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURED EVENTS SECTION */}
      <section id="featured" className="relative py-20 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="px-4 py-2 rounded-full bg-gold/10 border border-gold/30 text-gold text-sm font-medium inline-block mb-4">
              🔥 Featured Event
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Premium Web3 Experience
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Join our flagship event featuring elite networking and exclusive experiences
            </p>
          </motion.div>

          {/* Event Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/30 rounded-2xl overflow-hidden p-8 max-w-4xl mx-auto"
          >
            <div className="grid md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2">
                <div className="inline-block px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-bold mb-4">
                  MAIN EVENT
                </div>
                <h3 className="text-3xl font-bold mb-4">{featuredEvent.title}</h3>
                <p className="text-gray-300 mb-6">
                  {featuredEvent.description}. Experience fine dining, premium networking, and exclusive access to Africa's Web3 elite.
                </p>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="space-y-1">
                    <div className="text-gray-400 text-sm">DATE</div>
                    <div className="font-semibold">{featuredEvent.date}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-gray-400 text-sm">LOCATION</div>
                    <div className="font-semibold">{featuredEvent.location}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-gray-400 text-sm">ATTENDEES</div>
                    <div className="font-semibold">{featuredEvent.attendees}+</div>
                  </div>
                </div>

                <button
                  onClick={() => setIsTicketModalOpen(true)}
                  className="px-6 py-3 bg-gold text-black font-bold rounded-lg hover:shadow-lg hover:shadow-gold/40 transition-all"
                >
                  Get Tickets
                </button>
              </div>

              <div className="md:col-span-1">
                <div className="relative h-64 rounded-xl overflow-hidden border-2 border-gold/30">
                  <img
                    src={featuredEvent.image}
                    alt={featuredEvent.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PLATFORM BENEFITS SECTION */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Join LOFTE-3?
            </h2>
            <p className="text-gray-400 text-lg">
              Premium experiences designed for the Web3 community
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Elite Networking',
                description: 'Connect with top founders, investors, and builders',
                icon: '🤝'
              },
              {
                title: 'Exclusive Access',
                description: 'VIP experiences and premium event privileges',
                icon: '👑'
              },
              {
                title: 'Community Driven',
                description: 'Authentic connections with like-minded innovators',
                icon: '🌍'
              },
              {
                title: 'Cultural Blend',
                description: 'Web3 meets African culture and creativity',
                icon: '🎨'
              },
              {
                title: 'Real Opportunities',
                description: 'Partnerships, investments, and real value creation',
                icon: '💎'
              },
              {
                title: 'Unforgettable',
                description: 'Curated experiences you\'ll remember forever',
                icon: '✨'
              }
            ].map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl border border-gold/20 bg-black/30 backdrop-blur-sm hover:border-gold/50 transition-all group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative py-20">
        <div className="absolute inset-0 flex items-center overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute inset-0 bg-gold/5 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Experience Web3?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Secure your spot at Africa's premier Web3 events platform
            </p>

            <button
              onClick={() => setIsTicketModalOpen(true)}
              className="px-10 py-4 bg-gradient-to-r from-gold to-yellow-500 text-black font-bold text-lg rounded-lg hover:shadow-2xl hover:shadow-gold/40 transition-all inline-flex items-center gap-3"
            >
              <Sparkles className="w-6 h-6" />
              Claim Your Tickets
              <ArrowRight className="w-6 h-6" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* PREVIOUS EVENTS BUTTON */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        viewport={{ once: true }}
        className="text-center pb-20"
      >
        <Link href="/previous-events">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full border-2 border-gold/50 text-gold font-bold hover:border-gold hover:bg-gold/10 transition-all"
          >
            <History className="w-5 h-5" />
            View Previous Events
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </Link>
      </motion.div>
    </main>
  );
}
      <section id="home" className="relative pt-20 pb-20 md:pt-40 md:pb-32">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute top-20 left-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl"
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.2 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="absolute bottom-20 right-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 relative">
          {/* HEADING with Split Text Animation */}
          <div className="text-center mb-16 w-full">
            {/* WELCOME TO LOFTE-3 with SPLIT ANIMATION and CENTERED GOLD SHADOW */}
            <div className="relative w-full flex justify-center mb-12">
              {/* CENTERED GOLD SHADOW - VERY VISIBLE */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-[800px] h-48 bg-gold/40 blur-3xl rounded-full"></div>
                <div className="w-[600px] h-32 bg-gold/50 blur-2xl rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="w-[400px] h-24 bg-gold/60 blur-xl rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>
              
              <div className="relative z-10">
                <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                  {["WELCOME", "TO", "LOFTE-3"].map((word, index) => (
                    <motion.div
                      key={word}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        delay: 0.1 + (index * 0.3),
                        duration: 0.7,
                        ease: "easeOut"
                      }}
                      className="inline-block"
                    >
                      <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-white whitespace-nowrap">
                        {word}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Crypto Coin Beyond Coin Screen with WORKING animations */}
            <div className="w-full mb-12">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-5 flex-wrap">
                {/* Crypto */}
                <motion.div
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.0, duration: 0.6, ease: "easeOut" }}
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gold font-semibold"
                >
                  Crypto
                </motion.div>
                
                {/* Coin Icon 1 */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 1.1, type: "spring", stiffness: 200 }}
                  className="flex items-center"
                >
                  <Coins className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gold mx-3" />
                </motion.div>
                
                {/* Beyond */}
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.6, ease: "easeOut" }}
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gold font-semibold"
                >
                  Beyond
                </motion.div>
                
                {/* Coin Icon 2 */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 1.3, type: "spring", stiffness: 200 }}
                  className="flex items-center"
                >
                  <Coins className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gold mx-3" />
                </motion.div>
                
                {/* Screen */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.4, duration: 0.6, ease: "easeOut" }}
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gold font-semibold"
                >
                  Screen
                </motion.div>
              </div>
            </div>

            {/* DESCRIPTION with WORKING animation */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.7 }}
              className="w-full max-w-4xl mx-auto"
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8, duration: 0.7 }}
                className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-12 leading-relaxed text-center px-4"
              >
                Africa's leading strategic IRL and virtual Web3 
                event platform; Driving growth, culture, KPIs and lifestyle. Where blockchain meets real-world celebrations, 
                exclusive networking, and unforgettable moments with the crypto community.
              </motion.p>
              
              {/* GOLD STATS - INFINITY REPLACES 50+, HALL IN BOX */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-5xl mx-auto">
                {[
                  { icon: <Users className="w-8 h-8" />, label: "10K+", value: "Attendees" },
                  { icon: <Home className="w-8 h-8 text-gold" />, label: "♾️", value: "Events" },
                  { icon: <Sparkles className="w-8 h-8" />, label: "♾️", value: "Results" },
                  { icon: <Home className="w-8 h-8 text-gold" />, label: "Africa", value: "Wide Coverage" },
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 2.0 + idx * 0.15, duration: 0.5, type: "spring" }}
                    className="text-center"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="p-4 rounded-xl bg-gold/10 inline-block mb-4 border border-gold/20"
                    >
                      <div className="text-gold flex justify-center items-center">
                        {stat.icon}
                      </div>
                    </motion.div>
                    <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.label}</div>
                    <div className="text-sm text-gray-400">{stat.value}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* MAIN PARTY IMAGE with WORKING animation - MADE CLICKABLE */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: 2.5, 
              duration: 0.8,
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
            className="mt-20"
          >
            {/* Gold Glow Effect */}
            <div className="absolute -inset-4 bg-gold/10 rounded-2xl blur-xl" />
            
            {/* Image Container - CLICKABLE */}
            <motion.div
              onClick={() => openLink(xAccountLink)}
              className="block cursor-pointer"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="relative rounded-xl overflow-hidden border-2 border-gold shadow-2xl shadow-gold/20"
              >
                {/* Party Image */}
                <motion.img
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 2.6, duration: 1, ease: "easeOut" }}
                  src={eventImages.mainParty}
                  alt="Young adults partying at LOFTE-3 event"
                  className="w-full h-64 md:h-96 object-cover"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                
                {/* Gold Badge */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 2.7, duration: 0.5 }}
                  className="absolute top-4 right-4 px-4 py-2 rounded-full bg-black/80 backdrop-blur-sm border border-gold"
                >
                  <span className="text-sm font-bold text-gold flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    LIVE NOW
                  </span>
                </motion.div>
                
                {/* Text Overlay */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.8, duration: 0.5 }}
                  className="absolute bottom-6 left-6 text-white"
                >
                  <h3 className="text-2xl md:text-3xl font-bold mb-1">LOFTE-3 Africa</h3>
                  <p className="text-gray-300">500+ People Partying</p>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* LEARN MORE BUTTON */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.0 }}
            className="text-center mt-16"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(212, 175, 55, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openLink(learnMoreLink)}
              className="inline-flex items-center gap-3 px-10 py-4 rounded-full border-2 border-gold text-gold font-bold hover:bg-gold/10 transition-all cursor-pointer text-lg"
            >
              <span>Learn More About Us</span>
              <ExternalLink className="w-6 h-6" />
            </motion.button>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.1 }}
              className="text-gray-400 mt-4 text-sm"
            >
              Follow our X for event updates
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ========== UPCOMING EVENTS SECTION ========== */}
      <section id="events" className="py-20 bg-black relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-px">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="h-full bg-gradient-to-r from-transparent via-gold to-transparent"
          />
        </div>
        
        {/* Static background elements */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.5 }}
            className="text-center mb-16"
          >
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              <span className="text-white">Upcoming</span>
              <span className="gold-gradient ml-3">Events</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              viewport={{ once: true }}
              className="text-gray-400 text-lg"
            >
              Scroll to explore our upcoming Web3 celebrations
            </motion.p>
          </motion.div>

          {/* Scroll Stacking Container */}
          <div className="relative">
            {/* Animated Connector Line */}
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: "100%" }}
              transition={{ duration: 1, ease: "easeInOut" }}
              viewport={{ once: true }}
              className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gradient-to-b from-gold via-gold/50 to-transparent hidden md:block"
            />

            {/* EVENTS STACK */}
            <div className="space-y-32 md:space-y-48">
              {/* EVENT 1: LOFTE-3 PROJECT HANGOUT/CT DINNER EVENT - MAIN EVENT */}
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative"
              >
                {/* Animated Connector Dot */}
                <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 rounded-full bg-gold border-4 border-black" />
                </div>

                {/* Card Container */}
                <div className="md:grid md:grid-cols-2 md:gap-12 items-center">
                  {/* Image Side - MADE CLICKABLE to X POST */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="md:order-1 mb-8 md:mb-0"
                  >
                    <motion.div
                      onClick={() => openLink(xAccountLink)}
                      className="block cursor-pointer"
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="relative rounded-2xl overflow-hidden border-2 border-gold shadow-2xl shadow-gold/20"
                      >
                        {/* Valentine Event Image */}
                        <img
                          src={eventImages.valentineEvent}
                          alt="LOFTE-3 Project Hangout/CT Dinner Event"
                          className="w-full h-64 md:h-80 object-cover"
                        />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                        
                        {/* Click indicator */}
                        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-gold/50">
                          <span className="text-xs text-gold flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" />
                            View Post
                          </span>
                        </div>
                      </motion.div>
                    </motion.div>
                  </motion.div>

                  {/* Content Side */}
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="md:order-2"
                  >
                    <div className="bg-black rounded-2xl border border-gold/30 p-6 md:p-8">
                      <div className="mb-2">
                        <span className="inline-block px-4 py-1 rounded-full bg-gold/10 border border-gold mb-4">
                          <span className="text-gold font-bold">MAIN EVENT</span>
                        </span>
                      </div>
                      
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        LOFTE-3 PROJECT HANGOUT/CT DINNER EVENT 
                      </h3>
                      
                      <p className="text-gray-300 mb-6 leading-relaxed">
                        An unforgettable evening of fine dining and celebrations with web3 elites of crypto twitter Africa. 
                        Join us for an exclusive Red Carpet experience featuring gourmet cuisine, premium cocktails, and blockchain networking.
                      </p>

                      {/* Event Details */}
                      <div className="space-y-4 mb-8">
                        {[
                          { icon: <Calendar className="w-5 h-5 text-gold" />, label: "Date", value: "March 27, 2026" },
                          { icon: <Clock className="w-5 h-5 text-gold" />, label: "Time", value: "Scheduled on Ticket", subIcon: <Ticket className="w-4 h-4" /> },
                          { icon: <MapPin className="w-5 h-5 text-gold" />, label: "Location", value: "Scheduled on Ticket" },
                        ].map((detail, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gold/10 border border-gold/20">
                              {detail.icon}
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">{detail.label}</p>
                              <p className="text-white font-medium flex items-center gap-2">
                                {detail.subIcon && detail.subIcon}
                                {detail.value}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Buttons - MAIN EVENT uses TicketModal */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setIsTicketModalOpen(true)}
                          className="flex-1 text-center px-6 py-3 rounded-full border border-gold text-gold font-bold hover:bg-gold/10 transition hover:shadow-lg hover:shadow-gold/20 cursor-pointer"
                        >
                          Get Tickets
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openLink(calendlyLink)}
                          className="flex-1 text-center px-6 py-3 rounded-full bg-gold text-black font-bold hover:shadow-lg hover:shadow-gold/30 transition cursor-pointer"
                        >
                          Sponsor Event
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* EVENT 2: METAMASK COMMUNITY BUILDERS NIGHT - EXPIRED - COMMENTED OUT */}
              {/*
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative"
              >
                <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-3 h-3 rounded-full bg-gold border-2 border-black"></div>
                </div>

                <div className="md:grid md:grid-cols-2 md:gap-12 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="md:order-1 mb-8 md:mb-0"
                  >
                    <motion.div
                      onClick={() => openLink(xAccountLink)}
                      className="block cursor-pointer"
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="relative rounded-2xl overflow-hidden border-2 border-gold/50 hover:border-gold transition-all duration-300 shadow-xl hover:shadow-gold/20"
                      >
                        <img
                          src={eventImages.nftGala}
                          alt="MetaMask Community Builders Night"
                          className="w-full h-64 md:h-80 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        
                        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-gold/50">
                          <span className="text-xs text-gold flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" />
                            View Post
                          </span>
                        </div>
                      </motion.div>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="md:order-2"
                  >
                    <div className="bg-black/90 rounded-2xl border border-gold/30 p-6 backdrop-blur-sm">
                      <div className="mb-4">
                        <span className="inline-block px-4 py-1 rounded-full bg-red-500/20 border border-red-500/50 mb-3">
                          <span className="text-red-400 text-sm font-bold">EXPIRED</span>
                        </span>
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                          METAMASK COMMUNITY BUILDERS NIGHT, ABUJA
                        </h3>
                        <p className="text-gray-300 mb-6">
                          Community Builder Night is a community first version of MetaMask's global Builder Nights bringing Web3 education, onboarding, awards and conversations close to local ecosystem.
                        </p>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-gold" />
                          <div>
                            <p className="text-sm text-gray-400">Date</p>
                            <p className="text-white line-through">March 14, 2026</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-gold" />
                          <div>
                            <p className="text-sm text-gray-400">Location</p>
                            <p className="text-white">Abuja, Nigeria</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 text-center px-4 py-3 rounded-full bg-gray-800 text-gray-400 text-sm cursor-not-allowed">
                          Event Ended
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openLink(xAccountLink)}
                          className="flex-1 text-center px-4 py-3 rounded-full bg-gold/20 text-gold font-bold hover:bg-gold/30 transition text-sm border border-gold/50"
                        >
                          View Recap
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
              */}

              {/* Add new events here */}

            </div>
          </div>

          {/* Animated View Previous Events Button */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-20"
          >
            <Link href="/previous-events">
              <motion.button
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    "0 0 0px rgba(212, 175, 55, 0)",
                    "0 0 20px rgba(212, 175, 55, 0.5)",
                    "0 0 0px rgba(212, 175, 55, 0)"
                  ]
                }}
                transition={{
                  boxShadow: {
                    duration: 2,
                    repeatType: "loop"
                  }
                }}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-gold/20 to-gold/10 border-2 border-gold text-gold font-bold hover:bg-gold/20 transition-all cursor-pointer group relative overflow-hidden"
              >
                {/* Animated background effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/10 to-gold/0"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                
                {/* Button content */}
                <span className="relative z-10 flex items-center gap-3">
                  <History className="w-5 h-5" />
                  View Previous Events
                  <motion.div
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.div>
                </span>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}