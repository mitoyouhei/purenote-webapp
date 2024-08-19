import { createSlice } from "@reduxjs/toolkit";
import { RESET_APP } from ".";

const initialState = [];
const folders = createSlice({
  name: "folders",
  initialState,
  reducers: {
    setFolders: (state, action) => {
      return action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(RESET_APP, () => initialState); // 重置为初始状态
  },
});
export const { setFolders } = folders.actions;

export default folders;
