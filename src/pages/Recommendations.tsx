import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MockApiService, Nudge } from "@/services/mockApi";
import { TrendingUp, Target, AlertTriangle, CheckCircle, X, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Recommendations = () => {
  const [nudges, setNudges] = useState<Nudge[]>([]);
  const [acceptedNudges, setAcceptedNudges] = useState<Set<string>>(new Set());
  const [ignoredNudges, setIgnoredNudges] = useState<Set<string>>(new Set());
  const mockApi = MockApiService.getInstance();
  const { toast } = useToast();

  useEffect(() => {
    setNudges(mockApi.generateNudges());
  }, []);

  const handleAccept = (nudgeId: string) => {
    setAcceptedNudges(prev => new Set(prev).add(nudgeId));
    toast({
      title: "Recommendation Accepted",
      description: "We'll implement this optimization for you.",
    });
  };

  const handleIgnore = (nudgeId: string) => {
    setIgnoredNudges(prev => new Set(prev).add(nudgeId));
    toast({
      title: "Recommendation Ignored",
      description: "You can review this later in your settings.",
      variant: "destructive",
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'reallocation':
        return <TrendingUp className="h-5 w-5 text-primary" />;
      case 'optimization':
        return <Target className="h-5 w-5 text-warning" />;
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      default:
        return <DollarSign className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'reallocation':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'optimization':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'alert':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const activeNudges = nudges.filter(n => !acceptedNudges.has(n.id) && !ignoredNudges.has(n.id));
  const totalPotentialImpact = activeNudges.reduce((sum, n) => sum + n.impact, 0);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Smart Recommendations</h1>
          <p className="text-muted-foreground">
            AI-powered insights to optimize your capital allocation and improve ROI
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Recommendations</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeNudges.length}</div>
              <p className="text-xs text-muted-foreground">Requiring your attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Potential Impact</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                ${totalPotentialImpact.toLocaleString()}
              </div>
              <p className="text-xs text-success">Monthly savings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Implemented</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{acceptedNudges.size}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {activeNudges.length > 0 
                  ? Math.round(activeNudges.reduce((sum, n) => sum + n.confidence, 0) / activeNudges.length)
                  : 0}%
              </div>
              <p className="text-xs text-success">High confidence</p>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations List */}
        <div className="space-y-4">
          {activeNudges.map((nudge) => (
            <Card key={nudge.id} className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-card opacity-50"></div>
              <CardHeader className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="p-2 rounded-lg bg-background/50">
                      {getTypeIcon(nudge.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <CardTitle className="text-lg">{nudge.title}</CardTitle>
                        <Badge className={getTypeColor(nudge.type)}>
                          {nudge.type}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{nudge.description}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4 text-success" />
                          <span className="font-medium text-success">
                            ${nudge.impact.toLocaleString()} impact
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Target className="h-4 w-4 text-primary" />
                          <span>{nudge.confidence.toFixed(0)}% confidence</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => handleAccept(nudge.id)}
                    className="flex-1"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Accept Recommendation
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleIgnore(nudge.id)}
                    className="flex-1"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Ignore for Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Accepted Recommendations */}
        {acceptedNudges.size > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-success">Recently Implemented</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {nudges
                  .filter(n => acceptedNudges.has(n.id))
                  .map(nudge => (
                    <div key={nudge.id} className="flex items-center space-x-3 p-3 bg-success/5 rounded-lg border border-success/20">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <div className="flex-1">
                        <p className="font-medium">{nudge.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Potential savings: ${nudge.impact.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeNudges.length === 0 && acceptedNudges.size === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Recommendations Available</h3>
              <p className="text-muted-foreground">
                Connect your financial accounts to start receiving AI-powered optimization suggestions.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default Recommendations;