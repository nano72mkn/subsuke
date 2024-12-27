import type { LoaderFunction } from "@remix-run/node";
import { data, Link, useLoaderData } from "@remix-run/react";
import { PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { useSubscriptions } from "~/hooks/useSubscriptions";

export const loader: LoaderFunction = async () => {
  const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
  const jsonData = await response.json();
  return data({ exchangeRate: jsonData.rates.JPY });
};

type CalculateMonthlyTotal = {
  month: string;
  total: number;
  subscriptions: Array<{
    name: string;
    amount: number;
    isYearly: boolean;
  }>
};

export default function Index() {
  const { subscriptions, deleteSubscription } = useSubscriptions();
  const [selectedCurrency, setSelectedCurrency] = useState<'JPY' | 'USD'>('JPY');
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
                    content={({ payload, active }) => {
                      if (active && payload && payload.length) {
                        const data: CalculateMonthlyTotal = payload[0].payload;
                        return (
                          <div className="bg-white p-4 rounded shadow-lg border">
                            <p className="font-bold mb-2">{data.month}の支払い</p>
                            <div className="space-y-1">
                              {data.subscriptions.map((sub, index) => (
                                <div key={index} className="flex justify-between">
                                  <span className="mr-4">
                                    {sub.name}
                                    {sub.isYearly && ' (年払い)'}
                                  </span>
                                  <span className="font-medium">
                                    {formatAmount(sub.amount, selectedCurrency)}
                                  </span>
                                </div>
                              ))}
                              <div className="border-t mt-2 pt-2 font-bold flex justify-between">
                                <span>合計</span>
                                <span>{formatAmount(data.total, selectedCurrency)}</span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
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
