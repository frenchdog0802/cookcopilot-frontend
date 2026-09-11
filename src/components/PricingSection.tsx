import { useEffect, useState } from 'react';
import { formatLimit, subscriptionApi, type PlansResponse } from '../api/subscription';

interface PricingSectionProps {
  onGetStarted: () => void;
}

function LimitRow({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-start justify-between gap-4 border-b border-line py-2 text-sm last:border-b-0">
      <span className="text-muted">{label}</span>
      <span className="font-medium text-ink">{value}</span>
    </li>
  );
}

export function PricingSection({ onGetStarted }: PricingSectionProps) {
  const [plans, setPlans] = useState<PlansResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await subscriptionApi.getPlans();
        if (!cancelled) setPlans(data);
      } catch {
        if (!cancelled) setPlans(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const free = plans?.free;
  const pro = plans?.pro;

  return (
    <section id="pricing" className="border-t border-line px-[5%] py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-[clamp(1.75rem,4vw,2.25rem)] font-semibold text-ink">
            Free vs Pro
          </h2>
          <p className="mt-3 text-lg text-muted">
            Full kitchen management on Free. Pro unlocks high-volume AI and social recipe imports.
          </p>
          {plans?.trialDays ? (
            <p className="mt-2 text-sm text-herb">
              New accounts get {plans.trialDays} days of Pro to try everything.
            </p>
          ) : null}
        </div>

        {loading ? (
          <p className="mt-10 text-center text-sm text-muted">Loading plans…</p>
        ) : (
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            <div className="border border-line bg-linen p-8">
              <p className="text-sm font-semibold uppercase tracking-widest text-muted">Free</p>
              <p className="mt-3 font-display text-4xl font-semibold text-ink">$0</p>
              <p className="mt-1 text-sm text-muted">Forever</p>
              <ul className="mt-8">
                <LimitRow label="Pantry, shopping, calendar" value="Full access" />
                <LimitRow label="AI chat" value={`${free?.aiMessagesPerDay ?? 20} / day`} />
                <LimitRow label="URL / YouTube / Instagram import" value={`${free?.recipeImportsPerMonth ?? 3} / month`} />
                <LimitRow label="Recipes" value={`Up to ${free?.maxRecipes ?? 50}`} />
                <LimitRow label="Image uploads" value={`${free?.imageUploadsPerMonth ?? 10} / month`} />
              </ul>
              <button type="button" onClick={onGetStarted} className="btn-secondary mt-8 w-full">
                Get started free
              </button>
            </div>

            {plans?.plans.map((plan) => (
              <div key={plan.name} className="border border-herb bg-sage/20 p-8">
                <p className="text-sm font-semibold uppercase tracking-widest text-herb">Pro</p>
                <p className="mt-3 font-display text-4xl font-semibold text-ink">{plan.priceDisplay}</p>
                <p className="mt-1 text-sm text-muted">
                  per {plan.billingPeriod === 'yearly' ? 'year' : 'month'}
                  {plan.billingPeriod === 'yearly' ? ' · save ~33%' : ''}
                </p>
                <ul className="mt-8">
                  <LimitRow label="AI chat" value={`${pro?.aiMessagesPerDay ?? 200} / day`} />
                  <LimitRow label="Social / URL imports" value={`${pro?.recipeImportsPerMonth ?? 50} / month`} />
                  <LimitRow label="Recipes" value={formatLimit(pro?.maxRecipes ?? -1)} />
                  <LimitRow label="Image uploads" value={formatLimit(pro?.imageUploadsPerMonth ?? -1)} />
                  <LimitRow label="Priority support" value="Included" />
                </ul>
                <button type="button" onClick={onGetStarted} className="btn-primary mt-8 w-full">
                  Start with {plan.billingPeriod === 'yearly' ? 'annual' : 'monthly'} Pro
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
