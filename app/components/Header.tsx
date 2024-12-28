import { NavLink } from "@remix-run/react";
import clsx from "clsx";
import { ChartColumn, EllipsisVertical, PlusCircle, ScrollText } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { siteConfig } from "~/config/site";
import { AddForm } from "~/features/subscription/AddForm";
import { useToast } from "~/hooks/use-toast";
import { useSubscriptions } from "~/hooks/useSubscriptions";
import { LogoIcon } from "./icon/LogoIcon";
import { Modal } from "./Modal";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Input } from "./ui/input";

const subscriptionSchema = z.array(z.object({
  id: z.string(),
  name: z.string(),
  nextPaymentDate: z.string(),
  amount: z.number(),
  currency: z.enum(['JPY', 'USD']),
  billingCycle: z.enum(['monthly', 'yearly']),
  category: z.string(),
}));

export const Header = () => {
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
  
  return <div className="flex justify-between items-center mb-6">
    <div className="flex items-center gap-2">
      <LogoIcon />
      <h1 className="text-3xl font-bold">{siteConfig.title}</h1>
    </div>

    <div className={clsx(
      "flex gap-6 items-center",
      "max-md:fixed max-md:left-0 max-md:bottom-0",
      "max-md:w-full max-md:bg-white max-md:shadow max-md:py-4 max-md:px-6 max-md:z-10"
    )}>
      <NavLink to="/"
        className={({ isActive }) =>
          `text-sm flex items-center gap-2 hover:underline ${isActive ? "underline" : ""}`
        }
        viewTransition
      >
        <ScrollText size={16} />サブスクリスト
      </NavLink>
      <NavLink to="/dashboard"
        className={({ isActive }) =>
          `text-sm flex items-center gap-2 hover:underline ${isActive ? "underline" : ""}`
        }
        viewTransition
      >
        <ChartColumn size={16} />ダッシュボード
      </NavLink>
      <Modal
        title="サブスクを追加"
        description="新しいサブスクリプションを追加します。"
        trigger={
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            新規追加
          </Button>
        }
      >
        {({ onClose }) => <AddForm onSubmitSuccess={() => {
          onClose();
        }} />}
      </Modal>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <EllipsisVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>データの移行</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDownload}>jsonダウンロード</DropdownMenuItem>
            <DialogTrigger asChild>
              <DropdownMenuItem>インポート</DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>データをインポート</DialogTitle>
            <DialogDescription>
              JSONファイルをアップロードしてください
            </DialogDescription>
          </DialogHeader>
          <Input id="json" type="file" accept=".json" onChange={handleFileImport} />
        </DialogContent>
      </Dialog>
    </div>
  </div>
};
