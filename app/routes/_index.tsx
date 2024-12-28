import type { LoaderFunction } from "@remix-run/node";
import { data, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Header } from "~/components/Header";
import { Separator } from "~/components/ui/separator";
import { type Category } from "~/config/category";
import { CurrentMonthTotalCard } from "~/features/subscription/CurrentMonthTotalCard";
import { FilterModal } from "~/features/subscription/FilterModal";
import { SubscriptionCard } from "~/features/subscription/SubscriptionCard";
import { useSubscriptions } from "~/hooks/useSubscriptions";
import { Currency } from "~/types";

export const loader: LoaderFunction = async () => {
  const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
  const jsonData = await response.json();
  return data({ exchangeRate: jsonData.rates.JPY });
};

export default function Index() {
  const { subscriptions, deleteSubscription } = useSubscriptions();
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('JPY');
  const { exchangeRate } = useLoaderData<typeof loader>();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCycle, setFilterCycle] = useState<'monthly' | 'yearly' | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all');


  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearchQuery = sub.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilterCycle = filterCycle === 'all' || sub.billingCycle === filterCycle;
    const matchesFilterCategory = filterCategory === 'all' || sub.category === filterCategory;
    return matchesSearchQuery && matchesFilterCycle && matchesFilterCategory;
  });

  const calculateCurrentMonthTotal = () => {
    const currentMonth = new Date().getMonth();
    return subscriptions.reduce((total, sub) => {
      if (sub.billingCycle === 'yearly') {
        const paymentMonth = new Date(sub.nextPaymentDate).getMonth();
        if (paymentMonth !== currentMonth) return total;
      }

      const monthlyAmount = sub.billingCycle === 'yearly' ? sub.amount : sub.amount;
      
      if (selectedCurrency === 'JPY') {
        if (sub.currency === 'JPY') {
          return total + monthlyAmount;
        } else {
          return total + (monthlyAmount * exchangeRate);
        }
      } else {
        if (sub.currency === 'USD') {
          return total + monthlyAmount;
        } else {
          return total + (monthlyAmount / exchangeRate);
        }
      }
    }, 0);
  };

  const formatAmount = (amount: number, currency: Currency) => {
    if (currency === 'JPY') {
      return `¥${Math.round(amount).toLocaleString()}`;
    } else {
      return `$${amount.toFixed(2)}`;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Header />
      
      <div className="space-y-8">
        <div className="space-y-4">
          <CurrentMonthTotalCard 
            selectedCurrency={selectedCurrency} 
            setSelectedCurrency={setSelectedCurrency} 
            calculateCurrentMonthTotal={calculateCurrentMonthTotal} 
            formatAmount={formatAmount} 
            exchangeRate={exchangeRate} 
          />
        </div>

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
              件数: {filteredSubscriptions.length}
            </span>
          </div>
        </div>

        <div className="grid gap-4">
          {filteredSubscriptions.map((sub) => (
            <SubscriptionCard 
              key={sub.id} 
              sub={sub} 
              deleteSubscription={deleteSubscription} 
              formatAmount={formatAmount} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}

