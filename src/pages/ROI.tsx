import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MockApiService, Campaign } from "@/services/mockApi";
import { TrendingUp, TrendingDown, AlertTriangle, Play, Pause } from "lucide-react";

const ROI = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const mockApi = MockApiService.getInstance();

  useEffect(() => {
    setCampaigns(mockApi.generateCampaigns());
  }, []);

  const getROIBadge = (roi: number) => {
    if (roi >= 1.5) {
      return <Badge className="bg-success/10 text-success border-success/20">Excellent</Badge>;
    } else if (roi >= 1.0) {
      return <Badge className="bg-primary/10 text-primary border-primary/20">Good</Badge>;
    } else if (roi >= 0.7) {
      return <Badge className="bg-warning/10 text-warning border-warning/20">Fair</Badge>;
    } else {
      return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Poor</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    return status === 'active' ? (
      <Play className="h-4 w-4 text-success" />
    ) : (
      <Pause className="h-4 w-4 text-muted-foreground" />
    );
  };

  const sortedCampaigns = [...campaigns].sort((a, b) => a.roi - b.roi);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">ROI Analysis</h1>
          <p className="text-muted-foreground">
            Analyze campaign performance and identify optimization opportunities
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{campaigns.length}</div>
              <p className="text-xs text-muted-foreground">
                {campaigns.filter(c => c.status === 'active').length} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg ROI</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(campaigns.reduce((sum, c) => sum + c.roi, 0) / campaigns.length).toFixed(2)}x
              </div>
              <p className="text-xs text-success">Above 1.0x target</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Performers</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {campaigns.filter(c => c.roi >= 1.5).length}
              </div>
              <p className="text-xs text-success">ROI greater than 1.5x</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {campaigns.filter(c => c.roi < 0.7).length}
              </div>
              <p className="text-xs text-destructive">ROI less than 0.7x</p>
            </CardContent>
          </Card>
        </div>

        {/* Campaign Table */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Spend</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">ROI</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedCampaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell>{campaign.platform}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(campaign.status)}
                        <span className="capitalize">{campaign.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">${campaign.spend.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${campaign.revenue.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-medium">
                      <div className="flex items-center justify-end space-x-1">
                        {campaign.roi >= 1.0 ? (
                          <TrendingUp className="h-4 w-4 text-success" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-destructive" />
                        )}
                        {campaign.roi.toFixed(2)}x
                      </div>
                    </TableCell>
                    <TableCell>{getROIBadge(campaign.roi)}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        {campaign.roi < 0.7 ? 'Optimize' : 'View Details'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ROI;