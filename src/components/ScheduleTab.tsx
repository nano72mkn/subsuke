import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Subscription } from '@/types/subscription';
import { calculateMonthlyPayments, getNextPaymentDate } from '@/utils/subscriptionCalculator';
import { format, isSameMonth } from 'date-fns';
import { ja } from 'date-fns/locale';

type Props = {
  subscriptions: Subscription[];
  thisMonth: Date;
  nextMonth: Date;
};

export const ScheduleTab = ({ subscriptions, thisMonth, nextMonth }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>支払いスケジュール</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[thisMonth, nextMonth].map((month) => (
            <div key={month.toISOString()} className="space-y-2">
              <h3 className="font-medium">
                {format(month, 'yyyy年MM月', { locale: ja })}
                <span className="ml-2 text-sm text-gray-500">
                  合計: ¥{calculateMonthlyPayments(month, subscriptions).toLocaleString()}
                </span>
              </h3>
              <div className="grid gap-2">
                {subscriptions
                  .filter(sub => isSameMonth(getNextPaymentDate(sub, month), month))
                  .sort((a, b) => a.paymentDate - b.paymentDate)
                  .map(sub => (
                    <div 
                      key={sub.id} 
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <div>
                        <p className="font-medium">{sub.name}</p>
                        <p className="text-sm text-gray-500">
                          {format(getNextPaymentDate(sub, month), 'MM月dd日')}
                        </p>
                      </div>
                      <p className="font-medium">
                        ¥{sub.price.toLocaleString()}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
