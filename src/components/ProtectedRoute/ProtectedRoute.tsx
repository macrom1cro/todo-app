import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchUserProfile } from '../../store/slices/authSlice';
import { Box, CircularProgress } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

function ProtectedRoute({ 
  children, 
  requireAuth = true 
}: ProtectedRouteProps) {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { token, user, status } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user && status !== 'loading') {
      dispatch(fetchUserProfile());
    }
  }, [token, user, status, dispatch]);

  if (!requireAuth && token) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (requireAuth) {

    if (!token) {
      return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (status === 'loading' && !user) {
      return (
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight="400px"
        >
          <CircularProgress />
        </Box>
      );
    }
  }

  return <>{children}</>;
}

export default ProtectedRoute;