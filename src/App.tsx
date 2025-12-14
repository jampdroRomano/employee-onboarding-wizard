import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { CreateEmployee } from './pages/CreateEmployee';
import { AuthPage } from './pages/AuthPage';
import { PrivateRoute } from './components/auth/PrivateRoute';
import { useAuth } from './contexts/AuthContext';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  const { userLoggedIn, currentUser } = useAuth();
  // Helper para saber se pode ir pro Dashboard
  // O usuário só entra se estiver logado E com e-mail verificado
  const canAccessDashboard = userLoggedIn && currentUser?.emailVerified;

  return (
    <Routes>
      {/* Rota Pública: Login */}
      <Route 
        path="/login" 
        element={canAccessDashboard ? <Navigate to="/" replace /> : <AuthPage />} 
      />

      {/* Rotas Protegidas */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/criar"
        element={
          <PrivateRoute>
            <MainLayout>
              <CreateEmployee />
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;