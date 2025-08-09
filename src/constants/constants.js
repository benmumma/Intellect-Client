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
export const REACT_APP_MUMAPPS_URL = process.env.REACT_APP_MUMAPPS_URL; // e.g., localhost or full https://host
export const REACT_APP_MUMAPPS_PORT = process.env.REACT_APP_MUMAPPS_PORT; // omit when 80/443

// Build the Auth service origin using envs. Mirrors logic in CentralizedAuthLib.
const omitPort = (p) => !p || p === '80' || p === '443';

export const AUTH_ORIGIN = (() => {
  const urlEnv = REACT_APP_AUTH_URL;
  const portEnv = REACT_APP_AUTH_PORT;

  if (urlEnv) {
    if (/^https?:\/\//i.test(urlEnv)) {
      try {
        const parsed = new URL(urlEnv);
        const portPart = parsed.port ? `:${parsed.port}` : (!omitPort(portEnv) ? `:${portEnv}` : '');
        return `${parsed.protocol}//${parsed.hostname}${portPart}`;
      } catch {
        // fall through
      }
    }

    const isLocal = urlEnv.includes('localhost') || urlEnv.startsWith('127.');
    const protocol = isLocal ? 'http' : 'https';
    const portPart = !omitPort(portEnv) ? `:${portEnv}` : '';
    return `${protocol}://${urlEnv}${portPart}`;
  }

  const defaultDomain = 'auth.mumma.co';
  const portPart = !omitPort(REACT_APP_AUTH_PORT) ? `:${REACT_APP_AUTH_PORT}` : '';
  return `https://${defaultDomain}${portPart}`;
})();

export const MANAGE_ACCOUNT_URL = `${AUTH_ORIGIN}/manage-account`;

export const MUMAPPS_ORIGIN = (() => {
  const urlEnv = REACT_APP_MUMAPPS_URL;
  const portEnv = REACT_APP_MUMAPPS_PORT;

  if (urlEnv) {
    if (/^https?:\/\//i.test(urlEnv)) {
      try {
        const parsed = new URL(urlEnv);
        const portPart = parsed.port ? `:${parsed.port}` : (!omitPort(portEnv) ? `:${portEnv}` : '');
        return `${parsed.protocol}//${parsed.hostname}${portPart}`;
      } catch {
        // fall through
      }
    }

    const isLocal = urlEnv.includes('localhost') || urlEnv.startsWith('127.');
    const protocol = isLocal ? 'http' : 'https';
    const portPart = !omitPort(portEnv) ? `:${portEnv}` : '';
    return `${protocol}://${urlEnv}${portPart}`;
  }

  const defaultDomain = 'mumapps.mumma.co';
  const portPart = !omitPort(REACT_APP_MUMAPPS_PORT) ? `:${REACT_APP_MUMAPPS_PORT}` : '';
  return `https://${defaultDomain}${portPart}`;
})();

export const MUMAPPS_HOME_URL = `${MUMAPPS_ORIGIN}/`;



