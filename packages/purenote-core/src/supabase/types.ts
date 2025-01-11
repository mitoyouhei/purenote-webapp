import { PostgrestError, PostgrestSingleResponse } from '@supabase/supabase-js';

export type SupabaseResponse<T> = PostgrestSingleResponse<T>;

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

export type NoteResponse = SupabaseResponse<Note>;
export type FolderResponse = SupabaseResponse<RootFolder>;

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
