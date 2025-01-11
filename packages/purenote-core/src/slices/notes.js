import { createSlice } from "@reduxjs/toolkit";
import { RESET_APP } from ".";

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
    builder.addCase(RESET_APP, () => initialState); // 重置为初始状态
  },
});
export const { setNotes } = notes.actions;

export default notes;
