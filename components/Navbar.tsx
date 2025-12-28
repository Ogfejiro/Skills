"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Change navbar style on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { name: "Home", href: "#" },
    { name: "About", href: "#" },
    { name: "Services", href: "#" },
    { name: "Contact", href: "#" },
  ];

  return (
    <nav
      className={`fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-6xl px-6 py-3 z-50 backdrop-blur-md border-b transition-all ${
        scrolled ? "bg-black/80 border-white/20" : "bg-white/10 border-white/10"
      } rounded-b-xl`}
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="text-white font-bold text-2xl">LOFTE3</div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6">
          {links.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              className="text-white hover:text-gray-300 font-medium transition"
            >
              {link.name}
            </a>
          ))}
          <a
            href="https://calendly.com/YOUR_CALENDLY_LINK"
            target="_blank"
            className="px-4 py-2 border border-gold text-gold rounded-full hover:bg-gold hover:text-black transition"
          >
            Sponsor
          </a>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(true)} className="text-white">
            <Menu />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-3/4 bg-black text-white shadow-lg z-50 flex flex-col p-8 gap-6"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="self-end text-white"
            >
              <X />
            </button>
            <div className="flex flex-col gap-4 mt-6">
              {links.map((link, idx) => (
                <motion.a
                  key={idx}
                  href={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => setIsOpen(false)}
                  className="text-xl font-medium hover:text-gray-300 transition"
                >
                  {link.name}
                </motion.a>
              ))}
              <motion.a
                href="https://calendly.com/YOUR_CALENDLY_LINK"
                target="_blank"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: links.length * 0.1 }}
                className="px-4 py-2 border border-gold text-gold rounded-full hover:bg-gold hover:text-black transition mt-4"
              >
                Sponsor
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
