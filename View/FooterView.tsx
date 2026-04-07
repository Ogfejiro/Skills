import { motion } from 'framer-motion';
import { Twitter, MessageCircle, Mail, ChevronRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = {
    platform: [
      { label: 'List Event', href: '/auth/register' },
      { label: 'Browse Events', href: '/#featured' },
      { label: 'Dashboard', href: '/dashboard' },
    ],
    company: [
      { label: 'About Us', href: '/#home' },
      { label: 'Contact', href: 'mailto:support@lofte3.com' },
      { label: 'Support', href: 'mailto:support@lofte3.com' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Code of Conduct', href: '#' },
    ]
  };

  const socials = [
    { icon: Twitter, href: 'https://x.com/lofte3_', label: 'Twitter' },
    { icon: MessageCircle, href: 'https://T.me/lofte_live', label: 'Telegram' },
    { icon: Mail, href: 'mailto:support@lofte3.com', label: 'Email' },
  ];

  return (
    <footer className="bg-black text-white border-t border-gold/10">
      {/* Main Footer Content */}
      <div className="px-4 md:px-8 py-16">
        <div className="container mx-auto">
          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-3xl font-bold">
                  <span className="text-white">LO</span>FTE
                  <span className="text-gold">-3</span>
                </h2>
                <p className="text-gray-400 text-sm mt-2">Africa's Premier Web3 Events</p>
              </div>
              
              <p className="text-gray-400 max-w-xs leading-relaxed">
                Connecting Africa's Web3 community through unforgettable premium experiences.
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-4 pt-4">
                {socials.map((social, i) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={i}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.2, color: '#D4AF37' }}
                      className="text-gray-400 hover:text-gold transition-colors"
                      aria-label={social.label}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            {/* Platform Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-bold text-gold mb-6">Platform</h4>
              <ul className="space-y-3">
                {links.platform.map((link, i) => (
                  <li key={i}>
                    <Link href={link.href}>
                      <motion.span
                        whileHover={{ x: 4 }}
                        className="text-gray-400 hover:text-gold transition-colors flex items-center gap-2 group"
                      >
                        {link.label}
                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Company Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-bold text-gold mb-6">Company</h4>
              <ul className="space-y-3">
                {links.company.map((link, i) => (
                  <li key={i}>
                    <a href={link.href}>
                      <motion.span
                        whileHover={{ x: 4 }}
                        className="text-gray-400 hover:text-gold transition-colors flex items-center gap-2 group"
                      >
                        {link.label}
                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Newsletter CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="p-6 rounded-xl border border-gold/20 bg-gold/5"
            >
              <h4 className="text-lg font-bold text-gold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Get Updates
              </h4>
              <p className="text-gray-400 text-sm mb-4">
                Stay updated on our upcoming events and opportunities
              </p>
              <motion.a
                href="https://x.com/lofte3_"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                className="block w-full px-4 py-2 text-center bg-gold text-black font-bold rounded-lg hover:shadow-lg hover:shadow-gold/40 transition-all text-sm"
              >
                Follow Us
              </motion.a>
            </motion.div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-gold/0 via-gold/20 to-gold/0 mb-8" />

          {/* Bottom Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400"
          >
            <p>
              © {currentYear} LOFTE-3. All rights reserved.
            </p>
            
            <div className="flex items-center gap-6">
              {links.legal.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  className="hover:text-gold transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <p className="text-xs text-gray-500">
              Built with passion for Africa's Web3 community
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
  return (
    <footer className="bg-black text-white">
      {/* Main Footer Content */}
      <div className="px-6 md:px-20 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gold-500">LOFTE-3</h3>
            <p className="text-gray-400 max-w-xs">
              Building the future of decentralized technology. Join our community and be part of the revolution.
            </p>
            <div className="flex gap-4 pt-2">
              <a
                href="https://x.com/hidreams__"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gold-500 transition transform hover:-translate-y-1"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              {/* <a
                href="https://discord.gg/YOUR_DISCORD_LINK"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gold-500 transition transform hover:-translate-y-1"
                aria-label="Discord"
              >
                <Disc className="w-5 h-5" />
              </a> */}
              <a
                href="https://T.me/lofte_live"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gold-500 transition transform hover:-translate-y-1"
                aria-label="Telegram"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gold-500">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-gold-500 transition flex items-center gap-2 group"
                >
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-gold-500" />
                  <span>Documentation</span>
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-gold-500 transition flex items-center gap-2 group"
                >
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-gold-500" />
                  <span>Whitepaper</span>
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-gold-500 transition flex items-center gap-2 group"
                >
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-gold-500" />
                  <span>Roadmap</span>
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-gold-500 transition flex items-center gap-2 group"
                >
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-gold-500" />
                  <span>FAQ</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gold-500">Community</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="https://X.com/hidreams__"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gold-500 transition flex items-center gap-2"
                >
                  <Twitter className="w-4 h-4" />
                  <span>Twitter</span>
                </a>
              </li>
              {/* <li>
                <a 
                  href="https://discord.gg/YOUR_DISCORD_LINK"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gold-500 transition flex items-center gap-2"
                >
                  <Disc className="w-4 h-4" />
                  <span>Discord</span>
                </a>
              </li> */}
              <li>
                <a 
                  href="https://T.me/lofte_live"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gold-500 transition flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Telegram</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gold-500">Stay Updated</h4>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest updates.</p>
            <form className="space-y-3">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500 rounded-l-lg border border-gray-700"
                />
                <button
                  type="submit"
                  className="bg-gold-600 hover:bg-gold-700 px-4 py-2 rounded-r-lg transition flex items-center gap-2 text-black font-medium"
                >
                  <Mail className="w-4 h-4" />
                  <span>Subscribe</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 px-6 md:px-20 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm text-center md:text-left">
            © 2025 LOFTE-3. All rights reserved.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-gold-500 transition">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-gold-500 transition">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-gold-500 transition">
              Cookie Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-gold-500 transition">
              Disclaimer
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;