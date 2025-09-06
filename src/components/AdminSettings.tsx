import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Settings, 
  Database, 
  BarChart3, 
  Shield, 
  Wallet,
  Save,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { 
  getConfiguredTokenAddress, 
  setConfiguredTokenAddress,
  getConfiguredCompanyWallet, 
  setConfiguredCompanyWallet,
  getConfiguredPolicyContract,
  setConfiguredPolicyContract
} from '../services/web3';

interface AdminSettingsProps {
  className?: string;
}

export function AdminSettings({ className }: AdminSettingsProps) {
  const [tokenAddress, setTokenAddress] = useState(getConfiguredTokenAddress() || '');
  const [companyWallet, setCompanyWallet] = useState(getConfiguredCompanyWallet() || '');
  const [policyContract, setPolicyContract] = useState(getConfiguredPolicyContract() || '');
  const [showSecrets, setShowSecrets] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveSettings = () => {
    try {
      if (tokenAddress.trim()) {
        setConfiguredTokenAddress(tokenAddress.trim());
      }
      if (companyWallet.trim()) {
        setConfiguredCompanyWallet(companyWallet.trim());
      }
      if (policyContract.trim()) {
        setConfiguredPolicyContract(policyContract.trim());
      }
      
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const maskAddress = (address: string) => {
    if (!address || address.length < 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <motion.div
      className={`space-y-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Admin Settings</h2>
          <p className="text-muted-foreground">
            Manage system configuration and analytics
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          <Shield className="w-3 h-3 mr-1" />
          Admin Access
        </Badge>
      </div>

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="contracts" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Contracts
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          <AnalyticsDashboard />
        </TabsContent>

        <TabsContent value="contracts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Smart Contract Configuration
              </CardTitle>
              <CardDescription>
                Configure blockchain contract addresses and wallet settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tokenAddress">SHM Token Address</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="tokenAddress"
                        value={tokenAddress}
                        onChange={(e) => setTokenAddress(e.target.value)}
                        placeholder="0x..."
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowSecrets(!showSecrets)}
                      >
                        {showSecrets ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    {!showSecrets && tokenAddress && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Current: {maskAddress(tokenAddress)}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="companyWallet">Company Wallet Address</Label>
                    <Input
                      id="companyWallet"
                      value={companyWallet}
                      onChange={(e) => setCompanyWallet(e.target.value)}
                      placeholder="0x..."
                      className="font-mono text-sm mt-1"
                    />
                    {!showSecrets && companyWallet && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Current: {maskAddress(companyWallet)}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="policyContract">Policy Contract Address</Label>
                    <Input
                      id="policyContract"
                      value={policyContract}
                      onChange={(e) => setPolicyContract(e.target.value)}
                      placeholder="0x..."
                      className="font-mono text-sm mt-1"
                    />
                    {!showSecrets && policyContract && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Current: {maskAddress(policyContract)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Current Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Network</span>
                        <Badge variant="outline">Shardeum Unstablenet</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Chain ID</span>
                        <Badge variant="outline">8080</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Token</span>
                        <Badge variant={tokenAddress ? "default" : "secondary"}>
                          {tokenAddress ? "Configured" : "Not Set"}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Company Wallet</span>
                        <Badge variant={companyWallet ? "default" : "secondary"}>
                          {companyWallet ? "Configured" : "Not Set"}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Policy Contract</span>
                        <Badge variant={policyContract ? "default" : "secondary"}>
                          {policyContract ? "Configured" : "Not Set"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Save Configuration</p>
                  <p className="text-xs text-muted-foreground">
                    Settings are stored locally in your browser
                  </p>
                </div>
                <Button onClick={handleSaveSettings} className="flex items-center gap-2">
                  {saved ? (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Saved!
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Settings
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                System Configuration
              </CardTitle>
              <CardDescription>
                Application settings and environment configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Environment Variables</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">VITE_DEMO_MODE</span>
                      <Badge variant="outline">
                        {import.meta.env.VITE_DEMO_MODE || 'false'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">VITE_ANALYTICS_API_URL</span>
                      <Badge variant="outline">
                        {import.meta.env.VITE_ANALYTICS_API_URL || 'localhost:3001'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Mode</span>
                      <Badge variant="outline">
                        {import.meta.env.MODE}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Database Connection</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">MongoDB Status</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Connected
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Analytics API</span>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        Port 3001
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Collection</span>
                      <Badge variant="outline">
                        zenith-analytics
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Endpoints</CardTitle>
              <CardDescription>Available analytics and data endpoints</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">User Analytics</h5>
                  <div className="space-y-1 text-xs font-mono">
                    <div>POST /api/analytics/wallet-connection</div>
                    <div>POST /api/analytics/policy-purchase</div>
                    <div>GET /api/analytics/user/:address</div>
                    <div>GET /api/analytics/all-users</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">System Analytics</h5>
                  <div className="space-y-1 text-xs font-mono">
                    <div>GET /api/analytics/global</div>
                    <div>GET /api/analytics/revenue</div>
                    <div>GET /api/analytics/policy-types</div>
                    <div>GET /api/analytics/user-growth</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}