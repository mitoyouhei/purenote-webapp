import supabase from "./supabase";
import { handleSupabaseOperation } from "./utils";
import { Note, NoteResponse, FolderData, RootFolder, FolderResponse } from "./types";

export { supabase };

export function addNoteToFolder(
  folders: FolderData[],
  targetFolderId: string,
  noteId: string
): void {
  for (const folder of folders) {
    if (folder.id === targetFolderId) {
      folder.notes = folder.notes ?? [];
      folder.notes.push(noteId);
      return;
    }
    if (Array.isArray(folder.folders)) {
      addNoteToFolder(folder.folders, targetFolderId, noteId);
    }
  }
}

export function findFolderById(folders: FolderData[], folderId: string): FolderData | null {
  for (const folder of folders) {
    if (folder.id === folderId) {
      return folder;
    }
    if (Array.isArray(folder.folders)) {
      const result = findFolderById(folder.folders, folderId);
      if (result) {
        return result;
      }
    }
  }
  return null;
}

export function findFolderByNoteId(folders: FolderData[], noteId: string): FolderData | null {
  for (const folder of folders) {
    if (folder.notes?.includes(noteId)) {
      return folder;
    }
    if (Array.isArray(folder.folders)) {
      const result = findFolderByNoteId(folder.folders, noteId);
      if (result) {
        return result;
      }
    }
  }
  return null;
}

export const createNote = async (userId: string): Promise<NoteResponse> => {
  const response = await handleSupabaseOperation<Note>("createNote", async () => {
    return await supabase
      .from("notes")
      .insert([{ 
        user_id: userId,
        title: "Untitled",
        content: ""
      }])
      .select();
  });
  return {
    data: Array.isArray(response.data) && response.data.length > 0 ? response.data[0] : null,
    error: response.error
  };
};
export const initRootFolder = async (userId: string): Promise<FolderResponse> => {
  const response = await handleSupabaseOperation<RootFolder>("initRootFolder", async () => {
    const result = await supabase
      .from("folders")
      .upsert([{ 
        user_id: userId,
        name: "Root",
        notes: [],
        folders: [],
        root: { folders: [] }
      }])
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
  return {
    data: Array.isArray(response.data) && response.data.length > 0 ? response.data[0] : null,
    error: response.error
  };
};

export const getNotes = async (userId: string): Promise<Note[]> => {
  const response = await handleSupabaseOperation<Note[]>("getNotes", async () =>
    await supabase
      .from("notes")
      .select()
      .is("deleted_at", null)
      .order("updated_at", { ascending: false })
      .eq("user_id", userId),
    false
  );
  return response.data ?? [];
};

export const getRootFolder = async (userId: string): Promise<FolderResponse> => {
  const response = await handleSupabaseOperation<RootFolder>("getRootFolder", async () => {
    return await supabase
      .from("folders")
      .select()
      .is("deleted_at", null)
      .eq("user_id", userId)
      .single();
  });
  return {
    data: Array.isArray(response.data) && response.data.length > 0 ? response.data[0] : null,
    error: response.error
  };
};

export const updateFolder = async (userId: string, root: RootFolder): Promise<FolderResponse> => {
  const response = await handleSupabaseOperation<RootFolder>("updateFolder", async () => {
    return await supabase
      .from("folders")
      .update({ root })
      .eq("user_id", userId)
      .select();
  });
  return {
    data: Array.isArray(response.data) && response.data.length > 0 ? response.data[0] : null,
    error: response.error
  };
};

export const updateNoteTitle = async (
  id: string,
  title: string
): Promise<NoteResponse> => {
  return await handleSupabaseOperation<Note>("updateNoteTitle", async () =>
    await supabase.from("notes").update({ title }).eq("id", id).select()
  );
};

export const updateNoteContent = async (
  id: string,
  content: string
): Promise<NoteResponse> => {
  return await handleSupabaseOperation<Note>("updateNoteContent", async () =>
    await supabase.from("notes").update({ content }).eq("id", id).select()
  );
};

export const deleteNote = async (id: string): Promise<NoteResponse> => {
  return await handleSupabaseOperation<Note>("deleteNote", async () =>
    await supabase
      .from("notes")
      .update({ deleted_at: new Date() })
      .eq("id", id)
      .select()
  );
};

