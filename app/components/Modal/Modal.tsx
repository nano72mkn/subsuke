import { useState, type FC, type ReactNode } from "react"
import { useMediaQuery } from 'react-responsive'
import { Button } from "~/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog"
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "~/components/ui/drawer"

type Props = {
  title: string;
  description: string;
  children: (props: { onClose: () => void }) => ReactNode;
  footer?: ReactNode;
  trigger: ReactNode;
}

export const Modal: FC<Props> = ({ children, footer, title, description, trigger }) => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery({ minWidth: 768 });

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          { trigger }
        </DialogTrigger>
        <DialogDescription className="sr-only">
          { description}
        </DialogDescription>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{ title }</DialogTitle>
          </DialogHeader>
          {
            children({
              onClose: () => setOpen(false)
            })
          }
          <DialogFooter>
            { footer }
            <DialogClose asChild>
              <Button type="button" variant="secondary">閉じる</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        { trigger }
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{ title }</DrawerTitle>
        </DrawerHeader>
        <div className="p-4">
          {
            children({
              onClose: () => setOpen(false)
            })
          }
        </div>
        <DrawerFooter className="pt-2">
          { footer }
          <DrawerClose asChild>
            <Button variant="outline">閉じる</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
