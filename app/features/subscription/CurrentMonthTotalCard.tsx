import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Currency } from "~/types";

type CurrentMonthTotalCardProps = {
  selectedCurrency: Currency;
  setSelectedCurrency: (currency: Currency) => void;
  calculateCurrentMonthTotal: () => number;
  formatAmount: (amount: number, currency: Currency) => string;
  exchangeRate: number;
};

export function CurrentMonthTotalCard({ selectedCurrency, setSelectedCurrency, calculateCurrentMonthTotal, formatAmount, exchangeRate }: CurrentMonthTotalCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>今月の合計</CardTitle>
        <Select 
          value={selectedCurrency}
          onValueChange={(value: Currency) => setSelectedCurrency(value)}
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
  );
}
