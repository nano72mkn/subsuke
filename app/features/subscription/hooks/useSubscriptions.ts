import { useEffect, useState, useSyncExternalStore } from 'react';
import { toast } from '~/hooks/use-toast';
import type { SubscriptionSchemaType } from '../schema/subscriptionSchema';

const subscribe = (callback: () => void) => {
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("storage", callback);
  };
};

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionSchemaType[]>([]);

  const subscriptionsString = useSyncExternalStore(
    subscribe,
    () => localStorage.getItem('subscriptions'),
    () => "",
  );

  useEffect(() => {
    if (!subscriptionsString) return;
    setSubscriptions(JSON.parse(subscriptionsString));
  }, [subscriptionsString]);

  const addSubscription = (subscription: Omit<SubscriptionSchemaType, 'id'>) => {
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

  const updateSubscription = (id: string, updatedData: Partial<Omit<SubscriptionSchemaType, 'id'>>) => {
    const updated = subscriptions.map(sub => 
      sub.id === id ? { ...sub, ...updatedData } : sub
    );
    localStorage.setItem('subscriptions', JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
    toast({
      description: '更新しました',
    });
  };

  const getSubscriptionById = (id: string): SubscriptionSchemaType | undefined => {
    return subscriptions.find(sub => sub.id === id);
  };

  return { subscriptions, addSubscription, deleteSubscription, updateSubscription, getSubscriptionById };
}
