'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RequestList } from '@/components/lawyer-request';
import { LawyerRequestStatus } from '@/lib/types/lawyerRequest';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Search, 
  Clock, 
  AlertTriangle, 
  UserCheck, 
  CheckCircle2, 
  Timer, 
  ThumbsUp, 
  ArrowRight, 
  XCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function LawyerDashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Lawyer Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage and respond to client legal consultation requests</p>
        </div>

        <div className="w-full sm:w-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by client name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 pl-9"
          />
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Request Management</CardTitle>
          <CardDescription>
            View and manage all lawyer consultation requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="all" className="flex items-center gap-1">
                All
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                Pending
              </TabsTrigger>
              <TabsTrigger value="in_progress" className="flex items-center gap-1">
                <UserCheck className="h-3.5 w-3.5" />
                In Progress
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Completed
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="flex items-center gap-1">
                <XCircle className="h-3.5 w-3.5" />
                Cancelled
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <RequestList 
                showFilters={false} 
                isLawyerView={true}
              />
            </TabsContent>

            <TabsContent value="pending">
              <RequestList 
                initialStatus="pending" 
                showFilters={false} 
                isLawyerView={true}
              />
            </TabsContent>

            <TabsContent value="in_progress">
              <RequestList 
                initialStatus="in_progress" 
                showFilters={false} 
                isLawyerView={true}
              />
            </TabsContent>

            <TabsContent value="completed">
              <RequestList 
                initialStatus="completed" 
                showFilters={false} 
                isLawyerView={true}
              />
            </TabsContent>

            <TabsContent value="cancelled">
              <RequestList 
                initialStatus="cancelled" 
                showFilters={false} 
                isLawyerView={true}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and filtered views for faster access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <ActionCard 
                  title="Pending Requests" 
                  description="View and process new client requests"
                  actionText="View Pending"
                  icon={Clock}
                  status="pending"
                  color="text-yellow-600"
                />
                <ActionCard 
                  title="Urgent Cases" 
                  description="High priority cases requiring immediate attention"
                  actionText="View Urgent"
                  icon={AlertTriangle}
                  urgency="urgent"
                  color="text-red-600"
                />
                <ActionCard 
                  title="My Assigned Cases" 
                  description="Cases currently assigned to you"
                  actionText="View My Cases"
                  icon={UserCheck}
                  assigned={true}
                  color="text-blue-600"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>
                Your activity and response metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <StatCard 
                title="Completed Cases" 
                value="0" 
                change="+0%" 
                positive={true}
                icon={CheckCircle2}
              />
              <StatCard 
                title="Average Response Time" 
                value="N/A" 
                change="0%" 
                positive={false}
                icon={Timer}
              />
              <StatCard 
                title="Client Satisfaction" 
                value="N/A" 
                change="0%" 
                positive={true}
                icon={ThumbsUp}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Action card component
interface ActionCardProps {
  title: string;
  description: string;
  actionText: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: string;
  status?: LawyerRequestStatus;
  urgency?: 'normal' | 'urgent';
  assigned?: boolean;
}

function ActionCard({ 
  title, 
  description, 
  actionText,
  icon: Icon,
  color = "text-primary",
  status,
  urgency,
  assigned
}: ActionCardProps) {
  // This would be implemented to filter the requests based on the props
  const handleAction = () => {
    // In a real implementation, this would navigate to a filtered view
    console.log('Action clicked', { status, urgency, assigned });
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Icon className={cn("h-5 w-5", color)} />
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="min-h-[40px]">
          {description}
        </CardDescription>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          size="sm" 
          variant="outline"
          onClick={handleAction}
          className="w-full flex items-center justify-center gap-1"
        >
          {actionText}
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </CardFooter>
    </Card>
  );
}

// Stat card component
interface StatCardProps {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ComponentType<{ className?: string }>;
}

function StatCard({ title, value, change, positive, icon: Icon }: StatCardProps) {
  const TrendIcon = positive ? TrendingUp : TrendingDown;

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
      <div className={cn(
        "p-2 rounded-full",
        positive ? "bg-green-100" : "bg-red-100"
      )}>
        <Icon className={cn(
          "h-5 w-5",
          positive ? "text-green-600" : "text-red-600"
        )} />
      </div>

      <div className="flex-1">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="flex items-baseline gap-2">
          <p className="text-xl font-semibold">{value}</p>
          <div className="flex items-center text-xs font-medium">
            <TrendIcon className={cn(
              "h-3 w-3 mr-0.5",
              positive ? "text-green-600" : "text-red-600"
            )} />
            <span className={positive ? "text-green-600" : "text-red-600"}>
              {change}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
