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
import ManageAccount from "./intellect_inbox/pages/ManageAccount.jsx";
import SubscriptionSuccess from "./intellect_inbox/pages/SubscriptionSuccess.jsx";


const ProtectedRoute = ({ children }) => {
  const { inboxState, loadingSession, checkAuthStatus, iiSession } = useIntellectInbox();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (!authChecked) {
        await checkAuthStatus();
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, [checkAuthStatus, authChecked]);

  if (loadingSession || !authChecked) {
    // Show loading state while checking authentication
    return <div>Loading...</div>;
  }

  if (!iiSession) {
    // Redirect to login page if there's no session
    return <Navigate to="/login" replace />;
  }

  // If we have a session but user data hasn't been fetched yet, show loading
  if (iiSession && (!inboxState.user_id || inboxState.userStatus !== 'signed_in')) {
    return <div>Loading user data...</div>;
  }

  // If we have a session and user data, render the protected content
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
            <Route path="/manage" element={<ProtectedRoute><ManageAccount /></ProtectedRoute>} />
            <Route path="/success" element={<ProtectedRoute><SubscriptionSuccess /></ProtectedRoute>} />
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
