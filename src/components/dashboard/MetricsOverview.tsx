import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Target, Activity, AlertTriangle } from "lucide-react";
import { Transaction, Campaign } from "@/services/mockApi";

interface MetricsOverviewProps {
  transactions: Transaction[];
  campaigns: Campaign[];
}

export function MetricsOverview({ transactions, campaigns }: MetricsOverviewProps) {
  const totalSpend = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0);
  const totalROI = totalRevenue / totalSpend;
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const lowPerformingCampaigns = campaigns.filter(c => c.roi < 0.7).length;

  const metrics = [
    {
      title: "Total Spend",
      value: `$${totalSpend.toLocaleString()}`,
      description: "Last 90 days",
      icon: DollarSign,
      trend: -5.2,
      color: "primary"
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      description: "Attribution tracked",
      icon: TrendingUp,
      trend: 12.3,
      color: "success"
    },
    {
      title: "Overall ROI",
      value: `${totalROI.toFixed(2)}x`,
      description: totalROI > 1 ? "Profitable" : "Needs attention",
      icon: Target,
      trend: totalROI > 1 ? 8.1 : -15.2,
      color: totalROI > 1 ? "success" : "destructive"
    },
    {
      title: "Active Campaigns",
      value: activeCampaigns.toString(),
      description: `${lowPerformingCampaigns} underperforming`,
      icon: Activity,
      trend: 0,
      color: lowPerformingCampaigns > 0 ? "warning" : "success"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title} className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-card opacity-50"></div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold">{metric.value}</div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{metric.description}</p>
              {metric.trend !== 0 && (
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${
                    metric.trend > 0 
                      ? 'text-success bg-success/10' 
                      : 'text-destructive bg-destructive/10'
                  }`}
                >
                  {metric.trend > 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(metric.trend)}%
                </Badge>
              )}
            </div>
            {metric.title === "Active Campaigns" && lowPerformingCampaigns > 0 && (
              <div className="mt-2 flex items-center text-xs text-warning">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Attention needed
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}