import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { SupabaseError } from "./types";

const supabaseUrl = "https://zeqlfojypctkggihfdik.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplcWxmb2p5cGN0a2dnaWhmZGlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyODg2MDksImV4cCI6MjA1MDg2NDYwOX0.5SqVoUFni6vncoA_WYbPZUm70YMhCP6SkC1j48OEDOk";

let supabaseInstance: SupabaseClient | null = null;

function initializeSupabase(): SupabaseClient {
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseKey);
    } catch (error) {
      console.error(new SupabaseError("initializeSupabase", error as any));
      throw new Error("Failed to initialize Supabase client");
    }
  }
  return supabaseInstance;
}

// Initialize the client
const supabase = initializeSupabase();

// Add auth state change listener
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    console.log('User signed out');
  } else if (event === 'SIGNED_IN') {
    console.log('User signed in');
  } else if (event === 'TOKEN_REFRESHED') {
    console.log('Token refreshed');
  }
});

export default supabase;
