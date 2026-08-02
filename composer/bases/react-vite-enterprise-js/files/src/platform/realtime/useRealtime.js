import { useContext } from "react";
import { RealtimeContext } from "@/platform/realtime/RealtimeProvider";

export function useRealtime() {
  const ctx = useContext(RealtimeContext);
  if (!ctx) throw new Error("useRealtime must be used within a RealtimeProvider");
  return ctx;
}
