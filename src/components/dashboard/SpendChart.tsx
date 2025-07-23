import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Transaction } from "@/services/mockApi";

interface SpendChartProps {
  transactions: Transaction[];
}

const COLORS = [
  'hsl(214, 84%, 26%)',   // Primary blue
  'hsl(142, 76%, 36%)',   // Success green
  'hsl(38, 92%, 50%)',    // Warning orange
  'hsl(0, 84%, 60%)',     // Destructive red
  'hsl(214, 84%, 45%)',   // Primary light
  'hsl(215, 16%, 46%)',   // Muted
];

export function SpendChart({ transactions }: SpendChartProps) {
  // Aggregate spending by category
  const categorySpend = transactions.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categorySpend).map(([category, amount]) => ({
    name: category,
    value: Math.round(amount),
    percentage: Math.round((amount / Object.values(categorySpend).reduce((a, b) => a + b, 0)) * 100)
  }));

  const barData = pieData.sort((a, b) => b.value - a.value);

  const totalSpend = Object.values(categorySpend).reduce((a, b) => a + b, 0);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg shadow-card p-3">
          <p className="font-medium">{label}</p>
          <p className="text-primary">
            ${payload[0].value.toLocaleString()}
            <span className="text-muted-foreground ml-2">
              ({Math.round((payload[0].value / totalSpend) * 100)}%)
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Spend Analysis</CardTitle>
        <CardDescription>
          ${totalSpend.toLocaleString()} total spend across {pieData.length} categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pie" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pie">Pie Chart</TabsTrigger>
            <TabsTrigger value="bar">Bar Chart</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pie" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} (${percentage}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {pieData.map((item, index) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">${item.value.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="bar" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="hsl(214, 84%, 26%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}