// app/faq/page.tsx
'use client';

import { motion } from 'framer-motion';
import { 
  Sparkles,
  ChevronDown,
  ChevronUp,
  Calendar,
  Users,
  Ticket,
  Hotel,
  Building,
  Bell,
  Target,
  Zap,
  Globe,
  MessageCircle,
  Mail,
  MessageSquare,
  TrendingUp,
  Network,
  Users2,
  Gift,
  Coffee,
  Star
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useState } from 'react';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      id: 1,
      question: "What is LOFTE-3?",
      answer: "LOFTE-3 is a strategic Web3 events platform that helps brands design, host, and amplify high-impact IRL and virtual experiences. We combine culture, lifestyle, and technology to create events that go beyond gatherings—activating communities, generating content, and delivering measurable brand visibility.",
      details: [
        "Curate the right audience",
        "Design immersive brand moments",
        "Integrate sponsors seamlessly into the experience",
        "Extend reach beyond the venue through digital and community channels"
      ],
      summary: "From concept to execution, LOFTE-3 partners with brands to turn ideas into memorable experiences and create utility with your project.",
      icon: <Target className="w-6 h-6" />
    },
    {
      id: 2,
      question: "Will there be networking opportunities?",
      answer: "Yes. LOFTE-3 offers curated networking sessions designed to connect attendees, brands, and ecosystem leaders.",
      details: [
        "Brand activations",
        "After-event experiences",
        "Access to our growing online community",
        "Exclusive meetups and roundtables"
      ],
      icon: <Network className="w-6 h-6" />
    },
    {
      id: 3,
      question: "Are LOFTE-3 events free to attend?",
      answer: "Attendance varies by event. Some LOFTE-3 events are free, while others require a ticket.",
      note: "Please click the event-specific buttons or links for full access details.",
      icon: <Ticket className="w-6 h-6" />
    },
    {
      id: 4,
      question: "Will accommodation be provided?",
      answer: "Accommodation arrangements vary by event. Where applicable, both free and paid options will be made available and communicated ahead of time.",
      note: "Check specific event pages for accommodation details and partnerships.",
      icon: <Hotel className="w-6 h-6" />
    },
    {
      id: 5,
      question: "How can brands or companies host an event with LOFTE-3?",
      answer: "Brands interested in hosting or partnering with LOFTE-3 can reach out through the following channels:",
      contact: [
        {
          method: "Email",
          details: "hidreamsofweb3@gmail.com",
          icon: <Mail className="w-4 h-4" />
        },
        {
          method: "X (Twitter)",
          details: "Send a private message to our official page",
          icon: <MessageSquare className="w-4 h-4" />
        }
      ],
      note: "Our team will be available to discuss possible collaborations and partnership opportunities.",
      icon: <Building className="w-6 h-6" />
    },
    {
      id: 6,
      question: "How can I stay updated on LOFTE-3 events?",
      answer: "Follow our official social channels for the latest announcements, updates, and exclusive opportunities.",
      details: [
        "Regular event announcements",
        "Early bird ticket access",
        "VIP invitation opportunities",
        "Community exclusive updates"
      ],
      icon: <Bell className="w-6 h-6" />
    },
    {
      id: 7,
      question: "What makes LOFTE-3 different from other Web3 events?",
      answer: "LOFTE-3 combines culture, lifestyle, and technology to create holistic experiences that deliver real value beyond just networking.",
      details: [
        "Strategic brand partnerships",
        "Immersive cultural experiences",
        "Measurable ROI for sponsors",
        "Community-driven engagement"
      ],
      icon: <Sparkles className="w-6 h-6" />
    },
    {
      id: 8,
      question: "Who typically attends LOFTE-3 events?",
      answer: "LOFTE-3 attracts a diverse mix of Web3 professionals, innovators, and enthusiasts including:",
      details: [
        "Blockchain founders & builders",
        "Web3 investors & VCs",
        "Digital creators & artists",
        "Enterprise decision-makers",
        "Crypto enthusiasts & traders"
      ],
      icon: <Users2 className="w-6 h-6" />
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      <Navbar />
      
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ 
              rotate: { duration: 25, repeat: Infinity, ease: "linear" },
              scale: { duration: 6, repeat: Infinity },
              opacity: { duration: 4, repeat: Infinity }
            }}
            className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-gold/5 to-transparent rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              rotate: -360,
              scale: [1.1, 1, 1.1],
              opacity: [0.4, 0.6, 0.4]
            }}
            transition={{ 
              rotate: { duration: 30, repeat: Infinity, ease: "linear" },
              scale: { duration: 8, repeat: Infinity },
              opacity: { duration: 5, repeat: Infinity }
            }}
            className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-l from-gold/5 to-transparent rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gold/10 border border-gold/30 mb-6"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4 text-gold" />
              </motion.div>
              <span className="text-gold text-sm font-medium">FREQUENTLY ASKED QUESTIONS</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className="text-white">Got Questions?</span>
              <motion.span
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="gold-gradient block mt-2"
              >
                We've Got Answers
              </motion.span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto"
            >
              Everything you need to know about LOFTE-3 events, partnerships, and experiences.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-10 pb-20 relative">
        {/* Animated Gold Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute top-0 left-0 w-full h-px"
        >
          <div className="h-full bg-gradient-to-r from-transparent via-gold to-transparent"></div>
        </motion.div>

        <div className="container mx-auto px-4 relative z-10">
          {/* FAQ Grid */}
          <div className="max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="mb-4"
              >
                {/* FAQ Item */}
                <div className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  openIndex === index 
                    ? 'border-gold bg-gradient-to-br from-black to-black/80 shadow-2xl shadow-gold/10' 
                    : 'border-gold/20 bg-black/30 hover:border-gold/30'
                }`}>
                  {/* Question Header */}
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full p-6 text-left flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      {/* Icon with Animation */}
                      <motion.div
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        className={`p-3 rounded-xl border ${
                          openIndex === index 
                            ? 'bg-gold/20 border-gold' 
                            : 'bg-gold/10 border-gold/30'
                        }`}
                      >
                        <div className={`${openIndex === index ? 'text-gold' : 'text-gold/80'}`}>
                          {faq.icon}
                        </div>
                      </motion.div>
                      
                      <div className="text-left">
                        <h3 className="text-lg md:text-xl font-bold text-white">
                          {faq.question}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-6 h-px bg-gradient-to-r from-gold to-transparent"></div>
                          <span className="text-xs text-gray-400">Question #{faq.id}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Chevron Icon with Animation */}
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className={`p-2 rounded-lg border ${
                        openIndex === index 
                          ? 'bg-gold/20 border-gold text-gold' 
                          : 'bg-gold/10 border-gold/30 text-gold/70'
                      }`}
                    >
                      {openIndex === index ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </motion.div>
                  </button>
                  
                  {/* Answer Content with Animation */}
                  <motion.div
                    initial={false}
                    animate={{ 
                      height: openIndex === index ? 'auto' : 0,
                      opacity: openIndex === index ? 1 : 0
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 border-t border-gold/10 pt-4">
                      {/* Main Answer */}
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-300 text-base md:text-lg leading-relaxed mb-4"
                      >
                        {faq.answer}
                      </motion.p>
                      
                      {/* Details List */}
                      {faq.details && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="mb-4"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {faq.details.map((detail, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + idx * 0.05 }}
                                className="flex items-start gap-2 p-2 rounded-lg bg-gold/5 border border-gold/10"
                              >
                                <div className="p-1 rounded-full bg-gold/20 mt-0.5">
                                  <Star className="w-2 h-2 text-gold" />
                                </div>
                                <span className="text-sm text-gray-300">{detail}</span>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                      
                      {/* Contact Information */}
                      {faq.contact && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="mb-4"
                        >
                          <h4 className="text-white font-medium mb-2">Contact Methods:</h4>
                          <div className="space-y-2">
                            {faq.contact.map((contact, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + idx * 0.1 }}
                                className="flex items-center gap-3 p-3 rounded-xl bg-black/40 border border-gold/20"
                              >
                                <div className="p-2 rounded-lg bg-gold/10">
                                  <div className="text-gold">{contact.icon}</div>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-white">{contact.method}</p>
                                  <p className="text-sm text-gray-400">{contact.details}</p>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                      
                      {/* Additional Note */}
                      {faq.note && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          className="p-3 rounded-xl bg-gradient-to-r from-gold/5 to-transparent border border-gold/20"
                        >
                          <p className="text-sm text-gray-300 italic">{faq.note}</p>
                        </motion.div>
                      )}
                      
                      {/* Summary for first FAQ */}
                      {faq.id === 1 && faq.summary && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="mt-4 p-4 rounded-xl bg-gradient-to-br from-black to-black/60 border-2 border-gold/30"
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-gold/20">
                              <Zap className="w-5 h-5 text-gold" />
                            </div>
                            <div>
                              <h4 className="text-gold font-bold mb-1">In Summary:</h4>
                              <p className="text-gray-300">{faq.summary}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 relative">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="absolute inset-0 bg-gradient-to-t from-gold/5 via-transparent to-transparent"
        />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-8 rounded-3xl border-2 border-gold/30 bg-gradient-to-br from-black to-black/70"
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold mb-6"
              >
                <span className="text-white">Still Have Questions?</span>
                <motion.span
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity
                  }}
                  className="gold-gradient block"
                  style={{ 
                    backgroundSize: "200% auto"
                  }}
                >
                  Get In Touch With Us
                </motion.span>
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
                className="text-gray-300 text-lg mb-8"
              >
                Can't find what you're looking for? Reach out to our team for personalized assistance.
              </motion.p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 0 20px rgba(212, 175, 55, 0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  href="mailto:hidreamsofweb3@gmail.com"
                  className="px-8 py-3 rounded-full border border-gold text-gold font-bold hover:bg-gold/10 transition flex items-center justify-center gap-3"
                >
                  <Mail className="w-5 h-5" />
                  Email Our Team
                </motion.a>
                
                <motion.a
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 0 25px rgba(212, 175, 55, 0.5)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  href="/#events"
                  className="px-8 py-3 rounded-full bg-gold text-black font-bold hover:shadow-gold/30 transition"
                >
                  View Upcoming Events
                </motion.a>
              </div>
              
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                viewport={{ once: true }}
                className="mt-8 pt-6 border-t border-gold/10"
              >
                <div className="flex flex-wrap justify-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-400">Quick Response</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-400">24/7 Support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-400">Expert Team</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      
    </main>
  );
}