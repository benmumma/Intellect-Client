import { createClient } from '@supabase/supabase-js';
import { 
    REACT_APP_II_SUPABASE_KEY, 
    REACT_APP_II_SUPABASE_URL,
    REACT_APP_SUPABASE_URL,
    REACT_APP_SUPABASE_KEY
} from './constants';

// Dynamic client selection based on environment variable
const useNewInstance = process.env.REACT_APP_USE_NEW_SUPABASE === 'true';

export const ii_supabase = createClient(
    useNewInstance ? REACT_APP_SUPABASE_URL : REACT_APP_II_SUPABASE_URL,
    useNewInstance ? REACT_APP_SUPABASE_KEY : REACT_APP_II_SUPABASE_KEY
);

// Legacy client for fallback if needed
export const ii_supabase_legacy = createClient(
    REACT_APP_II_SUPABASE_URL,
    REACT_APP_II_SUPABASE_KEY
);

// Centralized auth integration helpers
// Apply centralized auth tokens to the Supabase client so RLS-authenticated queries work
export async function setIISupabaseSession(session) {
  try {
    const access_token = session?.access_token;
    const refresh_token = session?.refresh_token;
    if (!access_token || !refresh_token) {
      // Missing tokens; cannot initialize Supabase auth session
      return { ok: false, reason: 'missing_tokens' };
    }
    const { data, error } = await ii_supabase.auth.setSession({ access_token, refresh_token });
    if (error) return { ok: false, error };
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: e };
  }
}

export async function clearIISupabaseSession() {
  try {
    await ii_supabase.auth.signOut();
  } catch (e) {
    // no-op; best effort
  }
}
