import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Subscription } from '@/types/subscription';
import { calculateMonthlyPayments, getNextPaymentDate } from '@/utils/subscriptionCalculator';
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Trash2 } from "lucide-react";
import { AddSubscriptionDialog } from './AddSubscriptionDialog';
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

type Props = {
  subscriptions: Subscription[];
  updateSubscriptions: (subs: Subscription[]) => void;
  thisMonth: Date;
  nextMonth: Date;
};

export const OverviewTab = ({ subscriptions, updateSubscriptions, thisMonth, nextMonth }: Props) => {
  const categories = ["動画", "音楽", "ストレージ", "その他"];

  const deleteSubscription = (id: number) => {
    const newSubscriptions = subscriptions.filter(sub => sub.id !== id);
    updateSubscriptions(newSubscriptions);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>支払い概要</CardTitle>
        <CardDescription>
          <div className="space-y-1">
            <p>今月の支払い予定: ¥{calculateMonthlyPayments(thisMonth, subscriptions).toLocaleString()}</p>
            <p>来月の支払い予定: ¥{calculateMonthlyPayments(nextMonth, subscriptions).toLocaleString()}</p>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categories.map(category => {
            const categorySubscriptions = subscriptions.filter(sub => sub.category === category);
            if (categorySubscriptions.length === 0) return null;

            return (
              <div key={category} className="space-y-2">
                <h3 className="font-medium">{category}</h3>
                <div className="grid gap-4">
                  {categorySubscriptions.map(sub => (
                    <Card key={sub.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{sub.name}</p>
                            <p className="text-sm text-gray-500">
                              ¥{sub.price.toLocaleString()} / {sub.cycle === "monthly" ? "月" : "年"}
                            </p>
                            <p className="text-sm text-gray-500">
                              毎{sub.cycle === "monthly" ? "月" : "年"}{sub.paymentDate}日
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={sub.cycle === "monthly" ? "default" : "secondary"}>
                              {sub.cycle === "monthly" ? "月額" : "年額"}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteSubscription(sub.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            次回支払日: {format(getNextPaymentDate(sub, new Date()), 'yyyy年MM月dd日', { locale: ja })}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
      <CardFooter>
        <AddSubscriptionDialog onAdd={(newSub) => {
          updateSubscriptions([...subscriptions, {
            id: subscriptions.length + 1,
            ...newSub
          }]);
        }} />
      </CardFooter>
    </Card>
  );
};
