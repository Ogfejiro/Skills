// components/Navbar.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu, Sparkles, Calendar, Zap, Users } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { name: "Home", href: "#home", icon: <Sparkles className="w-4 h-4" /> },
    { name: "Events", href: "#events", icon: <Calendar className="w-4 h-4" /> },
    { name: "About", href: "#about", icon: <Users className="w-4 h-4" /> },
    { name: "Waitlist", href: "#waitlist", icon: <Zap className="w-4 h-4" /> },
  ];

  return (
    <nav
      className={`fixed top-0 md:top-4 left-0 md:left-1/2 md:-translate-x-1/2 z-50 w-full md:w-[95%] md:max-w-6xl px-4 md:px-6 py-3 transition-all duration-300
      ${
        scrolled
          ? "bg-black backdrop-blur-xl border-b md:border border-gold/20 shadow-2xl shadow-gold/5"
          : "bg-black md:bg-black/40 backdrop-blur-lg border-b md:border border-gold/10"
      } md:rounded-2xl`}
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* LOGO with Web3 flair */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="relative w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-gold to-gold/70 rounded-xl flex items-center justify-center overflow-hidden">
              {/* Your logo - Fixed image path */}
              <div className="relative w-8 h-8 md:w-10 md:h-10">
                <Image
                  src="/images/hds.jpg" 
                  alt="LoFT3 Logo" 
                  width={32}
                  height={32}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            {/* Animated orbit */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-2 border border-gold/30 rounded-full"
            />
          </div>
          <div>
            <div className="text-gold font-extrabold tracking-wider text-xl md:text-2xl">
              <span className="text-white">Lo</span>FT<span className="text-gold">3</span>
            </div>
            <p className="text-xs text-gray-400 tracking-wider hidden md:block">WEB3 EVENTS</p>
          </div>
        </div>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-6 bg-black/30 ">
          {links.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm uppercase tracking-wider text-gray-300 hover:text-gold hover:bg-gold/5 transition-all group relative"
            >
              <span className="opacity-60 group-hover:opacity-100 transition">
                {link.icon}
              </span>
              {link.name}
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gold group-hover:w-8 group-hover:left-1/4 transition-all duration-300" />
            </a>
          ))}
        </div>

        {/* MOBILE TOGGLE */}
        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden p-2 rounded-lg border border-gold/30 text-gold hover:bg-gold/10 transition"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop - Solid black for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />

            {/* Side Menu - Solid black on mobile */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-black border-l border-gold/30 z-50 p-6 flex flex-col shadow-2xl shadow-gold/20"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="self-end p-2 rounded-lg border border-gold/30 text-gold hover:bg-gold/10 transition mb-6"
              >
                <X size={24} />
              </button>

              {/* Logo in Menu */}
              <div className="mb-8 p-4 border border-gold/20 rounded-xl bg-gradient-to-br from-black to-black/80 flex items-center gap-3">
                <div className="relative w-10 h-10">
                  <Image 
                     src="/images/hds.jpg" // Same image as main logo
                    alt="LoFT3 Logo" 
                    width={40} 
                    height={40}
                    className="object-contain"
                  />
                </div>
                <div>
                  <div className="text-gold font-extrabold tracking-wider text-xl">
                    <span className="text-white">Lo</span>FT<span className="text-gold">3</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Exclusive Web3 Events</p>
                </div>
              </div>

              {/* Links */}
              <div className="flex flex-col gap-2">
                {links.map((link, idx) => (
                  <motion.a
                    key={idx}
                    href={link.href}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 px-4 py-3 rounded-lg text-base text-gray-300 hover:text-gold hover:bg-gold/10 transition group border border-transparent hover:border-gold/20"
                  >
                    <span className="text-gold opacity-80">
                      {link.icon}
                    </span>
                    {link.name}
                  </motion.a>
                ))}
              </div>

              {/* Footer Note */}
              <div className="mt-auto pt-6 border-t border-gold/10">
                <p className="text-center text-sm text-gray-500">
                  Navigate to sections for more info
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}