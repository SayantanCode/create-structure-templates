import AntModal from "antd/es/modal";

// antd uses onCancel, not onClose, and shows its own OK/Cancel footer by
// default — footer={null} keeps this a plain content dialog.
export function Modal({ open, onClose, children }) {
  return (
    <AntModal open={open} onCancel={onClose} footer={null}>
      {children}
    </AntModal>
  );
}
