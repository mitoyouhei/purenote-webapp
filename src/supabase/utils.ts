import { PostgrestResponse, PostgrestSingleResponse } from '@supabase/supabase-js';
import supabase from './supabase';
import { SupabaseError, SupabaseResponse } from './types';

export async function checkAuth(): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession();
  return session !== null;
}

export async function handleSupabaseOperation<T>(
  operation: string,
  action: () => Promise<PostgrestResponse<T>>,
  isSingleItem: boolean = true
): Promise<PostgrestSingleResponse<T>> {
  if (!(await checkAuth())) {
    return {
      data: null,
      error: {
        message: 'Authentication required',
        details: '',
        hint: '',
        code: 'AUTH_ERROR',
        name: 'AuthenticationError'
      },
      count: null,
      status: 401,
      statusText: 'Unauthorized'
    };
  }

  try {
    const { data, error } = await Promise.resolve(action());
    
    if (error) {
      console.error(new SupabaseError(operation, error));
      return {
        data: null,
        error,
        count: null,
        status: error.code ? parseInt(error.code) : 500,
        statusText: error.message
      };
    }

    if (!data || (Array.isArray(data) && data.length === 0)) {
      return {
        data: null,
        error: {
          message: 'No data found',
          details: '',
          hint: '',
          code: 'NO_DATA',
          name: 'NoDataError'
        },
        count: null,
        status: 404,
        statusText: 'Not Found'
      };
    }

    // Handle both single object and array responses
    if (!isSingleItem) {
      // For array responses, ensure we have an array
      const dataArray = Array.isArray(data) ? data : data ? [data] : null;
      return {
        data: dataArray as T,
        error: null,
        count: Array.isArray(dataArray) ? dataArray.length : null,
        status: 200,
        statusText: 'OK'
      };
    }

    // For single item responses, return the first item if it's an array
    const singleItem = Array.isArray(data) ? data[0] : data;
    return {
      data: singleItem as T,
      error: null,
      count: null,
      status: 200,
      statusText: 'OK'
    };
  } catch (err) {
    console.error(`Unexpected error in ${operation}:`, err);
    return {
      data: null,
      error: {
        message: 'An unexpected error occurred',
        details: String(err),
        hint: '',
        code: 'INTERNAL_ERROR',
        name: 'InternalError'
      },
      count: null,
      status: 500,
      statusText: 'Internal Server Error'
    };
  }
}
