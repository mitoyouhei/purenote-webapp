import { createSlice } from "@reduxjs/toolkit";

const initialState = [];
const folders = createSlice({
  name: "folders",
  initialState,
  reducers: {
    setFolders: (state, action) => {
      return action.payload;
    },
  },
});
export const { setFolders } = folders.actions;

export default folders;
