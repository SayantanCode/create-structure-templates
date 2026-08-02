import { useCallback, useState } from "react";

// The open/close boolean + handlers every dialog/menu/drawer needs:
// `const { isOpen, open, close, toggle } = useDisclosure()`.
export function useDisclosure(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  return { isOpen, open, close, toggle };
}
