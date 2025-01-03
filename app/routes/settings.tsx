import { Separator } from "@radix-ui/react-select";
import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { HardDriveDownload, Upload } from "lucide-react";
import { ErrorCard } from "~/components/ErrorCard/ErrorCard";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { SettingRow } from "~/features/settings/SettingRow";
import { useSubscriptions } from "~/features/subscription/hooks/useSubscriptions";
import { subscriptionSchema } from "~/features/subscription/schema/subscriptionSchema";
import { useToast } from "~/hooks/use-toast";

export default function Index() {
  const { subscriptions } = useSubscriptions();
  const { toast } = useToast();
  
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
      // jsonのParseに失敗した場合はエラーを投げる
      const parsedData = JSON.parse(text);

      // パースしたデータがスキーマに準拠しているかチェック
      parsedData.forEach((data: any) => {
        subscriptionSchema.parse(data);
      });

      localStorage.setItem('subscriptions', JSON.stringify(parsedData));
      window.dispatchEvent(new Event("storage"));
      toast({
        description: 'データをインポートしました',
        variant: 'default',
      });
    } catch (error) {
      console.log(error);
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
