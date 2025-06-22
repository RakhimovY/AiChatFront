'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { 
  LawyerRequest, 
  LawyerRequestStatus 
} from '@/lib/types/lawyerRequest';
import { 
  getLawyerRequest, 
  cancelLawyerRequest,
  addNotesToLawyerRequest 
} from '@/lib/lawyerRequestApi';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Loader2, 
  XCircle,
  AlertTriangle,
  FileText,
  Calendar,
  Phone,
  Mail,
  User,
  Clock4
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

// Status configurations
const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    description: 'Your request is pending review by our legal team.',
    icon: Clock,
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    badgeVariant: 'outline',
  },
  in_progress: {
    label: 'In Progress',
    description: 'A lawyer has been assigned to your case and is working on it.',
    icon: CheckCircle2,
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    badgeVariant: 'secondary',
  },
  completed: {
    label: 'Completed',
    description: 'Your legal consultation has been completed.',
    icon: CheckCircle2,
    color: 'bg-green-100 text-green-800 border-green-200',
    badgeVariant: 'default',
  },
  cancelled: {
    label: 'Cancelled',
    description: 'This request has been cancelled.',
    icon: XCircle,
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    badgeVariant: 'outline',
  },
};

interface RequestStatusCardProps {
  requestId: string;
}

export default function RequestStatusCard({ requestId }: RequestStatusCardProps) {
  const router = useRouter();
  const [request, setRequest] = useState<LawyerRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [submittingInfo, setSubmittingInfo] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const { toast } = useToast();

  // Fetch the lawyer request
  useEffect(() => {
    async function fetchRequest() {
      setLoading(true);
      setError(null);

      try {
        const response = await getLawyerRequest(requestId);

        if (response.success && response.data) {
          setRequest(response.data);
        } else {
          setError(response.error || 'Failed to fetch request details');
        }
      } catch (err) {
        console.error('Error fetching lawyer request:', err);
        setError('An unexpected error occurred. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchRequest();
  }, [requestId]);

  // Handle adding additional information
  const handleAddInfo = async () => {
    if (!additionalInfo.trim()) return;

    setSubmittingInfo(true);

    try {
      const response = await addNotesToLawyerRequest(requestId, additionalInfo);

      if (response.success && response.data) {
        setRequest(response.data);
        setAdditionalInfo('');
        toast({
          title: 'Information Added',
          description: 'Your additional information has been added to the request.',
          variant: 'default',
        });
      } else {
        toast({
          title: 'Failed to Add Information',
          description: response.error || 'Failed to add information. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (err) {
      console.error('Error adding information:', err);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setSubmittingInfo(false);
    }
  };

  // Handle cancelling the request
  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this request?')) return;

    setCancelling(true);

    try {
      const response = await cancelLawyerRequest(requestId);

      if (response.success) {
        toast({
          title: 'Request Cancelled',
          description: 'Your lawyer consultation request has been cancelled.',
          variant: 'default',
        });

        // Refresh the request data
        const updatedResponse = await getLawyerRequest(requestId);
        if (updatedResponse.success && updatedResponse.data) {
          setRequest(updatedResponse.data);
        }
      } else {
        toast({
          title: 'Cancellation Failed',
          description: response.error || 'Failed to cancel your request. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (err) {
      console.error('Error cancelling request:', err);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full mt-2" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={i >= 4 ? "md:col-span-2" : ""}>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-32" />
        </CardFooter>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error}
          <div className="mt-4">
            <Button onClick={() => router.push('/lawyer-request')}>
              Create New Request
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (!request) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Request Not Found</AlertTitle>
        <AlertDescription>
          The requested lawyer consultation could not be found.
          <div className="mt-4">
            <Button onClick={() => router.push('/lawyer-request')}>
              Create New Request
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  const statusConfig = STATUS_CONFIG[request.status] || STATUS_CONFIG.pending;
  const StatusIcon = statusConfig.icon;
  const canCancel = request.status === 'pending' || request.status === 'in_progress';
  const formattedDate = new Date(request.createdAt).toLocaleString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center">
              <StatusIcon className="h-5 w-5 mr-2 text-primary" />
              <CardTitle>Request #{request.id}</CardTitle>
            </div>
            <Badge 
              variant={statusConfig.badgeVariant as any} 
              className={cn("text-sm font-medium", statusConfig.color)}
            >
              {statusConfig.label}
            </Badge>
          </div>
          <CardDescription className="mt-2">
            {statusConfig.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-2">
              <User className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Client Name</h3>
                <p className="text-foreground">{request.clientName}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Contact Email</h3>
                <p className="text-foreground">{request.clientEmail}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Contact Phone</h3>
                <p className="text-foreground">{request.clientPhone}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Problem Type</h3>
                <p className="text-foreground">{request.problemType}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock4 className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Preferred Contact Time</h3>
                <p className="text-foreground">{request.preferredContactTime}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Urgency</h3>
                <p className="text-foreground capitalize">
                  {request.urgency === 'urgent' ? (
                    <Badge variant="destructive" className="mt-1">Urgent</Badge>
                  ) : (
                    'Normal'
                  )}
                </p>
              </div>
            </div>

            <div className="md:col-span-2 flex items-start gap-2">
              <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                <p className="text-foreground whitespace-pre-line mt-1 p-3 bg-muted/50 rounded-md">
                  {request.description}
                </p>
              </div>
            </div>

            {request.assignedLawyerId && (
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Assigned Lawyer</h3>
                  <p className="text-foreground">{request.assignedLawyerId}</p>
                </div>
              </div>
            )}

            {request.notes && (
              <div className="md:col-span-2 flex items-start gap-2">
                <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Additional Notes</h3>
                  <p className="text-foreground whitespace-pre-line mt-1 p-3 bg-muted/50 rounded-md">
                    {request.notes}
                  </p>
                </div>
              </div>
            )}

            <div className="md:col-span-2 flex items-start gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Created At</h3>
                <p className="text-foreground">{formattedDate}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {request.status !== 'cancelled' && request.status !== 'completed' && (
        <Card>
          <CardHeader>
            <CardTitle>Add Additional Information</CardTitle>
            <CardDescription>
              Provide any additional details that might help with your case.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Add any additional information about your case here..."
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              className="min-h-[120px]"
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button 
              onClick={handleAddInfo} 
              disabled={!additionalInfo.trim() || submittingInfo}
            >
              {submittingInfo ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Additional Information'
              )}
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => router.push('/lawyer-request')}
        >
          Back to Requests
        </Button>

        {canCancel && (
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={cancelling}
          >
            {cancelling ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cancelling...
              </>
            ) : (
              'Cancel Request'
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
