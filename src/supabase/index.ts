import supabase from "./supabase";
import { handleSupabaseOperation } from "./utils";
import { Note, NoteResponse } from "./types";

export { supabase };

export const createNote = async (): Promise<NoteResponse> => {
  return handleSupabaseOperation<Note>("createNote", () =>
    supabase.from("notes").insert([{}]).select()
  );
};

export const updateNoteTitle = async (
  id: string,
  title: string
): Promise<NoteResponse> => {
  return handleSupabaseOperation<Note>("updateNoteTitle", () =>
    supabase.from("notes").update({ title }).eq("id", id).select()
  );
};

export const updateNoteContent = async (
  id: string,
  content: string
): Promise<NoteResponse> => {
  return handleSupabaseOperation<Note>("updateNoteContent", () =>
    supabase.from("notes").update({ content }).eq("id", id).select()
  );
};

export const deleteNote = async (id: string): Promise<NoteResponse> => {
  return handleSupabaseOperation<Note>("deleteNote", () =>
    supabase
      .from("notes")
      .update({ deleted_at: new Date() })
      .eq("id", id)
      .select()
  );
};

