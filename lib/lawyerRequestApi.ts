import api from './api';
import { 
  LawyerRequest, 
  LawyerRequestFormData, 
  LawyerRequestResponse, 
  LawyerRequestListResponse,
  LawyerRequestStatus
} from './types/lawyerRequest';

/**
 * Creates a new lawyer request
 */
export async function createLawyerRequest(data: LawyerRequestFormData): Promise<LawyerRequestResponse> {
  try {
    const response = await api.post('/lawyer-requests', data);
    return response.data;
  } catch (error: any) {
    console.error('Error creating lawyer request:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to create lawyer request'
    };
  }
}

/**
 * Retrieves a specific lawyer request by ID
 */
export async function getLawyerRequest(id: string): Promise<LawyerRequestResponse> {
  try {
    const response = await api.get(`/lawyer-requests/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching lawyer request ${id}:`, error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to fetch lawyer request'
    };
  }
}

/**
 * Updates a specific lawyer request by ID
 */
export async function updateLawyerRequest(
  id: string, 
  data: Partial<LawyerRequestFormData> & { 
    status?: LawyerRequestStatus;
    assignedLawyerId?: string;
    notes?: string;
  }
): Promise<LawyerRequestResponse> {
  try {
    const response = await api.put(`/lawyer-requests/${id}`, data);
    return response.data;
  } catch (error: any) {
    console.error(`Error updating lawyer request ${id}:`, error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to update lawyer request'
    };
  }
}

/**
 * Cancels a specific lawyer request by ID
 */
export async function cancelLawyerRequest(id: string): Promise<LawyerRequestResponse> {
  try {
    const response = await api.delete(`/lawyer-requests/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error cancelling lawyer request ${id}:`, error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to cancel lawyer request'
    };
  }
}

/**
 * Retrieves a list of lawyer requests with optional filtering
 */
export async function getLawyerRequests(params?: {
  status?: LawyerRequestStatus;
  urgency?: 'normal' | 'urgent';
  page?: number;
  limit?: number;
}): Promise<LawyerRequestListResponse> {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.status) {
      queryParams.append('status', params.status);
    }
    
    if (params?.urgency) {
      queryParams.append('urgency', params.urgency);
    }
    
    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }
    
    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    
    const url = `/lawyer-requests${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await api.get(url);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching lawyer requests:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to fetch lawyer requests'
    };
  }
}

/**
 * Updates the status of a lawyer request
 */
export async function updateLawyerRequestStatus(
  id: string, 
  status: LawyerRequestStatus
): Promise<LawyerRequestResponse> {
  return updateLawyerRequest(id, { status });
}

/**
 * Assigns a lawyer to a request
 */
export async function assignLawyerToRequest(
  requestId: string, 
  lawyerId: string
): Promise<LawyerRequestResponse> {
  return updateLawyerRequest(requestId, { 
    assignedLawyerId: lawyerId,
    status: 'in_progress'
  });
}

/**
 * Adds notes to a lawyer request
 */
export async function addNotesToLawyerRequest(
  id: string, 
  notes: string
): Promise<LawyerRequestResponse> {
  return updateLawyerRequest(id, { notes });
}