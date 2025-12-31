// components/Loader.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Loader() {
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false); // Add this line

  useEffect(() => {
    setIsClient(true); // Set to true when component mounts on client
    
    // Hide loader after 5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Optionally store in localStorage to prevent showing on return visits
      sessionStorage.setItem('hasLoadedBefore', 'true');
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { 
              duration: 0.8, 
              ease: "easeInOut",
              delay: 0.3 
            }
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
          style={{ pointerEvents: isLoading ? 'auto' : 'none' }}
        >
          {/* Gold Orbital Animation */}
          <div className="relative w-64 h-64">
            {/* Outer ring */}
            <motion.div
              className="absolute inset-0 border-2 border-yellow-500/30 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Middle ring */}
            <motion.div
              className="absolute inset-8 border border-yellow-500/20 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
               
            {/* Inner ring */}
            <motion.div
              className="absolute inset-16 border border-yellow-500/10 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />

            {/* Floating gold nodes */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-lg shadow-yellow-500/50"
                style={{
                  left: `${50 + 40 * Math.cos((i / 8) * 2 * Math.PI)}%`,
                  top: `${50 + 40 * Math.sin((i / 8) * 2 * Math.PI)}%`,
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}

            {/* Center logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1, ease: "backOut" }}
                className="text-center"
              >
                <h1 className="text-4xl font-bold">
                  <span className="text-white">LO</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">FTE</span>
                  <span className="text-white">-3</span>
                </h1>
              </motion.div>
            </div>
          </div>

          {/* Loading text and progress */}
          <div className="absolute bottom-32 w-full max-w-md px-4">
            <div className="text-center mb-6">
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-2xl font-semibold text-white mb-2"
              >
                Loading Web3 Experience
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-gray-400"
              >
                Connecting to blockchain network...
              </motion.p>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden mb-2">
              <motion.div
                className="h-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 5, ease: "linear" }}
              />
            </div>

            {/* Progress text */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Initializing</span>
              <motion.span
                className="text-yellow-500 font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Counter from={0} to={100} duration={5} />%
              </motion.span>
            </div>

            {/* Loading states */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex justify-center gap-6 mt-6 text-xs text-gray-500"
            >
              {["Network", "Blockchain", "Web3", "Metaverse"].map((item, i) => (
                <motion.span
                  key={item}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeInOut"
                  }}
                >
                  {item}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* Bottom text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 text-center"
          >
            <p className="text-gray-500 text-sm tracking-widest">
              DECENTRALIZED • SECURE • IMMUTABLE
            </p>
          </motion.div>

          {/* Background particles - ONLY render on client to prevent hydration mismatch */}
          {isClient && [...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-500/20 rounded-full"
              initial={{
                x: Math.random() * 100 - 50 + "%",
                y: Math.random() * 100 - 50 + "%",
                opacity: 0
              }}
              animate={{
                y: [null, "-20px"],
                opacity: [0, 0.5, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 2 + Math.random(),
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Helper component for counting animation
function Counter({ from, to, duration }: { from: number; to: number; duration: number }) {
  const [count, setCount] = useState(from);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(from + progress * (to - from)));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [from, to, duration]);

  return <>{count}</>;
}