import { ReactNode } from "react";
import AntModal from "antd/es/modal";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

// antd uses onCancel, not onClose, and shows its own OK/Cancel footer by
// default — footer={null} keeps this a plain content dialog.
export function Modal({ open, onClose, children }: ModalProps) {
  return (
    <AntModal open={open} onCancel={onClose} footer={null}>
      {children}
    </AntModal>
  );
}
