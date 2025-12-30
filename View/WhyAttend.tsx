// app/why-attend/page.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles,
  Globe,
  Zap,
  ChevronLeft,
  ChevronRight,
  Star,
  Heart,
  Camera,
  Users,
  Target,
  Gift,
  Handshake,
  Coffee,
  CircleDollarSign,
  Mic,
  Trophy
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useState, useEffect } from 'react';

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
      icon: <Camera className="w-12 h-12" />,
      color: "from-red-500/20 to-gold/20",
      features: ["Professional Photos", "Media Coverage", "Celebrity Treatment", "Exclusive Entry"]
    },
    {
      id: 2,
      title: "Find Your Web3 Soulmate",
      description: "Connect with like-minded individuals in the blockchain space. Our matchmaking sessions help you find partners, co-founders, and lifelong friends.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2068&auto=format&fit=crop",
      stats: "Quality Connections",
      icon: <Heart className="w-12 h-12" />,
      color: "from-pink-500/20 to-gold/20",
      features: ["Matchmaking Sessions", "Founder Dating", "Team Building", "Community Bonding"]
    },
    {
      id: 3,
      title: "Brand & Community Exposure",
      description: "Showcase your project to thousands of Web3 enthusiasts. Get featured in our media coverage and connect with potential users and supporters.",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
      stats: "Amplify Your Reach",
      icon: <Mic className="w-12 h-12" />,
      color: "from-purple-500/20 to-gold/20",
      features: ["Media Features", "Community Showcases", "Project Spotlights", "Audience Growth"]
    },
    {
      id: 4,
      title: "Opportunities Beyond",
      description: "Access exclusive investment deals, partnership opportunities, and global connections that extend far beyond the event.",
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2070&auto=format&fit=crop",
      stats: "Expand Your Horizons",
      icon: <Globe className="w-12 h-12" />,
      color: "from-green-500/20 to-gold/20",
      features: ["Global Connections", "Investment Deals", "Partnerships", "Market Expansion"]
    },
    {
      id: 5,
      title: "Culture Meets Tech",
      description: "Experience the perfect fusion of African culture with cutting-edge technology. Art, music, fashion, and blockchain in one unforgettable experience.",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
      stats: "African Innovation Showcase",
      icon: <Target className="w-12 h-12" />,
      color: "from-orange-500/20 to-gold/20",
      features: ["Cultural Performances", "Tech Art Exhibits", "Fashion Tech", "Music Innovation"]
    },
    {
      id: 6,
      title: "Win Amazing Prizes",
      description: "Compete for exclusive rewards including NFTs, token airdrops, luxury gifts, and investment opportunities worth thousands of dollars.",
      image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop",
      stats: "$100K+ in Prizes",
      icon: <CircleDollarSign className="w-12 h-12" />,
      color: "from-yellow-500/20 to-gold/20",
      features: ["NFT Airdrops", "Token Rewards", "Luxury Gifts", "Investment Access"]
    },
    {
      id: 7,
      title: "Elite Networking",
      description: "Connect with Africa's top blockchain founders, investors, and builders in intimate settings. Build relationships that transform careers.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
      stats: "500+ Industry Leaders",
      icon: <Handshake className="w-12 h-12" />,
      color: "from-indigo-500/20 to-gold/20",
      features: ["VC Meetings", "Founder Circles", "Investor Pitches", "Mastermind Groups"]
    },
    {
      id: 8,
      title: "Premium Experiences",
      description: "Enjoy luxury amenities, gourmet dining, and exclusive access that redefine what a Web3 event can be.",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
      stats: "Luxury & Exclusivity",
      icon: <Coffee className="w-12 h-12" />,
      color: "from-blue-500/20 to-gold/20",
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
    <main className="min-h-screen bg-black text-white overflow-hidden">
      <Navbar />
      
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 5, repeat: Infinity },
              opacity: { duration: 3, repeat: Infinity }
            }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-gold/5 to-transparent rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              rotate: -360,
              scale: [1.1, 1, 1.1],
              opacity: [0.4, 0.6, 0.4]
            }}
            transition={{ 
              rotate: { duration: 25, repeat: Infinity, ease: "linear" },
              scale: { duration: 7, repeat: Infinity },
              opacity: { duration: 4, repeat: Infinity }
            }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-gold/5 to-transparent rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Page Header with Staggered Animations */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gold/10 border border-gold/30 mb-6"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4 text-gold" />
              </motion.div>
              <span className="text-gold text-sm font-medium">WHY JOIN LOFT3</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <motion.span
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-white"
                >
                  Why Attend
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="gold-gradient block mt-2"
                >
                  LOFT3 Events?
                </motion.span>
              </h1>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto"
            >
              Discover what makes LOFT3 the most exclusive Web3 event platform in Africa. 
              More than just parties—it's where opportunities are born.
            </motion.p>
          </motion.div>

          {/* Progress Bar with Animation */}
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "100%" }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="max-w-3xl mx-auto mb-12"
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
      <section className="py-10 relative">
        {/* Animated Gold Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute top-0 left-0 w-full h-px"
        >
          <div className="h-full bg-gradient-to-r from-transparent via-gold to-transparent"></div>
        </motion.div>

        <div className="container mx-auto px-4 relative">
          {/* Carousel Container */}
          <div className="max-w-6xl mx-auto">
            {/* Main Carousel with Zoom & Fade */}
            <div className="relative h-[500px] md:h-[600px] overflow-hidden rounded-3xl border-2 border-gold/30 shadow-2xl shadow-gold/10">
              {/* Background Pattern with Animation */}
              <motion.div
                animate={{ 
                  backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{ 
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute inset-0 opacity-5 bg-grid-white bg-grid-16 bg-[length:40px_40px]"
              />
              
              {/* Current Slide with Multiple Animations */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ 
                    opacity: 0,
                    x: 100,
                    scale: 0.95 
                  }}
                  animate={{ 
                    opacity: 1,
                    x: 0,
                    scale: 1 
                  }}
                  exit={{ 
                    opacity: 0,
                    x: -100,
                    scale: 0.95 
                  }}
                  transition={{ 
                    duration: 0.5,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0"
                >
                  <div className="h-full flex flex-col md:flex-row">
                    {/* Left Side - Image with Zoom In */}
                    <motion.div
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 1.2 }}
                      className="md:w-1/2 h-1/2 md:h-full relative overflow-hidden"
                    >
                      {/* Background Image with Fade In */}
                      <motion.img
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        src={reasons[currentSlide].image}
                        alt={reasons[currentSlide].title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      
                      {/* Gradient Overlay with Pulse */}
                      <motion.div
                        animate={{ opacity: [0.6, 0.8, 0.6] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className={`absolute inset-0 bg-gradient-to-br ${reasons[currentSlide].color}`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                      
                      {/* Animated Orbiting Elements */}
                      <motion.div
                        animate={{ 
                          rotate: 360,
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ 
                          rotate: { duration: 30, repeat: Infinity, ease: "linear" },
                          scale: { duration: 4, repeat: Infinity }
                        }}
                        className="absolute top-10 left-10 w-40 h-40 border border-gold/20 rounded-full"
                      />
                      
                      <motion.div
                        animate={{ 
                          rotate: -360,
                          scale: [1.2, 1, 1.2]
                        }}
                        transition={{ 
                          rotate: { duration: 40, repeat: Infinity, ease: "linear" },
                          scale: { duration: 5, repeat: Infinity }
                        }}
                        className="absolute bottom-10 right-10 w-60 h-60 border border-gold/30 rounded-full"
                      />
                      
                      {/* Icon Container with Float Animation */}
                      <div className="relative z-10 h-full flex items-center justify-center p-8">
                        <motion.div
                          animate={{ 
                            y: [0, -10, 0],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{ 
                            duration: 3,
                            repeat: Infinity
                          }}
                          className="p-8 rounded-2xl bg-black/60 backdrop-blur-sm border-2 border-gold/40 shadow-xl"
                        >
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-gold"
                          >
                            {reasons[currentSlide].icon}
                          </motion.div>
                        </motion.div>
                      </div>

                      {/* Image Badge with Slide In */}
                      <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="absolute bottom-4 left-4 px-4 py-2 rounded-full bg-black/80 backdrop-blur-sm border border-gold/30"
                      >
                        <span className="text-gold text-sm font-medium flex items-center gap-2">
                          <Camera className="w-3 h-3" />
                          Featured
                        </span>
                      </motion.div>
                    </motion.div>
                    
                    {/* Right Side - Content with Staggered Animation */}
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                      className="md:w-1/2 h-1/2 md:h-full p-6 md:p-10 flex flex-col justify-center bg-gradient-to-br from-black to-black/70 backdrop-blur-sm"
                    >
                      {/* Badge with Pulse */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4, type: "spring" }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-6 w-fit"
                      >
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="w-2 h-2 bg-gold rounded-full"
                        />
                        <span className="text-gold text-sm font-medium">
                          Reason #{reasons[currentSlide].id}
                        </span>
                      </motion.div>
                      
                      {/* Title with Typewriter Effect */}
                      <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-2xl md:text-4xl font-bold text-white mb-3"
                      >
                        {reasons[currentSlide].title}
                      </motion.h2>
                      
                      {/* Stats with Bounce */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8, type: "spring" }}
                        className="flex items-center gap-3 mb-5"
                      >
                        <motion.div
                          whileHover={{ rotate: 180 }}
                          transition={{ duration: 0.5 }}
                          className="p-2 rounded-lg bg-gold/10 border border-gold/20"
                        >
                          <Zap className="w-5 h-5 text-gold" />
                        </motion.div>
                        <span className="text-lg font-bold text-gold">
                          {reasons[currentSlide].stats}
                        </span>
                      </motion.div>
                      
                      {/* Description with Fade In */}
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="text-gray-300 text-base md:text-lg leading-relaxed mb-6"
                      >
                        {reasons[currentSlide].description}
                      </motion.p>
                      
                      {/* Features with Staggered Animation */}
                      <div className="space-y-2 mb-8">
                        <h4 className="text-white font-medium mb-2">What You Get:</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {reasons[currentSlide].features.map((feature, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 1.2 + idx * 0.1 }}
                              className="flex items-center gap-2"
                            >
                              <motion.div
                                whileHover={{ rotate: 90 }}
                                className="p-1 rounded-full bg-gold/20"
                              >
                                <Star className="w-2 h-2 text-gold" />
                              </motion.div>
                              <span className="text-sm text-gray-300">{feature}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Slide Counter with Glow */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.6 }}
                        className="flex items-center gap-4 mt-4"
                      >
                        <motion.span
                          animate={{ 
                            textShadow: ["0 0 0px #D4AF37", "0 0 10px #D4AF37", "0 0 0px #D4AF37"]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-4xl font-bold text-gold"
                        >
                          {reasons[currentSlide].id.toString().padStart(2, '0')}
                        </motion.span>
                        <div className="flex-1">
                          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                              animate={{ 
                                width: `${((currentSlide + 1) / reasons.length) * 100}%`,
                                boxShadow: ["0 0 0px #D4AF37", "0 0 5px #D4AF37", "0 0 0px #D4AF37"]
                              }}
                              transition={{ 
                                width: { duration: 0.5 },
                                boxShadow: { duration: 2, repeat: Infinity }
                              }}
                              className="h-full bg-gold rounded-full"
                            />
                          </div>
                        </div>
                        <span className="text-4xl font-bold text-gray-400">
                          / {reasons.length.toString().padStart(2, '0')}
                        </span>
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Controls with Hover Effects */}
            <div className="flex justify-between items-center mt-8">
              {/* Left Navigation */}
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(212, 175, 55, 0.1)" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handlePrev}
                  disabled={isAnimating}
                  className="p-3 rounded-full border border-gold/30 text-gold transition flex items-center gap-2 disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="font-medium hidden md:inline">Previous</span>
                </motion.button>
                
                {/* Dots Navigation with Glow */}
                <div className="flex items-center gap-2">
                  {reasons.map((_, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.3 }}
                      whileTap={{ scale: 0.8 }}
                      onClick={() => goToSlide(idx)}
                      disabled={isAnimating}
                      className={`relative transition-all ${
                        currentSlide === idx 
                          ? 'w-6' 
                          : 'w-2 hover:w-3'
                      }`}
                    >
                      <div className={`h-2 rounded-full transition-all ${
                        currentSlide === idx 
                          ? 'bg-gold shadow-[0_0_8px_rgba(212,175,55,0.8)]' 
                          : 'bg-gold/30 hover:bg-gold/50'
                      }`} />
                      {currentSlide === idx && (
                        <motion.div
                          layoutId="activeDot"
                          className="absolute -inset-1 rounded-full border border-gold/30"
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
              
              {/* Right Navigation */}
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: "rgba(212, 175, 55, 0.1)" }}
                whileTap={{ scale: 0.9 }}
                onClick={handleNext}
                disabled={isAnimating}
                className="p-3 rounded-full border border-gold/30 text-gold transition flex items-center gap-2 disabled:opacity-50"
              >
                <span className="font-medium hidden md:inline">Next</span>
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Subtle Indicator (No Text) */}
            <div className="text-center mt-6">
              <div className="inline-flex items-center gap-2">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity
                  }}
                  className="w-2 h-2 bg-gold rounded-full"
                />
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    delay: 0.2
                  }}
                  className="w-2 h-2 bg-gold rounded-full"
                />
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    delay: 0.4
                  }}
                  className="w-2 h-2 bg-gold rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 relative">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="absolute inset-0 bg-gradient-to-t from-gold/5 via-transparent to-transparent"
        />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-8 rounded-3xl border-2 border-gold/30 bg-gradient-to-br from-black to-black/70"
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold mb-6"
              >
                <span className="text-white">Ready to Experience</span>
                <motion.span
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity
                  }}
                  className="gold-gradient block"
                  style={{ 
                    backgroundSize: "200% auto"
                  }}
                >
                  Web3 Like Never Before?
                </motion.span>
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
                className="text-gray-300 text-lg mb-8"
              >
                From red carpet moments to global opportunities, LOFT3 offers everything you need 
                to thrive in the blockchain space. Limited spots available.
              </motion.p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 0 20px rgba(212, 175, 55, 0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  href="/#events"
                  className="px-8 py-3 rounded-full border border-gold text-gold font-bold hover:bg-gold/10 transition"
                >
                  View All Events
                </motion.a>
                
                <motion.a
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 0 25px rgba(212, 175, 55, 0.5)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  href="https://forms.gle/hGhEC5kq3yGdV3mdA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 rounded-full bg-gold text-black font-bold hover:shadow-gold/30 transition"
                >
                  Join Waitlist Now
                </motion.a>
              </div>
              
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                viewport={{ once: true }}
                className="mt-8 pt-6 border-t border-gold/10"
              >
                <p className="text-sm text-gray-400">
                  ⚡ Early access to all experiences • VIP treatment • Priority networking
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer with Fade In */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="border-t border-gold/10 py-8"
      >
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} LOFT3. All rights reserved. 
            <span className="text-gold ml-2">Where Culture Meets Web3</span>
          </p>
        </div>
      </motion.footer>
    </main>
  );
}