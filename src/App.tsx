import { Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { CreateEmployee } from './pages/CreateEmployee';
import { AuthPage } from './pages/AuthPage'; // <--- Importe aqui

function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} /> 
      
      {/* Rotas Protegidas (Futuramente) */}
      <Route path="/" element={
        <MainLayout>
          <Dashboard />
        </MainLayout>
      } />
      <Route path="/criar" element={
        <MainLayout>
          <CreateEmployee />
        </MainLayout>
      } />
    </Routes>
  );
}

export default App;