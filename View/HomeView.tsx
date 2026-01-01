'use client';

import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Users, 
  Globe,
  ExternalLink,
  Calendar,
  Clock,
  MapPin,
  Heart,
  ChevronRight,
  Zap,
  Coins,
  Ticket,
  Droplets,
  Infinity
} from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function HomePage() {
  const xAccountLink = "https://x.com/hidreams__";
  
  // CONFIGURE YOUR IMAGES HERE:
  const eventImages = {
    // Valentine event image (changed from video)
    valentineEvent: "/images/hde.jpg", // Your image path here
    
    // Other events
    nftGala: "https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?q=80&w=2070&auto=format&fit=crop",
    hackathon: "https://images.unsplash.com/photo-1492684223066-dd23140edf6d?q=80&w=2070&auto=format&fit=crop",
    mainParty: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2070&auto=format&fit=crop",
  };

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar />
      
      {/* ========== HERO SECTION ========== */}
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
              
              {/* GOLD STATS with UPDATED ICONS - Infinity icon for 50+ Events */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-5xl mx-auto">
                {[
                  { icon: <Users className="w-8 h-8" />, label: "10K+", value: "Attendees" },
                  { icon: <Infinity className="w-8 h-8 text-gold" />, label: "50+", value: "Events" }, // Infinity icon here
                  { icon: <Sparkles className="w-8 h-8" />, label: "100+", value: "Parties" },
                  { icon: <Globe className="w-8 h-8 text-gold" />, label: "Africa", value: "Wide Coverage" }, // Globe icon here
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
                      <div className="text-gold">{stat.icon}</div>
                    </motion.div>
                    <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.label}</div>
                    <div className="text-sm text-gray-400">{stat.value}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* MAIN PARTY IMAGE with WORKING animation */}
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
            
            {/* Image Container */}
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

          {/* LEARN MORE BUTTON - FIXED CLICKABLE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.0 }}
            className="text-center mt-16"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(212, 175, 55, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open(xAccountLink, '_blank', 'noopener,noreferrer')}
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
                  {/* Image Side */}
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
                      {/* Valentine Event Image */}
                      <img
                        src={eventImages.valentineEvent}
                        alt="LOFTE-3 Valentine's Dinner & Pool Party"
                        className="w-full h-64 md:h-80 object-cover"
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
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => window.open("https://forms.gle/gwhB683FptSMNsE39", '_blank', 'noopener,noreferrer')}
                          className="flex-1 text-center px-6 py-3 rounded-full border border-gold text-gold font-bold hover:bg-gold/10 transition hover:shadow-lg hover:shadow-gold/20 cursor-pointer"
                        >
                          Join Waitlist
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => window.open("https://calendly.com/hidreamsofweb3/30min", '_blank', 'noopener,noreferrer')}
                          className="flex-1 text-center px-6 py-3 rounded-full bg-gold text-black font-bold hover:shadow-lg hover:shadow-gold/30 transition cursor-pointer"
                        >
                          Sponsor Event
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* EVENT 2: NFT Art Gala */}
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 0.8, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative blur-[8px] hover:blur-0 transition-all duration-500"
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

              {/* EVENT 3: DeFi Hackathon */}
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 0.8, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative blur-[8px] hover:blur-0 transition-all duration-500"
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

          {/* View All Events */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-20"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 text-gold font-medium hover:text-gold/80 transition cursor-pointer"
            >
              <span>Back to Top</span>
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}