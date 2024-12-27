import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { CalculateMonthlyTotal, Currency } from "~/types";

type MonthlyTotalCardProps = {
  calculateMonthlyTotals: () => CalculateMonthlyTotal[];
  formatAmount: (amount: number, currency: Currency) => string;
  selectedCurrency: Currency;
};

export function MonthlyTotalCard({ calculateMonthlyTotals, formatAmount, selectedCurrency }: MonthlyTotalCardProps) {
  return (
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
  );
}
