import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { CreateEmployee } from './pages/CreateEmployee';
import { AuthPage } from './pages/AuthPage';
import { PrivateRoute } from './components/auth/PrivateRoute';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { userLoggedIn } = useAuth();

  return (
    <Routes>
      {/* Rota Pública: Login*/}
      <Route 
        path="/login" 
        element={userLoggedIn ? <Navigate to="/" replace /> : <AuthPage />} 
      />

      {/* Rotas Protegidas (Agrupadas) */}
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

      {/* Rota pega-tudo (404) -> Manda para home ou login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;