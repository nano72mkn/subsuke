import { Link } from "@remix-run/react";
import { PlusCircle } from "lucide-react";
import { siteConfig } from "~/config/site";
import { Button } from "./ui/button";

export const Header = () => {
  return <div className="flex justify-between items-center mb-6">
    <h1 className="text-3xl font-bold">{siteConfig.title}</h1>
    <div className="flex gap-4 items-center">
      <Link to="/">サブスクリスト</Link>
      <Link to="/dashboard">ダッシュボード</Link>
      <Link to="/new">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          新規追加
        </Button>
      </Link>
    </div>
  </div>
};
