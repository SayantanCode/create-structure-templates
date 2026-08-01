import { useStore } from "../store/useStore";
import { Button } from "./Button";

// Demonstrates the store from src/store/useStore.ts — safe to delete once
// you've wired up your own state.
export function CounterDemo() {
  const { count, increment, decrement, reset } = useStore();
  return (
    <div className="demo-card counter-card">
      <h2>Counter</h2>
      <p className="counter-value gradient-text">{count}</p>
      <div className="counter-actions">
        <Button className="counter-icon-btn" onClick={decrement} aria-label="Decrement">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14" />
          </svg>
        </Button>
        <Button className="counter-icon-btn" onClick={increment} aria-label="Increment">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </Button>
      </div>
      <Button className="counter-reset" onClick={reset}>
        Reset
      </Button>
    </div>
  );
}
