import { PostgrestError } from '@supabase/supabase-js';

export interface SupabaseResponse<T> {
  data: T | null;  // T is either a single type or array type based on IsArray generic
  error: string | null;
}

export interface Note {
  id: string;
  title?: string;
  content?: string;
  deleted_at?: Date | null;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

export interface Folder {
  id: string;
  notes?: string[];
  folders?: Folder[];
  user_id?: string;
  deleted_at?: Date | null;
  root?: any;
  created_at?: string;
  updated_at?: string;
}

export type NoteResponse = SupabaseResponse<Note>;
export type FolderResponse = SupabaseResponse<Folder>;

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
