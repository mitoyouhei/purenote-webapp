import { Note, NoteResponse, FolderResponse, RootFolder, FolderData } from './types';
import { handleSupabaseOperation } from './utils';
import supabase from './supabase';
import { PostgrestResponse, PostgrestSingleResponse } from '@supabase/supabase-js';

export const createNote = async (): Promise<Note | null> => {
  const { data } = await handleSupabaseOperation<Note>("createNote", async () =>
    await supabase.from("notes").insert([{}]).select().single()
  );
  return data;
};

export const updateNoteTitle = async (
  id: string,
  title: string
): Promise<Note | null> => {
  const { data } = await handleSupabaseOperation<Note>("updateNoteTitle", async () =>
    await supabase.from("notes").update({ title }).eq("id", id).select().single()
  );
  return data;
};

export const updateNoteContent = async (
  id: string,
  content: string
): Promise<Note | null> => {
  const { data } = await handleSupabaseOperation<Note>("updateNoteContent", async () =>
    await supabase.from("notes").update({ content }).eq("id", id).select().single()
  );
  return data;
};

export const deleteNote = async (id: string): Promise<Note | null> => {
  const { data } = await handleSupabaseOperation<Note>("deleteNote", async () =>
    await supabase.from("notes").update({ deleted_at: new Date() }).eq("id", id).select().single()
  );
  return data;
};

export const deleteNotes = async (ids: string[]): Promise<Note[]> => {
  const { data } = await handleSupabaseOperation<Note>("deleteNotes", async () =>
    await supabase
      .from("notes")
      .update({ deleted_at: new Date() })
      .in("id", ids)
      .select(),
    false
  );
  return Array.isArray(data) ? data : [];
};

export const restoreNote = async (id: string): Promise<Note | null> => {
  const { data } = await handleSupabaseOperation<Note>("restoreNote", async () =>
    await supabase.from("notes").update({ deleted_at: null }).eq("id", id).select().single()
  );
  return data;
};

export const getAllNotes = async (userId: string): Promise<Note[]> => {
  const { data } = await handleSupabaseOperation<Note[]>("getAllNotes", async () =>
    await supabase
      .from("notes")
      .select()
      .order("updated_at", { ascending: false })
      .eq("user_id", userId),
    false
  );
  return data ?? [];
};

export const getRootFolder = async (userId: string): Promise<RootFolder | null> => {
  const { data } = await handleSupabaseOperation<RootFolder>("getRootFolder", async () =>
    await supabase
      .from("folders")
      .select()
      .is("deleted_at", null)
      .eq("user_id", userId)
      .single(),
    true
  );
  return data;
};

export const initRootFolder = async (userId: string): Promise<RootFolder | null> => {
  const { data } = await handleSupabaseOperation<RootFolder>("initRootFolder", async () =>
    await supabase
      .from("folders")
      .upsert([{ user_id: userId, root: { folders: [] } }])
      .select()
      .single()
  );
  
  if (!data) {
    return getRootFolder(userId);
  }
  return data;
};

export const updateFolder = async (userId: string, root: { folders: FolderData[] }): Promise<RootFolder | null> => {
  const { data } = await handleSupabaseOperation<RootFolder>("updateFolder", async () =>
    await supabase
      .from("folders")
      .update({ root })
      .eq("user_id", userId)
      .select()
      .single()
  );
  return data;
};

export function addNoteToFolder(
  folder: FolderData,
  targetFolderId: string,
  noteId: string
): void {
  if (folder.id === targetFolderId) {
    folder.notes = folder.notes ?? [];
    folder.notes.push(noteId);
  } else if (Array.isArray(folder.folders)) {
    for (const subFolder of folder.folders) {
      addNoteToFolder(subFolder, targetFolderId, noteId);
    }
  }
}

export function findFolderById(folder: FolderData, folderId: string): FolderData | null {
  if (folder.id === folderId) {
    return folder;
  }

  if (Array.isArray(folder.folders)) {
    for (const subFolder of folder.folders) {
      const result = findFolderById(subFolder, folderId);
      if (result) {
        return result;
      }
    }
  }
  return null;
}

export function findFolderByNoteId(folder: FolderData, noteId: string): FolderData | null {
  if (folder.notes?.includes(noteId)) {
    return folder;
  }

  if (Array.isArray(folder.folders)) {
    for (const subFolder of folder.folders) {
      const result = findFolderByNoteId(subFolder, noteId);
      if (result) {
        return result;
      }
    }
  }
  return null;
}
