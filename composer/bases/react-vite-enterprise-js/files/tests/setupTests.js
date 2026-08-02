import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// RTL's automatic per-test cleanup relies on detecting global test hooks
// (`afterEach`); this project deliberately runs without `test.globals: true`
// (test files import `describe`/`it`/`expect` from "vitest" explicitly — see
// vite.config.js), so cleanup is registered explicitly here instead.
afterEach(() => {
  cleanup();
});
