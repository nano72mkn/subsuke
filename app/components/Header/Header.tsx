import clsx from "clsx";
import { ChartColumn, PlusCircle, ScrollText, Settings2 } from "lucide-react";
import { siteConfig } from "~/config/site";
import { AddForm } from "~/features/subscription/AddForm";
import { LogoIcon } from "../icon/LogoIcon";
import { Modal } from "../Modal";
import { Button } from "../ui/button";
import { NavButton } from "./NavButton";

export const Header = () => {
  return <div className="container mx-auto p-4 sticky top-0 z-10 bg-white">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <LogoIcon />
        <h1 className="text-3xl font-bold">{siteConfig.title}</h1>
      </div>

      <div className={clsx(
        "flex gap-4 items-center max-md:justify-center",
        "max-md:fixed max-md:left-0 max-md:bottom-6",
        "max-md:w-fit max-md:left-1/2 max-md:transform max-md:-translate-x-1/2",
        "max-md:py-2 max-md:px-2",
        "max-md:bg-white max-md:rounded-lg max-md:shadow-xl max-md:z-10",

      )}>
        <NavButton prefetch="render" href="/" icon={ScrollText} label="サブスク" id="home" />
        <NavButton prefetch="render" href="/dashboard" icon={ChartColumn} label="ダッシュボード" id="dashboard" />
        <NavButton prefetch="render" href="/settings" icon={Settings2} label="設定" id="settings" />

        <Modal
          title="サブスクを追加"
          description="新しいサブスクを追加します。"
          trigger={
            <Button
              className="flex items-center gap-2"
              aria-label="サブスクを新規追加する"
              style={{
                viewTransitionName: 'header-link-add'
              }}
            >
              <PlusCircle
                className="h-4 w-4"
                style={{
                  viewTransitionName: 'header-link-add-icon'
                }}
              />
              <span
                className="max-md:sr-only"
                style={{
                  viewTransitionName: 'header-link-add-text'
                }}
              >新規追加</span>
            </Button>
          }
        >
          {({ onClose }) => <AddForm onSubmitSuccess={() => {
            onClose();
          }} />}
        </Modal>
      </div>
    </div>
  </div>
};
