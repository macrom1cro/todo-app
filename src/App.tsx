import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAppDispatch } from "./store/hooks";
import { initializeAuth } from "./store/slices/authSlice";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import HomePage from "./pages/HomePage/HomePage";
import LoginForm from "./pages/LoginForm/LoginForm";
import RegisterForm from "./pages/RegisterForm/RegisterForm";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import styled from "styled-components";
import type { Theme } from "./theme/themes";
import { Box, CircularProgress } from "@mui/material";
import Time from "./components/Time/Time";

const AppContainer = styled.div<{ theme: Theme }>`
  background-color: ${props => props.theme.body};
  color: ${props => props.theme.text};
  min-height: 100vh;
  padding: 20px;
  transition: background-color 0.3s ease, color 0.3s ease;
`;

function App() {
  const dispatch = useAppDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await dispatch(initializeAuth()).unwrap();
      } catch (error) {
        console.error("Failed to initialize app:", error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, [dispatch]);

  if (!isInitialized) {
    return (
      <ThemeProvider>
        <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
          minHeight='100vh'
        >
          <CircularProgress size={60} />
        </Box>
      </ThemeProvider>
    );
  }
  return (
    <ThemeProvider>
      <Router>
        <AppContainer>
          <Time />
          <Routes>
            <Route
              path='/login'
              element={
                <ProtectedRoute requireAuth={false}>
                  <LoginForm />
                </ProtectedRoute>
              }
            />
            <Route
              path='/register'
              element={
                <ProtectedRoute requireAuth={false}>
                  <RegisterForm />
                </ProtectedRoute>
              }
            />

            <Route
              path='/'
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile'
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path='/404' element={<NotFoundPage />} />
            <Route path='*' element={<Navigate to='/404' replace />} />
          </Routes>
        </AppContainer>
      </Router>
    </ThemeProvider>
  );
}

export default App;
