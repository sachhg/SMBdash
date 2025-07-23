// Mock API service to simulate real financial data integrations

export interface Transaction {
    id: string;
    vendor: string;
    category: string;
    amount: number;
    date: string;
    description: string;
    source: 'stripe' | 'shopify' | 'meta' | 'manual';
  }
  
  export interface Campaign {
    id: string;
    name: string;
    platform: string;
    spend: number;
    clicks: number;
    conversions: number;
    revenue: number;
    roi: number;
    status: 'active' | 'paused' | 'ended';
  }
  
  export interface Product {
    sku: string;
    name: string;
    price: number;
    sales: number;
    revenue: number;
  }
  
  export interface Nudge {
    id: string;
    title: string;
    description: string;
    type: 'reallocation' | 'optimization' | 'alert';
    impact: number;
    confidence: number;
    accepted?: boolean;
  }
  
  export interface BenchmarkData {
    category: string;
    userPercentage: number;
    industryAverage: number;
    trend: number[];
  }
  
  // Mock data generators
  export class MockApiService {
    private static instance: MockApiService;
    private connected: Set<string> = new Set();
  
    static getInstance(): MockApiService {
      if (!MockApiService.instance) {
        MockApiService.instance = new MockApiService();
      }
      return MockApiService.instance;
    }
  
    // Simulate connecting to external services
    async connectSource(source: string): Promise<{ success: boolean; message: string }> {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      this.connected.add(source);
      
      return {
        success: true,
        message: `Successfully connected to ${source}`
      };
    }
  
    getConnectedSources(): string[] {
      return Array.from(this.connected);
    }
  
    // Generate fake transactions
    generateTransactions(): Transaction[] {
      const vendors = [
        { name: 'Meta Ads', category: 'Marketing', source: 'meta' as const },
        { name: 'Google Ads', category: 'Marketing', source: 'meta' as const },
        { name: 'Shopify', category: 'E-commerce', source: 'shopify' as const },
        { name: 'Stripe Processing', category: 'Payment Processing', source: 'stripe' as const },
        { name: 'AWS', category: 'Infrastructure', source: 'manual' as const },
        { name: 'Slack', category: 'SaaS', source: 'manual' as const },
        { name: 'Notion', category: 'SaaS', source: 'manual' as const },
        { name: 'Inventory Purchase', category: 'Inventory', source: 'manual' as const },
        { name: 'Office Supplies', category: 'Operations', source: 'manual' as const },
        { name: 'Legal Services', category: 'Professional Services', source: 'manual' as const }
      ];
  
      const transactions: Transaction[] = [];
      
      for (let i = 0; i < 90; i++) {
        const vendor = vendors[Math.floor(Math.random() * vendors.length)];
        const baseAmount = vendor.category === 'Marketing' ? 500 : 
                          vendor.category === 'Inventory' ? 2000 : 
                          vendor.category === 'E-commerce' ? 1000 : 200;
        
        transactions.push({
          id: `txn_${Math.random().toString(36).substr(2, 9)}`,
          vendor: vendor.name,
          category: vendor.category,
          amount: baseAmount + Math.random() * baseAmount,
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
          description: `${vendor.name} - ${vendor.category} expense`,
          source: vendor.source
        });
      }
  
      return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  
    // Generate fake campaigns with ROI data
    generateCampaigns(): Campaign[] {
      const campaignNames = [
        'Black Friday Sale',
        'Summer Collection Launch',
        'Brand Awareness Drive',
        'Retargeting Campaign',
        'Product Demo Videos',
        'Customer Acquisition',
        'Holiday Promotion',
        'Back to School',
        'New Customer Discount',
        'Loyalty Program Push'
      ];
  
      const platforms = ['Meta Ads', 'Google Ads', 'TikTok Ads', 'LinkedIn Ads'];
  
      return campaignNames.map((name, index) => {
        const spend = 1000 + Math.random() * 5000;
        const clicks = Math.floor(spend * (50 + Math.random() * 100));
        const conversions = Math.floor(clicks * (0.02 + Math.random() * 0.08));
        const revenue = conversions * (50 + Math.random() * 200);
        const roi = revenue / spend;
  
        return {
          id: `camp_${index + 1}`,
          name,
          platform: platforms[Math.floor(Math.random() * platforms.length)],
          spend: Math.round(spend),
          clicks,
          conversions,
          revenue: Math.round(revenue),
          roi: Math.round(roi * 100) / 100,
          status: roi < 0.7 ? 'paused' as const : 'active' as const
        };
      });
    }
  
    // Generate products/SKUs
    generateProducts(): Product[] {
      const productNames = [
        'Wireless Bluetooth Headphones',
        'Smart Phone Case',
        'Portable Charger',
        'Fitness Tracker',
        'Coffee Mug Set',
        'Laptop Stand',
        'Blue Light Glasses',
        'Ergonomic Mouse Pad',
        'Desktop Organizer',
        'Wireless Charging Pad',
        'Phone Ring Holder',
        'Cable Management Kit',
        'Bluetooth Speaker',
        'Screen Cleaner Kit',
        'Portable Phone Stand',
        'USB Hub',
        'Keyboard Wrist Rest',
        'Monitor Light Bar',
        'Desk Lamp',
        'Plant Pot Set'
      ];
  
      return productNames.map((name, index) => {
        const price = 15 + Math.random() * 85;
        const sales = Math.floor(50 + Math.random() * 500);
        
        return {
          sku: `SKU${String(index + 1).padStart(3, '0')}`,
          name,
          price: Math.round(price * 100) / 100,
          sales,
          revenue: Math.round(price * sales * 100) / 100
        };
      });
    }
  
    // Generate reallocation nudges
    generateNudges(): Nudge[] {
      const campaigns = this.generateCampaigns();
      const lowROI = campaigns.filter(c => c.roi < 0.7);
      const highROI = campaigns.filter(c => c.roi > 1.5);
      
      const nudges: Nudge[] = [];
  
      lowROI.forEach((lowCampaign, index) => {
        if (highROI[index]) {
          const highCampaign = highROI[index];
          const reallocationAmount = Math.round(lowCampaign.spend * 0.3);
          
          nudges.push({
            id: `nudge_${index + 1}`,
            title: `Reallocate Budget: ${lowCampaign.name} → ${highCampaign.name}`,
            description: `Move $${reallocationAmount} from underperforming campaign (${lowCampaign.roi}x ROI) to high-performing campaign (${highCampaign.roi}x ROI)`,
            type: 'reallocation',
            impact: reallocationAmount * (highCampaign.roi - lowCampaign.roi),
            confidence: 85 + Math.random() * 10
          });
        }
      });
  
      // Add some optimization nudges
      nudges.push({
        id: 'nudge_opt_1',
        title: 'Reduce Marketing Spend',
        description: 'Your marketing spend is 28% above industry average. Consider optimizing ad targeting.',
        type: 'optimization',
        impact: 2500,
        confidence: 78
      });
  
      return nudges;
    }
  
    // Generate benchmark data
    generateBenchmarks(): BenchmarkData[] {
      return [
        {
          category: 'Marketing',
          userPercentage: 26,
          industryAverage: 18,
          trend: [15, 16, 18, 19, 18, 17, 18, 19, 20, 18, 17, 18]
        },
        {
          category: 'Operations',
          userPercentage: 15,
          industryAverage: 22,
          trend: [20, 21, 22, 23, 22, 21, 22, 23, 24, 22, 21, 22]
        },
        {
          category: 'Technology',
          userPercentage: 8,
          industryAverage: 12,
          trend: [10, 11, 12, 13, 12, 11, 12, 13, 14, 12, 11, 12]
        },
        {
          category: 'Professional Services',
          userPercentage: 5,
          industryAverage: 8,
          trend: [6, 7, 8, 9, 8, 7, 8, 9, 10, 8, 7, 8]
        }
      ];
    }
  }