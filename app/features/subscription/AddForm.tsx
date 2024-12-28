import type { FC } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { categoryOptions } from "~/config/category";
import { useSubscriptions } from "~/hooks/useSubscriptions";
import type { BillingCycle, Currency } from "~/types";

type Props = {
  onSubmitSuccess: () => void;
};

export const AddForm: FC<Props> = ({ onSubmitSuccess }) => {
  const { addSubscription } = useSubscriptions();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    addSubscription({
      name: formData.get("name") as string,
      amount: Number(formData.get("amount")),
      currency: formData.get("currency") as Currency,
      billingCycle: formData.get("billingCycle") as BillingCycle,
      category: formData.get("category") as string,
      nextPaymentDate: formData.get("nextPaymentDate") as string
    });
    onSubmitSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">サービス名</Label>
        <Input id="name" name="name" required />
      </div>
      
      <div>
        <Label htmlFor="amount">金額</Label>
        <Input 
          id="amount" 
          name="amount" 
          type="number" 
          min="0" 
          step="0.01" 
          required 
        />
      </div>

      <div>
        <Label>通貨</Label>
        <RadioGroup name="currency" className="flex gap-4" defaultValue="JPY">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="JPY" id="JPY" />
            <Label htmlFor="JPY">JPY (¥)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="USD" id="USD" />
            <Label htmlFor="USD">USD ($)</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label>支払いサイクル</Label>
        <RadioGroup name="billingCycle" className="flex gap-4" defaultValue="monthly">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="monthly" id="monthly" />
            <Label htmlFor="monthly">月払い</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yearly" id="yearly" />
            <Label htmlFor="yearly">年払い</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div>
        <Label htmlFor="category">カテゴリー</Label>
        <Select name="category" required>
          <SelectTrigger>
            <SelectValue placeholder="カテゴリーを選択" />
          </SelectTrigger>
          <SelectContent>
            {categoryOptions.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="nextPaymentDate">次回支払日</Label>
        <Input 
          id="nextPaymentDate" 
          name="nextPaymentDate" 
          type="date" 
          required 
        />
      </div>
      
      <Button type="submit" className="w-full">
        登録
      </Button>
    </form>
  );
};