import { Twitter, Disc, MessageCircle, Mail, ChevronRight } from 'lucide-react';

const Footer = () => {
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
                href="https://twitter.com/YOUR_TWITTER_LINK"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gold-500 transition transform hover:-translate-y-1"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://discord.gg/YOUR_DISCORD_LINK"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gold-500 transition transform hover:-translate-y-1"
                aria-label="Discord"
              >
                <Disc className="w-5 h-5" />
              </a>
              <a
                href="https://t.me/YOUR_TELEGRAM_LINK"
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
                  href="https://twitter.com/YOUR_TWITTER_LINK"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gold-500 transition flex items-center gap-2"
                >
                  <Twitter className="w-4 h-4" />
                  <span>Twitter</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://discord.gg/YOUR_DISCORD_LINK"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gold-500 transition flex items-center gap-2"
                >
                  <Disc className="w-4 h-4" />
                  <span>Discord</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://t.me/YOUR_TELEGRAM_LINK"
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