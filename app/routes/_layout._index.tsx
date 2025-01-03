import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { useCallback, useState } from "react";
import { ErrorCard } from "~/components/ErrorCard/ErrorCard";
import { Separator } from "~/components/ui/separator";
import type { CategoryType } from "~/config/category";
import { FilterModal } from "~/features/subscription/FilterModal";
import { useSubscriptions } from "~/features/subscription/hooks/useSubscriptions";
import { SubscriptionCard } from "~/features/subscription/SubscriptionCard";

export default function Index() {
  const { subscriptions, deleteSubscription } = useSubscriptions();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCycle, setFilterCycle] = useState<'monthly' | 'yearly' | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<CategoryType | 'all'>('all');

  const filteredSubscriptions = useCallback(() => subscriptions.filter((sub) => {
    const matchesSearchQuery = sub.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilterCycle = filterCycle === 'all' || sub.billingCycle === filterCycle;
    const matchesFilterCategory = filterCategory === 'all' || sub.category === filterCategory;
    return matchesSearchQuery && matchesFilterCycle && matchesFilterCategory;
  })
  , [subscriptions, searchQuery, filterCycle, filterCategory]);

  return (
    <div className="space-y-8">
      <Separator />
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">サブスク</h2>
          <span>
            {filteredSubscriptions().length}件（全{subscriptions.length}件）
          </span>
        </div>
        <div className="flex items-center gap-4">
          <FilterModal
            searchQuery={searchQuery}
            filterCategory={filterCategory}
            filterCycle={filterCycle}
            setSearchQuery={setSearchQuery}
            setFilterCategory={setFilterCategory}
            setFilterCycle={setFilterCycle}
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredSubscriptions().map((sub) => (
          <SubscriptionCard 
            key={sub.id} 
            sub={sub} 
            deleteSubscription={deleteSubscription} 
          />
        ))}
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <ErrorCard title={`${error.status}: ${error.statusText}`} description={error.data} />
    );
  } else if (error instanceof Error) {
    return (
      <ErrorCard title="Error" description={error.message} />
    );
  } else {
    return <ErrorCard title="Error" description="予期せぬエラーが発生しました" />;
  }
}

