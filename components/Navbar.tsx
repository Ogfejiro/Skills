// components/Navbar.tsx - SIMPLIFIED WORKING VERSION
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Calendar, Users, Home, Ticket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home", label: "Home", icon: <Home className="w-5 h-5" />, href: "#home" },
    { id: "events", label: "Events", icon: <Calendar className="w-5 h-5" />, href: "#events" },
    { id: "why-attend", label: "Why Attend", icon: <Sparkles className="w-5 h-5" />, href: "#why-attend" },
    { id: "waitlist", label: "Waitlist", icon: <Users className="w-5 h-5" />, href: "https://forms.gle/gwhB683FptSMNsE39", external: true },
  ];

  return (
    <>
      {/* DESKTOP NAVBAR */}
      <nav
        className={`hidden md:flex fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl px-6 py-3 transition-all duration-300
        ${
          scrolled
            ? "bg-black backdrop-blur-xl border border-gold/20 shadow-2xl shadow-gold/5"
            : "bg-black/40 backdrop-blur-lg border border-gold/10"
        } rounded-2xl`}
      >
        <div className="container mx-auto flex items-center justify-between w-full">
          {/* LOGO */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 bg-gradient-to-br from-gold to-gold/70 rounded-xl flex items-center justify-center overflow-hidden">
              <div className="relative w-8 h-8">
                <Image
                  src="/images/hds.jpg" 
                  alt="LOFTE-3 Logo" 
                  width={32}
                  height={32}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <div>
              <div className="text-gold font-extrabold tracking-wider text-xl">
                <span className="text-white">LO</span>FTE<span className="text-gold">-3</span>
              </div>
              <p className="text-xs text-gray-400 tracking-wider">WEB3 EVENTS</p>
            </div>
          </div>

          {/* NAV ITEMS & GET TICKETS BUTTON */}
          <div className="flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm uppercase tracking-wider text-gray-300 hover:text-gold hover:bg-gold/5 transition-all group relative"
              >
                <span className="opacity-60 group-hover:opacity-100 transition">
                  {item.icon}
                </span>
                {item.label}
              </a>
            ))}

            {/* GET TICKETS BUTTON - HIGHLY VISIBLE */}
            <Link href="/payment">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold via-gold/90 to-gold/80 text-black font-bold rounded-xl hover:shadow-lg hover:shadow-gold/30 transition-all duration-300 relative overflow-hidden min-w-[140px] justify-center"
              >
                {/* Animated background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000" />
                
                <Ticket className="w-5 h-5" />
                <span className="tracking-wider">GET TICKETS</span>
                
                {/* Live indicator */}
                <div className="absolute -right-1 -top-1 flex items-center gap-1">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 bg-red-500 rounded-full"
                  />
                  <span className="text-[10px] text-red-500 font-bold">LIVE</span>
                </div>
              </motion.button>
            </Link>
          </div>
        </div>
      </nav>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-gold/20 shadow-2xl shadow-gold/10">
        <div className="flex items-center justify-around px-4 py-3">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className="flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all"
            >
              <div className="p-2 rounded-full">
                <div className="text-gray-400">
                  {item.icon}
                </div>
              </div>
              <span className="text-xs mt-1 text-gray-400">
                {item.label}
              </span>
            </a>
          ))}
          
          {/* MOBILE GET TICKETS BUTTON */}
          <Link href="/payment">
            <button className="flex flex-col items-center justify-center px-3 py-2 relative">
              <div className="p-2 rounded-full bg-gradient-to-r from-gold to-gold/80 border border-gold/30">
                <Ticket className="w-5 h-5 text-black" />
              </div>
              <span className="text-xs mt-1 text-gold font-medium">Tickets</span>
              
              {/* Live indicator */}
              <div className="absolute top-0 right-2">
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1.5 h-1.5 bg-red-500 rounded-full"
                />
              </div>
            </button>
          </Link>
        </div>
      </nav>

      {/* MOBILE TOP BAR */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-lg border-b border-gold/10 py-3 px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 bg-gradient-to-br from-gold to-gold/70 rounded-xl flex items-center justify-center overflow-hidden">
              <div className="relative w-8 h-8">
                <Image
                  src="/images/hds.jpg" 
                  alt="LOFTE-3 Logo" 
                  width={32}
                  height={32}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <div>
              <div className="text-gold font-extrabold tracking-wider text-xl">
                <span className="text-white">LO</span>FTE<span className="text-gold">-3</span>
              </div>
              <p className="text-xs text-gray-400 tracking-wider">WEB3 EVENTS</p>
            </div>
          </div>
          
          {/* Status */}
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 rounded-full bg-red-500/20 border border-red-500/30">
              <span className="text-xs text-red-400 font-bold">LIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for mobile bottom nav */}
      <div className="md:hidden h-20" />
      
      {/* Spacer for desktop nav */}
      <div className="hidden md:block h-24" />
    </>
  );
}