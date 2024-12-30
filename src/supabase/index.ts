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
