import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import WalletConnector from './WalletConnector';
import { 
  Shield, 
  BarChart3, 
  Zap, 
  Settings, 
  Menu, 
  X,
  Sparkles,
  Coins
} from 'lucide-react';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const PayFiNavigation: React.FC<NavigationProps> = ({ activeSection, onSectionChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'dashboard', label: 'FEATURES', icon: BarChart3 },
    { id: 'policies', label: 'POLICIES', icon: Shield },
    { id: 'flow', label: 'HOW IT WORKS', icon: Zap },
    { id: 'analytics', label: 'ANALYTICS', icon: Sparkles },
    { id: 'my-policies', label: 'MY ACCOUNT', icon: Coins },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center justify-between px-6 py-3 mx-4 mt-4 rounded-full bg-background-navbar border border-border backdrop-blur-xl shadow-medium">
        {/* Logo - Glassmorphism Badge Style */}
        <motion.div 
          className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 shadow-lg"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05, y: -1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
              <Coins className="h-5 w-5 text-black" />
            </div>
            {/* Futuristic Glow Effect */}
            <div className="absolute inset-0 w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 opacity-30 blur-sm animate-pulse"></div>
          </div>
          <h1 className="text-lg font-bold text-yellow-400 tracking-wide drop-shadow-[0_0_6px_rgba(250,204,21,0.7)]">
            Riskzap
          </h1>
        </motion.div>

        {/* Navigation Tags - Compressed Webzi Style */}
        <div className="flex items-center gap-6">
          {navigationItems.map((item, index) => {
            const isActive = activeSection === item.id;
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`relative px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-300 ${
                    isActive 
                      ? 'bg-primary/15 text-primary border border-primary/30' 
                      : 'text-slate-400 hover:text-foreground hover:bg-primary/5'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Compact Wallet Connector */}
        <div className="flex items-center">
          <WalletConnector />
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden flex items-center justify-between p-3 mx-2 mt-2 rounded-2xl glass-card border border-primary/10 backdrop-blur-xl shadow-lg">
        {/* Mobile Logo - Elevated Badge Style */}
        <motion.div 
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 shadow-lg border border-white/10"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="relative">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center">
              <Coins className="h-3.5 w-3.5 text-black" />
            </div>
            <div className="absolute inset-0 w-6 h-6 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 opacity-30 blur-sm animate-pulse"></div>
          </div>
          <span className="font-bold text-yellow-400 text-sm tracking-wide drop-shadow-[0_0_6px_rgba(250,204,21,0.7)]">
            Riskzap
          </span>
        </motion.div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="border-glow-soft rounded-full h-8 w-8 p-0"
        >
          {isMobileMenuOpen ? <X className="h-3 w-3" /> : <Menu className="h-3 w-3" />}
        </Button>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-sm"
            >
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  className="absolute right-2 top-2 bottom-2 w-72 card-modern border border-border rounded-2xl p-4 shadow-elevated backdrop-blur-xl"
                >
                  {/* Mobile Menu Header */}
                  <div className="flex items-center justify-between mb-6">
                    {/* Mobile Menu Logo - Minimal Outline Style */}
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full border-2 border-yellow-400 flex items-center justify-center">
                        <Coins className="h-3.5 w-3.5 text-yellow-400" />
                      </div>
                      <span className="font-bold text-white">
                        <span className="underline decoration-yellow-400 decoration-2 underline-offset-2">Riskzap</span>
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="border-modern rounded-full h-7 w-7 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  {/* Mobile Navigation Items */}
                  <div className="space-y-1 mb-6">
                    {navigationItems.map((item, index) => {
                      const isActive = activeSection === item.id;
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <button
                            onClick={() => {
                              onSectionChange(item.id);
                              setIsMobileMenuOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${
                              isActive 
                                ? 'bg-gradient-to-r from-primary/20 to-primary/10 text-primary border border-primary/30' 
                                : 'text-muted-foreground hover:bg-primary/5 hover:text-foreground'
                            }`}
                          >
                            {item.label}
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Mobile Wallet Connector */}
                  <div className="border-t border-primary/20 pt-4">
                  <WalletConnector />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default PayFiNavigation;