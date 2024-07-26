import { createSlice } from "@reduxjs/toolkit";

const initialState = { socketConnected: false };
const client = createSlice({
  name: "client",
  initialState,
  reducers: {
    setSocketConnected: (state, action) => {
      return {
        ...state,
        socketConnected: action.payload,
      };
    },
  },
});

export const { setSocketConnected } = client.actions;
export default client;
