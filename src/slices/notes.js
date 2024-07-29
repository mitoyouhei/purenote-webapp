import { createSlice } from "@reduxjs/toolkit";

const initialState = {};
const notes = createSlice({
  name: "notes",
  initialState,
  reducers: {
    setNotes: (state, action) => {
      return { ...state, [action.payload.folderId]: action.payload };
    },
  },
});
export const { setNotes } = notes.actions;

export default notes;
