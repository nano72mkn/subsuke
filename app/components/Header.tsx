import { NavLink } from "@remix-run/react";
import clsx from "clsx";
import { ChartColumn, PlusCircle, ScrollText, Settings2 } from "lucide-react";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
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
  const isDesktop = useMediaQuery({ minWidth: 768 });
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
  
  return <div className="container mx-auto p-4 sticky top-0 z-10 bg-white">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <LogoIcon />
        <h1 className="text-3xl font-bold">{siteConfig.title}</h1>
      </div>

      <div className={clsx(
        "flex gap-4 items-center",
        "max-md:fixed max-md:left-0 max-md:bottom-0",
        "max-md:w-full max-md:bg-white max-md:shadow max-md:py-4 max-md:px-6 max-md:z-10",
        "max-md:justify-center"
      )}>
        <NavLink to="/"
          viewTransition
        >
          {({ isActive }) => (
            <Button
              variant={isDesktop ? "link" : isActive ? "secondary": "ghost"}
              className={
                clsx(
                  `text-sm flex items-center gap-2`,
                  { "max-md:underline": isActive },
                )
              }
              style={{
                viewTransitionName: 'header-link-home'
              }}
            >
              <ScrollText
                size={24}
                className="md:h-4 md:w-4"
                style={{
                  viewTransitionName: 'header-link-home-icon'
                }}
              />
              <span
                className={
                  clsx(
                    { "max-md:sr-only": !isActive }
                  )
                }
                style={{
                  viewTransitionName: 'header-link-home-text'
                }}
              >サブスク</span>
            </Button>
          )}
        </NavLink>
        <NavLink to="/dashboard"
          viewTransition
        >
          {({ isActive }) => (
            <Button
              variant={isDesktop ? "link" : isActive ? "secondary": "ghost"}
              className={
                clsx(
                  `text-sm flex items-center gap-2`,
                  { "max-md:underline": isActive }
                )
              }
              style={{
                viewTransitionName: 'header-link-dashboard'
              }}
            >
              <ChartColumn
                size={24}
                className="md:h-4 md:w-4"
                style={{
                  viewTransitionName: 'header-link-dashboard-icon'
                }}
              />
              <span
                className={
                  clsx(
                    { "max-md:sr-only": !isActive }
                  )
                }
                style={{
                  viewTransitionName: 'header-link-dashboard-text'
                }}
              >ダッシュボード</span>
            </Button>
          )}
        </NavLink>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant="ghost"
                className="text-sm flex items-center gap-2 hover:underline"
                style={{
                  viewTransitionName: 'header-link-settings'
                }}
              >
                <Settings2
                  size={24}
                  className="md:h-4 md:w-4"
                  style={{
                    viewTransitionName: 'header-link-settings-icon'
                  }}
                />
                <span
                  className="max-md:sr-only"
                  style={{
                    viewTransitionName: 'header-link-settings-text'
                  }}
                >設定</span>
              </Button>
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

        <Modal
          title="サブスクを追加"
          description="新しいサブスクを追加します。"
          trigger={
            <Button
              className="flex items-center gap-2"
              aria-label="サブスクを新規追加する"
              style={{
                viewTransitionName: 'header-link-add'
              }}
            >
              <PlusCircle
                className="h-4 w-4"
                style={{
                  viewTransitionName: 'header-link-add-icon'
                }}
              />
              <span
                className="max-md:sr-only"
                style={{
                  viewTransitionName: 'header-link-add-text'
                }}
              >新規追加</span>
            </Button>
          }
        >
          {({ onClose }) => <AddForm onSubmitSuccess={() => {
            onClose();
          }} />}
        </Modal>
      </div>
    </div>
  </div>
};
