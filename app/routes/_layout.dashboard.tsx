import type { LoaderFunction } from "@remix-run/node";
import { data, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import type { CurrencyType } from "~/config/currency";
import { useSubscriptions } from "~/features/subscription/hooks/useSubscriptions";
import { MonthlyTotalCard } from "~/features/subscription/MonthlyTotalCard";
import { CalculateMonthlyTotal } from "~/types";

export const loader: LoaderFunction = async () => {
  const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
  const jsonData = await response.json();
  return data({ exchangeRate: jsonData.rates.JPY });
};

export default function Index() {
  const { subscriptions } = useSubscriptions();
  const [selectedCurrency] = useState<CurrencyType>('JPY');
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

  const formatAmount = (amount: number, currency: CurrencyType) => {
    if (currency === 'JPY') {
      return `¥${Math.round(amount).toLocaleString()}`;
    } else {
      return `$${amount.toFixed(2)}`;
    }
  };

  return (
    <MonthlyTotalCard 
      calculateMonthlyTotals={calculateMonthlyTotals} 
      formatAmount={formatAmount} 
      selectedCurrency={selectedCurrency} 
    />
  );
}
