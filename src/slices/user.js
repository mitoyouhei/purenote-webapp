import { createSlice } from "@reduxjs/toolkit";
import { RESET_APP } from ".";

const initialState = null;
const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const user = action.payload;
      return user;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(RESET_APP, () => initialState); // 重置为初始状态
  },
});

export const { setUser } = user.actions;
export default user;
