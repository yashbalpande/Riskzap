import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import WalletConnector from './WalletConnector';
import AdminSettings from './AdminSettings';
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
  const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'policies', label: 'Policies', icon: Shield },
    { id: 'flow', label: 'Process Flow', icon: Zap },
    { id: 'analytics', label: 'Analytics', icon: Sparkles },
  ];

  return (
    <>
      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="bg-warning/20 border-b border-warning/30 px-4 py-2">
          <div className="flex items-center justify-center gap-2 text-warning text-sm">
            <Sparkles className="h-4 w-4" />
            <span>Demo Mode: Simulated transactions (no real contracts deployed)</span>
            <Sparkles className="h-4 w-4" />
          </div>
        </div>
      )}

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center justify-between p-6 border-b border-primary/20 bg-card/30 backdrop-blur-sm">
        {/* Logo */}
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="relative">
            <Coins className="h-8 w-8 text-primary particle-glow" />
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-warning/70" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gradient-fire">Riskzap</h1>
            <p className="text-xs text-muted-foreground">Shardeum Micro-Policies</p>
          </div>
        </motion.div>

        {/* Navigation Links */}
        <div className="flex items-center gap-2">
          {navigationItems.map((item, index) => {
            const IconComponent = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant={isActive ? "payfi" : "floating"}
                    onClick={() => onSectionChange(item.id)}
                    className="gap-2 relative px-4 py-2"
                >
                  <IconComponent className="h-4 w-4" />
                  {item.label}
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      layoutId="activeIndicator"
                    />
                  )}
                </Button>
              </motion.div>
            );
          })}
        </div>

        {/* Wallet Connector */}
        <div className="flex items-center gap-2">
          <AdminSettings />
          <div className="rounded-full p-0.5 border-glow-soft" title="Connect Wallet">
            <WalletConnector />
          </div>
        </div>
      </nav>

      {/* Mobile Demo Mode Banner */}
      {isDemoMode && (
        <div className="lg:hidden bg-warning/20 border-b border-warning/30 px-4 py-2">
          <div className="flex items-center justify-center gap-2 text-warning text-xs">
            <Sparkles className="h-3 w-3" />
            <span>Demo Mode Active</span>
            <Sparkles className="h-3 w-3" />
          </div>
        </div>
      )}

      {/* Mobile Navigation */}
      <nav className="lg:hidden flex items-center justify-between p-4 border-b border-primary/20 bg-card/30 backdrop-blur-sm">
        {/* Mobile Logo */}
        <div className="flex items-center gap-2">
          <Coins className="h-6 w-6 text-primary" />
          <span className="font-bold text-gradient-fire">Riskzap</span>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="floating"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
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
                className="absolute right-0 top-0 h-full w-80 bg-card border-l border-primary/20 p-6"
              >
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <Coins className="h-6 w-6 text-primary" />
                    <span className="font-bold text-gradient-fire">Riskzap</span>
                  </div>
                  <Button
                    variant="floating"
                    size="sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Mobile Navigation Items */}
                <div className="space-y-4 mb-8">
                  {navigationItems.map((item, index) => {
                    const IconComponent = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Button
                          variant={isActive ? "payfi" : "floating"}
                          onClick={() => {
                            onSectionChange(item.id);
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full justify-start gap-3"
                        >
                          <IconComponent className="h-5 w-5" />
                          {item.label}
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Mobile Wallet Connector */}
                <div className="border-t border-primary/20 pt-6">
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