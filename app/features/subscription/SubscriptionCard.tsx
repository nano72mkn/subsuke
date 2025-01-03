import { format } from "date-fns";
import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { ModalContent } from "~/components/Modal/ModalContent";
import { ModalTrigger } from "~/components/Modal/ModalTrigger";
import { ModalWrapper } from "~/components/Modal/ModalWrapper";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { categoryOptions } from "~/config/category";
import { calculateNextPaymentDate } from "~/lib/calculateNextPaymentDate";
import { formatAmount } from "~/lib/formatAmount";
import { EditForm } from "./EditForm";
import type { SubscriptionSchemaType } from "./schema/subscriptionSchema";

type SubscriptionCardProps = {
  sub: SubscriptionSchemaType;
  deleteSubscription: (id: string) => void;
};

export function SubscriptionCard({ sub, deleteSubscription }: SubscriptionCardProps) {
  const [open, setOpen] = useState(false);
  const nextPaymentDate = sub.initialPaymentDate && calculateNextPaymentDate({
    billingCycle: sub.billingCycle,
    initialPaymentDate: new Date(sub.initialPaymentDate),
  });

  return (
    <Card key={sub.id}>
      <CardContent className="flex justify-between items-center p-6">
        <div>
          <h3 className="font-bold">{sub.name}</h3>
          {nextPaymentDate && (
            <p className="text-sm text-gray-500">
              次回支払日: {format(nextPaymentDate, "yyyy年MM月dd日")}
            </p>
          )}
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
          <ModalWrapper open={open} onOpenChange={setOpen}>
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
                  <ModalTrigger>
                    <DropdownMenuItem>
                        <Pencil size={16} />
                        <span>編集</span>
                      </DropdownMenuItem>
                  </ModalTrigger>
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
                  <AlertDialogAction onClick={() => sub.id && deleteSubscription(sub.id)}>削除する</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <ModalContent
              title="サブスクを追加"
              description="新しいサブスクを追加します。"
            >
              {sub.id && <EditForm subscription={sub} onSubmitSuccess={() => {
                setOpen(false);
              }} />}
            </ModalContent>
          </ModalWrapper>
        </div>
      </CardContent>
    </Card>
  );
}
