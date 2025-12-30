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
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl px-6 py-3 transition-all duration-300
      ${
        scrolled
          ? "bg-black/80 backdrop-blur-xl border border-gold/20 shadow-2xl shadow-gold/5"
          : "bg-black/40 backdrop-blur-lg border border-gold/10"
      } rounded-2xl`}
    >
      <div className="flex items-center justify-between">
        {/* LOGO with Web3 flair */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="relative w-12 h-12 bg-gradient-to-br from-gold to-gold/70 rounded-xl flex items-center justify-center overflow-hidden">
              {/* Your logo */}
              <div className="relative w-10 h-10">
                <Image 
                  src="/images/hbd.png" 
                  alt="LoFT3 Logo" 
                  width={40} 
                  height={40}
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
            <div className="text-gold font-extrabold tracking-wider text-2xl">
              <span className="text-white">Lo</span>FT<span className="text-gold">3</span>
            </div>
            <p className="text-xs text-gray-400 tracking-wider">WEB3 EVENTS</p>
          </div>
        </div>

        {/* DESKTOP NAV - No CTA buttons here */}
        <div className="hidden md:flex items-center gap-8">
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
          <Menu size={26} />
        </button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Side Menu */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-black/95 backdrop-blur-xl border-l border-gold/20 z-50 p-8 flex flex-col shadow-2xl shadow-gold/10"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="self-end p-2 rounded-lg border border-gold/30 text-gold hover:bg-gold/10 transition mb-8"
              >
                <X size={24} />
              </button>

              {/* Logo in Menu */}
              <div className="mb-10 p-4 border border-gold/20 rounded-xl bg-gradient-to-br from-black to-black/50 flex items-center gap-3">
                <div className="relative w-10 h-10">
                  <Image 
                    src="/images/logo.png"
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

              {/* Links - No buttons in mobile menu either */}
              <div className="flex flex-col gap-3">
                {links.map((link, idx) => (
                  <motion.a
                    key={idx}
                    href={link.href}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 px-4 py-4 rounded-xl text-lg text-gray-300 hover:text-gold hover:bg-gold/5 transition group border border-transparent hover:border-gold/20"
                  >
                    <span className="text-gold opacity-80">
                      {link.icon}
                    </span>
                    {link.name}
                  </motion.a>
                ))}
              </div>

              {/* Mobile Navigation only - No CTA buttons */}
              <div className="mt-auto pt-8">
                <p className="text-center text-sm text-gray-500">
                  Navigate to sections for waitlist & sponsor info
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}