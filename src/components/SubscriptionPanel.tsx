import { useEffect, useState } from 'react';
import { subscriptionApi, type SubscriptionStatus } from '../api/subscription';
import { UpgradeButtons } from './UpgradeButtons';

interface SubscriptionPanelProps {
  checkoutSuccess?: boolean;
  checkoutCancelled?: boolean;
}

export function SubscriptionPanel({ checkoutSuccess = false, checkoutCancelled = false }: SubscriptionPanelProps) {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stripeEnabled, setStripeEnabled] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [statusData, plansData] = await Promise.all([
        subscriptionApi.getStatus(),
        subscriptionApi.getPlans(),
      ]);
      setStatus(statusData);
      setStripeEnabled(plansData.stripeCheckoutEnabled);
    } catch {
      setError('Could not load subscription status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (checkoutSuccess) {
      load();
    }
  }, [checkoutSuccess]);

  if (loading) {
    return <p className="text-sm text-muted">Loading subscription…</p>;
  }

  if (error) {
    return <p className="text-sm text-herb">{error}</p>;
  }

  if (!status) {
    return null;
  }

  const usage = status.usage;
  const showUpgrade = !status.isPro || status.isTrial;

  return (
    <div className="space-y-6">
      {checkoutSuccess && (
        <div className="border border-herb bg-sage/30 p-4 text-sm text-ink">
          Payment received. Your Pro subscription should activate shortly.
        </div>
      )}

      {checkoutCancelled && (
        <div className="border border-line bg-linen p-4 text-sm text-muted">
          Checkout was cancelled. You can upgrade anytime from here.
        </div>
      )}

      <div>
        <h2 className="font-display text-xl font-semibold text-ink mb-2">Your plan</h2>
        <p className="text-sm text-muted">
          {status.isPro
            ? status.isTrial
              ? `Pro trial active until ${formatDate(status.trialEndsAt)}.`
              : `${status.planName ?? 'Pro'} active${status.expiresAt ? ` until ${formatDate(status.expiresAt)}` : ''}.`
            : 'You are on the Free plan.'}
        </p>
      </div>

      <div className="border border-line p-4">
        <h3 className="text-sm font-semibold text-ink mb-3">Usage this period</h3>
        <ul className="space-y-2 text-sm">
          <UsageRow
            label="AI messages today"
            used={usage.aiMessagesUsed}
            limit={usage.aiMessagesLimit}
          />
          <UsageRow
            label="Recipe imports this month"
            used={usage.recipeImportsUsed}
            limit={usage.recipeImportsLimit}
          />
          <UsageRow label="Recipes saved" used={usage.recipeCount} limit={usage.recipeLimit} />
          <UsageRow
            label="Image uploads this month"
            used={usage.imageUploadsUsed}
            limit={usage.imageUploadsLimit}
          />
        </ul>
      </div>

      {showUpgrade && (
        <div className="border border-herb bg-sage/20 p-4">
          <h3 className="font-display text-lg font-semibold text-ink">Upgrade to Pro</h3>
          <p className="mt-2 text-sm text-muted">
            Pro includes 200 AI messages per day, 50 social/URL imports per month, and unlimited recipes and uploads.
          </p>
          <p className="mt-3 text-sm text-muted">$4.99/month or $39.99/year.</p>
          <UpgradeButtons stripeEnabled={stripeEnabled} className="mt-4" />
        </div>
      )}
    </div>
  );
}

function UsageRow({ label, used, limit }: { label: string; used: number; limit: number }) {
  const unlimited = limit < 0;
  return (
    <li className="flex items-center justify-between gap-4">
      <span className="text-muted">{label}</span>
      <span className="font-medium text-ink">
        {used} / {unlimited ? 'Unlimited' : limit}
      </span>
    </li>
  );
}

function formatDate(epochSeconds?: number): string {
  if (!epochSeconds) return '';
  return new Date(epochSeconds * 1000).toLocaleDateString();
}
