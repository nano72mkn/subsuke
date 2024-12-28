import { useCallback, useState } from "react";
import { z } from "zod";
import { Separator } from "~/components/ui/separator";
import { type Category } from "~/config/category";
import { FilterModal } from "~/features/subscription/FilterModal";
import { SubscriptionCard } from "~/features/subscription/SubscriptionCard";
import { useSubscriptions } from "~/hooks/useSubscriptions";

const subscriptionSchema = z.array(z.object({
  id: z.string(),
  name: z.string(),
  nextPaymentDate: z.string(),
  amount: z.number(),
  currency: z.enum(['JPY', 'USD']),
  billingCycle: z.enum(['monthly', 'yearly']),
  category: z.string(),
}));

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
  , [subscriptions]);

  const handleCopy = () => {
    const textToCopy = JSON.stringify(subscriptions, null, 2);
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert('コピーしました');
    });
  };

  const handleDownload = () => {
    const textToDownload = JSON.stringify(subscriptions, null, 2);
    const blob = new Blob([textToDownload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subscriptions.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (text: string) => {
    try {
      const parsedData = JSON.parse(text);
      subscriptionSchema.parse(parsedData);
      localStorage.setItem('subscriptions', JSON.stringify(parsedData));
      alert('インポートしました');
    } catch (error) {
      alert('インポートに失敗しました: ' + (error?.message ?? 'Unknown error'));
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        handleImport(text);
      };
      reader.readAsText(file);
    }
  };

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
            <button onClick={handleCopy}>コピー</button>
            <button onClick={handleDownload}>ダウンロード</button>
            <input type="file" accept=".json" onChange={handleFileImport} />
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

