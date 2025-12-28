"use client";

import React, { useEffect, useState } from "react";
import SplitText from "@/components/SplitText";
import DarkVeil from "@/components/DarkVeil";
import Navbar from "@/components/Navbar";
import { Loader2 } from "lucide-react";

const HomeView = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // simulate load (background effects, fonts, animations)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1800); // adjust if needed

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black text-white gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-gold" />
        <p className="text-gray-300 text-sm tracking-wide">
          Your content is loading, please wait…
        </p>
      </div>
    );
  }

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* BACKGROUND EFFECT */}
      <DarkVeil />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-black to-black opacity-80 z-0"></div>

      <Navbar />

      {/* FOREGROUND */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 md:px-20 text-center gap-6">
        <SplitText
          text="LOFTE-3 WEB3 EXPERIENCE"
          tag="h1"
          className="!text-5xl md:!text-7xl lg:!text-8xl font-extrabold tracking-tight text-white"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          textAlign="center"
        />

        <p className="text-gray-300 text-lg md:text-2xl max-w-3xl">
          Nigeria&apos;s premier Web3 event — Connect, Learn, and Experience the
          Future of Blockchain and Crypto.
        </p>

        <div className="flex flex-col md:flex-row gap-4 mt-6 justify-center">
          <a
            href="https://google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-gold text-black font-bold rounded-full hover:bg-yellow-500 transition"
          >
            Join Event
          </a>

          <a
            href="https://calendly.com/hidreamsofweb3/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 border border-gold text-gold font-bold rounded-full hover:bg-gold hover:text-black transition"
          >
            Become a Sponsor
          </a>
        </div>
      </div>
    </section>
  );
};

export default HomeView;
