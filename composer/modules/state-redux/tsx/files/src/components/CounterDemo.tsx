import { useDispatch, useSelector } from "react-redux";
import { decrement, increment, reset } from "@/store/counterSlice";
import type { AppDispatch, RootState } from "@/store/store";
import { Button } from "@/components";

// Demonstrates the store from src/store/store.ts — safe to delete once
// you've wired up your own state.
export function CounterDemo() {
  const count = useSelector((state: RootState) => state.counter.count);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="demo-card counter-card">
      <h2>Counter</h2>
      <p className="counter-value gradient-text">{count}</p>
      <div className="counter-actions">
        <Button className="counter-icon-btn" onClick={() => dispatch(decrement())} aria-label="Decrement">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14" />
          </svg>
        </Button>
        <Button className="counter-icon-btn" onClick={() => dispatch(increment())} aria-label="Increment">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </Button>
      </div>
      <Button className="counter-reset" onClick={() => dispatch(reset())}>
        Reset
      </Button>
    </div>
  );
}
