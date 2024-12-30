import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";


export default function Index() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>設定</CardTitle>
        </CardHeader>

        <CardContent>
          <p>設定ページです</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>データの移行</CardTitle>
        </CardHeader>

        <CardContent>
          <p>設定ページです</p>
        </CardContent>
      </Card>
    </div>
  );
}
