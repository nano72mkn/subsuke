import type { LoaderFunction } from "@remix-run/node";
import { data, Outlet, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { CurrentMonthTotalCard } from "~/features/subscription/CurrentMonthTotalCard";
import { useSubscriptions } from "~/hooks/useSubscriptions";
import type { Currency } from "~/types";

export const loader: LoaderFunction = async () => {
  const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
  const jsonData = await response.json();
  return data({ exchangeRate: jsonData.rates.JPY });
};

export default function Layout() {
  const { subscriptions } = useSubscriptions();
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
  
  return (
    <div className="space-y-8">
        <CurrentMonthTotalCard 
          selectedCurrency={selectedCurrency} 
          setSelectedCurrency={setSelectedCurrency} 
          calculateCurrentMonthTotal={calculateCurrentMonthTotal} 
          exchangeRate={exchangeRate} 
        />
      <Outlet />
    </div>
  )
}
