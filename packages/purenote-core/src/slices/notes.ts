import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const notes = createSlice({
  name: "notes",
  initialState,
  reducers: {
    setNotes: (state, action) => {
      return { ...state, [action.payload.id]: action.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase("RESET_APP", () => initialState);
  },
});

export const { setNotes } = notes.actions;
export default notes.reducer;
