import { PostgrestError } from '@supabase/supabase-js';

export interface SupabaseResponse<T> {
  data: T | null;
  error: string | null;
}

export interface Note {
  id: string;
  title?: string;
  content?: string;
  deleted_at?: Date | null;
  created_at?: string;
  updated_at?: string;
}

export type NoteResponse = SupabaseResponse<Note>;

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
