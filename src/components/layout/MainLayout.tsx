// src/components/layout/MainLayout.tsx
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

      {/* 3. Área de Conteúdo (O Placeholder Cinza) */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: '#F4F6F8', // Cor do Background Neutral 
          minHeight: '100vh',
          p: 3,
          width: `calc(100% - ${DRAWER_WIDTH}px)`,
        }}
      >
        {/* Esse Toolbar vazio serve para empurrar o conteúdo para baixo do Header fixo */}
        <Toolbar sx={{ height: 80 }} /> 
        
        {children}
      </Box>
    </Box>
  );
};