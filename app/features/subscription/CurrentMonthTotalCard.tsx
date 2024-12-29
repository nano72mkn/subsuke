import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { formatAmount } from "~/lib/formatAmount";
import { Currency } from "~/types";

type CurrentMonthTotalCardProps = {
  selectedCurrency: Currency;
  setSelectedCurrency: (currency: Currency) => void;
  calculateCurrentMonthTotal: () => number;
  exchangeRate: number;
};

export function CurrentMonthTotalCard({ selectedCurrency, setSelectedCurrency, calculateCurrentMonthTotal, exchangeRate }: CurrentMonthTotalCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-row items-center justify-between space-y-0">
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
        </div>
        <CardDescription>
          {new Date().getMonth() + 1}
          月の支払い合計
        </CardDescription>
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
