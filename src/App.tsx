import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { CreateEmployee } from './pages/CreateEmployee';
import { AuthPage } from './pages/AuthPage';
import { PrivateRoute } from './components/auth/PrivateRoute';
import { useAuth } from './hooks/useAuth';
import { NotFoundPage } from './pages/NotFoundPage';
import { DepartmentsPage } from './pages/DepartmentsPage';
import { CreateDepartment } from './pages/CreateDepartment';
import { Toaster } from 'sonner';

function App() {
  const { userLoggedIn, currentUser } = useAuth();
  const canAccessDashboard = userLoggedIn && currentUser?.emailVerified;

  return (
    <>
      <Toaster
        richColors
        position="top-right"
        theme="light"
      />
      <Routes>
        <Route
          path="/login"
          element={canAccessDashboard ? <Navigate to="/" replace /> : <AuthPage />}
        />

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

        {/* Rota de Criação */}
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

        {/* --- NOVA ROTA DE EDIÇÃO --- */}
        <Route
          path="/editar/:id"
          element={
            <PrivateRoute>
              <MainLayout>
                <CreateEmployee />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/departamentos"
          element={
            <PrivateRoute>
              <MainLayout>
                <DepartmentsPage />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/departamentos/criar"
          element={
            <PrivateRoute>
              <MainLayout>
                <CreateDepartment />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/departamentos/editar/:id"
          element={
            <PrivateRoute>
              <MainLayout>
                <CreateDepartment />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;