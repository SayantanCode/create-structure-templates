import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { contactsApi } from "@/features/contacts/api/contactsApi";
import { mapApiContacts } from "@/features/contacts/services/contactsService";

export const fetchContacts = createAsyncThunk("contacts/fetch", async (_arg, { rejectWithValue }) => {
  try {
    const data = await contactsApi.list();
    return mapApiContacts(data);
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const createContact = createAsyncThunk("contacts/create", async (payload, { rejectWithValue }) => {
  try {
    const data = await contactsApi.create(payload);
    // JSONPlaceholder always returns id: 11 for a new /users POST regardless
    // of what's already in the list — good enough to prove the round trip,
    // not a real id generator.
    return { ...payload, id: data.id };
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const updateContact = createAsyncThunk("contacts/update", async ({ id, ...payload }, { rejectWithValue }) => {
  try {
    await contactsApi.update(id, payload);
    return { id, ...payload };
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const deleteContact = createAsyncThunk("contacts/delete", async (id, { rejectWithValue }) => {
  try {
    await contactsApi.remove(id);
    return id;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const contactsSlice = createSlice({
  name: "contacts",
  initialState: {
    items: [],
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createContact.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        const index = state.items.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) state.items[index] = { ...state.items[index], ...action.payload };
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
      });
  },
});

export default contactsSlice.reducer;
