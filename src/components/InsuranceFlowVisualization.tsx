import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Zap,
  CheckCircle,
  Clock
} from 'lucide-react';

interface FlowStep {
  id: string;
  title: string;
  description: string;
  detailedDescription: string;
  icon: React.ComponentType<any>;
  status: 'pending' | 'active' | 'completed';
}

const InsuranceFlowVisualization: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const flowSteps: FlowStep[] = [
    {
      id: 'request',
      title: 'User Request',
      description: 'Initiate micro-policy request',
      detailedDescription: 'User initiates a micro-policy request through the Riskzap interface. Smart contracts validate the request parameters and user eligibility for seamless processing.',
      icon: UserCheck,
      status: currentStep === 0 ? 'active' : completedSteps.includes(0) ? 'completed' : 'pending'
    },
    {
      id: 'validation',
      title: 'Validation',
      description: 'Smart contract validation',
      detailedDescription: 'Advanced validation algorithms check request integrity, user credentials, and smart contract conditions to ensure all parameters meet security requirements.',
      icon: Shield,
      status: currentStep === 1 ? 'active' : completedSteps.includes(1) ? 'completed' : 'pending'
    },
    {
      id: 'kyc',
      title: 'KYC / AML',
      description: 'Identity verification',
      detailedDescription: 'Automated KYC/AML verification using decentralized identity protocols ensures regulatory compliance while maintaining user privacy and security.',
      icon: FileCheck,
      status: currentStep === 2 ? 'active' : completedSteps.includes(2) ? 'completed' : 'pending'
    },
    {
      id: 'underwriting',
      title: 'Underwriting',
      description: 'AI-powered risk assessment',
      detailedDescription: 'AI-powered underwriting engine analyzes risk factors using real-time data feeds and predictive modeling algorithms to determine coverage eligibility.',
      icon: Calculator,
      status: currentStep === 3 ? 'active' : completedSteps.includes(3) ? 'completed' : 'pending'
    },
    {
      id: 'quote',
      title: 'Quote Generation',
      description: 'Dynamic pricing algorithm',
      detailedDescription: 'Dynamic pricing algorithms generate personalized quotes based on comprehensive risk assessment, current market conditions, and selected coverage options.',
      icon: BarChart3,
      status: currentStep === 4 ? 'active' : completedSteps.includes(4) ? 'completed' : 'pending'
    },
    {
      id: 'selection',
      title: 'Policy Selection',
      description: 'Choose coverage options',
      detailedDescription: 'Interactive policy selection interface allows users to customize coverage parameters with real-time premium adjustments and feature comparisons.',
      icon: Award,
      status: currentStep === 5 ? 'active' : completedSteps.includes(5) ? 'completed' : 'pending'
    },
    {
      id: 'payment',
      title: 'Riskzap Payment',
      description: 'Instant SHM micropayment',
      detailedDescription: 'Instant Riskzap micropayments using SHM tokens enable seamless premium collection with minimal transaction fees and immediate confirmation.',
      icon: CreditCard,
      status: currentStep === 6 ? 'active' : completedSteps.includes(6) ? 'completed' : 'pending'
    },
    {
      id: 'creation',
      title: 'Policy Creation',
      description: 'On-chain policy issuance',
      detailedDescription: 'Smart contracts automatically issue policy NFTs with embedded terms and conditions, creating immutable on-chain insurance records for transparency.',
      icon: FileText,
      status: currentStep === 7 ? 'active' : completedSteps.includes(7) ? 'completed' : 'pending'
    },
    {
      id: 'notification',
      title: 'Notification',
      description: 'Real-time updates',
      detailedDescription: 'Real-time notification system updates all stakeholders about policy status changes, claim submissions, and other important events via multiple channels.',
      icon: Bell,
      status: currentStep === 8 ? 'active' : completedSteps.includes(8) ? 'completed' : 'pending'
    },
    {
      id: 'dashboard',
      title: 'Dashboard Update',
      description: 'Live policy management',
      detailedDescription: 'Live dashboard updates provide comprehensive policy management, claims tracking, portfolio analytics, and real-time visualization of all insurance activities.',
      icon: Zap,
      status: currentStep === 9 ? 'active' : completedSteps.includes(9) ? 'completed' : 'pending'
    }
  ];

  const handleStepClick = (stepIndex: number) => {
    if (expandedStep === stepIndex) {
      setExpandedStep(null);
    } else {
      setExpandedStep(stepIndex);
      setCurrentStep(stepIndex);
      if (!completedSteps.includes(stepIndex)) {
        setCompletedSteps(prev => [...prev, stepIndex]);
      }
    }
  };

  const getStepIcon = (step: FlowStep, index: number) => {
    if (step.status === 'completed') {
      return <CheckCircle className="h-6 w-6 text-green-400" />;
    } else if (step.status === 'active') {
      return <Clock className="h-6 w-6 text-yellow-400" />;
    } else {
      const IconComponent = step.icon;
      return <IconComponent className="h-6 w-6 text-gray-500" />;
    }
  };

  const getNodeStyles = (step: FlowStep) => {
    if (step.status === 'completed') {
      return 'bg-green-400 border-green-400';
    } else if (step.status === 'active') {
      return 'bg-yellow-400 border-yellow-400 animate-pulse';
    } else {
      return 'bg-transparent border-gray-600';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-black min-h-screen">
      <div className="relative">
        {/* Vertical Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-700"></div>
        
        {/* Progress Line Animation */}
        <motion.div
          className="absolute left-8 top-0 w-0.5 bg-gradient-to-b from-green-400 to-yellow-400"
          initial={{ height: 0 }}
          animate={{ 
            height: `${((completedSteps.length + (currentStep > completedSteps.length ? 1 : 0)) / flowSteps.length) * 100}%`
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />

        {/* Timeline Steps */}
        <div className="space-y-8">
          {flowSteps.map((step, index) => {
            const IconComponent = step.icon;
            
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-start"
              >
                {/* Timeline Node */}
                <motion.div
                  className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 ${getNodeStyles(step)} cursor-pointer`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleStepClick(index)}
                >
                  {getStepIcon(step, index)}
                  
                  {/* Active Step Pulse Effect */}
                  {step.status === 'active' && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-yellow-400"
                      animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0, 0.8] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  )}
                </motion.div>

                {/* Step Content */}
                <div className="ml-8 flex-1 cursor-pointer" onClick={() => handleStepClick(index)}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {step.description}
                    </p>
                  </motion.div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedStep === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 p-4 rounded-lg bg-gray-900/50 border border-gray-700"
                      >
                        <div className="flex items-start gap-3">
                          <IconComponent className="h-8 w-8 text-white mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="text-white font-medium mb-2">
                              Step {index + 1}: {step.title}
                            </h4>
                            <p className="text-gray-300 text-sm leading-relaxed">
                              {step.detailedDescription}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Progress Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-6 rounded-2xl bg-gray-900/50 border border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                Insurance Flow Progress
              </h3>
              <p className="text-gray-400">
                {completedSteps.length} of {flowSteps.length} steps completed
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">
                {Math.round((completedSteps.length / flowSteps.length) * 100)}%
              </div>
              <div className="text-sm text-gray-400">Complete</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-400 to-yellow-400"
              initial={{ width: 0 }}
              animate={{ width: `${(completedSteps.length / flowSteps.length) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InsuranceFlowVisualization;