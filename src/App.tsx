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
import { EditEmployeePage } from './pages/EditEmployeePage';
import { EditDepartmentPage } from './pages/EditDepartmentPage'; // Importação Nova

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

        {/* Rota de Criação de Colaborador */}
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

        {/* Rota de Edição de Colaborador */}
        <Route
          path="/editar/:id"
          element={
            <PrivateRoute>
              <MainLayout>
                <EditEmployeePage />
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

        {/* --- ROTA DE EDIÇÃO DE DEPARTAMENTO ATUALIZADA --- */}
        <Route
          path="/departamentos/editar/:id"
          element={
            <PrivateRoute>
              <MainLayout>
                <EditDepartmentPage /> 
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