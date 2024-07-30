import { createSlice } from "@reduxjs/toolkit";

const initialState = { socketConnected: false, errorMessage: null };
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
    setErrorMessage: (state, action) => {
      return {
        ...state,
        errorMessage: action.payload,
      };
    },
  },
});

export const { setSocketConnected, setErrorMessage } = client.actions;
export default client;
