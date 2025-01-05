import type { FC, ReactNode } from "react";
import { useMediaQuery } from "react-responsive";
import { Dialog } from "../ui/dialog";
import { Drawer } from "../ui/drawer";

type Props = {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const ModalWrapper: FC<Props> = ({ children, open, onOpenChange }) => {
  const isDesktop = useMediaQuery({ minWidth: 768 });

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {children}
      </Dialog>
    );
  }

  return (
    <Drawer repositionInputs={false} open={open} onOpenChange={onOpenChange}>
      {children}
    </Drawer>
  );
}
