import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Smartphone, 
  Calendar, 
  Shield, 
  Plane, 
  Camera, 
  Zap,
  Clock,
  DollarSign,
  TrendingUp
} from 'lucide-react';

interface PolicyType {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  basePremium: number;
  duration: string;
  coverage: string;
  popular: boolean;
  features: string[];
}

const PolicyCards: React.FC = () => {
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);

  const policyTypes: PolicyType[] = [
    {
      id: 'device',
      name: 'Device Protection',
      description: 'Instant coverage for smartphones, tablets, and electronics',
      icon: Smartphone,
      basePremium: 0.5,
      duration: '24 hours',
      coverage: 'Up to $500',
      popular: true,
      features: [
        'Accidental damage',
        'Theft protection',
        'Liquid damage',
        'Instant claim processing'
      ]
    },
    {
      id: 'event',
      name: 'Event Coverage',
      description: 'Quick insurance for concerts, sports events, and gatherings',
      icon: Calendar,
      basePremium: 1.2,
      duration: 'Single event',
      coverage: 'Up to $1,000',
      popular: false,
      features: [
        'Event cancellation',
        'Weather protection',
        'Travel delays',
        'Emergency medical'
      ]
    },
    {
      id: 'travel',
      name: 'Micro Travel',
      description: 'Short-term travel insurance for day trips and weekends',
      icon: Plane,
      basePremium: 2.0,
      duration: '1-7 days',
      coverage: 'Up to $2,500',
      popular: true,
      features: [
        'Trip interruption',
        'Baggage loss',
        'Medical emergency',
        'Flight delays'
      ]
    },
    {
      id: 'equipment',
      name: 'Equipment Rental',
      description: 'Coverage for rented cameras, tools, and equipment',
      icon: Camera,
      basePremium: 0.8,
      duration: 'Rental period',
      coverage: 'Full replacement',
      popular: false,
      features: [
        'Damage protection',
        'Theft coverage',
        'Loss replacement',
        'No deductible'
      ]
    }
  ];

  const handlePolicySelect = (policyId: string) => {
    setSelectedPolicy(policyId === selectedPolicy ? null : policyId);
  };

  const purchasePolicy = (policy: PolicyType) => {
    // This would integrate with the smart contract
    console.log('Purchasing policy:', policy.name);
    // Implementation for Web3 transaction would go here
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gradient-fire mb-4">
          Micro-Policy Marketplace
        </h2>
        <p className="text-lg text-muted-foreground">
          Instant, affordable insurance for your immediate needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {policyTypes.map((policy, index) => {
          const IconComponent = policy.icon;
          const isSelected = selectedPolicy === policy.id;
          
          return (
            <motion.div
              key={policy.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Popular Badge */}
              {policy.popular && (
                <div className="absolute -top-3 -right-3 z-10">
                  <div className="bg-warning text-warning-foreground px-3 py-1 rounded-full text-sm font-bold particle-glow">
                    <TrendingUp className="inline h-4 w-4 mr-1" />
                    Popular
                  </div>
                </div>
              )}

              <motion.div
                className={`
                  relative overflow-hidden rounded-2xl border-2 transition-all duration-300 cursor-pointer
                  ${isSelected 
                    ? 'border-primary bg-card shadow-2xl shadow-primary/20 scale-105' 
                    : 'border-primary/20 bg-card/50 hover:border-primary/40 card-hover'
                  }
                `}
                onClick={() => handlePolicySelect(policy.id)}
                whileHover={{ y: -5 }}
                layout
              >
                {/* Holographic Background Effect */}
                <div className="absolute inset-0 holographic opacity-10" />
                
                <div className="relative p-6 backdrop-blur-sm">
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-xl bg-primary/10 particle-glow">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{policy.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {policy.description}
                      </p>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 rounded-lg bg-background/50">
                      <DollarSign className="h-5 w-5 text-success mx-auto mb-2" />
                      <div className="text-lg font-bold text-success">
                        {policy.basePremium} SHM
                      </div>
                      <div className="text-xs text-muted-foreground">Premium</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-background/50">
                      <Clock className="h-5 w-5 text-warning mx-auto mb-2" />
                      <div className="text-sm font-bold">{policy.duration}</div>
                      <div className="text-xs text-muted-foreground">Duration</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-background/50">
                      <Shield className="h-5 w-5 text-primary mx-auto mb-2" />
                      <div className="text-sm font-bold">{policy.coverage}</div>
                      <div className="text-xs text-muted-foreground">Coverage</div>
                    </div>
                  </div>

                  {/* Features List */}
                  <motion.div
                    initial={false}
                    animate={{ height: isSelected ? 'auto' : 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mb-6">
                      <h4 className="font-semibold mb-3">Coverage Features:</h4>
                      <ul className="space-y-2">
                        {policy.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 rounded-full bg-success" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>

                  {/* Action Button */}
                  <Button
                    variant={isSelected ? "hero" : "payfi"}
                    className="w-full gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      purchasePolicy(policy);
                    }}
                  >
                    <Zap className="h-4 w-4" />
                    {isSelected ? 'Purchase Now' : 'Quick Buy'}
                  </Button>
                </div>

                {/* Animated Border Effect */}
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-primary"
                    animate={{ 
                      boxShadow: [
                        '0 0 20px hsl(var(--primary) / 0.5)',
                        '0 0 40px hsl(var(--primary) / 0.8)',
                        '0 0 20px hsl(var(--primary) / 0.5)'
                      ]
                    }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-16 text-center"
      >
        <div className="fractal-bg p-8 rounded-2xl border border-primary/20">
          <h3 className="text-2xl font-bold text-gradient-success mb-4">
            Why Choose PayFi Micro-Policies?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <Zap className="h-12 w-12 text-primary mx-auto mb-3 particle-glow" />
              <h4 className="font-bold mb-2">Instant Coverage</h4>
              <p className="text-sm text-muted-foreground">
                Get protected in seconds with smart contract automation
              </p>
            </div>
            <div>
              <DollarSign className="h-12 w-12 text-success mx-auto mb-3 particle-glow" />
              <h4 className="font-bold mb-2">Micro-Payments</h4>
              <p className="text-sm text-muted-foreground">
                Pay only for what you need with SHM tokens
              </p>
            </div>
            <div>
              <Shield className="h-12 w-12 text-warning mx-auto mb-3 particle-glow" />
              <h4 className="font-bold mb-2">Trustless Claims</h4>
              <p className="text-sm text-muted-foreground">
                Automated claim processing via blockchain verification
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PolicyCards;