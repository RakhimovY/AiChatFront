"use client";

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { 
  getLawyerRequest, 
  updateLawyerRequestStatus,
  assignLawyerToRequest,
  addNotesToLawyerRequest
} from '@/lib/lawyerRequestApi';
import { LawyerRequestStatus } from '@/lib/types/lawyerRequest';
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  FileText, 
  Clock, 
  Calendar, 
  UserCheck, 
  UserPlus, 
  RefreshCw, 
  Play, 
  CheckCircle2, 
  XCircle, 
  PenLine, 
  Save, 
  Loader2 
} from "lucide-react";

export default function LawyerRequestDetailPage({ params }: { params: { id: string } }) {
  const { t } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Set initial sidebar state based on screen width after component mounts
  useEffect(() => {
    setIsSidebarOpen(window.innerWidth >= 768);
  }, []);

  // Handle clicks outside the sidebar to close it on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Only close sidebar on outside clicks when it's open on mobile
      if (!isSidebarOpen || window.innerWidth >= 768) return;

      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Clean up event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header
        isMobileMenuOpen={isSidebarOpen}
        setIsMobileMenuOpen={setIsSidebarOpen}
        showThemeToggle={true}
        showUserInfo={false}
        showBackButton={true}
      />

      <div className="flex flex-1 pt-16 md:pt-20">
        {/* Sidebar container with ref for click-outside detection */}
        <aside ref={sidebarRef}>
          <Sidebar
            isMobileMenuOpen={isSidebarOpen}
            setIsMobileMenuOpen={setIsSidebarOpen}
            activePage="/lawyer-dashboard"
          />
        </aside>

        {/* Main content area */}
        <main className="flex-1 flex flex-col overflow-hidden p-3 md:ml-16">
          <div className="container max-w-4xl py-6 mx-auto">
            <div className="mb-8">
              <Link 
                href="/lawyer-dashboard" 
                className="flex items-center text-primary hover:text-primary/80 mb-4 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span>Back to Dashboard</span>
              </Link>

              <h1 className="text-3xl font-bold mb-2">Manage Request</h1>
              <p className="text-muted-foreground">
                Review and manage this lawyer consultation request.
              </p>
            </div>

            <LawyerRequestDetail requestId={params.id} />
          </div>
        </main>
      </div>
    </div>
  );
}

// Client component for the request detail
'use client';

function LawyerRequestDetail({ requestId }: { requestId: string }) {
  const router = useRouter();
  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [submittingNotes, setSubmittingNotes] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [assigning, setAssigning] = useState(false);
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

  // Handle status update
  const handleStatusUpdate = async (status: LawyerRequestStatus) => {
    if (!request) return;

    setUpdatingStatus(true);

    try {
      const response = await updateLawyerRequestStatus(requestId, status);

      if (response.success && response.data) {
        setRequest(response.data);
        toast({
          title: 'Status Updated',
          description: `Request status has been updated to ${status.replace('_', ' ')}.`,
          variant: 'default',
        });
      } else {
        toast({
          title: 'Update Failed',
          description: response.error || 'Failed to update status. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (err) {
      console.error('Error updating status:', err);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Handle assigning to self
  const handleAssignToSelf = async () => {
    if (!request) return;

    setAssigning(true);

    try {
      // In a real implementation, we would get the lawyer ID from the session
      const lawyerId = 'current-lawyer-id';

      const response = await assignLawyerToRequest(requestId, lawyerId);

      if (response.success && response.data) {
        setRequest(response.data);
        toast({
          title: 'Request Assigned',
          description: 'This request has been assigned to you.',
          variant: 'default',
        });
      } else {
        toast({
          title: 'Assignment Failed',
          description: response.error || 'Failed to assign request. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (err) {
      console.error('Error assigning request:', err);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setAssigning(false);
    }
  };

  // Handle adding notes
  const handleAddNotes = async () => {
    if (!request || !notes.trim()) return;

    setSubmittingNotes(true);

    try {
      const response = await addNotesToLawyerRequest(requestId, notes);

      if (response.success && response.data) {
        setRequest(response.data);
        setNotes('');
        toast({
          title: 'Notes Added',
          description: 'Your notes have been added to the request.',
          variant: 'default',
        });
      } else {
        toast({
          title: 'Failed to Add Notes',
          description: response.error || 'Failed to add notes. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (err) {
      console.error('Error adding notes:', err);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setSubmittingNotes(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-card rounded-lg shadow-md p-6 border animate-pulse">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <div className="h-7 bg-muted rounded w-48"></div>
            <div className="mt-2 sm:mt-0 flex items-center gap-2">
              <div className="h-6 bg-muted rounded-full w-24"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="h-4 w-4 bg-muted rounded-full mt-0.5"></div>
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-24 mb-2"></div>
                  <div className="h-5 bg-muted rounded w-full"></div>
                </div>
              </div>
            ))}

            <div className="md:col-span-2 flex items-start gap-2">
              <div className="h-4 w-4 bg-muted rounded-full mt-0.5"></div>
              <div className="flex-1">
                <div className="h-4 bg-muted rounded w-24 mb-2"></div>
                <div className="h-24 bg-muted rounded w-full"></div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="h-6 bg-muted rounded w-24 mb-4"></div>

            <div className="space-y-6">
              <div className="bg-muted/30 p-4 rounded-lg border">
                <div className="h-5 bg-muted rounded w-32 mb-3"></div>
                <div className="h-9 bg-muted rounded w-40"></div>
              </div>

              <div className="bg-muted/30 p-4 rounded-lg border">
                <div className="h-5 bg-muted rounded w-32 mb-3"></div>
                <div className="flex flex-wrap gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-8 bg-muted rounded w-24"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <div className="h-9 bg-muted rounded w-36"></div>
          <div className="h-9 bg-muted rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md border border-red-200">
        <h3 className="text-lg font-semibold text-red-600 mb-2">Error</h3>
        <p className="text-gray-700 mb-4">{error}</p>
        <Button onClick={() => router.push('/lawyer-dashboard')}>
          Return to Dashboard
        </Button>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md border border-yellow-200">
        <h3 className="text-lg font-semibold text-yellow-600 mb-2">Request Not Found</h3>
        <p className="text-gray-700 mb-4">The requested consultation could not be found.</p>
        <Button onClick={() => router.push('/lawyer-dashboard')}>
          Return to Dashboard
        </Button>
      </div>
    );
  }

  const isAssigned = !!request.assignedLawyerId;
  const canTakeAction = request.status !== 'completed' && request.status !== 'cancelled';

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg shadow-md p-6 border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Client Request</h2>
          <div className="mt-2 sm:mt-0 flex items-center gap-2">
            <Badge 
              variant={
                request.status === 'pending' ? 'outline' :
                request.status === 'in_progress' ? 'secondary' :
                request.status === 'completed' ? 'default' :
                'outline'
              }
              className={
                request.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                request.status === 'in_progress' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                request.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' :
                'bg-muted text-muted-foreground'
              }
            >
              {request.status.replace('_', ' ').toUpperCase()}
            </Badge>
            {request.urgency === 'urgent' && (
              <Badge variant="destructive">
                URGENT
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex items-start gap-2">
            <User className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Client Name</h3>
              <p>{request.clientName}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Contact Email</h3>
              <p>{request.clientEmail}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Contact Phone</h3>
              <p>{request.clientPhone}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Problem Type</h3>
              <p>{request.problemType}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Preferred Contact Time</h3>
              <p>{request.preferredContactTime}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Created At</h3>
              <p>{new Date(request.createdAt).toLocaleString()}</p>
            </div>
          </div>

          <div className="md:col-span-2 flex items-start gap-2">
            <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
              <p className="whitespace-pre-line mt-1 p-3 bg-muted/50 rounded-md">{request.description}</p>
            </div>
          </div>

          {request.notes && (
            <div className="md:col-span-2 flex items-start gap-2">
              <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Additional Notes</h3>
                <p className="whitespace-pre-line mt-1 p-3 bg-muted/50 rounded-md">{request.notes}</p>
              </div>
            </div>
          )}
        </div>

        {canTakeAction && (
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-3">Actions</h3>

            <div className="space-y-6">
              {!isAssigned && (
                <div className="bg-muted/30 p-4 rounded-lg border">
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-primary" />
                    <span>Assignment</span>
                  </h4>
                  <Button 
                    onClick={handleAssignToSelf}
                    disabled={assigning}
                    className="w-full sm:w-auto flex items-center gap-2"
                  >
                    {assigning ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Assigning...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4" />
                        <span>Assign to Myself</span>
                      </>
                    )}
                  </Button>
                </div>
              )}

              <div className="bg-muted/30 p-4 rounded-lg border">
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-primary" />
                  <span>Update Status</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={request.status === 'pending' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusUpdate('pending')}
                    disabled={updatingStatus || request.status === 'pending'}
                    className="flex items-center gap-1"
                  >
                    <Clock className="h-3.5 w-3.5" />
                    <span>Pending</span>
                  </Button>
                  <Button
                    variant={request.status === 'in_progress' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusUpdate('in_progress')}
                    disabled={updatingStatus || request.status === 'in_progress'}
                    className="flex items-center gap-1"
                  >
                    <Play className="h-3.5 w-3.5" />
                    <span>In Progress</span>
                  </Button>
                  <Button
                    variant={request.status === 'completed' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusUpdate('completed')}
                    disabled={updatingStatus || request.status === 'completed'}
                    className="flex items-center gap-1"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Completed</span>
                  </Button>
                  <Button
                    variant={request.status === 'cancelled' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusUpdate('cancelled')}
                    disabled={updatingStatus || request.status === 'cancelled'}
                    className="flex items-center gap-1"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    <span>Cancelled</span>
                  </Button>
                </div>
              </div>

              <div className="bg-muted/30 p-4 rounded-lg border">
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <PenLine className="h-4 w-4 text-primary" />
                  <span>Add Notes</span>
                </h4>
                <Textarea
                  placeholder="Add notes about this case..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[100px] mb-3"
                />
                <Button 
                  onClick={handleAddNotes} 
                  disabled={!notes.trim() || submittingNotes}
                  className="flex items-center gap-2"
                >
                  {submittingNotes ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Add Notes</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Button
          variant="outline"
          onClick={() => router.push('/lawyer-dashboard')}
          className="flex items-center gap-2 order-2 sm:order-1 w-full sm:w-auto"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Button>

        {canTakeAction && (
          <Button
            onClick={() => window.location.href = `mailto:${request.clientEmail}`}
            className="flex items-center gap-2 order-1 sm:order-2 w-full sm:w-auto"
          >
            <Mail className="h-4 w-4" />
            <span>Contact Client</span>
          </Button>
        )}
      </div>
    </div>
  );
}
