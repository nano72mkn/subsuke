import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Subscription } from '@/types/subscription';
import { getNextPaymentDate } from '@/utils/subscriptionCalculator';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Trash2 } from 'lucide-react';

type Props = {
  subscription: Subscription;
  onDelete: (id: number) => void;
};

export const SubscriptionCard = ({ subscription, onDelete }: Props) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{subscription.name}</p>
            <p className="text-sm text-gray-500">
              ¥{subscription.price.toLocaleString()} / {subscription.cycle === "monthly" ? "月" : "年"}
            </p>
            <p className="text-sm text-gray-500">
              毎{subscription.cycle === "monthly" ? "月" : "年"}{subscription.paymentDate}日
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={subscription.cycle === "monthly" ? "default" : "secondary"}>
              {subscription.cycle === "monthly" ? "月額" : "年額"}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(subscription.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            次回支払日: {format(getNextPaymentDate(subscription), 'yyyy年MM月dd日', { locale: ja })}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
