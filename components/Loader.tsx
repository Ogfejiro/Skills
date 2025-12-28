"use client"

import { motion } from "framer-motion"

const Loader = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="h-14 w-14 rounded-full border-4 border-white/20 border-t-yellow-400"
      />
    </motion.div>
  )
}

export default Loader
