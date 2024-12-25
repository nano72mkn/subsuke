import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { addMonths, addYears, format, isBefore, isSameMonth, startOfMonth } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const SubscriptionManager = () => {
  const defaultSubscriptions = [
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

  const [subscriptions, setSubscriptions] = useState([]);

  // ローカルストレージからデータを読み込む
  useEffect(() => {
    const savedSubscriptions = localStorage.getItem('subscriptions');
    if (savedSubscriptions) {
      const parsedSubscriptions = JSON.parse(savedSubscriptions).map(sub => ({
        ...sub,
        startDate: new Date(sub.startDate)
      }));
      setSubscriptions(parsedSubscriptions);
    } else {
      setSubscriptions(defaultSubscriptions);
      localStorage.setItem('subscriptions', JSON.stringify(defaultSubscriptions));
    }
  }, []);

  // subscriptionsの更新時にローカルストレージに保存
  const updateSubscriptions = (newSubscriptions) => {
    setSubscriptions(newSubscriptions);
    localStorage.setItem('subscriptions', JSON.stringify(newSubscriptions));
  };

  const [isOpen, setIsOpen] = useState(false);
  const [newSub, setNewSub] = useState({
    name: "",
    price: 0,
    cycle: "monthly",
    category: "その他",
    paymentDate: 1,
    startDate: new Date()
  });

  const categories = ["動画", "音楽", "ストレージ", "その他"];
  const cycles = [
    { value: "monthly", label: "月額" },
    { value: "yearly", label: "年額" }
  ];

  const calculateMonthlyPayments = (targetDate) => {
    return subscriptions.reduce((acc, sub) => {
      const nextPaymentDate = getNextPaymentDate(sub, targetDate);
      
      if (isSameMonth(nextPaymentDate, targetDate)) {
        return acc + (sub.cycle === "yearly" ? sub.price : sub.price);
      }
      return acc;
    }, 0);
  };

  const getNextPaymentDate = (subscription, fromDate) => {
    const { startDate, paymentDate, cycle } = subscription;
    let baseDate = new Date(startDate);
    baseDate.setDate(paymentDate);

    while (isBefore(baseDate, fromDate)) {
      if (cycle === "monthly") {
        baseDate = addMonths(baseDate, 1);
      } else {
        baseDate = addYears(baseDate, 1);
      }
    }
    return baseDate;
  };

  const addSubscription = () => {
    if (newSub.name && newSub.price) {
      const newSubscriptions = [...subscriptions, {
        id: subscriptions.length + 1,
        ...newSub
      }];
      updateSubscriptions(newSubscriptions);
      setNewSub({
        name: "",
        price: 0,
        cycle: "monthly",
        category: "その他",
        paymentDate: 1,
        startDate: new Date()
      });
      setIsOpen(false);
    }
  };

  const deleteSubscription = (id) => {
    const newSubscriptions = subscriptions.filter(sub => sub.id !== id);
    updateSubscriptions(newSubscriptions);
  };

  const thisMonth = startOfMonth(new Date());
  const nextMonth = addMonths(thisMonth, 1);
  const thisMonthTotal = calculateMonthlyPayments(thisMonth);
  const nextMonthTotal = calculateMonthlyPayments(nextMonth);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="schedule">支払いスケジュール</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>支払い概要</CardTitle>
              <CardDescription>
                <div className="space-y-1">
                  <p>今月の支払い予定: ¥{thisMonthTotal.toLocaleString()}</p>
                  <p>来月の支払い予定: ¥{nextMonthTotal.toLocaleString()}</p>
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
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    サブスクリプションを追加
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm">
                  <DialogHeader>
                    <DialogTitle>新規サブスクリプション</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">サービス名</Label>
                      <Input
                        id="name"
                        value={newSub.name}
                        onChange={(e) => setNewSub({ ...newSub, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">料金</Label>
                      <Input
                        id="price"
                        type="number"
                        value={newSub.price}
                        onChange={(e) => setNewSub({ ...newSub, price: parseInt(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cycle">支払いサイクル</Label>
                      <Select
                        value={newSub.cycle}
                        onValueChange={(value) => setNewSub({ ...newSub, cycle: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {cycles.map((cycle) => (
                            <SelectItem key={cycle.value} value={cycle.value}>
                              {cycle.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="category">カテゴリー</Label>
                      <Select
                        value={newSub.category}
                        onValueChange={(value) => setNewSub({ ...newSub, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>支払い日</Label>
                      <Input
                        type="number"
                        min="1"
                        max="31"
                        value={newSub.paymentDate}
                        onChange={(e) => setNewSub({ ...newSub, paymentDate: parseInt(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label>初回支払い日</Label>
                      <div className="mt-1">
                        <Calendar
                          mode="single"
                          selected={newSub.startDate}
                          onSelect={(date) => date && setNewSub({ ...newSub, startDate: date })}
                          className="rounded-md border"
                        />
                      </div>
                    </div>
                    <Button className="w-full" onClick={addSubscription}>
                      追加
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
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
                        合計: ¥{calculateMonthlyPayments(month).toLocaleString()}
                      </span>
                    </h3>
                    <div className="grid gap-2">
                      {subscriptions
                        .filter(sub => isSameMonth(getNextPaymentDate(sub, month), month))
                        .sort((a, b) => a.paymentDate - b.paymentDate)
                        .map(sub => (
                          <div key={sub.id} className="flex items-center justify-between p-2 border rounded">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubscriptionManager;
