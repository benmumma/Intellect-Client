import { useState, useEffect, useCallback } from 'react';
import centralizedAuth from './CentralizedAuthLib';

export const useCentralizedAuth = () => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    session: null,
    appAccess: null,
    loading: true,
    hasIntellectAccess: false,
  });

  const checkAuthStatus = useCallback(async () => {
    setAuthState((prev) => ({ ...prev, loading: true }));
    const authResult = await centralizedAuth.checkAuthStatus();

    setAuthState({
      isAuthenticated: authResult.authenticated,
      user: authResult.user || null,
      session: authResult.session || null,
      appAccess: centralizedAuth.getAuthState().appAccess || null,
      hasIntellectAccess:
        authResult.hasIntellectAccess ||
        !!centralizedAuth.getAuthState().appAccess?.['intellect-inbox'] ||
        !!centralizedAuth.getAuthState().appAccess?.['full-site'],
      loading: false,
    });

    return authResult;
  }, []);

  useEffect(() => {
    const unsubscribe = centralizedAuth.addListener((newAuthState) => {
      setAuthState((prev) => ({
        ...prev,
        isAuthenticated: newAuthState.isAuthenticated,
        user: newAuthState.user,
        session: newAuthState.session,
        appAccess: newAuthState.appAccess,
        hasIntellectAccess:
          !!newAuthState.appAccess?.['intellect-inbox'] ||
          !!newAuthState.appAccess?.['full-site'],
      }));
    });

    checkAuthStatus();
    return unsubscribe;
  }, [checkAuthStatus]);

  return {
    isAuthenticated: authState.isAuthenticated,
    user: authState.user,
    session: authState.session,
    appAccess: authState.appAccess,
    hasIntellectAccess: authState.hasIntellectAccess,
    loading: authState.loading,
    signIn: () => centralizedAuth.signIn(),
    signOut: () => centralizedAuth.signOut(),
    checkAuthStatus,
  };
};

export default useCentralizedAuth;
