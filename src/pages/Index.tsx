import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PayFiBackground from '@/components/PayFiBackground';
import PayFiNavigation from '@/components/PayFiNavigation';
import SectionTransition from '@/components/SectionTransition';
import Dashboard from '@/components/Dashboard';
import PolicyCards from '@/components/PolicyCards';
import InsuranceFlowVisualization from '@/components/InsuranceFlowVisualization';
import AnalyticsView from '@/components/AnalyticsView';
import MyPoliciesPage from '@/pages/MyPoliciesPage';
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
      case 'my-policies':
        return <MyPoliciesPage onBack={() => setActiveSection('dashboard')} />;
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
      </div>
    </WalletProvider>
  );
};

export default Index;
