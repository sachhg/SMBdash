import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, ExternalLink } from "lucide-react";
import { MockApiService } from "@/services/mockApi";
import { useToast } from "@/hooks/use-toast";

interface ConnectButtonProps {
  source: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  onConnect: () => void;
}

export function ConnectButton({ source, title, description, icon, onConnect }: ConnectButtonProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();
  const mockApi = MockApiService.getInstance();

  const handleConnect = async () => {
    setIsConnecting(true);
    
    try {
      const result = await mockApi.connectSource(source);
      
      if (result.success) {
        setIsConnected(true);
        onConnect();
        
        toast({
          title: "Connection Successful",
          description: result.message,
        });
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-financial">
      <div className="absolute inset-0 bg-gradient-card opacity-50"></div>
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/10">
              {icon}
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
          {isConnected && (
            <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
              <CheckCircle className="w-3 h-3 mr-1" />
              Connected
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="relative">
        <Button
          onClick={handleConnect}
          disabled={isConnecting || isConnected}
          className="w-full"
          variant={isConnected ? "secondary" : "default"}
        >
          {isConnecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isConnected ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Connected
            </>
          ) : (
            <>
              <ExternalLink className="mr-2 h-4 w-4" />
              Connect {title}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}