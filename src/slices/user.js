import { createSlice } from "@reduxjs/toolkit";

const initialState = null;
const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const user = action.payload;
      return user;
    },
    clearUser: (state, action) => {
      return null;
    },
  },
});

export const { setUser, clearUser } = user.actions;
export default user;
