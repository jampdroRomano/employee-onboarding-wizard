import { Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { CreateEmployee } from './pages/CreateEmployee';
import { AuthPage } from './pages/AuthPage'; // <--- Importe aqui

function App() {
  return (
    // Se quiser ver o Login FORA do layout principal (sem sidebar), 
    // tire o AuthPage de dentro do MainLayout, ou crie uma rota separada.
    // Geralmente Login não tem Sidebar.
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