import { useNavigate } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { useSubscriptions } from "~/hooks/useSubscriptions";

export default function NewSubscription() {
  const { addSubscription } = useSubscriptions();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    addSubscription({
      name: formData.get("name") as string,
      amount: Number(formData.get("amount")),
      category: formData.get("category") as string,
      nextPaymentDate: formData.get("nextPaymentDate") as string
    });

    navigate("/");
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6">新規サブスクリプション</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">サービス名</Label>
          <Input id="name" name="name" required />
        </div>
        
        <div>
          <Label htmlFor="amount">月額 (円)</Label>
          <Input 
            id="amount" 
            name="amount" 
            type="number" 
            min="0" 
            step="1" 
            required 
          />
        </div>
        
        <div>
          <Label htmlFor="category">カテゴリー</Label>
          <Select name="category" required>
            <SelectTrigger>
              <SelectValue placeholder="カテゴリーを選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="エンターテイメント">エンターテイメント</SelectItem>
              <SelectItem value="仕事">仕事</SelectItem>
              <SelectItem value="生活">生活</SelectItem>
              <SelectItem value="その他">その他</SelectItem>
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
    </div>
  );
}
