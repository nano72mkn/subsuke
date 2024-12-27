import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { PlusCircle, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useSubscriptions } from "~/hooks/useSubscriptions";

export const meta: MetaFunction = () => {
  return [
    { title: "Subsuke" },
    { name: "description", content: "サブスク管理サイト - Subsuke（サブスケ）" },
  ];
};

export default function Index() {
  const { subscriptions, deleteSubscription } = useSubscriptions();
  const totalMonthly = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">サブスクリプション管理</h1>
        <Link to="/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            新規追加
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>月額合計</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">¥{totalMonthly.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        {subscriptions.map((sub) => (
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
                  <p className="font-bold">¥{sub.amount.toLocaleString()}/月</p>
                  <p className="text-sm text-gray-500">{sub.category}</p>
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
        ))}
      </div>
    </div>
  );
}
