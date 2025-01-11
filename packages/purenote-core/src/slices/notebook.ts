import { createSlice } from "@reduxjs/toolkit";

interface NoteModel {
  id: string;
  name: string;
}

interface NotebookModel {
  id: string;
  name: string;
  notes: NoteModel[];
}

interface NotebookState {
  notebooks: NotebookModel[];
}

const initialState: NotebookState = {
  notebooks: [],
};

const notebook = createSlice({
  name: "notebook",
  initialState,
  reducers: {
    setNotebooks: (state, action) => {
      return { ...state, notebooks: action.payload };
    },
    setNotes: (state, action) => {
      const { notebookId, notes } = action.payload;
      const notebooks = state.notebooks.map((notebook) => {
        if (notebook.id === notebookId) {
          return { ...notebook, notes };
        }
        return notebook;
      });
      return { ...state, notebooks };
    },
  },
  extraReducers: (builder) => {
    builder.addCase("RESET_APP", () => initialState);
  },
});

export const { setNotebooks, setNotes } = notebook.actions;
export default notebook.reducer;
