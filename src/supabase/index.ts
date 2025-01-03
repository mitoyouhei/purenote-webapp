import supabase from "./supabase";

export { supabase };

export const createNote = async () => {
  const { data, error } = await supabase.from("notes").insert([{}]).select();

  if (error) {
    console.error("Error creating note:", error);
    return null;
  }
  return data[0];
};
export const initRootFolder = async () => {
  const { data, error } = await supabase.from("folders").insert([{}]).select();

  if (error) {
    console.error("Error creating root folder:", error);
    return null;
  }
  return data[0];
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

