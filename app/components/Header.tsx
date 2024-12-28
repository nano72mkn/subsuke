import { NavLink } from "@remix-run/react";
import { ChartColumn, PlusCircle, ScrollText } from "lucide-react";
import { siteConfig } from "~/config/site";
import { AddForm } from "~/features/subscription/AddForm";
import { LogoIcon } from "./icon/LogoIcon";
import { Modal } from "./Modal";
import { Button } from "./ui/button";

export const Header = () => {
  return <div className="flex justify-between items-center mb-6">
    <div className="flex items-center gap-2">
      <LogoIcon />
      <h1 className="text-3xl font-bold">{siteConfig.title}</h1>
    </div>
    <div className="flex gap-6 items-center">
      <NavLink to="/"
        className={({ isActive }) =>
          `text-sm flex items-center gap-2 hover:underline ${isActive ? "underline" : ""}`
        }
        viewTransition
      >
        <ScrollText size={16} />サブスクリスト
      </NavLink>
      <NavLink to="/dashboard"
        className={({ isActive }) =>
          `text-sm flex items-center gap-2 hover:underline ${isActive ? "underline" : ""}`
        }
        viewTransition
      >
        <ChartColumn size={16} />ダッシュボード
      </NavLink>
      <Modal
        title="サブスクを追加"
        trigger={
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            新規追加
          </Button>
        }
      >
        {({ onClose }) => <AddForm onSubmitSuccess={onClose} />}
      </Modal>
    </div>
  </div>
};
