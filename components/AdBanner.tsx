// components/AdBanner.tsx - REDUCED SIZE VERSION
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
  const [particles, setParticles] = useState<Array<{ left: string, top: string, x: number, y: number }>>([])

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
    const newParticles = [...Array(3)].map(() => ({
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
        className="relative bg-gradient-to-br from-purple-900/30 via-black to-blue-900/30 border border-gold/30 rounded-xl overflow-hidden shadow-xl shadow-gold/10 my-4"
      >
        {/* Background effects - these are safe */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-gold/5 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>

        {/* Content - Reduced padding and sizes */}
        <div className="relative z-10 p-4 md:p-5">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            {/* App Image/Logo - Smaller */}
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="flex-shrink-0"
            >
              <div className="relative">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden shadow-lg shadow-gold/30 border border-gold/30">
                  <Image
                    src="/images/apeit.jpg"
                    alt="APEIT Wallet"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-1 border border-gold/30 rounded-xl"
                />
              </div>
            </motion.div>

            {/* Content - More compact */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-1 mb-1">
                <Sparkles className="w-3 h-3 text-gold" />
                <span className="text-[10px] font-bold text-gold uppercase tracking-wider">Sponsored</span>
              </div>
              <h3 className="text-base md:text-lg font-bold text-white mb-1">
                APEIT WALLET
              </h3>
              <p className="text-xs text-gray-300 mb-2 max-w-md">
                Low gas fees & share $100,000 airdrops monthly.
              </p>

              {/* Features - Smaller tags */}
              <div className="flex flex-wrap gap-1 mb-3 justify-center md:justify-start">
                {['Early Access', 'Airdrops', 'Live Updates'].map((feature, i) => (
                  <span key={i} className="px-2 py-0.5 bg-gold/10 border border-gold/30 rounded-full text-[10px] text-gold">
                    {feature}
                  </span>
                ))}
              </div>

              {/* Action Buttons - Smaller */}
              <div className="flex flex-col sm:flex-row gap-2 justify-center md:justify-start">
                {/* Download Button */}
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-gradient-to-r from-gold to-yellow-500 text-black font-bold rounded-lg text-xs flex items-center justify-center gap-1 hover:opacity-90 transition"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                  <span className="text-[8px] bg-black/20 px-1 py-0.5 rounded-full">FREE</span>
                </button>

                {/* Airdrop Button */}
                <button
                  onClick={handleAirdrop}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1 hover:opacity-90 transition"
                >
                  <Gift className="w-3 h-3" />
                  <span>Airdrop</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </button>
              </div>
            </div>

            {/* Badge - Smaller */}
            <div className="absolute top-2 right-2 bg-gradient-to-r from-gold to-yellow-500 text-black text-[8px] font-bold px-2 py-0.5 rounded-full shadow-lg">
              LIMITED
            </div>
          </div>
        </div>

        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-2 left-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </motion.div>
    )
  }

  // Client-side version with particles - similarly reduced
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-gradient-to-br from-purple-900/30 via-black to-blue-900/30 border border-gold/30 rounded-xl overflow-hidden shadow-xl shadow-gold/10 my-4"
    >
      {/* Animated background elements - Smaller */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gold/5 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      {/* Floating particles - fewer and smaller */}
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
              className="absolute w-0.5 h-0.5 bg-gold rounded-full"
              style={{
                left: particle.left,
                top: particle.top,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 p-4 md:p-5">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
          {/* App Image/Logo - Smaller */}
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="flex-shrink-0"
          >
            <div className="relative">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden shadow-lg shadow-gold/30 border border-gold/30">
                <Image
                  src="/images/apeit.jpg"
                  alt="APEIT Wallet"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Animated ring around image - Smaller */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-1 border border-gold/30 rounded-xl"
              />
            </div>
          </motion.div>

          {/* Content - More compact */}
          <div className="flex-1 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-center md:justify-start gap-1 mb-1">
                <Sparkles className="w-3 h-3 text-gold" />
                <span className="text-[10px] font-bold text-gold uppercase tracking-wider">Sponsored</span>
              </div>
              <h3 className="text-base md:text-lg font-bold text-white mb-1">
                APEIT WALLET
              </h3>
              <p className="text-xs text-gray-300 mb-2 max-w-md">
                Low gas fees & share $100,000 airdrops monthly.
              </p>
            </motion.div>

            {/* Features - Smaller tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-1 mb-3 justify-center md:justify-start"
            >
              {['Early Access', 'Airdrops', 'Live Updates'].map((feature, i) => (
                <span key={i} className="px-2 py-0.5 bg-gold/10 border border-gold/30 rounded-full text-[10px] text-gold">
                  {feature}
                </span>
              ))}
            </motion.div>

            {/* Action Buttons - Smaller */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-2 justify-center md:justify-start"
            >
              {/* Download Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownload}
                className="px-4 py-2 bg-gradient-to-r from-gold to-yellow-500 text-black font-bold rounded-lg text-xs flex items-center justify-center gap-1 hover:opacity-90 transition"
              >
                <Download className="w-3 h-3" />
                <span>Download</span>
                <span className="text-[8px] bg-black/20 px-1 py-0.5 rounded-full">FREE</span>
              </motion.button>

              {/* Airdrop Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAirdrop}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1 hover:opacity-90 transition"
              >
                <Gift className="w-3 h-3" />
                <span>Airdrop</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </motion.button>
            </motion.div>

            {/* Stats - Smaller */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-3 mt-3 text-[10px] text-gray-400 justify-center md:justify-start"
            >
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span>2.8k online</span>
              </div>
              <span>⭐ 4.8</span>
              <span>50K+</span>
            </motion.div>
          </div>

          {/* Badge - Smaller */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: 'spring' }}
            className="absolute top-2 right-2 bg-gradient-to-r from-gold to-yellow-500 text-black text-[8px] font-bold px-2 py-0.5 rounded-full shadow-lg"
          >
            LIMITED
          </motion.div>
        </div>
      </div>

      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 left-2 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </motion.div>
  )
}