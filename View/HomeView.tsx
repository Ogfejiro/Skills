// 'use client'

// import { motion } from 'framer-motion'
// import { useState } from 'react'
// import {
// 	Calendar,
// 	MapPin,
// 	Users,
// 	ArrowRight,
// 	Sparkles,
// 	ChevronRight,
// 	History,
// 	Coins,
// 	Home,
// 	Clock,
// 	Ticket,
// 	ExternalLink,
// } from 'lucide-react'

// import Link from 'next/link'
// import Navbar from '@/components/Navbar'
// import TicketModal from '@/components/TicketModal'

// export default function HomePage() {
// 	const [isTicketModalOpen, setIsTicketModalOpen] = useState(false)

// 	const openLink = (link: string) => {
// 		if (link) window.open(link, '_blank')
// 	}

// 	const xAccountLink = 'https://x.com'
// 	const learnMoreLink = 'https://example.com/about'
// 	const calendlyLink = 'https://calendly.com'

// 	const eventImages = {
// 		mainParty: '/images/new.jpg',
// 		valentineEvent: '/images/valentine.jpg',
// 	}

// 	const featuredEvent = {
// 		title: 'LOFTE-3 Project Hangout & Dinner',
// 		date: 'March 27, 2026',
// 		location: 'Eko Hotels & Suites, Lagos',
// 		image: '/images/new.jpg',
// 		attendees: 500,
// 		description: 'An exclusive evening with Web3 elites',
// 	}

// 	return (
// 		<main className='min-h-screen bg-black text-white overflow-x-hidden'>
// 			<Navbar />

// 			<TicketModal
// 				isOpen={isTicketModalOpen}
// 				onClose={() => setIsTicketModalOpen(false)}
// 			/>

// 			{/* HERO */}
// 			<section className='relative min-h-screen flex items-center pt-20'>
// 				<div className='container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center'>
// 					{/* LEFT */}
// 					<div>
// 						<h1 className='text-5xl md:text-7xl font-bold mb-6'>
// 							Where Web3 Meets{' '}
// 							<span className='text-gold'>Reality</span>
// 						</h1>

// 						<p className='text-gray-300 mb-8'>
// 							Discover and join premium Web3 events across Africa.
// 						</p>

// 						<div className='flex gap-4'>
// 							<button
// 								onClick={() => setIsTicketModalOpen(true)}
// 								className='px-6 py-3 bg-gold text-black font-bold rounded-lg'
// 							>
// 								Get Tickets
// 							</button>

// 							<a
// 								href='#events'
// 								className='px-6 py-3 border border-gold text-gold rounded-lg'
// 							>
// 								Explore
// 							</a>
// 						</div>
// 					</div>

// 					{/* RIGHT IMAGE */}
// 					<div>
// 						<img
// 							src={featuredEvent.image}
// 							className='rounded-xl border border-gold'
// 						/>
// 					</div>
// 				</div>
// 			</section>

// 			{/* WELCOME SECTION (FIXED POSITION) */}
// 			<section id='home' className='py-20 text-center'>
// 				<h2 className='text-4xl md:text-6xl font-bold mb-6'>
// 					WELCOME TO LOFTE-3
// 				</h2>

// 				<p className='text-gray-400 max-w-2xl mx-auto mb-10'>
// 					Africa's leading Web3 IRL event platform.
// 				</p>

// 				<div className='flex justify-center gap-6 flex-wrap'>
// 					<div className='text-gold text-3xl flex items-center gap-2'>
// 						Crypto <Coins />
// 					</div>
// 					<div className='text-gold text-3xl flex items-center gap-2'>
// 						Beyond <Coins />
// 					</div>
// 					<div className='text-gold text-3xl'>Screen</div>
// 				</div>
// 			</section>

// 			{/* FEATURED EVENT */}
// 			<section id='featured' className='py-20'>
// 				<div className='container mx-auto px-4 max-w-4xl'>
// 					<div className='border border-gold p-8 rounded-xl'>
// 						<h3 className='text-3xl font-bold mb-4'>
// 							{featuredEvent.title}
// 						</h3>

// 						<p className='text-gray-400 mb-6'>
// 							{featuredEvent.description}
// 						</p>

// 						<div className='grid grid-cols-3 gap-4 mb-6 text-sm'>
// 							<div>{featuredEvent.date}</div>
// 							<div>{featuredEvent.location}</div>
// 							<div>{featuredEvent.attendees}+ Attendees</div>
// 						</div>

// 						<button
// 							onClick={() => setIsTicketModalOpen(true)}
// 							className='bg-gold text-black px-6 py-3 rounded-lg font-bold'
// 						>
// 							Get Tickets
// 						</button>
// 					</div>
// 				</div>
// 			</section>

// 			{/* UPCOMING EVENTS */}
// 			<section id='events' className='py-20'>
// 				<div className='container mx-auto px-4'>
// 					<h2 className='text-4xl font-bold text-center mb-16'>
// 						Upcoming Events
// 					</h2>

// 					<div className='grid md:grid-cols-2 gap-10'>
// 						<div className='border border-gold p-6 rounded-xl'>
// 							<h3 className='text-2xl font-bold mb-4'>
// 								LOFTE-3 Dinner Event
// 							</h3>

// 							<p className='text-gray-400 mb-6'>
// 								Premium Web3 networking dinner.
// 							</p>

// 							<div className='space-y-2 mb-6 text-sm'>
// 								<div className='flex items-center gap-2'>
// 									<Calendar className='w-4' /> March 27, 2026
// 								</div>
// 								<div className='flex items-center gap-2'>
// 									<MapPin className='w-4' /> Lagos
// 								</div>
// 							</div>

// 							<div className='flex gap-4'>
// 								<button
// 									onClick={() => setIsTicketModalOpen(true)}
// 									className='flex-1 border border-gold text-gold py-2 rounded-lg'
// 								>
// 									Tickets
// 								</button>

// 								<button
// 									onClick={() => openLink(calendlyLink)}
// 									className='flex-1 bg-gold text-black py-2 rounded-lg'
// 								>
// 									Sponsor
// 								</button>
// 							</div>
// 						</div>
// 					</div>
// 				</div>
// 			</section>

// 			{/* CTA */}
// 			<section className='py-20 text-center'>
// 				<h2 className='text-4xl font-bold mb-6'>
// 					Ready to Experience Web3?
// 				</h2>

// 				<button
// 					onClick={() => setIsTicketModalOpen(true)}
// 					className='px-10 py-4 bg-gold text-black font-bold rounded-lg'
// 				>
// 					Claim Tickets
// 				</button>
// 			</section>

// 			{/* PREVIOUS EVENTS */}
// 			<div className='text-center pb-20'>
// 				<Link href='/previous-events'>
// 					<button className='px-8 py-3 border border-gold text-gold rounded-full flex items-center gap-2 mx-auto'>
// 						<History className='w-4' />
// 						Previous Events
// 						<ChevronRight className='w-4' />
// 					</button>
// 				</Link>
// 			</div>
// 		</main>
// 	)
// }

"use client";

import { useState } from "react";
import WhyAttendPage from '@/View/WhyAttend';
import FaqView from '@/View/FaqView';



const LOGOS = [
  "Sorare", "VISA", "Sling", "Slack", "Unqork",
  "Segment", "LinkedIn", "Overwolf", "Microsoft", "Humaans",
];

const FEATURES = [
  {
    icon: "📅",
    title: "Interactive Schedule",
    desc: "Easily navigate and plan your day with interactive schedule.",
  },
  {
    icon: "🔒",
    title: "Exclusive Content",
    desc: "Gain access to exclusive sessions that will elevate your knowledge.",
  },
  {
    icon: "🔔",
    title: "Event Updates",
    desc: "Stay informed with real-time updates and announcements.",
  },
  {
    icon: "📡",
    title: "Live Streaming",
    desc: "Experience the event from anywhere with seamless live streaming.",
  },
];

const KEY_FEATURES = [
  {
    icon: "🔗",
    title: "Social Integration",
    desc: "Connect and interact with us and fellow attendees on various social media platforms.",
  },
  {
    icon: "🎤",
    title: "Speaker Lineup",
    desc: "This feature highlights the profiles of keynote speakers, panelists, and workshop leaders.",
  },
];

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-[#0d0d18]/80 backdrop-blur border-b border-white/5">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg overflow-hidden bg-gradient-to-br from-yellow-500 to-yellow-800 flex items-center justify-center">
            <span className="text-xs font-black text-black">L3</span>
          </div>
          <div className="leading-tight">
            <span className="font-black text-sm tracking-tight">
              <span className="text-white">LO</span>
              <span className="text-[#c9a227]">FTE-3</span>
            </span>
            <p className="text-[10px] text-gray-400 tracking-widest">WEB3 EVENTS</p>
          </div>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
          {NAV_LINKS.map((link) => (
            <a key={link} href="#" className="hover:text-white transition-colors">
              {link}
            </a>
          ))}
          <a href="#" className="flex items-center gap-1 text-white font-medium">
            <span className="w-2 h-2 rounded-full bg-[#c9a227] inline-block" />
            Ngstarz Today
          </a>
        </div>

        <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-sm hover:border-[#c9a227] hover:text-[#c9a227] transition-all">
          Sign In ↗
        </button>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {menuOpen && (
        <div className="fixed top-14 left-0 right-0 z-40 bg-[#0d0d18] border-b border-white/10 p-6 flex flex-col gap-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <a key={link} href="#" className="text-gray-300 hover:text-white">
              {link}
            </a>
          ))}
          <a href="#" className="text-[#c9a227] font-semibold">Ngstarz Today</a>
          <a href="#" className="border border-white/20 rounded-full px-4 py-2 text-center text-sm">Sign In</a>
        </div>
      )}

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-24 pb-16 overflow-hidden">
        {/* Stars background */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 80 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() > 0.8 ? "2px" : "1px",
                height: Math.random() > 0.8 ? "2px" : "1px",
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.6 + 0.1,
              }}
            />
          ))}
        </div>

        {/* Glow orbs */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#c9a227]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[200px] bg-purple-900/20 rounded-full blur-[100px] pointer-events-none" />

        <p className="text-xs text-gray-500 tracking-widest mb-6 uppercase">
          ✦ This is an unforgettable experience
        </p>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight max-w-4xl mb-4">
          <span className="text-white">Join the Celebration</span>
          <br />
          <span className="text-white">Unforgettable </span>
          <span className="text-[#c9a227]">Event Experience</span>
        </h1>

        <p className="text-gray-400 max-w-xl text-sm md:text-base mt-4 mb-8 leading-relaxed">
          Embark on a journey of sophistication and joy, where each moment is designed
          to inspire and delight. Join us and discover the perfect fusion.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button className="px-6 py-3 rounded-full bg-[#c9a227] text-black font-bold text-sm hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-900/40">
            Register Now Today →
          </button>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {["🧑", "👩", "🧔", "👱"].map((emoji, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border-2 border-[#0a0a0f] flex items-center justify-center text-xs"
                >
                  {emoji}
                </div>
              ))}
            </div>
            <div className="text-left">
              <p className="text-xs text-white font-semibold">Relied upon by more</p>
              <p className="text-xs text-gray-500">than 20,000 Users</p>
            </div>
          </div>
        </div>

        {/* Dashboard Preview Cards */}
        <div className="relative mt-16 w-full max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Upload Card */}
          <DashCard title="Upload" accent="#c9a227">
            <div className="space-y-2 mt-2">
              {[{ label: "25 Videos", size: "2.5GB" }, { label: "25 Videos", size: "1.2GB" }, { label: "25 Videos", size: "3.1GB" }].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-[#c9a227]/20 flex items-center justify-center text-[8px]">🎬</div>
                    <span>{item.label}</span>
                  </div>
                  <span className="text-gray-600">{item.size}</span>
                </div>
              ))}
            </div>
          </DashCard>

          {/* Create Event Card */}
          <DashCard title="Create an Event" accent="#8b5cf6">
            <div className="mt-2 space-y-2">
              <div className="w-full bg-white/5 rounded px-2 py-1 text-xs text-gray-300">Title</div>
              <div className="flex gap-1">
                <span className="px-2 py-0.5 rounded-full bg-purple-600/30 text-purple-300 text-[10px]">Event</span>
                <span className="px-2 py-0.5 rounded-full bg-[#c9a227]/20 text-yellow-400 text-[10px]">Reminder</span>
              </div>
              <div className="flex gap-1">
                {["#ef4444","#f97316","#eab308","#22c55e","#3b82f6","#8b5cf6"].map(c => (
                  <div key={c} className="w-3.5 h-3.5 rounded-full" style={{ background: c }} />
                ))}
              </div>
              <div className="text-[10px] text-gray-500">Friday, 14 Oct 2022</div>
            </div>
          </DashCard>

          {/* Checklist Card */}
          <DashCard title="Checklist" accent="#06b6d4">
            <div className="mt-2 space-y-2 text-xs">
              <p className="text-gray-300 text-[11px] font-semibold">Business</p>
              <CheckItem label="Turn on chat during session" checked={false} />
              <CheckItem label="Turn on chat during session" checked={true} />
              <p className="text-gray-300 text-[11px] font-semibold mt-1">Private</p>
              <CheckItem label="Turn on chat during session" checked={false} />
              <CheckItem label="Turn on chat during session" checked={true} />
            </div>
          </DashCard>

          {/* Settings / Share */}
          <div className="flex flex-col gap-3">
            <DashCard title="Settings" accent="#10b981">
              <div className="mt-2 space-y-1 text-[10px] text-gray-400">
                <div className="flex justify-between"><span>Sound</span><span className="text-green-400">40%</span></div>
                <div className="w-full bg-white/10 rounded-full h-1"><div className="bg-green-400 h-1 rounded-full w-2/5" /></div>
                <div className="flex justify-between mt-1"><span>Chat</span><div className="w-6 h-3 bg-green-500 rounded-full" /></div>
                <div className="mt-1 text-gray-600">logo-rename.gif</div>
              </div>
            </DashCard>
            <DashCard title="Share" accent="#f43f5e">
              <div className="mt-2">
                <div className="w-full bg-white/5 rounded px-2 py-1 text-[10px] text-gray-500">Enter your message...</div>
                <button className="mt-2 w-full py-1 rounded bg-[#c9a227] text-black text-[10px] font-bold">Share now</button>
              </div>
            </DashCard>
          </div>
        </div>
      </section>

      {/* ── Logo Marquee ── */}
      <section className="py-12 border-y border-white/5 overflow-hidden">
        <div className="flex gap-12 animate-marquee whitespace-nowrap">
          {[...LOGOS, ...LOGOS].map((logo, i) => (
            <span key={i} className="text-gray-500 font-semibold text-sm tracking-wide hover:text-[#c9a227] transition-colors cursor-default">
              {logo}
            </span>
          ))}
        </div>
      </section>

      {/* ── Explore Our Event Website Offers ── */}
      <section className="py-24 px-4 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <span className="text-[10px] text-[#c9a227] tracking-widest uppercase font-semibold">✦ Website Features</span>
            <h2 className="text-3xl md:text-4xl font-black mt-3 mb-4 leading-tight">
              Explore Our Event<br />Website Offers
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-10 max-w-md">
              Our interactive schedule allows attendees to easily view and plan their day. It offers a user-friendly interface where participants can explore session details, speakers, and event locations.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {FEATURES.map((f) => (
                <div key={f.title}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#c9a227]">{f.icon}</span>
                    <p className="text-sm font-semibold text-white">{f.title}</p>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Checklist Preview */}
          <div className="bg-[#10101e] rounded-2xl border border-white/10 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-white">Checklist</h3>
              <div className="w-8 h-8 rounded-full bg-[#c9a227]/20 flex items-center justify-center text-sm">📋</div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs">🏢</div>
                  <span className="text-sm font-semibold">Business</span>
                </div>
                <div className="ml-8 space-y-2">
                  <CheckItem label="Turn on chat during session" checked={false} />
                  <CheckItem label="Turn on chat during session" checked={true} />
                </div>
              </div>
              <div className="border-t border-white/5 pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs">🔒</div>
                  <span className="text-sm font-semibold">Private</span>
                </div>
                <div className="ml-8 space-y-2">
                  <CheckItem label="Turn on chat during session" checked={false} />
                  <CheckItem label="Turn on chat during session" checked={true} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Key Features + Create Event ── */}
      <section className="py-24 px-4 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Create an Event Card */}
          <div className="bg-[#10101e] rounded-2xl border border-white/10 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white">Create an Event</h3>
              <div className="w-8 h-8 rounded-full bg-[#c9a227]/20 flex items-center justify-center text-sm">✏️</div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  placeholder="Title"
                  className="flex-1 bg-white/5 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:ring-1 focus:ring-[#c9a227]/50 mr-3"
                />
                <span className="text-xs text-gray-500">46</span>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full bg-purple-600/30 text-purple-300 text-xs font-medium">Event</span>
                <span className="px-3 py-1 rounded-full bg-[#c9a227]/20 text-yellow-400 text-xs font-medium">Reminder</span>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">Color</p>
                <div className="flex gap-2">
                  {["#ef4444","#f97316","#eab308","#22c55e","#3b82f6","#8b5cf6"].map(c => (
                    <div key={c} className="w-5 h-5 rounded-full cursor-pointer hover:scale-110 transition-transform" style={{ background: c }} />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">Date</p>
                <div className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                  <span className="text-sm text-gray-300">Friday, 14 Oct 2022</span>
                  <span className="text-gray-500">📅</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {["19:00", "20:00"].map(t => (
                  <div key={t} className="bg-white/5 rounded-lg px-3 py-2 text-sm text-gray-300 flex items-center justify-between">
                    <span>{t}</span>
                    <span className="text-gray-600">∨</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div>
            <span className="text-[10px] text-[#c9a227] tracking-widest uppercase font-semibold">✦ Website Features</span>
            <h2 className="text-3xl md:text-4xl font-black mt-3 mb-4 leading-tight">
              Key Features of Our<br />Event Website
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Easily navigate and plan your day with our interactive schedule. Attendees can view session details, speaker information, and event locations, personalise their agenda, and receive notifications for upcoming sessions.
            </p>
            <div className="space-y-6">
              {KEY_FEATURES.map((f) => (
                <div key={f.title} className="flex gap-4">
                  <div className="w-9 h-9 rounded-xl bg-[#c9a227]/10 flex items-center justify-center text-lg flex-shrink-0">{f.icon}</div>
                  <div>
                    <p className="text-sm font-semibold text-white mb-1">{f.title}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Footer Banner ── */}
      <section className="py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#c9a227]/5 to-transparent pointer-events-none" />
        <h2 className="text-3xl md:text-5xl font-black mb-4">
          Ready to Host Your Next<br />
          <span className="text-[#c9a227]">Unforgettable Event?</span>
        </h2>
        <p className="text-gray-400 max-w-md mx-auto text-sm mb-8">
          Join thousands of organizers who trust LOFTE-3 to power their Web3 events across Africa and beyond.
        </p>
        <button className="px-8 py-4 rounded-full bg-[#c9a227] text-black font-black text-sm hover:bg-yellow-400 transition-all shadow-2xl shadow-yellow-900/40">
          Get Started Today →
        </button>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-yellow-500 to-yellow-800 flex items-center justify-center text-[8px] font-black text-black">L3</div>
          <span><span className="text-white font-bold">LO</span><span className="text-[#c9a227] font-bold">FTE-3</span> — Africa's leading Web3 IRL event platform</span>
        </div>
        <div className="flex gap-6">
          {["Privacy", "Terms", "Contact"].map(l => (
            <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
          ))}
        </div>
        <span>© 2024 LOFTE-3. All rights reserved.</span>
      </footer>

      <style jsx global>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
}

/* ── Sub-components ── */

function DashCard({
  title,
  accent,
  children,
}: {
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#10101e] rounded-xl border border-white/10 p-4 hover:border-white/20 transition-colors">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-300">{title}</p>
        <div
          className="w-5 h-5 rounded flex items-center justify-center text-[10px]"
          style={{ background: `${accent}22`, color: accent }}
        >
          ⚡
        </div>
      </div>
      {children}
    </div>
  );
}

function CheckItem({ label, checked }: { label: string; checked: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-3.5 h-3.5 rounded flex items-center justify-center flex-shrink-0 ${
          checked
            ? "bg-[#c9a227] text-black"
            : "border border-white/20"
        }`}
      >
        {checked && <span className="text-[8px] font-black">✓</span>}
      </div>
      <span className="text-[11px] text-gray-400">{label}</span>
    </div>
  );

  <FaqView/>
  <WhyAttend/>


}