import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PayFiBackground from '@/components/PayFiBackground';
import PayFiNavigation from '@/components/PayFiNavigation';
import SectionTransition from '@/components/SectionTransition';
import Dashboard from '@/components/Dashboard';
import PolicyCards from '@/components/PolicyCards';
import InsuranceFlowVisualization from '@/components/InsuranceFlowVisualization';
import AnalyticsView from '@/components/AnalyticsView';
import { WalletProvider } from '@/components/WalletConnector';

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'policies':
        return <PolicyCards />;
      case 'flow':
        return <InsuranceFlowVisualization />;
      case 'analytics':
        return <AnalyticsView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <WalletProvider>
      <div className="min-h-screen bg-background relative">
        {/* 3D Particle Background */}
        <SectionTransition index={0} className="absolute inset-0 -z-10">
          <PayFiBackground />
        </SectionTransition>

        {/* Navigation */}
        <SectionTransition index={1}>
          <PayFiNavigation 
            activeSection={activeSection} 
            onSectionChange={setActiveSection} 
          />
        </SectionTransition>
        
        {/* Main Content */}
        <main className="relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="container mx-auto py-8"
            >
              <SectionTransition index={2}>
                {renderSection()}
              </SectionTransition>
            </motion.div>
          </AnimatePresence>
        </main>
        
        {/* Floating Elements */}
        <div className="fixed bottom-8 right-8 z-20">
          <motion.div
            className="floating-delayed"
            whileHover={{ scale: 1.1 }}
          >
            <div className="w-16 h-16 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 flex items-center justify-center particle-glow">
              <span className="text-xs font-bold text-primary">SHM</span>
            </div>
          </motion.div>
        </div>
      </div>
    </WalletProvider>
  );
};

export default Index;
