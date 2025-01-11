// Redux slices
export { default as notesReducer, setNotes as setNotesInNotes } from './slices/notes';
export { default as clientReducer } from './slices/client';
export { default as notebookReducer, setNotes as setNotesInNotebook } from './slices/notebook';
export { RESET_APP } from './slices';

// Supabase
export { default as supabase } from './supabase/supabase';
export * from './supabase/types';
export * from './supabase/utils';
export {
  createNote,
  updateNoteTitle,
  updateNoteContent,
  deleteNote,
  initRootFolder,
  updateFolder,
  findFolderByNoteId,
  restoreNote,
  deleteNotes,
  getAllNotes,
  getRootFolder,
  findFolderById,
  addNoteToFolder
} from './supabase/operations';
export type { Note } from './supabase/types';

// Utils
export * from './utils/utils';
