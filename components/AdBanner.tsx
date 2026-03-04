// components/AdBanner.tsx - FIXED HYDRATION ERROR
'use client'

import { motion } from 'framer-motion'
import { Download, ExternalLink, Sparkles, Gift, X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface AdBannerProps {
  onClose?: () => void
}

export default function AdBanner({ onClose }: AdBannerProps) {
  const [mounted, setMounted] = useState(false)
  const [particles, setParticles] = useState<Array<{left: string, top: string, x: number, y: number}>>([])

  const handleDownload = () => {
    window.open('https://apeitwallet.com', '_blank')
  }

  const handleAirdrop = () => {
    window.open('https://apeitreferal.com/ref/HIDREAMS', '_blank')
  }

  // Generate particles only on the client side after mounting
  useEffect(() => {
    setMounted(true)
    
    // Generate random positions once
    const newParticles = [...Array(5)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
    }))
    setParticles(newParticles)
  }, [])

  // Don't render particles during SSR to avoid hydration mismatch
  if (!mounted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-purple-900/30 via-black to-blue-900/30 border-2 border-gold/30 rounded-2xl overflow-hidden shadow-2xl shadow-gold/10 my-8"
      >
        {/* Background effects - these are safe */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-gold/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Rest of your content without particles */}
        <div className="relative z-10 p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            {/* App Image/Logo */}
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="flex-shrink-0"
            >
              <div className="relative">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-xl shadow-gold/30 border-2 border-gold/30">
                  <Image 
                    src="/images/apeit.jpg" 
                    alt="APEIT Wallet"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-2 border border-gold/30 rounded-2xl"
                />
              </div>
            </motion.div>

            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-gold" />
                <span className="text-xs font-bold text-gold uppercase tracking-wider">Sponsored</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                APEIT WALLET - Early wallet eat fast
              </h3>
              <p className="text-gray-300 mb-4 max-w-lg">
                Enjoy low gas fees and be among those that would share $100,000 airdrops from your volume monthly.
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-3 mb-6 justify-center md:justify-start">
                {['Early Access', 'Push Notifications', 'Exclusive Airdrops', 'Live Updates'].map((feature, i) => (
                  <span key={i} className="px-3 py-1 bg-gold/10 border border-gold/30 rounded-full text-xs text-gold">
                    {feature}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                {/* Download Button */}
                <button
                  onClick={handleDownload}
                  className="group relative px-6 py-3 bg-gradient-to-r from-gold to-yellow-500 text-black font-bold rounded-xl overflow-hidden shadow-lg shadow-gold/30 flex items-center justify-center gap-2 hover:opacity-90 transition"
                >
                  <Download className="w-5 h-5" />
                  <span>Download App</span>
                  <span className="text-xs bg-black/20 px-2 py-1 rounded-full">FREE</span>
                </button>

                {/* Airdrop Button */}
                <button
                  onClick={handleAirdrop}
                  className="group relative px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl overflow-hidden shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 hover:opacity-90 transition"
                >
                  <Gift className="w-5 h-5" />
                  <span>Register for Airdrop</span>
                  <ExternalLink className="w-4 h-4 opacity-70" />
                </button>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 mt-6 text-sm text-gray-400 justify-center md:justify-start">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>2,847 online</span>
                </div>
                <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                <span>⭐ 4.8 rating</span>
                <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                <span>50K+ downloads</span>
              </div>
            </div>

            {/* Badge */}
            <div className="absolute top-4 right-4 bg-gradient-to-r from-gold to-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              LIMITED OFFER
            </div>
          </div>
        </div>

        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </motion.div>
    )
  }

  // Client-side version with particles
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-gradient-to-br from-purple-900/30 via-black to-blue-900/30 border-2 border-gold/30 rounded-2xl overflow-hidden shadow-2xl shadow-gold/10 my-8"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gold/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Floating particles - only rendered on client */}
      {particles.length > 0 && (
        <div className="absolute inset-0">
          {particles.map((particle, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.2, 1],
                x: particle.x,
                y: particle.y,
              }}
              transition={{
                duration: 3,
                delay: i * 0.5,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
              className="absolute w-1 h-1 bg-gold rounded-full"
              style={{
                left: particle.left,
                top: particle.top,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
          {/* App Image/Logo */}
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="flex-shrink-0"
          >
            <div className="relative">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-xl shadow-gold/30 border-2 border-gold/30">
                <Image 
                  src="/images/apeit.jpg" 
                  alt="APEIT Wallet"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Animated ring around image */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-2 border border-gold/30 rounded-2xl"
              />
            </div>
          </motion.div>

          {/* Content */}
          <div className="flex-1 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-gold" />
                <span className="text-xs font-bold text-gold uppercase tracking-wider">Sponsored</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                APEIT WALLET - Early wallet eat fast
              </h3>
              <p className="text-gray-300 mb-4 max-w-lg">
                Enjoy low gas fees and be among those that would share $100,000 airdrops from your volume monthly.
              </p>
            </motion.div>

            {/* Features */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-3 mb-6 justify-center md:justify-start"
            >
              {['Early Access', 'Push Notifications', 'Exclusive Airdrops', 'Live Updates'].map((feature, i) => (
                <span key={i} className="px-3 py-1 bg-gold/10 border border-gold/30 rounded-full text-xs text-gold">
                  {feature}
                </span>
              ))}
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start"
            >
              {/* Download Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownload}
                className="group relative px-6 py-3 bg-gradient-to-r from-gold to-yellow-500 text-black font-bold rounded-xl overflow-hidden shadow-lg shadow-gold/30 flex items-center justify-center gap-2"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <Download className="w-5 h-5" />
                <span>Download App</span>
                <span className="text-xs bg-black/20 px-2 py-1 rounded-full">FREE</span>
              </motion.button>

              {/* Airdrop Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAirdrop}
                className="group relative px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl overflow-hidden shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <Gift className="w-5 h-5" />
                <span>Register for Airdrop</span>
                <ExternalLink className="w-4 h-4 opacity-70" />
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-4 mt-6 text-sm text-gray-400 justify-center md:justify-start"
            >
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>2,847 online</span>
              </div>
              <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
              <span>⭐ 4.8 rating</span>
              <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
              <span>50K+ downloads</span>
            </motion.div>
          </div>

          {/* Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: 'spring' }}
            className="absolute top-4 right-4 bg-gradient-to-r from-gold to-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg"
          >
            LIMITED OFFER
          </motion.div>
        </div>
      </div>

      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </motion.div>
  )
}