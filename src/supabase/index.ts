import supabase from "./supabase";

export { supabase };


export function addNoteToFolder(
  folder: any,
  targetFolderId: string,
  noteId: string
) {
  if (folder.id === targetFolderId) {
    folder.notes = folder.notes ?? [];
    folder.notes.push(noteId);
  } else if (Array.isArray(folder.folders)) {
    for (const subFolder of folder.folders) {
      addNoteToFolder(subFolder, targetFolderId, noteId);
    }
  }
}
export function findFolderById(folder: any, folderId: any): any | null {
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
export function findFolderByNoteId(folder: any, noteId: any): any | null {
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

export const createNote = async () => {
  const { data, error } = await supabase.from("notes").insert([{}]).select();

  if (error) {
    console.error("Error creating note:", error);
    return null;
  }
  return data[0];
};
export const initRootFolder = async (userId: string) => {
  const { data, error } = await supabase
    .from("folders")
    .upsert([{}])
    .eq("user_id", userId)
    .select();

  if (error) {
    console.error("Error creating root folder:", error);
    if (error.code === "23505") {
      return await getRootFolder(userId);
    }
    return null;
  }
  return data[0];
};
export const getAllNotes = async (userId: string) => {
  const { data } = await supabase
    .from("notes")
    .select()
    .order("updated_at", { ascending: false })
    .eq("user_id", userId);
  return data ?? [];
};

export const getRootFolder = async (userId: string) => {
  const { data } = await supabase
    .from("folders")
    .select()
    .is("deleted_at", null)
    .eq("user_id", userId);
  return data?.[0];
};
export const updateFolder = async (userId: string, root: any) => {
  const { data, error } = await supabase
    .from("folders")
    .update({ root })
    .eq("user_id", userId)
    .select();

  if (error) {
    console.error("Error updating root folder:", error);
    return null;
  }
  return data[0];
};

export const updateNoteTitle = async (id: string, title: string) => {
  const { data, error } = await supabase
    .from("notes")
    .update({ title })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating note title:", error);
    return null;
  }
  return data[0];
};

export const updateNoteContent = async (id: string, content: string) => {
  const { data, error } = await supabase
    .from("notes")
    .update({ content })
    .eq("id", id)
    .select();
  if (error) {
    console.error("Error updating note content:", error);
    return null;
  }
  return data[0];
};

export const deleteNote = async (id: string) => {
  const { data, error } = await supabase
    .from("notes")
    .update({ deleted_at: new Date() })
    .eq("id", id)
    .select();
  if (error) {
    console.error("Error deleting note:", error);
    return null;
  }
  return data[0];
};

export const deleteNotes = async (ids: string[]) => {
  const { data, error } = await supabase
    .from("notes")
    .update({ deleted_at: new Date() })
    .in("id", ids)
    .select();

  if (error) {
    console.error("Error deleting notes:", error);
    return null;
  }
  return data;
};



export const restoreNote = async (id: string) => {
  const { data, error } = await supabase
    .from("notes")
    .update({ deleted_at: null })
    .eq("id", id)
    .select();
  if (error) {
    console.error("Error restoring note:", error);
    return null;
  }
  return data[0];
};

