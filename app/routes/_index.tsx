import type { LoaderFunction } from "@remix-run/node";
import { json, Link, useLoaderData } from "@remix-run/react";
import { PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { useSubscriptions } from "~/hooks/useSubscriptions";

export const loader: LoaderFunction = async () => {
  const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
  const data = await response.json();
  return json({ exchangeRate: data.rates.JPY });
};

export default function Index() {
  const { subscriptions, deleteSubscription } = useSubscriptions();
  const [selectedCurrency, setSelectedCurrency] = useState<'JPY' | 'USD'>('JPY');
  const { exchangeRate } = useLoaderData<typeof loader>();

  const calculateMonthlyTotals = () => {
    const months = Array.from({ length: 12 }, (_, i) => {
      return {
        month: new Date(2024, i, 1).toLocaleString('ja-JP', { month: 'short' }),
        total: 0
      };
    });

    subscriptions.forEach(sub => {
      const amount = sub.currency === selectedCurrency ? 
        sub.amount : 
        (selectedCurrency === 'JPY' ? sub.amount * exchangeRate : sub.amount / exchangeRate);

      if (sub.billingCycle === 'monthly') {
        months.forEach(m => m.total += amount);
      } else {
        const paymentMonth = new Date(sub.nextPaymentDate).getMonth();
        months[paymentMonth].total += amount;
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

  const formatAmount = (amount: number, currency: 'JPY' | 'USD') => {
    if (currency === 'JPY') {
      return `¥${Math.round(amount).toLocaleString()}`;
    } else {
      return `$${amount.toFixed(2)}`;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">サブスクリプション管理</h1>
        <Link to="/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            新規追加
          </Button>
        </Link>
      </div>
      
      <div className="mb-8 space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>今月の合計</CardTitle>
            <Select 
              value={selectedCurrency}
              onValueChange={(value: 'JPY' | 'USD') => setSelectedCurrency(value)}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="通貨" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="JPY">JPY (¥)</SelectItem>
                <SelectItem value="USD">USD ($)</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatAmount(calculateCurrentMonthTotal(), selectedCurrency)}
            </p>
            <p className="text-sm text-gray-500">
              為替レート: $1 = ¥{exchangeRate.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>月別支払額</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={calculateMonthlyTotals()}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => formatAmount(value, selectedCurrency)}
                  />
                  <Bar 
                    dataKey="total" 
                    fill="#3b82f6"
                    name="支払額"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        {subscriptions.map((sub) => (
          <Card key={sub.id}>
            <CardContent className="flex justify-between items-center p-6">
              <div>
                <h3 className="font-bold">{sub.name}</h3>
                <p className="text-sm text-gray-500">
                  次回支払日: {new Date(sub.nextPaymentDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-bold">
                    {formatAmount(sub.amount, sub.currency)}
                    /{sub.billingCycle === 'monthly' ? '月' : '年'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {sub.category}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteSubscription(sub.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
