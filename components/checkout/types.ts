/**
 * Type definitions for the checkout components
 */

export type Plan = {
  id: string;
  name: string;
  price: number;
  description: string;
};

export type FormData = {
  name: string;
  email: string;
  cardNumber: string;
  expiryDate: string;
  cvc: string;
};