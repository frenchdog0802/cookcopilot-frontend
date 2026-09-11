import { api } from './client';

export interface UsageSummary {
  aiMessagesUsed: number;
  aiMessagesLimit: number;
  recipeImportsUsed: number;
  recipeImportsLimit: number;
  recipeCount: number;
  recipeLimit: number;
  imageUploadsUsed: number;
  imageUploadsLimit: number;
}

export interface SubscriptionStatus {
  isPro: boolean;
  isTrial: boolean;
  trialEndsAt?: number;
  expiresAt?: number;
  productId?: string;
  planName?: string;
  usage: UsageSummary;
}

export interface TierComparison {
  aiMessagesPerDay: number;
  recipeImportsPerMonth: number;
  maxRecipes: number;
  imageUploadsPerMonth: number;
}

export interface Plan {
  name: string;
  billingPeriod: string;
  priceCents: number;
  currency: string;
  priceDisplay: string;
  productIdIos: string;
  productIdAndroid: string;
}

export interface PlansResponse {
  plans: Plan[];
  free: TierComparison;
  pro: TierComparison;
  trialDays: number;
  stripeCheckoutEnabled: boolean;
}

function unwrap<T>(response: { success: boolean; message?: string; data?: T }): T {
  if (!response.success || response.data === undefined) {
    throw new Error(response.message ?? 'Subscription request failed');
  }
  return response.data;
}

export const subscriptionApi = {
  getPlans: async (): Promise<PlansResponse> => {
    const response = await api.get<PlansResponse>('/api/subscription/plans');
    return unwrap(response);
  },

  getStatus: async (): Promise<SubscriptionStatus> => {
    const response = await api.get<SubscriptionStatus>('/api/subscription/status');
    return unwrap(response);
  },

  syncPurchase: async (payload: { productId: string; transactionId: string; platform: string }) => {
    const response = await api.post<{ success: boolean; status: SubscriptionStatus }>(
      '/api/subscription/sync',
      payload,
    );
    return unwrap(response);
  },

  createCheckout: async (billingPeriod: 'monthly' | 'yearly') => {
    const response = await api.post<{ checkoutUrl: string }>('/api/subscription/checkout', {
      billingPeriod,
    });
    return unwrap(response);
  },
};

export function formatLimit(value: number): string {
  return value < 0 ? 'Unlimited' : String(value);
}
