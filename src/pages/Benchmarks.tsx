import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MockApiService, BenchmarkData } from "@/services/mockApi";
import { TrendingUp, TrendingDown, BarChart3, Users } from "lucide-react";

const Benchmarks = () => {
  const [benchmarks, setBenchmarks] = useState<BenchmarkData[]>([]);
  const mockApi = MockApiService.getInstance();

  useEffect(() => {
    setBenchmarks(mockApi.generateBenchmarks());
  }, []);

  const getPerformanceBadge = (userPercentage: number, industryAverage: number) => {
    const difference = ((userPercentage - industryAverage) / industryAverage) * 100;
    
    if (Math.abs(difference) <= 10) {
      return <Badge className="bg-success/10 text-success border-success/20">On Target</Badge>;
    } else if (difference > 10) {
      return <Badge className="bg-warning/10 text-warning border-warning/20">Above Average</Badge>;
    } else {
      return <Badge className="bg-primary/10 text-primary border-primary/20">Below Average</Badge>;
    }
  };

  const getTrendIcon = (trend: number[]) => {
    const recent = trend.slice(-3);
    const earlier = trend.slice(-6, -3);
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length;
    
    return recentAvg > earlierAvg ? (
      <TrendingUp className="h-4 w-4 text-success" />
    ) : (
      <TrendingDown className="h-4 w-4 text-destructive" />
    );
  };

  const chartData = benchmarks[0]?.trend.map((value, index) => ({
    month: `Month ${index + 1}`,
    industry: value,
    user: benchmarks[0]?.userPercentage
  })) || [];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Industry Benchmarks</h1>
          <p className="text-muted-foreground">
            Compare your spending patterns with similar businesses in your industry
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Industry Cohort</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">DTC Retail</div>
              <p className="text-xs text-muted-foreground">$2M-$10M ARR</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Peer Companies</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">247</div>
              <p className="text-xs text-muted-foreground">In your cohort</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories Tracked</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{benchmarks.length}</div>
              <p className="text-xs text-muted-foreground">Spend categories</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Ranking</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">72nd</div>
              <p className="text-xs text-success">Top 30%</p>
            </CardContent>
          </Card>
        </div>

        {/* Trend Chart */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Marketing Spend Trend</CardTitle>
            <p className="text-sm text-muted-foreground">
              Your marketing spend vs. industry average over time
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="industry" 
                    stroke="hsl(var(--muted-foreground))" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Industry Average"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="user" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    name="Your Business"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Benchmark Comparison */}
        <div className="grid gap-4">
          {benchmarks.map((benchmark) => (
            <Card key={benchmark.category} className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-card opacity-50"></div>
              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{benchmark.category} Spending</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Percentage of total business expenses
                    </p>
                  </div>
                  <div className="text-right">
                    {getPerformanceBadge(benchmark.userPercentage, benchmark.industryAverage)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {benchmark.userPercentage}%
                    </div>
                    <p className="text-sm text-muted-foreground">Your Business</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-muted-foreground">
                      {benchmark.industryAverage}%
                    </div>
                    <p className="text-sm text-muted-foreground">Industry Avg</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      {getTrendIcon(benchmark.trend)}
                      <span className="text-lg font-bold ml-1">
                        {Math.abs(
                          Math.round(
                            ((benchmark.userPercentage - benchmark.industryAverage) / 
                             benchmark.industryAverage) * 100
                          )
                        )}%
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {benchmark.userPercentage > benchmark.industryAverage ? 'Above' : 'Below'} Avg
                    </p>
                  </div>
                </div>

                {/* Visual bar comparison */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Your Business ({benchmark.userPercentage}%)</span>
                    <span className="text-primary font-medium">
                      ${((benchmark.userPercentage / 100) * 100000).toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(benchmark.userPercentage / Math.max(benchmark.userPercentage, benchmark.industryAverage)) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span>Industry Average ({benchmark.industryAverage}%)</span>
                    <span className="text-muted-foreground font-medium">
                      ${((benchmark.industryAverage / 100) * 100000).toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-muted-foreground h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(benchmark.industryAverage / Math.max(benchmark.userPercentage, benchmark.industryAverage)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Insights Card */}
        <Card className="bg-gradient-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-white">Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-primary-foreground/90">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Your marketing spend is 44% above industry average - consider optimization</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingDown className="h-4 w-4" />
                <span>Technology investments are below average - potential growth opportunity</span>
              </div>
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Operations efficiency is strong compared to peers</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Benchmarks;