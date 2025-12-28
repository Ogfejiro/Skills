import { Twitter, Disc, MessageCircle } from 'lucide-react';


const Footer = () => {
  return (
    <footer className="bg-black py-10 text-white px-6 md:px-20">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold">LOFTE-3</h3>
          <p className="text-gray-400">© 2025 LOFTE-3. All rights reserved.</p>
        </div>

        <div className="flex gap-6">
          {/* Twitter */}
          <a
            href="https://twitter.com/YOUR_TWITTER_LINK"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition"
          >
            <Twitter className="w-6 h-6" />
          </a>

          {/* Discord */}
          <a
            href="https://discord.gg/YOUR_DISCORD_LINK"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition"
          >
            <Disc className="w-6 h-6" />
          </a>

          {/* Telegram */}
          <a
            href="https://t.me/YOUR_TELEGRAM_LINK"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition"
          >
            <MessageCircle className="w-6 h-6" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
