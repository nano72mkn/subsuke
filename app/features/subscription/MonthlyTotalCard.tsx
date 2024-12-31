import { Bar, BarChart, CartesianGrid, Tooltip, XAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { ChartContainer, type ChartConfig } from "~/components/ui/chart";
import type { CurrencyType } from "~/config/currency";
import { CalculateMonthlyTotal } from "~/types";

type MonthlyTotalCardProps = {
  calculateMonthlyTotals: () => CalculateMonthlyTotal[];
  formatAmount: (amount: number, currency: CurrencyType) => string;
  selectedCurrency: CurrencyType;
};

const chartConfig = {
  total: {
    label: "合計金額",
    color: "#000",
  },
} satisfies ChartConfig

export function MonthlyTotalCard({ calculateMonthlyTotals, formatAmount, selectedCurrency }: MonthlyTotalCardProps) {
  const calculateMonthlyTotalsData = calculateMonthlyTotals();

  return (
    <Card>
      <CardHeader>
        <CardTitle>月別支払額</CardTitle>
        <CardDescription>
          月ごとの支払い合計金額を表示します
        </CardDescription>
      </CardHeader>
      <CardContent>
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <BarChart accessibilityLayer data={calculateMonthlyTotalsData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" />
              <Bar 
                dataKey="total"
                radius={[4, 4, 4, 4]}
              />
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
            </BarChart>
          </ChartContainer>
      </CardContent>
    </Card>
  );
}
