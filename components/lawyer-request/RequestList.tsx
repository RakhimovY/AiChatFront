'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  LawyerRequest, 
  LawyerRequestStatus 
} from '@/lib/types/lawyerRequest';
import { getLawyerRequests } from '@/lib/lawyerRequestApi';

// Status badge colors
const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-800',
};

interface RequestListProps {
  initialStatus?: LawyerRequestStatus;
  showFilters?: boolean;
  maxItems?: number;
  isLawyerView?: boolean;
}

export default function RequestList({ 
  initialStatus, 
  showFilters = true, 
  maxItems,
  isLawyerView = false
}: RequestListProps) {
  const router = useRouter();
  const [requests, setRequests] = useState<LawyerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<LawyerRequestStatus | 'all'>(initialStatus || 'all');
  const [selectedUrgency, setSelectedUrgency] = useState<'all' | 'normal' | 'urgent'>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Fetch lawyer requests
  useEffect(() => {
    async function fetchRequests() {
      setLoading(true);
      setError(null);
      
      try {
        const params: any = {
          page,
          limit: maxItems || 10,
        };
        
        if (selectedStatus !== 'all') {
          params.status = selectedStatus;
        }
        
        if (selectedUrgency !== 'all') {
          params.urgency = selectedUrgency;
        }
        
        const response = await getLawyerRequests(params);
        
        if (response.success && response.data) {
          setRequests(response.data);
          
          // Calculate total pages
          if (response.total && response.limit) {
            setTotalPages(Math.ceil(response.total / response.limit));
          }
        } else {
          setError(response.error || 'Failed to fetch requests');
        }
      } catch (err) {
        console.error('Error fetching lawyer requests:', err);
        setError('An unexpected error occurred. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchRequests();
  }, [selectedStatus, selectedUrgency, page, maxItems]);
  
  // Handle status filter change
  const handleStatusChange = (status: LawyerRequestStatus | 'all') => {
    setSelectedStatus(status);
    setPage(1); // Reset to first page when filter changes
  };
  
  // Handle urgency filter change
  const handleUrgencyChange = (urgency: 'all' | 'normal' | 'urgent') => {
    setSelectedUrgency(urgency);
    setPage(1); // Reset to first page when filter changes
  };
  
  // Handle view request
  const handleViewRequest = (id: string) => {
    router.push(`/lawyer-request/status/${id}`);
  };
  
  // Handle take action (for lawyer view)
  const handleTakeAction = (id: string) => {
    router.push(`/lawyer-dashboard/request/${id}`);
  };
  
  if (loading && requests.length === 0) {
    return (
      <div className="space-y-4">
        {showFilters && (
          <div className="flex flex-wrap gap-2 mb-4 animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-24"></div>
            <div className="h-10 bg-gray-200 rounded w-24"></div>
            <div className="h-10 bg-gray-200 rounded w-24"></div>
          </div>
        )}
        
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 border rounded-lg animate-pulse">
            <div className="flex justify-between mb-2">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-10 bg-gray-200 rounded w-24 mt-4"></div>
          </div>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md border border-red-200">
        <h3 className="text-lg font-semibold text-red-600 mb-2">Error</h3>
        <p className="text-gray-700 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }
  
  if (requests.length === 0) {
    return (
      <div>
        {showFilters && (
          <div className="flex flex-wrap gap-2 mb-6">
            <StatusFilter 
              selectedStatus={selectedStatus} 
              onChange={handleStatusChange} 
            />
            <UrgencyFilter 
              selectedUrgency={selectedUrgency} 
              onChange={handleUrgencyChange} 
            />
          </div>
        )}
        
        <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200 text-center">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Requests Found</h3>
          <p className="text-gray-700 mb-4">
            {selectedStatus !== 'all' || selectedUrgency !== 'all'
              ? 'Try changing your filters to see more requests.'
              : 'There are no lawyer consultation requests available.'}
          </p>
          {!isLawyerView && (
            <Button onClick={() => router.push('/lawyer-request')}>
              Create New Request
            </Button>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div>
      {showFilters && (
        <div className="flex flex-wrap gap-2 mb-6">
          <StatusFilter 
            selectedStatus={selectedStatus} 
            onChange={handleStatusChange} 
          />
          <UrgencyFilter 
            selectedUrgency={selectedUrgency} 
            onChange={handleUrgencyChange} 
          />
        </div>
      )}
      
      <div className="space-y-4">
        {requests.map((request) => (
          <div key={request.id} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
              <h3 className="font-medium">
                {isLawyerView ? request.clientName : `Request #${request.id}`}
              </h3>
              <div className="flex items-center mt-2 sm:mt-0">
                {request.urgency === 'urgent' && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded mr-2">
                    URGENT
                  </span>
                )}
                <span className={`px-2 py-1 rounded text-xs font-medium ${STATUS_COLORS[request.status]}`}>
                  {request.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Problem:</span> {request.problemType}
            </p>
            <p className="text-sm text-gray-600 mb-3">
              <span className="font-medium">Created:</span> {new Date(request.createdAt).toLocaleDateString()}
            </p>
            
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                {isLawyerView 
                  ? `Contact: ${request.clientPhone}`
                  : request.assignedLawyerId 
                    ? `Assigned to: ${request.assignedLawyerId}` 
                    : 'Not yet assigned'
                }
              </p>
              
              <Button 
                size="sm"
                onClick={() => isLawyerView 
                  ? handleTakeAction(request.id) 
                  : handleViewRequest(request.id)
                }
              >
                {isLawyerView ? 'Take Action' : 'View Details'}
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            
            <div className="flex items-center px-4">
              Page {page} of {totalPages}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Status filter component
function StatusFilter({ 
  selectedStatus, 
  onChange 
}: { 
  selectedStatus: LawyerRequestStatus | 'all';
  onChange: (status: LawyerRequestStatus | 'all') => void;
}) {
  return (
    <div className="flex flex-wrap gap-1">
      <Button
        size="sm"
        variant={selectedStatus === 'all' ? 'default' : 'outline'}
        onClick={() => onChange('all')}
      >
        All
      </Button>
      <Button
        size="sm"
        variant={selectedStatus === 'pending' ? 'default' : 'outline'}
        onClick={() => onChange('pending')}
      >
        Pending
      </Button>
      <Button
        size="sm"
        variant={selectedStatus === 'in_progress' ? 'default' : 'outline'}
        onClick={() => onChange('in_progress')}
      >
        In Progress
      </Button>
      <Button
        size="sm"
        variant={selectedStatus === 'completed' ? 'default' : 'outline'}
        onClick={() => onChange('completed')}
      >
        Completed
      </Button>
      <Button
        size="sm"
        variant={selectedStatus === 'cancelled' ? 'default' : 'outline'}
        onClick={() => onChange('cancelled')}
      >
        Cancelled
      </Button>
    </div>
  );
}

// Urgency filter component
function UrgencyFilter({ 
  selectedUrgency, 
  onChange 
}: { 
  selectedUrgency: 'all' | 'normal' | 'urgent';
  onChange: (urgency: 'all' | 'normal' | 'urgent') => void;
}) {
  return (
    <div className="flex flex-wrap gap-1">
      <Button
        size="sm"
        variant={selectedUrgency === 'all' ? 'default' : 'outline'}
        onClick={() => onChange('all')}
      >
        All Urgency
      </Button>
      <Button
        size="sm"
        variant={selectedUrgency === 'normal' ? 'default' : 'outline'}
        onClick={() => onChange('normal')}
      >
        Normal
      </Button>
      <Button
        size="sm"
        variant={selectedUrgency === 'urgent' ? 'default' : 'outline'}
        onClick={() => onChange('urgent')}
      >
        Urgent
      </Button>
    </div>
  );
}