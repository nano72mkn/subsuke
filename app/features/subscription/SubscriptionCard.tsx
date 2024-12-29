import { EllipsisVertical, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { categoryOptions } from "~/config/category";
import { formatAmount } from "~/lib/formatAmount";
import { Subscription } from "~/types";

type SubscriptionCardProps = {
  sub: Subscription;
  deleteSubscription: (id: string) => void;
};

export function SubscriptionCard({ sub, deleteSubscription }: SubscriptionCardProps) {
  return (
    <Card key={sub.id}>
      <CardContent className="flex justify-between items-center p-6">
        <div>
          <h3 className="font-bold">{sub.name}</h3>
          <p className="text-sm text-gray-500">
            次回支払日: {new Date(sub.nextPaymentDate).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-bold">
              {formatAmount(sub.amount, sub.currency)}
              /{sub.billingCycle === 'monthly' ? '月' : '年'}
            </p>
            <p className="text-sm text-gray-500">
              {categoryOptions.find((category) => category.id === sub.category)?.label}
            </p>
          </div>
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  variant="ghost"
                  size="icon"
                >
                  <EllipsisVertical size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem>
                    <Trash2 size={16} />
                    <span>削除</span>
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{ sub.name }を削除しますか？</AlertDialogTitle>
                <AlertDialogDescription>
                  削除すると復元できませんがよろしいですか？
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>キャンセル</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteSubscription(sub.id)}>削除する</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
