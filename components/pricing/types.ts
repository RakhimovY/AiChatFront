/**
 * Type definitions for the pricing components
 */

export type PlanFeature = {
  name: string;
  included: boolean;
};

export type Plan = {
  id: string;
  name: string;
  price: number;
  description: string;
  features: PlanFeature[];
  popular?: boolean;
};