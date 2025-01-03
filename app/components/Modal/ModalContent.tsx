import type { FC, ReactNode } from "react";
import { useMediaQuery } from "react-responsive";
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "../ui/drawer";

type Props = {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
};

export const ModalContent: FC<Props> = ({ title, children, footer }) => {
  const isDesktop = useMediaQuery({ minWidth: 768 });

  if (isDesktop) {
    return (
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{ title }</DialogTitle>
        </DialogHeader>
        { children }
        <DialogFooter>
          { footer }
        </DialogFooter>
      </DialogContent>
    );
  }

  return (
    <DrawerContent>
      <DrawerHeader className="text-left">
        <DrawerTitle>{ title }</DrawerTitle>
      </DrawerHeader>
      <div className="p-4">
        { children }
      </div>
      <DrawerFooter className="pt-2">
        { footer }
      </DrawerFooter>
    </DrawerContent>
  )
};
