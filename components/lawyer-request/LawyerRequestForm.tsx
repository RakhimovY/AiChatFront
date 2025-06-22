'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { 
  LawyerRequestFormData, 
  lawyerRequestSchema 
} from '@/lib/types/lawyerRequest';
import { createLawyerRequest } from '@/lib/lawyerRequestApi';
import { cn } from '@/lib/utils';

// Problem types for the dropdown
const PROBLEM_TYPES = [
  { value: 'contract_dispute', label: 'Contract Dispute' },
  { value: 'family_law', label: 'Family Law' },
  { value: 'criminal_defense', label: 'Criminal Defense' },
  { value: 'personal_injury', label: 'Personal Injury' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'intellectual_property', label: 'Intellectual Property' },
  { value: 'employment_law', label: 'Employment Law' },
  { value: 'tax_law', label: 'Tax Law' },
  { value: 'immigration', label: 'Immigration' },
  { value: 'other', label: 'Other' },
];

// Preferred contact times for the dropdown
const CONTACT_TIMES = [
  { value: 'morning', label: 'Morning (8am - 12pm)' },
  { value: 'afternoon', label: 'Afternoon (12pm - 5pm)' },
  { value: 'evening', label: 'Evening (5pm - 9pm)' },
  { value: 'any', label: 'Any time' },
];

export default function LawyerRequestForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    control,
  } = useForm<LawyerRequestFormData>({
    resolver: zodResolver(lawyerRequestSchema),
    defaultValues: {
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      problemType: '',
      description: '',
      preferredContactTime: '',
      urgency: 'normal',
    },
  });

  const onSubmit = async (data: LawyerRequestFormData) => {
    setIsSubmitting(true);

    try {
      const response = await createLawyerRequest(data);

      if (response.success && response.data) {
        toast({
          title: 'Request Submitted',
          description: 'Your lawyer consultation request has been submitted successfully.',
          variant: 'default',
        });

        // Redirect to the status page
        router.push(`/lawyer-request/status/${response.data.id}`);
      } else {
        toast({
          title: 'Submission Failed',
          description: response.error || 'Failed to submit your request. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error submitting lawyer request:', error);
      toast({
        title: 'Submission Error',
        description: 'An unexpected error occurred. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Please provide your contact details so we can reach you about your case.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="clientName" className="text-base">
                Full Name
              </Label>
              <Input
                id="clientName"
                placeholder="Enter your full name"
                {...register('clientName')}
                className={cn(
                  "mt-1.5",
                  errors.clientName && "border-destructive focus-visible:ring-destructive"
                )}
                aria-invalid={errors.clientName ? "true" : "false"}
                aria-describedby={errors.clientName ? "clientName-error" : undefined}
              />
              {errors.clientName && (
                <p id="clientName-error" className="text-destructive text-sm mt-1.5">
                  {errors.clientName.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="clientEmail" className="text-base">
                Email Address
              </Label>
              <Input
                id="clientEmail"
                type="email"
                placeholder="Enter your email address"
                {...register('clientEmail')}
                className={cn(
                  "mt-1.5",
                  errors.clientEmail && "border-destructive focus-visible:ring-destructive"
                )}
                aria-invalid={errors.clientEmail ? "true" : "false"}
                aria-describedby={errors.clientEmail ? "clientEmail-error" : undefined}
              />
              {errors.clientEmail && (
                <p id="clientEmail-error" className="text-destructive text-sm mt-1.5">
                  {errors.clientEmail.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="clientPhone" className="text-base">
                Phone Number
              </Label>
              <Input
                id="clientPhone"
                placeholder="Enter your phone number"
                {...register('clientPhone')}
                className={cn(
                  "mt-1.5",
                  errors.clientPhone && "border-destructive focus-visible:ring-destructive"
                )}
                aria-invalid={errors.clientPhone ? "true" : "false"}
                aria-describedby={errors.clientPhone ? "clientPhone-error" : undefined}
              />
              {errors.clientPhone && (
                <p id="clientPhone-error" className="text-destructive text-sm mt-1.5">
                  {errors.clientPhone.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Case Details</CardTitle>
          <CardDescription>
            Tell us about your legal issue so we can match you with the right lawyer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="problemType" className="text-base">
                Type of Legal Problem
              </Label>
              <Select
                id="problemType"
                placeholder="Select the type of legal problem"
                options={PROBLEM_TYPES}
                {...register('problemType')}
                onChange={(value) => setValue('problemType', value)}
                value={watch('problemType')}
                error={errors.problemType?.message}
                className="mt-1.5"
              />
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="description" className="text-base">
                Description of Your Situation
              </Label>
              <Textarea
                id="description"
                placeholder="Please describe your legal situation in detail"
                {...register('description')}
                className={cn(
                  "min-h-[150px] mt-1.5",
                  errors.description && "border-destructive focus-visible:ring-destructive"
                )}
                aria-invalid={errors.description ? "true" : "false"}
                aria-describedby={errors.description ? "description-error" : undefined}
              />
              {errors.description && (
                <p id="description-error" className="text-destructive text-sm mt-1.5">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Preferences</CardTitle>
          <CardDescription>
            Let us know when and how urgently you need to be contacted.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="preferredContactTime" className="text-base">
                Preferred Contact Time
              </Label>
              <Select
                id="preferredContactTime"
                placeholder="Select your preferred contact time"
                options={CONTACT_TIMES}
                {...register('preferredContactTime')}
                onChange={(value) => setValue('preferredContactTime', value)}
                value={watch('preferredContactTime')}
                error={errors.preferredContactTime?.message}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label className="text-base mb-1.5 block">Urgency</Label>
              <RadioGroup 
                defaultValue="normal"
                onValueChange={(value) => setValue('urgency', value as 'normal' | 'urgent')}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="normal" id="urgency-normal" />
                  <Label htmlFor="urgency-normal" className="cursor-pointer">Normal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="urgent" id="urgency-urgent" />
                  <Label htmlFor="urgency-urgent" className="cursor-pointer">Urgent</Label>
                </div>
              </RadioGroup>
              {errors.urgency && (
                <p className="text-destructive text-sm mt-1.5">{errors.urgency.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Request'
          )}
        </Button>
      </div>
    </form>
  );
}
