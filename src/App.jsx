import React, {useEffect, useState} from "react";
import {
  ChakraProvider,
} from '@chakra-ui/react';
import theme from "./general/theme";
import { Route, Routes, Navigate} from 'react-router-dom';

import IntellectInboxMain from "./intellect_inbox/IntellectInboxMain.jsx";
import { IntellectInboxProvider } from "./intellect_inbox/context/IntellectInboxContext";
import IntellectInboxUnsubscribe from "./intellect_inbox/pages/IntellectInboxUnsubscribe.jsx";

import Privacy from "./docs/Privacy.jsx";
import TermsOfService from "./docs/TermsOfService.jsx";
import Pricing from "./docs/Pricing.jsx";
import About from "./docs/About.jsx";
import NewSignup from "./account/pages/NewSignup.jsx";
import NewLogin from "./account/pages/NewLogin.jsx";
import NewSetPassword from "./account/pages/NewSetPassword.jsx";
import LessonPage from "./intellect_inbox/pages/LessonPage.jsx";
import AdminPage from "./intellect_inbox/pages/AdminPage.jsx";
import { CoursesProvider } from "./intellect_inbox/context/CoursesContext.jsx";
import { useIntellectInbox } from "./intellect_inbox/context/IntellectInboxContext";
import PasswordResetRequest from "./account/components/PasswordResetRequest.jsx";
import PublicCoursePage from "./intellect_inbox/public/PublicCoursePage.jsx";
import PublicDirectoryPage from "./intellect_inbox/public/PublicDirectoryPage.jsx";
import useCentralizedAuth from './auth/useCentralizedAuth';
import { MANAGE_ACCOUNT_URL } from "./constants/constants.js";


const ProtectedRoute = ({ children }) => {
  const { inboxState, loadingSession, checkAuthStatus, iiSession } = useIntellectInbox();
  const [authChecked, setAuthChecked] = useState(false);
  const useCentralized = process.env.REACT_APP_USE_CENTRALIZED_AUTH === 'true';
  const { isAuthenticated: cAuthenticated, hasIntellectAccess, loading: cLoading, signIn: cSignIn } = useCentralizedAuth();

  useEffect(() => {
    const checkAuth = async () => {
      if (!authChecked && !useCentralized) {
        await checkAuthStatus();
        setAuthChecked(true);
      } else if (!authChecked && useCentralized) {
        // centralized hook performs its own initial check
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, [checkAuthStatus, authChecked, useCentralized]);

  if (!useCentralized) {
    if (loadingSession || !authChecked) return <div>Loading...</div>;
    if (!iiSession) return <Navigate to="/login" replace />;
    if (iiSession && (!inboxState.user_id || inboxState.userStatus !== 'signed_in')) return <div>Loading user data...</div>;
    return children;
  }

  // Centralized auth flow
  if (cLoading || !authChecked) return <div>Loading...</div>;
  if (!cAuthenticated) {
    return (
      <div style={{ padding: 24 }}>
        <p>You need to sign in to continue.</p>
        <button onClick={() => cSignIn()}>Sign in</button>
      </div>
    );
  }
  if (!hasIntellectAccess) {
    return (
      <div style={{ padding: 24 }}>
        <p>This feature requires an Intellect Inbox or Full-Site subscription.</p>
        <a href={MANAGE_ACCOUNT_URL} rel="noreferrer">Manage subscription</a>
      </div>
    );
  }
  return children;
};

function App() {

  return (
    <ChakraProvider theme={theme}>
      <IntellectInboxProvider>
      <CoursesProvider>
      <Routes>
            <Route path="/" element={<IntellectInboxMain />} />
            <Route path="/signup" element={<NewSignup />} />
            <Route path="/signup/:app" element={<NewSignup />} />
            <Route path="/login/*" element={<NewLogin />} />
            <Route path="/login/:app" element={<NewLogin />} />
            <Route path="/setpassword/:app" element={<NewSetPassword />} />
            <Route path="/tos" element={<TermsOfService />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/intellectinbox" element={<IntellectInboxMain />}/>
            <Route path="/reset-password" element={<PasswordResetRequest />} />
            <Route 
              path="/intellectinbox/lesson/:lessonId" 
              element={
                <ProtectedRoute>
                  <LessonPage key={window.location.pathname}/>
                </ProtectedRoute>
              }
            />
            {/* Public Pages */}
            <Route path="/course/:course_id" element={<PublicCoursePage />} />
            <Route path="/courses" element={<PublicDirectoryPage />} />
            {/* End of Public Pages */}
            <Route path="/intellectinbox/unsubscribe" element={<IntellectInboxUnsubscribe />}/>
            <Route path="/intellectinbox/admin" element={<AdminPage />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />

      </Routes>
      </CoursesProvider>
      </IntellectInboxProvider>
    </ChakraProvider>
  );
}

export default App;
