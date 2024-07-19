import { createSlice } from "@reduxjs/toolkit";

const initialState = null;
const note = createSlice({
  name: "note",
  initialState,
  reducers: {
    setNote: (state, action) => {
      return action.payload;
    },
  },
});
export const { setNote } = note.actions;

export default note;
