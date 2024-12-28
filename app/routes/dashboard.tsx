import type { LoaderFunction } from "@remix-run/node";
import { data, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Header } from "~/components/Header";
import { CurrentMonthTotalCard } from "~/features/subscription/CurrentMonthTotalCard";
import { MonthlyTotalCard } from "~/features/subscription/MonthlyTotalCard";
import { useSubscriptions } from "~/hooks/useSubscriptions";
import { CalculateMonthlyTotal, Currency } from "~/types";

export const loader: LoaderFunction = async () => {
  const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
  const jsonData = await response.json();
  return data({ exchangeRate: jsonData.rates.JPY });
};

export default function Index() {
  const { subscriptions, deleteSubscription } = useSubscriptions();
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('JPY');
  const { exchangeRate } = useLoaderData<typeof loader>();

  const calculateMonthlyTotals = (): CalculateMonthlyTotal[] => {
    const months = Array.from({ length: 12 }, (_, i) => {
      return {
        month: new Date(2024, i, 1).toLocaleString('ja-JP', { month: 'short' }),
        total: 0,
        subscriptions: [] as Array<{    // 追加
          name: string;
          amount: number;
          isYearly: boolean;
        }>
      };
    });

    subscriptions.forEach(sub => {
      const amount = sub.currency === selectedCurrency ? 
        sub.amount : 
        (selectedCurrency === 'JPY' ? sub.amount * exchangeRate : sub.amount / exchangeRate);

      if (sub.billingCycle === 'monthly') {
        months.forEach(m => {
          m.total += amount;
          m.subscriptions.push({
            name: sub.name,
            amount: amount,
            isYearly: false
          });
        });
      } else {
        const paymentMonth = new Date(sub.nextPaymentDate).getMonth();
        months[paymentMonth].total += amount;
        months[paymentMonth].subscriptions.push({  // 追加
          name: sub.name,
          amount: amount,
          isYearly: true
        });
      }
    });

    return months;
  };

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
      
      <div className="mb-8 space-y-4">
        <CurrentMonthTotalCard 
          selectedCurrency={selectedCurrency} 
          setSelectedCurrency={setSelectedCurrency} 
          calculateCurrentMonthTotal={calculateCurrentMonthTotal} 
          formatAmount={formatAmount} 
          exchangeRate={exchangeRate} 
        />
        <MonthlyTotalCard 
          calculateMonthlyTotals={calculateMonthlyTotals} 
          formatAmount={formatAmount} 
          selectedCurrency={selectedCurrency} 
        />
      </div>
    </div>
  );
}