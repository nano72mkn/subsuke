import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Subscription } from '@/types/subscription';
import { addMonths, startOfMonth } from 'date-fns';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { OverviewTab } from './OverviewTab';
import { ScheduleTab } from './ScheduleTab';

const subscriptionSchema = z.array(
  z.object({
    id: z.number(),
    name: z.string(),
    price: z.number(),
    cycle: z.enum(['monthly', 'yearly']),
    category: z.string(),
    paymentDate: z.number(),
    startDate: z.date()
  })
);

const rawSubscriptionSchema = z.array(
  z.object({
    id: z.number(),
    name: z.string(),
    price: z.number(),
    cycle: z.enum(['monthly', 'yearly']),
    category: z.string(),
    paymentDate: z.number(),
    startDate: z.string() // JSON形式ではDateがstring型で保存されるため
  })
);

const SubscriptionManager = () => {
  const defaultSubscriptions: Subscription[] = [
    { 
      id: 1, 
      name: "Netflix", 
      price: 1990, 
      cycle: "monthly", 
      category: "動画",
      paymentDate: 15,
      startDate: new Date('2024-01-15')
    },
    { 
      id: 2, 
      name: "AWS", 
      price: 12000, 
      cycle: "yearly", 
      category: "その他",
      paymentDate: 20,
      startDate: new Date('2024-03-20')
    }
  ];

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  useEffect(() => {
    const savedSubscriptions = localStorage.getItem('subscriptions');
    if (savedSubscriptions) {
      try {
        // 先にJSONデータの構造を検証
        const parsedData = JSON.parse(savedSubscriptions);
        const validatedRawData = rawSubscriptionSchema.parse(parsedData);
        
        // 検証後にDateオブジェクトに変換
        const subscriptionsWithDates = validatedRawData.map(sub => ({
          ...sub,
          startDate: new Date(sub.startDate)
        }));
        
        setSubscriptions(subscriptionsWithDates);
      } catch (error) {
        console.error('Invalid subscription data:', error);
        setSubscriptions(defaultSubscriptions);
        localStorage.setItem('subscriptions', JSON.stringify(defaultSubscriptions));
      }
    } else {
      setSubscriptions(defaultSubscriptions);
      localStorage.setItem('subscriptions', JSON.stringify(defaultSubscriptions));
    }
  }, []);

  const updateSubscriptions = (newSubscriptions: Subscription[]) => {
    setSubscriptions(newSubscriptions);
    localStorage.setItem('subscriptions', JSON.stringify(newSubscriptions));
  };

  const thisMonth = startOfMonth(new Date());
  const nextMonth = addMonths(thisMonth, 1);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="schedule">支払いスケジュール</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab
            subscriptions={subscriptions}
            updateSubscriptions={updateSubscriptions}
            thisMonth={thisMonth}
            nextMonth={nextMonth}
          />
        </TabsContent>

        <TabsContent value="schedule">
          <ScheduleTab
            subscriptions={subscriptions}
            thisMonth={thisMonth}
            nextMonth={nextMonth}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubscriptionManager;
