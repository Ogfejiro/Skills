"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

import DarkVeil from "@/components/DarkVeil"
import Navbar from "@/components/Navbar"
import SplitText from "@/components/SplitText"
import Loader from "@/components/Loader"

const HomeView = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1600)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {/* PAGE LOADER */}
      <AnimatePresence>{loading && <Loader />}</AnimatePresence>

      {!loading && (
        <div className="relative h-screen w-full overflow-hidden bg-black">
          {/* BACKGROUND */}
          <DarkVeil />

          {/* FOREGROUND */}
          <div className="relative z-10 h-full">
            <Navbar />

            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-4 text-center">
              <SplitText
                text="WELCOME TO LOFTE-3"
                tag="h1"
                className="!text-5xl md:!text-7xl lg:!text-8xl font-bold tracking-tight leading-[1.05] text-white"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                textAlign="center"
              />

              <h2 className="text-xl md:text-2xl text-white">
                Biggest Web3 Platform in Nigeria
              </h2>

              <p className="max-w-2xl text-white/80 text-base md:text-lg leading-relaxed">
                Join builders, creators, founders, and innovators shaping the
                future of blockchain, AI, and decentralized technology.
                Experience powerful talks, networking, and opportunities —
                all in one place.
              </p>

              {/* CTA BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.08 }}
                  className="px-8 py-4 rounded-full bg-white text-black font-semibold shadow-[0_0_25px_rgba(255,215,0,0.35)]"
                >
                  Register
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.75 }}
                  whileHover={{ scale: 1.06 }}
                  className="px-8 py-4 rounded-full border border-white/40 text-white backdrop-blur-md hover:bg-white/10"
                >
                  Become a Sponsor
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default HomeView
