import { useState } from 'react';
import { subscriptionApi } from '../api/subscription';

interface UpgradeButtonsProps {
  stripeEnabled: boolean;
  className?: string;
}

export function UpgradeButtons({ stripeEnabled, className = '' }: UpgradeButtonsProps) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState('');

  const startCheckout = async (billingPeriod: 'monthly' | 'yearly') => {
    setLoadingPlan(billingPeriod);
    setError('');
    try {
      const { checkoutUrl } = await subscriptionApi.createCheckout(billingPeriod);
      window.location.href = checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to start checkout');
      setLoadingPlan(null);
    }
  };

  if (!stripeEnabled) {
    return (
      <p className={`text-sm text-muted ${className}`}>
        Web checkout is not configured yet. Use the mobile app to subscribe, or contact support.
      </p>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => startCheckout('monthly')}
          disabled={loadingPlan !== null}
          className="btn-primary flex-1 disabled:opacity-60"
        >
          {loadingPlan === 'monthly' ? 'Redirecting…' : 'Subscribe monthly — $4.99'}
        </button>
        <button
          type="button"
          onClick={() => startCheckout('yearly')}
          disabled={loadingPlan !== null}
          className="btn-secondary flex-1 disabled:opacity-60"
        >
          {loadingPlan === 'yearly' ? 'Redirecting…' : 'Subscribe yearly — $39.99'}
        </button>
      </div>
      {error ? <p className="text-sm text-herb">{error}</p> : null}
    </div>
  );
}
