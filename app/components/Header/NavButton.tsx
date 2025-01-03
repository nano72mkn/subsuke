import { NavLink } from "@remix-run/react";
import clsx from "clsx";
import type { ChartColumn } from "lucide-react";
import type { ComponentProps, FC } from "react";
import { useMediaQuery } from "react-responsive";
import { Button } from "../ui/button";

type Props = {
  href: string;
  prefetch: ComponentProps<typeof NavLink>['prefetch'];
  icon: typeof ChartColumn;
  label: string;
  id: string;
};

export const NavButton: FC<Props> = ({ href, prefetch, icon: Icon, label, id }) => {
  const isDesktop = useMediaQuery({ minWidth: 768 });

  const viewTransitionName = `header-link-${id}`;

  return (
    <NavLink to={href} prefetch={prefetch} viewTransition >
      {({ isActive }) => (
        <Button
          variant={isDesktop ? isActive ? "secondary" : "link" : isActive ? "secondary": "ghost"}
          className="text-sm flex items-center gap-2"
          style={{ viewTransitionName }}
        >
          <Icon
            size={24}
            className="md:h-4 md:w-4"
            style={{
              viewTransitionName: viewTransitionName + '-icon'
            }}
          />
          <span
            className={
              clsx(
                { "max-md:sr-only": !isActive }
              )
            }
            style={{
              viewTransitionName: viewTransitionName + '-text'
            }}
          >{ label }</span>
        </Button>
      )}
    </NavLink>
  );
};
