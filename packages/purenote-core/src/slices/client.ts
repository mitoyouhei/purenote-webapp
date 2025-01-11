import { createSlice } from "@reduxjs/toolkit";

interface ClientState {
  errorMessage: string | null;
  noteSiderbarWidth: number;
  initializedUserSession: boolean;
}

const initialState: ClientState = {
  errorMessage: null,
  noteSiderbarWidth: 300,
  initializedUserSession: false,
};

const client = createSlice({
  name: "client",
  initialState,
  reducers: {
    setNoteSiderbarWidth: (state, action) => {
      return {
        ...state,
        noteSiderbarWidth: action.payload,
      };
    },
    setInitializedUserSession: (state, action) => {
      return {
        ...state,
        initializedUserSession: action.payload,
      };
    },
    setErrorMessage: (state, action) => {
      return {
        ...state,
        errorMessage: action.payload,
      };
    },
    clearErrorMessage: (state) => {
      return {
        ...state,
        errorMessage: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase("RESET_APP", () => initialState);
  },
});

export const {
  setInitializedUserSession,
  setErrorMessage,
  setNoteSiderbarWidth,
  clearErrorMessage,
} = client.actions;

export default client.reducer;
