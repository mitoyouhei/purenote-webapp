import supabase from "./supabase";

export { supabase };

export const createNote = async () => {
  const { data, error } = await supabase.from("notes").insert([{}]).select();

  if (error) {
    console.error("Error creating note:", error);
    return null;
  }

  return data;
};