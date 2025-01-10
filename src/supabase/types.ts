import { PostgrestError, PostgrestSingleResponse, PostgrestResponse } from '@supabase/supabase-js';

export type SupabaseResponse<T> = PostgrestResponse<T>;
export type SupabaseSingleResponse<T> = {
  data: T | null;
  error: PostgrestError | null;
  count: number | null;
  status: number;
  statusText: string;
};

export interface Note {
  id: string;
  title: string | null;
  content: string | null;
  deleted_at: Date | null;
  created_at: string | null;
  updated_at: string | null;
  user_id: string;
}

export interface FolderData {
  id: string;
  name: string;
  folders: FolderData[] | null;
  notes: string[] | null;
}

export interface RootFolder {
  id: string;
  user_id: string;
  deleted_at: Date | null;
  root: {
    folders: FolderData[];
  };
  created_at: string | null;
  updated_at: string | null;
}

export type NoteResponse = SupabaseSingleResponse<Note>;
export type FolderResponse = SupabaseSingleResponse<RootFolder>;
export type NotesResponse = SupabaseResponse<Note[]>;

export class SupabaseError extends Error {
  public readonly operation: string;
  public readonly originalError: PostgrestError;

  constructor(operation: string, error: PostgrestError) {
    super(`${operation} failed: ${error.message}`);
    this.name = 'SupabaseError';
    this.operation = operation;
    this.originalError = error;
  }
}
