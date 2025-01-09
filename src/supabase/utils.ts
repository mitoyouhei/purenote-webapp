import { PostgrestError, PostgrestResponse } from '@supabase/supabase-js';
import supabase from './supabase';
import { SupabaseError, SupabaseResponse } from './types';

export async function checkAuth(): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession();
  return session !== null;
}

export async function handleSupabaseOperation<T, IsArray extends boolean = false>(
  operation: string,
  action: () => Promise<PostgrestResponse<IsArray extends true ? T[] : T>> | PostgrestResponse<IsArray extends true ? T[] : T>
): Promise<SupabaseResponse<IsArray extends true ? T[] : T>> {
  if (!(await checkAuth())) {
    return {
      data: null,
      error: 'Authentication required'
    };
  }

  try {
    const { data, error } = await Promise.resolve(action());
    
    if (error) {
      console.error(new SupabaseError(operation, error));
      return {
        data: null,
        error: error.message
      };
    }

    if (!data || Array.isArray(data) && data.length === 0) {
      return {
        data: null,
        error: 'No data found'
      };
    }

    // Return data as-is, TypeScript will ensure correct typing through generics
    return {
      data: data as IsArray extends true ? T[] : T,
      error: null
    };
  } catch (err) {
    console.error(`Unexpected error in ${operation}:`, err);
    return {
      data: null,
      error: 'An unexpected error occurred'
    };
  }
}
