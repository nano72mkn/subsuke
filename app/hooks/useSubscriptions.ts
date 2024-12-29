import { useEffect, useState, useSyncExternalStore } from 'react';
import type { BillingCycle, Currency } from '~/types';
import { toast } from './use-toast';

export type Subscription = {
  id: string;
  name: string;
  amount: number;
  currency: Currency;
  billingCycle: BillingCycle;
  category: string;
  nextPaymentDate: string;
};

const subscribe = (callback: () => void) => {
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("storage", callback);
  };
};

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  const subscriptionsString = useSyncExternalStore(
    subscribe,
    () => localStorage.getItem('subscriptions'),
    () => "",
  );

  useEffect(() => {
    if (!subscriptionsString) return;
    setSubscriptions(JSON.parse(subscriptionsString));
  }, [subscriptionsString]);

  const addSubscription = (subscription: Omit<Subscription, 'id'>) => {
    const newSubscription = {
      ...subscription,
      id: crypto.randomUUID()
    };
    const updated = [...subscriptions, newSubscription];
    localStorage.setItem('subscriptions', JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  };

  const deleteSubscription = (id: string) => {
    const updated = subscriptions.filter(sub => sub.id !== id);
    localStorage.setItem('subscriptions', JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
    toast({
      description: '削除しました',
    });
  };

  return { subscriptions, addSubscription, deleteSubscription };
}
