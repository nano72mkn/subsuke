import { useState, type FC, type ReactNode } from "react"
import { ModalContent } from "./ModalContent"
import { ModalTrigger } from "./ModalTrigger"
import { ModalWrapper } from "./ModalWrapper"

type Props = {
  title: string;
  description: string;
  children: (props: { onClose: () => void }) => ReactNode;
  footer?: ReactNode;
  trigger: ReactNode;
}

export const Modal: FC<Props> = ({ children: Children, footer, title, description, trigger }) => {
  const [open, setOpen] = useState(false);

  return (
    <ModalWrapper open={open} onOpenChange={setOpen}>
      <ModalTrigger>
        {trigger}
      </ModalTrigger>
      <ModalContent title={title} description={description} footer={footer}>
        <Children onClose={() => setOpen(false)} />
      </ModalContent>
    </ModalWrapper>
  );
}
