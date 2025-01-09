import supabase from "./supabase";
import { handleSupabaseOperation } from "./utils";
import { Note, NoteResponse, Folder, FolderResponse, SupabaseError } from "./types";

export { supabase };

export function addNoteToFolder(
  folder: Folder,
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

export function findFolderById(folder: Folder, folderId: string): Folder | null {
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

export function findFolderByNoteId(folder: Folder, noteId: string): Folder | null {
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

export const createNote = async (): Promise<NoteResponse> => {
  return handleSupabaseOperation<Note>("createNote", async () => {
    return await supabase.from("notes").insert([{}]).select();
  });
};
export const initRootFolder = async (userId: string): Promise<FolderResponse> => {
  return handleSupabaseOperation<Folder>("initRootFolder", async () => {
    const result = await supabase
      .from("folders")
      .upsert([{ user_id: userId }])
      .eq("user_id", userId)
      .select();

    if (result.error?.code === "23505") {
      return await supabase
        .from("folders")
        .select()
        .is("deleted_at", null)
        .eq("user_id", userId)
        .single();
    }
    return result;
  });
};

export const getNotes = async (userId: string): Promise<Note[]> => {
  const { data, error } = await supabase
    .from("notes")
    .select()
    .is("deleted_at", null)
    .order("updated_at", { ascending: false })
    .eq("user_id", userId);
  
  if (error) {
    console.error(new SupabaseError("getNotes", error));
    return [];
  }
  return data ?? [];
};

export const getRootFolder = async (userId: string): Promise<FolderResponse> => {
  return handleSupabaseOperation<Folder>("getRootFolder", async () => {
    return await supabase
      .from("folders")
      .select()
      .is("deleted_at", null)
      .eq("user_id", userId)
      .single();
  });
};

export const updateFolder = async (userId: string, root: Folder): Promise<FolderResponse> => {
  return handleSupabaseOperation<Folder>("updateFolder", async () => {
    return await supabase
      .from("folders")
      .update({ root })
      .eq("user_id", userId)
      .select();
  });
};

export const updateNoteTitle = async (
  id: string,
  title: string
): Promise<NoteResponse> => {
  return handleSupabaseOperation<Note>("updateNoteTitle", async () => {
    return await supabase.from("notes").update({ title }).eq("id", id).select();
  });
};

export const updateNoteContent = async (
  id: string,
  content: string
): Promise<NoteResponse> => {
  return handleSupabaseOperation<Note>("updateNoteContent", async () => {
    return await supabase.from("notes").update({ content }).eq("id", id).select();
  });
};

export const deleteNote = async (id: string): Promise<NoteResponse> => {
  return handleSupabaseOperation<Note>("deleteNote", async () => {
    return await supabase
      .from("notes")
      .update({ deleted_at: new Date() })
      .eq("id", id)
      .select();
  });
};

