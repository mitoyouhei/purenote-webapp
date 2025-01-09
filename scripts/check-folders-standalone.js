import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://zeqlfojypctkggihfdik.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplcWxmb2p5cGN0a2dnaWhmZGlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyODg2MDksImV4cCI6MjA1MDg2NDYwOX0.5SqVoUFni6vncoA_WYbPZUm70YMhCP6SkC1j48OEDOk";

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkFolders() {
  // Use test account credentials
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: 'fengzhe1983@gmail.com',
    password: 'jldnmoc9999'
  });

  if (signInError) {
    console.error('Sign in error:', signInError);
    return;
  }

  const { data: session } = await supabase.auth.getSession();
  const userId = session?.session?.user?.id;

  if (!userId) {
    console.error('No user ID found after sign in');
    return;
  }

  console.log('Checking folders for user:', userId);

  // Query all folders for the user
  const { data: folders, error: foldersError } = await supabase
    .from('folders')
    .select('*')
    .eq('user_id', userId);

  if (foldersError) {
    console.error('Error fetching folders:', foldersError);
    return;
  }

  console.log('\nFound folders:', folders?.length || 0);
  console.log('\nFolder details:');
  folders?.forEach((folder, index) => {
    console.log(`\nFolder ${index + 1}:`);
    console.log(JSON.stringify(folder, null, 2));
  });

  // Try single() to see if it fails
  const { data: singleFolder, error: singleError } = await supabase
    .from('folders')
    .select()
    .eq('user_id', userId)
    .single();

  if (singleError) {
    console.log('\nSingle() query error:', singleError.message);
    console.log('This indicates multiple folders exist - single() is not appropriate');
  } else {
    console.log('\nSingle folder query succeeded:', singleFolder);
    console.log('This indicates single() is appropriate for this user');
  }
}

checkFolders().catch(console.error);
