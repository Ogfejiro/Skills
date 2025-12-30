// components/LoadingScreen.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Globe } from 'lucide-react';

export default function Loader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 150);

    // Auto-hide after 3 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  // Blockchain node animation
  const nodes = [1, 2, 3, 4, 5];

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
        >
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute inset-0 grid-web3"></div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-gold/10 rounded-full"
            />
          </div>

          {/* Main Content */}
          <div className="relative z-10 text-center">
            {/* Blockchain Nodes Visualization */}
            <div className="relative mb-12">
              <div className="flex items-center justify-center space-x-8">
                {nodes.map((node) => (
                  <motion.div
                    key={node}
                    className="relative"
                    initial={{ y: 0 }}
                    animate={{ y: [0, -15, 0] }}
                    transition={{
                      duration: 1.5,
                      delay: node * 0.2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    {/* Node */}
                    <div className="relative">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 2,
                          delay: node * 0.3,
                          repeat: Infinity
                        }}
                        className="w-4 h-4 rounded-full bg-gradient-to-br from-gold to-yellow-600 shadow-lg shadow-gold/30"
                      />
                      {/* Glow */}
                      <div className="absolute inset-0 w-4 h-4 rounded-full bg-gold animate-ping opacity-20" />
                    </div>
                    
                    {/* Connecting Line */}
                    {node < nodes.length && (
                      <div className="absolute top-2 -right-6 w-8 h-0.5 bg-gradient-to-r from-gold/50 to-transparent" />
                    )}
                  </motion.div>
                ))}
              </div>
              
              {/* Circular Connection */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-8 border border-gold/20 rounded-full"
              />
            </div>

            {/* Logo/Brand */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="p-3 bg-gradient-to-br from-gold to-yellow-700 rounded-xl"
                >
                  <Sparkles className="w-8 h-8 text-black" />
                </motion.div>
                <h1 className="text-5xl font-bold">
                  <span className="text-white">Lo</span>
                  <span className="gold-gradient">FT</span>
                  <span className="text-white">3</span>
                </h1>
              </div>
              <p className="text-gray-400 text-lg tracking-wider">
                WEB3 EVENTS NETWORK
              </p>
            </motion.div>

            {/* Loading Text */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-10"
            >
              <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-3">
                <Zap className="w-6 h-6 text-gold animate-pulse" />
                <span>Loading Exclusive Experiences</span>
                <Globe className="w-6 h-6 text-gold" />
              </h2>
              <p className="text-gray-400">Connecting to decentralized events...</p>
            </motion.div>

            {/* Progress Bar */}
            <div className="w-80 mx-auto mb-4">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Initializing</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-gradient-to-r from-gold to-yellow-600 rounded-full relative"
                >
                  {/* Shine effect */}
                  <motion.div
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                  />
                </motion.div>
              </div>
            </div>

            {/* Web3 Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex justify-center gap-8 mt-8 text-sm text-gray-500"
            >
              <div className="text-center">
                <div className="text-gold font-bold">10K+</div>
                <div>Community</div>
              </div>
              <div className="text-center">
                <div className="text-gold font-bold">200+</div>
                <div>Events</div>
              </div>
              <div className="text-center">
                <div className="text-gold font-bold">50+</div>
                <div>Speakers</div>
              </div>
            </motion.div>

            {/* Bottom Note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 1 }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-600"
            >
              Secured by blockchain technology • Powered by community
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}