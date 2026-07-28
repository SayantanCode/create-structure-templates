import { useStore } from "../store/useStore";
import { Button } from "./Button";

// Demonstrates the store from src/store/useStore.ts — safe to delete once
// you've wired up your own state.
export function CounterDemo() {
  const { count, increment, reset } = useStore();
  return (
    <div>
      <p>Count: {count}</p>
      <Button onClick={increment}>Increment</Button>{" "}
      <Button onClick={reset}>Reset</Button>
    </div>
  );
}
