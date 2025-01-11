import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zeqlfojypctkggihfdik.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplcWxmb2p5cGN0a2dnaWhmZGlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyODg2MDksImV4cCI6MjA1MDg2NDYwOX0.5SqVoUFni6vncoA_WYbPZUm70YMhCP6SkC1j48OEDOk";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
