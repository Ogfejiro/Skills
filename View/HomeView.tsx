// app/page.tsx (or View/HomeView.tsx if that's your actual file)
'use client';

import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Users, 
  Trophy, 
  Globe, 
  ExternalLink,
  Calendar,
  Clock,
  MapPin,
  Heart,
  ChevronRight,
  Music,
  Zap,
  Coins,
  Ticket,
  Droplets
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useEffect, useRef } from 'react';

export default function HomePage() {
  const xAccountLink = "https://twitter.com/YourTwitterHandle";
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // CONFIGURE YOUR IMAGES HERE:
  const eventImages = {
    // Valentine event video
    valentineEvent: "/images/video2.mp4", // Your video path here
    
    // Other events
    musicFestival: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070&auto=format&fit=crop",
    nftGala: "https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?q=80&w=2070&auto=format&fit=crop",
    hackathon: "https://images.unsplash.com/photo-1492684223066-dd23140edf6d?q=80&w=2070&auto=format&fit=crop",
    mainParty: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2070&auto=format&fit=crop",
  };

  // Handle video autoplay with sound on mobile
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoPlay = () => {
      // Try to play with sound, if fails, mute and play
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // Autoplay with sound failed, mute and try again
          video.muted = true;
          video.play();
        });
      }
    };

    // Try to play when component mounts
    handleVideoPlay();

    // Also try to play when user interacts with page
    const handleUserInteraction = () => {
      if (video.paused) {
        handleVideoPlay();
      }
    };

    // Add event listeners for user interaction
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      <Navbar />
      
      {/* ========== HERO SECTION ========== */}
      <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-32">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute top-20 left-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl"
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="absolute bottom-20 right-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 relative">
          {/* HEADING with Split Text Animation - Faster animations */}
          <div className="text-center mb-16">
            {/* Split text animation for "WELCOME TO" */}
            <div className="flex justify-center gap-2 md:gap-4 flex-wrap mb-4">
              {["WELCOME", "TO"].map((word, index) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.1, 
                    duration: 0.4,
                    ease: "easeOut"
                  }}
                  className="text-4xl md:text-5xl font-bold text-white"
                >
                  {word}
                </motion.span>
              ))}
            </div>
            
            {/* LOFTE-3 with gold gradient */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-5xl md:text-7xl font-bold mb-8"
            >
              <span className="gold-gradient">LOFTE-3</span>
            </motion.div>
            
            {/* Subtitle sliding from left and right */}
            <div className="overflow-hidden mb-8">
              <motion.h2
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
                className="text-2xl md:text-3xl text-gray-300 mb-2"
              >
                Where <span className="text-gold font-bold">Web3</span> Meets
              </motion.h2>
              <motion.h2
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
                className="text-2xl md:text-3xl text-gray-300"
              >
                Celebration
              </motion.h2>
            </div>

            {/* DESCRIPTION with faster animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="max-w-2xl mx-auto"
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="text-xl text-gray-300 mb-10 leading-relaxed"
              >
                Africa's premier Web3 event platform. Experience blockchain through 
                electrifying parties, exclusive networking, and unforgettable moments 
                with the crypto community.
              </motion.p>
              
              {/* GOLD STATS with faster staggered animation */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
              >
                {[
                  { icon: <Users className="w-7 h-7" />, label: "10K+", value: "Attendees" },
                  { icon: <Trophy className="w-7 h-7" />, label: "50+", value: "Events" },
                  { icon: <Sparkles className="w-7 h-7" />, label: "100+", value: "Parties" },
                  { icon: <Globe className="w-7 h-7 text-gold" />, label: "Africa", value: "Wide Coverage" },
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.9 + idx * 0.05, duration: 0.4 }}
                    className="text-center"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="p-3 rounded-xl bg-gold/10 inline-block mb-3 border border-gold/20"
                    >
                      <div className="text-gold">{stat.icon}</div>
                    </motion.div>
                    <div className="text-2xl font-bold text-white">{stat.label}</div>
                    <div className="text-sm text-gray-400">{stat.value}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* MAIN PARTY IMAGE with faster animation */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: 1.2, 
              duration: 0.6,
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
            className="mt-16"
          >
            {/* Gold Glow Effect */}
            <div className="absolute -inset-4 bg-gold/10 rounded-2xl blur-xl" />
            
            {/* Image Container */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="relative rounded-xl overflow-hidden border-2 border-gold shadow-2xl shadow-gold/20"
            >
              {/* Party Image */}
              <motion.img
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.3, duration: 0.8 }}
                src={eventImages.mainParty}
                alt="Young adults partying at LOFTE-3 event"
                className="w-full h-64 md:h-96 object-cover"
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              
              {/* Gold Badge */}
              <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-black/80 backdrop-blur-sm border border-gold">
                <span className="text-sm font-bold text-gold flex items-center gap-2">
                  <Sparkles className="w-3 h-3" />
                  LIVE NOW
                </span>
              </div>
              
              {/* Text Overlay - Changed to LOFTE-3 Africa */}
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl md:text-3xl font-bold mb-1">LOFTE-3 Africa</h3>
                <p className="text-gray-300">500+ People Partying</p>
              </div>
            </motion.div>
          </motion.div>

          {/* LEARN MORE BUTTON with faster animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="text-center mt-12"
          >
            <motion.a
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(212, 175, 55, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              href={xAccountLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-3 rounded-full border-2 border-gold text-gold font-bold hover:bg-gold/10 transition-all"
            >
              <span>Learn More About Us</span>
              <ExternalLink className="w-5 h-5" />
            </motion.a>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
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

          {/* NEXT EVENTS SECTION (Before blurred events) */}
          <div className="text-center mb-12">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-bold text-white mb-4"
            >
              <span className="text-gold">Next</span> Events
            </motion.h3>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              viewport={{ once: true }}
              className="text-gray-400 max-w-2xl mx-auto"
            >
              Stay tuned for these upcoming exclusive events. More details coming soon!
            </motion.p>
          </div>

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

            {/* EVENTS STACK with faster animations */}
            <div className="space-y-32 md:space-y-48">
              {/* EVENT 1: VALENTINE'S DINNER & POOL PARTY - MAIN EVENT */}
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
                  {/* Video Side */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="md:order-1 mb-8 md:mb-0"
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="relative rounded-2xl overflow-hidden border-2 border-gold shadow-2xl shadow-gold/20"
                    >
                      {/* Valentine Event Video - FIXED FOR MOBILE AUDIO */}
                      <video
                        ref={videoRef}
                        src={eventImages.valentineEvent}
                        className="w-full h-64 md:h-80 object-cover"
                        autoPlay
                        loop
                        playsInline
                        muted={false}
                        controls={false}
                        preload="auto"
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                      
                      {/* Valentine Badge */}
                      <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-red-500/90 backdrop-blur-sm border border-gold">
                        <span className="text-white font-bold text-sm flex items-center gap-2">
                          <Heart className="w-4 h-4" />
                          VALENTINE EDITION
                        </span>
                      </div>
                      
                      {/* Pool Party Badge */}
                      <div className="absolute top-16 left-4 px-4 py-2 rounded-full bg-blue-500/90 backdrop-blur-sm border border-gold">
                        <span className="text-white font-bold text-sm flex items-center gap-2">
                          <Droplets className="w-4 h-4" />
                          POOL PARTY
                        </span>
                      </div>
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
                        LOFTE-3 Dinner Night & Pool Party
                        <span className="block text-lg text-gold mt-2">(Valentine Edition)</span>
                      </h3>
                      
                      <p className="text-gray-300 mb-6 leading-relaxed">
                        An unforgettable evening of fine dining, romantic ambiance, and poolside celebrations. 
                        Join Africa's Web3 elite for an exclusive Valentine's experience featuring gourmet cuisine, 
                        premium cocktails, and blockchain networking under the stars.
                      </p>

                      {/* Event Details */}
                      <div className="space-y-4 mb-8">
                        {[
                          { icon: <Calendar className="w-5 h-5 text-gold" />, label: "Date", value: "February 17, 2026" },
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

                      {/* Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <motion.a
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          href="https://forms.gle/gwhB683FptSMNsE39"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-center px-6 py-3 rounded-full border border-gold text-gold font-bold hover:bg-gold/10 transition hover:shadow-lg hover:shadow-gold/20"
                        >
                          Join Waitlist
                        </motion.a>
                        <motion.a
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          href="https://calendly.com/hidreamsofweb3/30min"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-center px-6 py-3 rounded-full bg-gold text-black font-bold hover:shadow-lg hover:shadow-gold/30 transition"
                        >
                          Sponsor Event
                        </motion.a>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* BLURRED EVENTS - REDUCED BLUR */}
              {/* EVENT 2: Web3 Music Festival */}
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 0.8, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative blur-[2px] hover:blur-0 transition-all duration-500"
              >
                <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-3 h-3 rounded-full bg-gold/50 border-2 border-black"></div>
                </div>

                <div className="md:grid md:grid-cols-2 md:gap-12 items-center">
                  <div className="mb-8 md:mb-0">
                    <div className="bg-black/70 rounded-2xl border border-gold/20 p-6">
                      <div className="mb-4">
                        <span className="inline-block px-4 py-1 rounded-full bg-gold/10 border border-gold/20 mb-3">
                          <span className="text-gold text-sm font-bold">COMING SOON</span>
                        </span>
                        <h3 className="text-xl font-bold text-white mb-3">
                          Web3 Music Festival
                        </h3>
                        <p className="text-gray-300 mb-6">
                          Africa's first crypto-powered music festival with top DJs, 
                          NFT ticket system, and blockchain voting for lineup.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-gold" />
                          <p className="text-gray-400">March 15, 2026</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Music className="w-5 h-5 text-gold" />
                          <p className="text-gray-400">Lagos & Virtual</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="md:order-first">
                    <div className="relative rounded-2xl overflow-hidden border border-gold/30">
                      <img
                        src={eventImages.musicFestival}
                        alt="Web3 Music Festival"
                        className="w-full h-64 md:h-80 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* EVENT 3: NFT Art Gala */}
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 0.8, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative blur-[2px] hover:blur-0 transition-all duration-500"
              >
                <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-3 h-3 rounded-full bg-gold/50 border-2 border-black"></div>
                </div>

                <div className="md:grid md:grid-cols-2 md:gap-12 items-center">
                  <div className="md:order-1 mb-8 md:mb-0">
                    <div className="relative rounded-2xl overflow-hidden border border-gold/30">
                      <img
                        src={eventImages.nftGala}
                        alt="NFT Art Gala"
                        className="w-full h-64 md:h-80 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    </div>
                  </div>

                  <div className="md:order-2">
                    <div className="bg-black/70 rounded-2xl border border-gold/20 p-6">
                      <div className="mb-4">
                        <span className="inline-block px-4 py-1 rounded-full bg-gold/10 border border-gold/20 mb-3">
                          <span className="text-gold text-sm font-bold">COMING SOON</span>
                        </span>
                        <h3 className="text-xl font-bold text-white mb-3">
                          NFT Art Gala Night
                        </h3>
                        <p className="text-gray-300 mb-6">
                          Exclusive digital art exhibition featuring Africa's top NFT artists, 
                          live minting, and collector networking.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-gold" />
                          <p className="text-gray-400">April 5, 2026</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Coins className="w-5 h-5 text-gold" />
                          <p className="text-gray-400">Digital Gallery</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* EVENT 4: DeFi Hackathon */}
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 0.8, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative blur-[2px] hover:blur-0 transition-all duration-500"
              >
                <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-3 h-3 rounded-full bg-gold/50 border-2 border-black"></div>
                </div>

                <div className="md:grid md:grid-cols-2 md:gap-12 items-center">
                  <div className="mb-8 md:mb-0">
                    <div className="bg-black/70 rounded-2xl border border-gold/20 p-6">
                      <div className="mb-4">
                        <span className="inline-block px-4 py-1 rounded-full bg-gold/10 border border-gold/20 mb-3">
                          <span className="text-gold text-sm font-bold">COMING SOON</span>
                        </span>
                        <h3 className="text-xl font-bold text-white mb-3">
                          DeFi Hackathon Finals
                        </h3>
                        <p className="text-gray-300 mb-6">
                          Africa's biggest DeFi competition with $100K prizes, 
                          VC pitching, and live coding battles.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-gold" />
                          <p className="text-gray-400">May 20, 2026</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Zap className="w-5 h-5 text-gold" />
                          <p className="text-gray-400">Tech Hub, Abuja</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="md:order-first">
                    <div className="relative rounded-2xl overflow-hidden border border-gold/30">
                      <img
                        src={eventImages.hackathon}
                        alt="DeFi Hackathon"
                        className="w-full h-64 md:h-80 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* View All Events - Scrolls to top of events section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-20"
          >
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="#events"
              className="inline-flex items-center gap-2 text-gold font-medium hover:text-gold/80 transition"
            >
              <span>Back to Top</span>
              <ChevronRight className="w-4 h-4" />
            </motion.a>
          </motion.div>
        </div>
      </section>
    </main>
  );
}