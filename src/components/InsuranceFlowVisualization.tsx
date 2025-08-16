import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  UserCheck, 
  Shield, 
  FileCheck, 
  Calculator, 
  CreditCard, 
  Award,
  Bell,
  FileText,
  BarChart3,
  Zap
} from 'lucide-react';

interface FlowStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  status: 'pending' | 'active' | 'completed';
  color: string;
}

const InsuranceFlowVisualization: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const flowSteps: FlowStep[] = [
    {
      id: 'request',
      title: 'User Request',
      description: 'Initiate micro-policy request',
      icon: UserCheck,
      status: currentStep === 0 ? 'active' : completedSteps.includes(0) ? 'completed' : 'pending',
      color: 'text-primary'
    },
    {
      id: 'validation',
      title: 'Validation',
      description: 'Smart contract validation',
      icon: Shield,
      status: currentStep === 1 ? 'active' : completedSteps.includes(1) ? 'completed' : 'pending',
      color: 'text-warning'
    },
    {
      id: 'kyc',
      title: 'KYC/AML',
      description: 'Identity verification',
      icon: FileCheck,
      status: currentStep === 2 ? 'active' : completedSteps.includes(2) ? 'completed' : 'pending',
      color: 'text-secondary'
    },
    {
      id: 'underwriting',
      title: 'Underwriting',
      description: 'Risk assessment with AI',
      icon: Calculator,
      status: currentStep === 3 ? 'active' : completedSteps.includes(3) ? 'completed' : 'pending',
      color: 'text-primary'
    },
    {
      id: 'quote',
      title: 'Quote Generation',
      description: 'Dynamic pricing algorithm',
      icon: BarChart3,
      status: currentStep === 4 ? 'active' : completedSteps.includes(4) ? 'completed' : 'pending',
      color: 'text-success'
    },
    {
      id: 'selection',
      title: 'Policy Selection',
      description: 'Choose coverage options',
      icon: Award,
      status: currentStep === 5 ? 'active' : completedSteps.includes(5) ? 'completed' : 'pending',
      color: 'text-warning'
    },
    {
      id: 'payment',
  title: 'Riskzap Payment',
      description: 'Instant SHM micropayment',
      icon: CreditCard,
      status: currentStep === 6 ? 'active' : completedSteps.includes(6) ? 'completed' : 'pending',
      color: 'text-primary'
    },
    {
      id: 'creation',
      title: 'Policy Creation',
      description: 'On-chain policy issuance',
      icon: FileText,
      status: currentStep === 7 ? 'active' : completedSteps.includes(7) ? 'completed' : 'pending',
      color: 'text-success'
    },
    {
      id: 'notification',
      title: 'Notification',
      description: 'Real-time updates',
      icon: Bell,
      status: currentStep === 8 ? 'active' : completedSteps.includes(8) ? 'completed' : 'pending',
      color: 'text-warning'
    },
    {
      id: 'dashboard',
      title: 'Dashboard Update',
      description: 'Live policy management',
      icon: Zap,
      status: currentStep === 9 ? 'active' : completedSteps.includes(9) ? 'completed' : 'pending',
      color: 'text-success'
    }
  ];

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps(prev => [...prev, stepIndex]);
    }
  };

  const getStepProgress = () => {
    return ((currentStep + 1) / flowSteps.length) * 100;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Progress Vine */}
      <div className="relative mb-12">
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full vine-progress rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${getStepProgress()}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </div>
        <div className="absolute -top-1 left-0 w-full">
          {flowSteps.map((_, index) => (
            <div
              key={index}
              className="absolute w-5 h-5 rounded-full border-2 border-background"
              style={{ left: `${(index / (flowSteps.length - 1)) * 100}%`, transform: 'translateX(-50%)' }}
            >
              <div 
                className={`w-full h-full rounded-full transition-all duration-300 ${
                  completedSteps.includes(index) || currentStep >= index
                    ? 'bg-success particle-glow' 
                    : 'bg-muted'
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Flow Steps Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {flowSteps.map((step, index) => {
          const IconComponent = step.icon;
          
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <Button
                variant={step.status === 'active' ? 'payfi' : step.status === 'completed' ? 'success' : 'floating'}
                onClick={() => handleStepClick(index)}
                className="w-full h-32 flex-col gap-3 p-4 card-hover"
              >
                <div className="relative">
                  <IconComponent className={`h-8 w-8 ${step.color}`} />
                  {step.status === 'active' && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-primary"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  )}
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-sm">{step.title}</h3>
                  <p className="text-xs opacity-80 mt-1">{step.description}</p>
                </div>
              </Button>

              {/* Connecting Lines */}
              {index < flowSteps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-border transform -translate-y-1/2">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: currentStep > index ? '100%' : '0%' }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Current Step Details */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mt-12 p-6 rounded-2xl border border-primary/20 bg-card/50 backdrop-blur-sm"
        >
          <div className="flex items-center gap-4 mb-4">
            {React.createElement(flowSteps[currentStep].icon, { 
              className: `h-12 w-12 ${flowSteps[currentStep].color}` 
            })}
            <div>
              <h2 className="text-2xl font-bold text-gradient-fire">
                {flowSteps[currentStep].title}
              </h2>
              <p className="text-muted-foreground text-lg">
                {flowSteps[currentStep].description}
              </p>
            </div>
          </div>
          
          <div className="fractal-bg p-4 rounded-lg">
            <p className="text-sm leading-relaxed">
              {currentStep === 0 && "User initiates a micro-policy request through the Riskzap interface. Smart contracts validate the request parameters and user eligibility."}
              {currentStep === 1 && "Advanced validation algorithms check request integrity, user credentials, and smart contract conditions for seamless processing."}
              {currentStep === 2 && "Automated KYC/AML verification using decentralized identity protocols ensures compliance while maintaining privacy."}
              {currentStep === 3 && "AI-powered underwriting engine analyzes risk factors using real-time data feeds and predictive modeling algorithms."}
              {currentStep === 4 && "Dynamic pricing algorithms generate personalized quotes based on risk assessment, market conditions, and coverage options."}
              {currentStep === 5 && "Interactive policy selection interface allows users to customize coverage with real-time premium adjustments."}
              {currentStep === 6 && "Instant Riskzap micropayments using SHM tokens enable seamless premium collection with minimal transaction fees."}
              {currentStep === 7 && "Smart contracts automatically issue policy NFTs with embedded terms, creating immutable on-chain insurance records."}
              {currentStep === 8 && "Real-time notification system updates all stakeholders about policy status, claims, and important events."}
              {currentStep === 9 && "Live dashboard updates provide comprehensive policy management, claims tracking, and analytics visualization."}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default InsuranceFlowVisualization;