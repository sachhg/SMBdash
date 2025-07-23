import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ConnectButton } from "@/components/dashboard/ConnectButton";
import { SpendChart } from "@/components/dashboard/SpendChart";
import { MetricsOverview } from "@/components/dashboard/MetricsOverview";
import { MockApiService, Transaction, Campaign } from "@/services/mockApi";
import { Zap, ShoppingCart, Facebook, CreditCard } from "lucide-react";

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [hasConnections, setHasConnections] = useState(false);
  const mockApi = MockApiService.getInstance();

  useEffect(() => {
    // Load initial data if there are any connections
    const connected = mockApi.getConnectedSources();
    if (connected.length > 0) {
      setHasConnections(true);
      setTransactions(mockApi.generateTransactions());
      setCampaigns(mockApi.generateCampaigns());
    }
  }, []);

  const handleConnection = () => {
    setHasConnections(true);
    setTransactions(mockApi.generateTransactions());
    setCampaigns(mockApi.generateCampaigns());
  };

  const connectionSources = [
    {
      source: "stripe",
      title: "Stripe",
      description: "Payment processing and transaction data",
      icon: <CreditCard className="h-6 w-6 text-primary" />
    },
    {
      source: "shopify",
      title: "Shopify",
      description: "E-commerce sales and inventory data",
      icon: <ShoppingCart className="h-6 w-6 text-primary" />
    },
    {
      source: "meta",
      title: "Meta Ads",
      description: "Advertising campaigns and performance metrics",
      icon: <Facebook className="h-6 w-6 text-primary" />
    },
    {
      source: "quickbooks",
      title: "QuickBooks",
      description: "Accounting and financial records",
      icon: <Zap className="h-6 w-6 text-primary" />
    }
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Financial Intelligence Dashboard</h1>
          <p className="text-muted-foreground">
            Connect your financial accounts to get AI-powered insights and recommendations
          </p>
        </div>

        {!hasConnections ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Connect Your Financial Sources</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {connectionSources.map((source) => (
                  <ConnectButton
                    key={source.source}
                    source={source.source}
                    title={source.title}
                    description={source.description}
                    icon={source.icon}
                    onConnect={handleConnection}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <MetricsOverview transactions={transactions} campaigns={campaigns} />
            <div className="grid gap-6 lg:grid-cols-3">
              <SpendChart transactions={transactions} />
              <div className="space-y-4">
                {/* Quick insights card */}
                <div className="p-6 bg-gradient-card rounded-lg border border-border shadow-card">
                  <h3 className="text-lg font-semibold mb-3">Quick Insights</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Marketing ROI</span>
                      <span className={`text-sm font-medium ${
                        campaigns.filter(c => c.platform.includes('Ads')).reduce((sum, c) => sum + c.roi, 0) / 
                        campaigns.filter(c => c.platform.includes('Ads')).length > 1 
                          ? 'text-success' : 'text-warning'
                      }`}>
                        {(campaigns.filter(c => c.platform.includes('Ads')).reduce((sum, c) => sum + c.roi, 0) / 
                         campaigns.filter(c => c.platform.includes('Ads')).length).toFixed(2)}x
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Top Category</span>
                      <span className="text-sm font-medium">
                        {Object.entries(
                          transactions.reduce((acc, t) => {
                            acc[t.category] = (acc[t.category] || 0) + t.amount;
                            return acc;
                          }, {} as Record<string, number>)
                        ).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Active Campaigns</span>
                      <span className="text-sm font-medium">
                        {campaigns.filter(c => c.status === 'active').length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Index;