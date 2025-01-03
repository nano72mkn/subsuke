import type { FC, ReactNode } from "react";
import { useMediaQuery } from "react-responsive";
import { DialogTrigger } from "../ui/dialog";
import { DrawerTrigger } from "../ui/drawer";

export type Props = {
  children: ReactNode;
}

export const ModalTrigger: FC<Props> = ({ children }) => {
  const isDesktop = useMediaQuery({ minWidth: 768 });
  
  if (isDesktop) {
    return (
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
    )
  }

  return (
    <DrawerTrigger asChild>
      { children }
    </DrawerTrigger>
  );
}
