import React from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/yashbalpande',
      icon: Github,
      username: '@yashbalpande'
    },
    {
      name: 'Twitter',
      url: 'https://x.com/Yash__Balpande',
      icon: Twitter,
      username: '@Yash__Balpande'
    }
  ];

  // Add click handler to ensure links work
  const handleLinkClick = (url: string, name: string) => {
    console.log(`Clicking on ${name} link: ${url}`);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="relative z-10 mt-16 border-t border-gray-800/50 bg-gray-900/50 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-8">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Brand Section */}
          <div className="flex flex-col items-center md:items-start">
            <motion.a
              href="#dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent cursor-pointer hover:from-cyan-300 hover:to-purple-300 transition-all duration-200"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = 'dashboard';
              }}
            >
              RiskZap
            </motion.a>
            <p className="text-gray-400 text-sm mt-1">
              Decentralized Insurance Platform
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            {socialLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-300 border border-gray-700/50 hover:border-cyan-400/50 cursor-pointer shadow-lg hover:shadow-cyan-500/20"
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.url, link.name);
                }}
              >
                <link.icon className="h-5 w-5 text-gray-400 group-hover:text-cyan-400 transition-colors duration-200" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors duration-200">
                    {link.name}
                  </span>
                  <span className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors duration-200">
                    {link.username}
                  </span>
                </div>
                <ExternalLink className="h-3 w-3 text-gray-500 group-hover:text-cyan-400 transition-all duration-200 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-0.5" />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 pt-6 border-t border-gray-800/50 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} RiskZap. Built on Shardeum Network.
          </div>
          
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a 
              href="https://explorer-unstable.shardeum.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 hover:text-cyan-400 transition-colors duration-200 cursor-pointer"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Live on Shardeum Unstablenet
              <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </a>
          </div>
        </motion.div>
      </div>

      {/* Animated Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
    </footer>
  );
};

export default Footer;
