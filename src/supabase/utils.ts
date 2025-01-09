import { PostgrestError, PostgrestResponse } from '@supabase/supabase-js';
import supabase from './supabase';
import { SupabaseError, SupabaseResponse } from './types';

export async function checkAuth(): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession();
  return session !== null;
}

export async function handleSupabaseOperation<T>(
  operation: string,
  action: () => Promise<PostgrestResponse<T>> | PostgrestResponse<T>
): Promise<SupabaseResponse<T>> {
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

    // Handle both single object and array responses
    const result = Array.isArray(data) ? data[0] : data;
    
    return {
      data: result as T,
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
