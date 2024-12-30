import { Separator } from "@radix-ui/react-select";
import { HardDriveDownload, Upload } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { SettingRow } from "~/features/settings/SettingRow";
import { useToast } from "~/hooks/use-toast";
import { useSubscriptions } from "~/hooks/useSubscriptions";

const subscriptionSchema = z.array(z.object({
  id: z.string(),
  name: z.string(),
  nextPaymentDate: z.string(),
  amount: z.number(),
  currency: z.enum(['JPY', 'USD']),
  billingCycle: z.enum(['monthly', 'yearly']),
  category: z.string(),
}));

export default function Index() {
  const { subscriptions } = useSubscriptions();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleDownload = () => {
    const textToDownload = JSON.stringify(subscriptions, null, 2);
    const blob = new Blob([textToDownload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subscriptions.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (text: string) => {
    try {
      const parsedData = JSON.parse(text);
      subscriptionSchema.parse(parsedData);
      localStorage.setItem('subscriptions', JSON.stringify(parsedData));
      window.dispatchEvent(new Event("storage"));
      setIsDialogOpen(false);
      toast({
        description: 'データをインポートしました',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'エラー',
        description: 'データのインポートに失敗しました',
        variant: 'destructive',
      });
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        handleImport(text);
      };
      reader.readAsText(file);
    }
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>設定</CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>データの移行</CardTitle>
          <CardDescription>データのエクスポート・インポート</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <SettingRow
              icon={HardDriveDownload}
            >
              <Button onClick={handleDownload}>
                データのダウンロード
              </Button>
            </SettingRow>

            <Separator />

            <SettingRow
              icon={Upload}
            >
              <Input id="json" type="file" accept=".json" onChange={handleFileImport} />
            </SettingRow>

          </div>
        </CardContent>
      </Card>
    </div>
  );
}
