import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Box, CircularProgress } from '@mui/material';
import type { ReactNode } from 'react';

interface PrivateRouteProps {
  children: ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { userLoggedIn, loading, currentUser } = useAuth();

  // 1. Enquanto o Firebase verifica o login, mostra um loading
  if (loading) {
    return (
      <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

    // 2. Se terminou de carregar e NÃO tem usuário, vai para o login
  if (!userLoggedIn) {
    return <Navigate to="/login" replace />;
  }

    // 3. Se tem usuário, renderiza a página protegida
  if (userLoggedIn && !currentUser?.emailVerified) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};