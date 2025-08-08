class CentralizedAuthLib {
  constructor() {
    this.authState = {
      isAuthenticated: false,
      user: null,
      session: null,
      appAccess: null,
    };
    this.listeners = [];
  }

  _buildAuthOrigin() {
    const urlEnv = process.env.REACT_APP_AUTH_URL;
    const portEnv = process.env.REACT_APP_AUTH_PORT;
    const omitPort = (p) => !p || p === '80' || p === '443';

    if (urlEnv) {
      // If url contains protocol, parse and use origin; if not, infer protocol
      if (/^https?:\/\//i.test(urlEnv)) {
        try {
          const parsed = new URL(urlEnv);
          // If URL already has a port, keep it; otherwise append portEnv if present and not 80/443
          const portPart = parsed.port
            ? `:${parsed.port}`
            : (!omitPort(portEnv) ? `:${portEnv}` : '');
          return `${parsed.protocol}//${parsed.hostname}${portPart}`;
        } catch {
          // fall through to non-protocol logic
        }
      }

      const isLocal = urlEnv.includes('localhost') || urlEnv.startsWith('127.');
      const protocol = isLocal ? 'http' : 'https';
      const portPart = !omitPort(portEnv) ? `:${portEnv}` : '';
      return `${protocol}://${urlEnv}${portPart}`;
    }

    const defaultDomain = 'auth.mumma.co';
    const portPart = !omitPort(process.env.REACT_APP_AUTH_PORT)
      ? `:${process.env.REACT_APP_AUTH_PORT}`
      : '';
    return `https://${defaultDomain}${portPart}`;
  }

  _getCookieDomain() {
    const hostname = window.location.hostname;
    if (hostname.endsWith('.mumma.local')) return '.mumma.local';
    if (hostname.endsWith('.mumma.co')) return '.mumma.co';
    return hostname;
  }

  getAuthState() {
    return this.authState;
  }

  setAuthState(newState) {
    this.authState = { ...this.authState, ...newState };
    this.listeners.forEach((cb) => {
      try { cb(this.authState); } catch (e) { /* no-op */ }
    });
  }

  clearAuthState() {
    this.setAuthState({
      isAuthenticated: false,
      user: null,
      session: null,
      appAccess: null,
    });
  }

  addListener(cb) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  async checkAuthStatus() {
    const origin = this._buildAuthOrigin();
    try {
      const response = await fetch(`${origin}/api/auth-status?ts=${Date.now()}`, {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
      });

      if (response.ok) {
        const authData = await response.json();
        // Accept multiple shapes from the auth service
        const appAccess = authData.appAccess || authData.app_access || {};
        const session = authData.session || authData.tokens || null;
        const user = authData.user || authData.profile || null;
        const isAuthenticated = !!(
          authData.authenticated === true ||
          authData.auth_status === 'success' ||
          user ||
          (session && (session.access_token || session.refresh_token))
        );

        if (isAuthenticated) {
          this.setAuthState({
            isAuthenticated: true,
            user: user || null,
            session: session || null,
            appAccess: appAccess,
          });

          const hasIntellectAccess = appAccess['intellect-inbox'] || appAccess['full-site'] || authData.hasIntellectAccess;
          return { authenticated: true, user: user || null, session: session || null, hasIntellectAccess: !!hasIntellectAccess };
        }
      }
    } catch (e) {
      // swallow and fall through to unauthenticated
      // console.error('Auth status check failed', e);
    }

    this.clearAuthState();
    return { authenticated: false };
  }

  signIn() {
    const origin = this._buildAuthOrigin();
    const returnTo = encodeURIComponent(window.location.href);
    window.location.href = `${origin}/auth?return_to=${returnTo}`;
  }

  async signOut() {
    const origin = this._buildAuthOrigin();
    try {
      await fetch(`${origin}/api/logout`, { method: 'POST', credentials: 'include' });
    } finally {
      this.clearAuthState();
      window.location.href = `${origin}/auth`;
    }
  }
}

export const centralizedAuth = new CentralizedAuthLib();
export default centralizedAuth;
