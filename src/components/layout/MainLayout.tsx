import { Box, Toolbar } from '@mui/material';
import { type ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

const DRAWER_WIDTH = 280;

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* 1. Header Fixo no Topo */}
      <Header />

      {/* 2. Sidebar Fixa na Esquerda */}
      <Sidebar />

      {/* 3. Área de Conteúdo */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default', 
          minHeight: '100vh',
          p: 3,
          width: `calc(100% - ${DRAWER_WIDTH}px)`,
        }}
      >
        {/* Espaçador para o Header fixo */}
        <Toolbar sx={{ height: 80 }} /> 
        
        {children}
      </Box>
    </Box>
  );
};