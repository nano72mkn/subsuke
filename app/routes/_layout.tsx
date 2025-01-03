import type { LoaderFunction } from "@remix-run/node";
import { data, isRouteErrorResponse, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { useState } from "react";
import { ErrorCard } from "~/components/ErrorCard/ErrorCard";
import type { CurrencyType } from "~/config/currency";
import { CurrentMonthTotalCard } from "~/features/subscription/CurrentMonthTotalCard";
import { useSubscriptions } from "~/features/subscription/hooks/useSubscriptions";

export const loader: LoaderFunction = async () => {
  const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
  const jsonData = await response.json();
  return data({ exchangeRate: jsonData.rates.JPY });
};

export default function Layout() {
  const { subscriptions } = useSubscriptions();
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyType>('JPY');
  const { exchangeRate } = useLoaderData<typeof loader>();
  
  const calculateCurrentMonthTotal = () => {
    const currentMonth = new Date().getMonth();
    return subscriptions.reduce((total, sub) => {
      if (sub.billingCycle === 'yearly') {
        const paymentMonth = new Date(sub.initialPaymentDate).getMonth();
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
