// components/Navbar.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Calendar, Users, Home, Gift } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      
      // Update active nav based on scroll position
      const sections = ['home', 'events'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveNav(currentSection);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home", label: "Home", icon: <Home className="w-5 h-5" />, href: "#home" },
    { id: "events", label: "Events", icon: <Calendar className="w-5 h-5" />, href: "#events" },
    { id: "why-attend", label: "Why Attend", icon: <Sparkles className="w-5 h-5" />, href: "/why-attend" },
    { id: "waitlist", label: "Waitlist", icon: <Users className="w-5 h-5" />, href: "https://forms.gle/gwhB683FptSMNsE39", external: true },
  ];

  return (
    <>
      {/* DESKTOP NAVBAR */}
      <nav
        className={`hidden md:block fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl px-6 py-3 transition-all duration-300
        ${
          scrolled
            ? "bg-black backdrop-blur-xl border border-gold/20 shadow-2xl shadow-gold/5"
            : "bg-black/40 backdrop-blur-lg border border-gold/10"
        } rounded-2xl`}
      >
        <div className="container mx-auto flex items-center justify-between">
          {/* LOGO */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="relative w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-gold to-gold/70 rounded-xl flex items-center justify-center overflow-hidden">
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
              <p className="text-xs text-gray-400 tracking-wider">WEB3 EVENTS</p>
            </div>
          </div>

          {/* DESKTOP NAV */}
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
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gold group-hover:w-8 group-hover:left-1/4 transition-all duration-300" />
              </a>
            ))}
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
              onClick={() => !item.external && setActiveNav(item.id)}
              className="flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all"
            >
              <div className={`p-2 rounded-full transition-all ${
                activeNav === item.id 
                  ? "bg-gold/20 border border-gold/30" 
                  : "border border-transparent"
              }`}>
                <div className={`transition-all ${
                  activeNav === item.id ? "text-gold" : "text-gray-400"
                }`}>
                  {item.icon}
                </div>
              </div>
              <span className={`text-xs mt-1 transition-all ${
                activeNav === item.id ? "text-gold font-medium" : "text-gray-400"
              }`}>
                {item.label}
              </span>
              
              {/* Active indicator */}
              {activeNav === item.id && (
                <motion.div
                  layoutId="activeIndicator"
                  className="w-1 h-1 bg-gold rounded-full mt-1"
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              )}
            </a>
          ))}
        </div>
      </nav>

      {/* MOBILE TOP LOGO BAR */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-lg border-b border-gold/10 py-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 bg-gradient-to-br from-gold to-gold/70 rounded-xl flex items-center justify-center overflow-hidden">
              <div className="relative w-8 h-8">
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
            <div>
              <div className="text-gold font-extrabold tracking-wider text-xl">
                <span className="text-white">Lo</span>FT<span className="text-gold">3</span>
              </div>
              <p className="text-xs text-gray-400 tracking-wider">WEB3 EVENTS</p>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className="px-3 py-1 rounded-full bg-gold/10 border border-gold/20">
            <span className="text-xs text-gold font-medium">LIVE</span>
          </div>
        </div>
      </div>

      {/* Spacer for mobile bottom nav */}
      <div className="md:hidden h-20" />
    </>
  );
}