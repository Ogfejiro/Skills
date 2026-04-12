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

// 			

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

import { useState, useEffect } from "react";
import { Calendar, MapPin, Users, Ticket, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import eventService from "@/app/services/eventService";
import WhyAttendPage from "./WhyAttend";
import FAQPage from "./FaqView";



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

const NAV_LINKS = ["Events", "About", "FAQ", "Contact"];

const LOFTE3_BENEFITS = [
  {
    icon: "🌐",
    title: "Web3 Networking",
    desc: "Connect with crypto innovators and blockchain enthusiasts from across Africa.",
  },
  {
    icon: "⭐",
    title: "Premium Events",
    desc: "Access exclusive, carefully curated Web3 events with top-tier speakers and experiences.",
  },
  {
    icon: "🎟️",
    title: "Easy Ticketing",
    desc: "Seamless ticket purchasing with crypto and fiat payment options.",
  },
  {
    icon: "🌍",
    title: "Global Reach",
    desc: "Connect with Web3 communities across Africa and beyond in one platform.",
  },
];

export default function HomePage() {
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [publicEvents, setPublicEvents] = useState<any[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState('');
  const calendlyLink = 'https://calendly.com';
  
  const openLink = (link: string) => {
    if (link) window.open(link, '_blank');
  };

  // Fetch public events on component mount
  useEffect(() => {
    const fetchPublicEvents = async () => {
      try {
        setEventsLoading(true);
        setEventsError('');
        const response = await eventService.getPublicEvents(1, 6);
        if (response.success && response.data.events) {
          setPublicEvents(response.data.events);
        }
      } catch (error: any) {
        console.error('Error fetching public events:', error);
        setEventsError(error.message || 'Failed to load events');
      } finally {
        setEventsLoading(false);
      }
    };

    fetchPublicEvents();
  }, []);
  
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans">
      {/* Import Navbar Component */}
      <Navbar />

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

        {/* LOFTE-3 Benefits Cards */}
        <div className="relative mt-16 w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {LOFTE3_BENEFITS.map((benefit, idx) => (
            <div
              key={idx}
              className="bg-[#10101e] rounded-xl border border-white/10 p-6 hover:border-white/20 hover:shadow-lg hover:shadow-[#c9a227]/10 transition-all hover:scale-105"
            >
              <div className="text-4xl mb-3">{benefit.icon}</div>
              <h3 className="text-sm font-bold text-white mb-2">{benefit.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
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

        </div>
      </section>

      {/* ── Current Events ── */}
      <section className="py-24 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[10px] text-[#c9a227] tracking-widest uppercase font-semibold">✦ Now Happening</span>
          <h2 className="text-3xl md:text-4xl font-black mt-3">Current Events</h2>
          <p className="text-gray-400 text-sm mt-2">Discover the best Web3 events happening now</p>
        </div>

        {/* Display status */}
        {eventsError && (
          <div className="mb-8 p-4 bg-red-500/20 border border-red-500 rounded-lg flex items-center gap-3">
            <AlertCircle className="text-red-500" size={20} />
            <p className="text-red-300">Error loading events: {eventsError}</p>
          </div>
        )}

        {/* Events Grid */}
        {eventsLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Loading events...</p>
          </div>
        ) : publicEvents.length === 0 ? (
          <div className="text-center py-12 bg-[#10101e] rounded-xl border border-white/10 p-8">
            <Ticket className="w-12 h-12 text-[#c9a227]/50 mx-auto mb-4" />
            <p className="text-gray-400">No approved events available at the moment</p>
            <p className="text-sm text-gray-500 mt-2">Check back soon for upcoming Web3 events!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publicEvents.map((event: any) => (
              <div
                key={event._id}
                className="bg-[#10101e] rounded-xl border border-white/10 overflow-hidden hover:border-white/20 transition-all hover:shadow-lg hover:shadow-[#c9a227]/10"
              >
                {event.banner && (
                  <div className="h-48 bg-gradient-to-br from-[#c9a227]/20 to-purple-900/20 overflow-hidden">
                    <img
                      src={event.banner}
                      alt={event.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Calendar className="w-4 h-4 text-[#c9a227]" />
                      <span>
                        {new Date(event.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <MapPin className="w-4 h-4 text-[#c9a227]" />
                      <span className="truncate">{event.venue}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Users className="w-4 h-4 text-[#c9a227]" />
                      <span>{event.capacity} Capacity</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsTicketModalOpen(true)}
                    className="w-full px-4 py-2 rounded-lg bg-[#c9a227] text-black font-bold text-sm hover:bg-yellow-400 transition-all"
                  >
                    Get Tickets
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Events Button */}
        {publicEvents.length > 0 && (
          <div className="text-center mt-12">
            <button className="px-8 py-3 rounded-full border border-[#c9a227] text-[#c9a227] font-bold hover:bg-[#c9a227]/10 transition-all">
              View All Events →
            </button>
          </div>
        )}
      </section>
// 			<section id='events' className='py-20'>
// 				<div className='container mx-auto px-4'>
// 					<h2 className='text-4xl font-bold text-center mb-16'>
// 						Upcoming Events
// 					</h2>

// 					<div className='grid md:grid-cols-2 gap-10'>
// 						<div className='border border-gold p-6 rounded-xl'>
// 							<h3 className='text-2xl font-bold mb-4'>
// 								MELISSA NFT LAUNCH PARTY
// 							</h3>

// 							<p className='text-gray-400 mb-6'>
// 								All White Beach Party.
// 							</p>

// 							<div className='space-y-2 mb-6 text-sm'>
// 								<div className='flex items-center gap-2'>
// 									<Calendar className='w-4' /> April 16, 2026
// 								</div>
// 								<div className='flex items-center gap-2'>
// 									<MapPin className='w-4' /> Lagos
// 								</div>
// 							</div>

// 							<div className='flex gap-4'>
// 								<button
									onClick={() => setIsTicketModalOpen(true)}
									className='flex-1 border border-gold text-gold py-2 rounded-lg'
								>
									Tickets
								</button>

								<button
									onClick={() => openLink(calendlyLink)}
									className='flex-1 bg-gold text-black py-2 rounded-lg'
								>
									Sponsor
								</button>
							</div>
						</div>
					</div>
				</div>
			</section>

      <WhyAttendPage/>
      <FAQPage/>

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