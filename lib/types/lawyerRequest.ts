// Type definitions for the lawyer request system

export type LawyerRequestStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type LawyerRequestUrgency = 'normal' | 'urgent';

export interface LawyerRequest {
  id: string;
  userId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  problemType: string;
  description: string;
  preferredContactTime: string;
  urgency: LawyerRequestUrgency;
  status: LawyerRequestStatus;
  createdAt: Date;
  updatedAt: Date;
  assignedLawyerId?: string;
  notes?: string;
}

// Zod schema for validating lawyer requests
import { z } from 'zod';

export const lawyerRequestSchema = z.object({
  clientName: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  clientEmail: z.string().email({ message: 'Invalid email address' }),
  clientPhone: z.string().min(10, { message: 'Phone number must be at least 10 characters' }),
  problemType: z.string().min(1, { message: 'Please select a problem type' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  preferredContactTime: z.string().min(1, { message: 'Please select a preferred contact time' }),
  urgency: z.enum(['normal', 'urgent'], { 
    required_error: 'Please select urgency',
    invalid_type_error: 'Urgency must be either normal or urgent'
  }),
});

export type LawyerRequestFormData = z.infer<typeof lawyerRequestSchema>;

// Type for the response from the API
export interface LawyerRequestResponse {
  success: boolean;
  data?: LawyerRequest;
  error?: string;
}

// Type for the list response from the API
export interface LawyerRequestListResponse {
  success: boolean;
  data?: LawyerRequest[];
  error?: string;
  total?: number;
  page?: number;
  limit?: number;
}