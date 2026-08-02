import { createSelector } from "@reduxjs/toolkit";

export const selectContactsState = (state) => state.contacts;
export const selectContacts = (state) => state.contacts.items;
export const selectContactsStatus = (state) => state.contacts.status;

export const selectContactById = (id) =>
  createSelector(selectContacts, (contacts) => contacts.find((c) => c.id === id));
