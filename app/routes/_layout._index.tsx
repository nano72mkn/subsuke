import { useCallback, useState } from "react";
import { Separator } from "~/components/ui/separator";
import { type Category } from "~/config/category";
import { FilterModal } from "~/features/subscription/FilterModal";
import { SubscriptionCard } from "~/features/subscription/SubscriptionCard";
import { useSubscriptions } from "~/hooks/useSubscriptions";

export default function Index() {
  const { subscriptions, deleteSubscription } = useSubscriptions();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCycle, setFilterCycle] = useState<'monthly' | 'yearly' | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all');

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
        <h2 className="text-2xl font-bold">サブスクリプション</h2>
        <div className="flex items-center gap-4">
          <FilterModal
            searchQuery={searchQuery}
            filterCategory={filterCategory}
            filterCycle={filterCycle}
            setSearchQuery={setSearchQuery}
            setFilterCategory={setFilterCategory}
            setFilterCycle={setFilterCycle}
          />
          <span>
            件数: {filteredSubscriptions().length}
          </span>
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

