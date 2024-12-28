// app/hooks/useSubscriptions.ts
import { useEffect, useState } from 'react';
import type { BillingCycle, Currency } from '~/types';

export type Subscription = {
  id: string;
  name: string;
  amount: number;
  currency: Currency;
  billingCycle: BillingCycle;
  category: string;
  nextPaymentDate: string;
};

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('subscriptions');
    if (stored) setSubscriptions(JSON.parse(stored));
  }, []);

  const addSubscription = (subscription: Omit<Subscription, 'id'>) => {
    const newSubscription = {
      ...subscription,
      id: crypto.randomUUID()
    };
    const updated = [...subscriptions, newSubscription];
    setSubscriptions(updated);
    localStorage.setItem('subscriptions', JSON.stringify(updated));
  };

  const deleteSubscription = (id: string) => {
    const updated = subscriptions.filter(sub => sub.id !== id);
    setSubscriptions(updated);
    localStorage.setItem('subscriptions', JSON.stringify(updated));
  };

  return { subscriptions, addSubscription, deleteSubscription };
}
