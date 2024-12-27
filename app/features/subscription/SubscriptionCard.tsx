import { Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Currency, Subscription } from "~/types";

type SubscriptionCardProps = {
  sub: Subscription;
  deleteSubscription: (id: string) => void;
  formatAmount: (amount: number, currency: Currency) => string;
};

export function SubscriptionCard({ sub, deleteSubscription, formatAmount }: SubscriptionCardProps) {
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
              {sub.category}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteSubscription(sub.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
