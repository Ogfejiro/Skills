// app/why-attend/page.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function WhyAttendPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const reasons = [
    {
      id: 1,
      title: "Red Carpet Experience",
      description: "Walk the red carpet like a Web3 celebrity. Professional photography, media coverage, and star treatment from arrival to departure.",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop",
      stats: "VIP Treatment",
      features: ["Professional Photos", "Media Coverage", "Celebrity Treatment", "Exclusive Entry"]
    },
    {
      id: 2,
      title: "Find Your Web3 Soulmate",
      description: "Connect with like-minded individuals in the blockchain space. Our matchmaking sessions help you find partners, co-founders, and lifelong friends.",
      image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2094&auto=format&fit=crop",
      stats: "Quality Connections",
      features: ["Matchmaking Sessions", "Founder Dating", "Team Building", "Community Bonding"]
    },
    {
      id: 3,
      title: "Brand & Community Exposure",
      description: "Showcase your project to thousands of Web3 enthusiasts. Get featured in our media coverage and connect with potential users and supporters.",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
      stats: "Amplify Your Reach",
      features: ["Media Features", "Community Showcases", "Project Spotlights", "Audience Growth"]
    },
    {
      id: 4,
      title: "Opportunities Beyond",
      description: "Access exclusive investment deals, partnership opportunities, and global connections that extend far beyond the event.",
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2070&auto=format&fit=crop",
      stats: "Expand Your Horizons",
      features: ["Global Connections", "Investment Deals", "Partnerships", "Market Expansion"]
    },
    {
      id: 5,
      title: "Culture Meets Tech",
      description: "Experience the perfect fusion of African culture with cutting-edge technology. Art, music, fashion, and blockchain in one unforgettable experience.",
      image: "https://images.unsplash.com/photo-1571622840901-92ae138bd36e?q=80&w=2070&auto=format&fit=crop",
      stats: "African Innovation Showcase",
      features: ["Cultural Performances", "Tech Art Exhibits", "Fashion Tech", "Music Innovation"]
    },
    {
      id: 6,
      title: "Win Amazing Prizes",
      description: "Compete for exclusive rewards including NFTs, token airdrops, luxury gifts, and investment opportunities worth thousands of dollars.",
      image: "https://images.unsplash.com/photo-1604591259955-5c4db0eacb44?q=80&w=2070&auto=format&fit=crop",
      stats: "$100K+ in Prizes",
      features: ["NFT Airdrops", "Token Rewards", "Luxury Gifts", "Investment Access"]
    },
    {
      id: 7,
      title: "Elite Networking",
      description: "Connect with Africa's top blockchain founders, investors, and builders in intimate settings. Build relationships that transform careers.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
      stats: "500+ Industry Leaders",
      features: ["VC Meetings", "Founder Circles", "Investor Pitches", "Mastermind Groups"]
    },
    {
      id: 8,
      title: "Premium Experiences",
      description: "Enjoy luxury amenities, gourmet dining, and exclusive access that redefine what a Web3 event can be.",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
      stats: "Luxury & Exclusivity",
      features: ["Gourmet Dining", "Luxury Venues", "VIP Access", "Premium Amenities"]
    }
  ];

  // Memoize the handlers to prevent unnecessary re-renders
  const handleNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide(prev => (prev + 1) % reasons.length);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, reasons.length]);

  const handlePrev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide(prev => (prev - 1 + reasons.length) % reasons.length);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, reasons.length]);

  const goToSlide = useCallback((index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  // Auto-rotate slides every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        handleNext();
      }
    }, 8000);
    
    return () => clearInterval(interval);
  }, [isAnimating, handleNext]);

  return (
    <main id="why-attend" className="min-h-screen bg-black text-white">
      <Navbar />
      
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="container mx-auto relative z-10">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 mb-6">
              <span className="text-gold text-sm font-medium">WHY JOIN LOFTE-3</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-white block">Why Attend</span>
              <span className="gold-gradient block mt-2">LOFTE-3 Events?</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Discover what makes LOFTE-3 the most exclusive Web3 event platform in Africa. 
              More than just parties it's where opportunities are born.
            </p>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="max-w-3xl mx-auto mb-8"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Reason {currentSlide + 1} of {reasons.length}</span>
              <span className="text-sm text-gold font-medium">
                {reasons[currentSlide]?.title || ''}
              </span>
            </div>
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-gold to-yellow-500"
                initial={{ width: "0%" }}
                animate={{ width: `${((currentSlide + 1) / reasons.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* CAROUSEL SECTION */}
      <section className="py-10 relative px-4">
        <div className="container mx-auto relative">
          <div className="max-w-6xl mx-auto">
            {/* Main Carousel */}
            <div className="relative h-[500px] md:h-[600px] overflow-hidden rounded-2xl border border-gold/30">
              {/* Current Slide */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <div className="h-full flex flex-col md:flex-row">
                    {/* Left Side - Image */}
                    <div className="md:w-1/2 h-1/2 md:h-full relative overflow-hidden">
                      <img
                        src={reasons[currentSlide]?.image || ''}
                        alt={reasons[currentSlide]?.title || ''}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      {/* Dark overlay to ensure text is readable */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent md:bg-gradient-to-r md:from-black/70 md:via-black/50 md:to-transparent" />
                      
                      <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-black/80 backdrop-blur-sm border border-gold/30 z-10">
                        <span className="text-gold text-sm font-medium">
                          Reason #{reasons[currentSlide]?.id}
                        </span>
                      </div>
                      
                      {/* Title on image for mobile */}
                      <div className="absolute bottom-4 left-4 right-4 z-10 md:hidden">
                        <h3 className="text-xl font-bold text-white mb-2">
                          {reasons[currentSlide]?.title || ''}
                        </h3>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gold rounded-full" />
                          <span className="text-gold text-sm font-medium">
                            {reasons[currentSlide]?.stats || ''}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right Side - Content */}
                    <div className="md:w-1/2 h-1/2 md:h-full p-6 md:p-8 flex flex-col justify-center bg-black">
                      {/* Badge */}
                      <div className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-6 w-fit">
                        <div className="w-2 h-2 bg-gold rounded-full" />
                        <span className="text-gold text-sm font-medium">
                          Reason #{reasons[currentSlide]?.id}
                        </span>
                      </div>
                      
                      {/* Title - Hidden on mobile (shown on image) */}
                      <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="hidden md:block text-2xl md:text-3xl font-bold text-white mb-4"
                      >
                        {reasons[currentSlide]?.title || ''}
                      </motion.h2>
                      
                      {/* Stats - Hidden on mobile (shown on image) */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="hidden md:flex items-center gap-3 mb-5"
                      >
                        <div className="w-2 h-2 bg-gold rounded-full" />
                        <span className="text-lg font-bold text-gold">
                          {reasons[currentSlide]?.stats || ''}
                        </span>
                      </motion.div>
                      
                      {/* Description */}
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-gray-300 text-base md:text-lg leading-relaxed mb-6"
                      >
                        {reasons[currentSlide]?.description || ''}
                      </motion.p>
                      
                      {/* Features */}
                      <div className="space-y-2 mb-8">
                        <h4 className="text-white font-medium mb-2">What You Get:</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {reasons[currentSlide]?.features.map((feature, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.8 + idx * 0.1 }}
                              className="flex items-center gap-2"
                            >
                              <div className="w-1.5 h-1.5 bg-gold rounded-full flex-shrink-0" />
                              <span className="text-sm text-gray-300">{feature}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Slide Counter */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="flex items-center gap-4 mt-4"
                      >
                        <span className="text-3xl md:text-4xl font-bold text-gold">
                          {reasons[currentSlide]?.id.toString().padStart(2, '0')}
                        </span>
                        <div className="flex-1">
                          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gold rounded-full"
                              initial={{ width: "0%" }}
                              animate={{ width: `${((currentSlide + 1) / reasons.length) * 100}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                        </div>
                        <span className="text-3xl md:text-4xl font-bold text-gray-400">
                          / {reasons.length.toString().padStart(2, '0')}
                        </span>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Controls */}
            <div className="flex justify-between items-center mt-8">
              {/* Left Navigation */}
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePrev}
                  disabled={isAnimating}
                  className="p-3 rounded-full border border-gold/30 text-gold transition flex items-center gap-2 disabled:opacity-50 hover:bg-gold/10"
                >
                  <span className="font-medium hidden sm:inline">Previous</span>
                  <span className="font-medium sm:hidden">Prev</span>
                </motion.button>
                
                {/* Dots Navigation */}
                <div className="flex items-center gap-2">
                  {reasons.map((_, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.3 }}
                      whileTap={{ scale: 0.8 }}
                      onClick={() => goToSlide(idx)}
                      disabled={isAnimating}
                      className={`w-2 h-2 rounded-full transition-all ${
                        currentSlide === idx 
                          ? 'bg-gold w-4' 
                          : 'bg-gold/30 hover:bg-gold/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Right Navigation */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                disabled={isAnimating}
                className="p-3 rounded-full border border-gold/30 text-gold transition flex items-center gap-2 disabled:opacity-50 hover:bg-gold/10"
              >
                <span className="font-medium hidden sm:inline">Next</span>
                <span className="font-medium sm:hidden">Next</span>
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 relative px-4">
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="p-8 rounded-2xl border border-gold/30 bg-gradient-to-br from-black to-black/70">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl md:text-3xl font-bold mb-6"
              >
                <span className="text-white block">Ready to Experience</span>
                <span className="gold-gradient block">Web3 Like Never Before?</span>
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-300 text-lg mb-8"
              >
                From red carpet moments to global opportunities, LOFTE-3 offers everything you need 
                to thrive in the blockchain space. Limited spots available.
              </motion.p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/#events"
                  className="px-8 py-3 rounded-full border border-gold text-gold font-bold hover:bg-gold/10 transition text-center"
                >
                  View All Events
                </Link>
                
                <Link
                  href="https://forms.gle/gwhB683FptSMNsE39"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 rounded-full bg-gold text-black font-bold hover:bg-gold/80 transition text-center"
                >
                  Join Waitlist Now
                </Link>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gold/10">
                <p className="text-sm text-gray-400">
                  ⚡ Early access to all experiences • VIP treatment • Priority networking
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}