import type { LoaderFunction } from "@remix-run/node";
import { data, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Header } from "~/components/Header";
import { Separator } from "~/components/ui/separator";
import { CurrentMonthTotalCard } from "~/features/subscription/CurrentMonthTotalCard";
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
          <span>
            登録件数: {subscriptions.length}
          </span>
        </div>

        <div className="grid gap-4">
          {subscriptions.map((sub) => (
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
