import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "@/store/counterSlice";

// Add each new feature's reducer here as one more key — this is the single
// place the whole app's state shape is assembled.
export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});
