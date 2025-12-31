// app/why-attend/page.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
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
      image: "data:image/jpeg;base64,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", // Original red carpet image
      stats: "VIP Treatment",
      features: ["Professional Photos", "Media Coverage", "Celebrity Treatment", "Exclusive Entry"]
    },
    {
      id: 2,
      title: "Find Your Web3 Soulmate",
      description: "Connect with like-minded individuals in the blockchain space. Our matchmaking sessions help you find partners, co-founders, and lifelong friends.",
      image: "data:image/jpeg;base64,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", // Original couple image
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
      image: "https://images.unsplash.com/photo-1571622840901-92ae138bd36e?q=80&w=2070&auto=format&fit=crop", // Pool party image
      stats: "African Innovation Showcase",
      features: ["Cultural Performances", "Tech Art Exhibits", "Fashion Tech", "Music Innovation"]
    },
    {
      id: 6,
      title: "Win Amazing Prizes",
      description: "Compete for exclusive rewards including NFTs, token airdrops, luxury gifts, and investment opportunities worth thousands of dollars.",
      image: "https://plus.unsplash.com/premium_photo-1744679847695-6e36a8f6956c?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Prize wheel image
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
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop", // Premium dining image
      stats: "Luxury & Exclusivity",
      features: ["Gourmet Dining", "Luxury Venues", "VIP Access", "Premium Amenities"]
    }
  ];

  // Auto-rotate slides every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 8000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % reasons.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + reasons.length) % reasons.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

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
              <span className="text-gold text-sm font-medium">WHY JOIN LOFT3</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-white block">Why Attend</span>
              <span className="gold-gradient block mt-2">LOFT3 Events?</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Discover what makes LOFT3 the most exclusive Web3 event platform in Africa. 
              More than just parties—it's where opportunities are born.
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
                {reasons[currentSlide].title}
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
                        src={reasons[currentSlide].image}
                        alt={reasons[currentSlide].title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      {/* Dark overlay to ensure text is readable */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent md:bg-gradient-to-r md:from-black/70 md:via-black/50 md:to-transparent" />
                      
                      <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-black/80 backdrop-blur-sm border border-gold/30 z-10">
                        <span className="text-gold text-sm font-medium">
                          Reason #{reasons[currentSlide].id}
                        </span>
                      </div>
                      
                      {/* Title on image for mobile */}
                      <div className="absolute bottom-4 left-4 right-4 z-10 md:hidden">
                        <h3 className="text-xl font-bold text-white mb-2">
                          {reasons[currentSlide].title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gold rounded-full" />
                          <span className="text-gold text-sm font-medium">
                            {reasons[currentSlide].stats}
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
                          Reason #{reasons[currentSlide].id}
                        </span>
                      </div>
                      
                      {/* Title - Hidden on mobile (shown on image) */}
                      <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="hidden md:block text-2xl md:text-3xl font-bold text-white mb-4"
                      >
                        {reasons[currentSlide].title}
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
                          {reasons[currentSlide].stats}
                        </span>
                      </motion.div>
                      
                      {/* Description */}
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-gray-300 text-base md:text-lg leading-relaxed mb-6"
                      >
                        {reasons[currentSlide].description}
                      </motion.p>
                      
                      {/* Features */}
                      <div className="space-y-2 mb-8">
                        <h4 className="text-white font-medium mb-2">What You Get:</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {reasons[currentSlide].features.map((feature, idx) => (
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
                          {reasons[currentSlide].id.toString().padStart(2, '0')}
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

            {/* Slide Indicator */}
            <div className="text-center mt-6">
              <div className="inline-flex items-center gap-2">
                <div className="w-2 h-2 bg-gold/50 rounded-full" />
                <div className="w-2 h-2 bg-gold/50 rounded-full" />
                <div className="w-2 h-2 bg-gold/50 rounded-full" />
              </div>
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
                From red carpet moments to global opportunities, LOFT3 offers everything you need 
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