export const SERVER_PORT = process.env.REACT_APP_SERVER_PORT;
export const SERVER_URL = process.env.REACT_APP_SERVER_URL;
export const API_BASE_URL = `${SERVER_URL}:${SERVER_PORT}/`;
export const REACT_APP_II_SUPABASE_URL = process.env.REACT_APP_II_SUPABASE_URL;
export const REACT_APP_II_SUPABASE_KEY = process.env.REACT_APP_II_SUPABASE_ANON_KEY;

// New Supabase instance variables
// Prefer REACT_APP_SUPABASE_*; fall back to REACT_APP_NEW_SUPABASE_* if present
export const REACT_APP_SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || process.env.REACT_APP_NEW_SUPABASE_URL;
export const REACT_APP_SUPABASE_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || process.env.REACT_APP_NEW_SUPABASE_ANON_KEY;

export const app_name = 'IntellectInbox';

// Centralized auth toggle and config
export const REACT_APP_USE_CENTRALIZED_AUTH = process.env.REACT_APP_USE_CENTRALIZED_AUTH === 'true';
export const REACT_APP_AUTH_URL = process.env.REACT_APP_AUTH_URL; // e.g., localhost or full https://host
export const REACT_APP_AUTH_PORT = process.env.REACT_APP_AUTH_PORT; // omit when 80/443
