import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/store/authSlice";
import contactsReducer from "@/features/contacts/store/contactsSlice";

// Static combineReducers — one import + one key per feature slice. This is
// the standard RTK pattern and doesn't need refactoring even at "100+
// features"; it's O(1) friction per feature added. See this base's README
// for why dynamic reducer injection isn't used instead.
export const rootReducer = combineReducers({
  auth: authReducer,
  contacts: contactsReducer,
});
