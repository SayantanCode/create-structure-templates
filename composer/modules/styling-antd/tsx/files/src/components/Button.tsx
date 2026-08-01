import { MouseEventHandler, ReactNode } from "react";
import AntButton from "antd/es/button";

// A deliberately narrow, library-independent contract — spreading native
// ButtonHTMLAttributes here doesn't work: antd's own Button has a strict
// `color` union type that a loose `color?: string` (part of React's native
// HTMLAttributes) collides with, and antd's `type` prop means style variant
// ("primary"/"default"/...), not the native HTML button type our callers
// actually mean when they pass e.g. `type="submit"`.
interface ButtonProps {
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

export function Button({ children, type, ...props }: ButtonProps) {
  return (
    <AntButton type="primary" htmlType={type} {...props}>
      {children}
    </AntButton>
  );
}
