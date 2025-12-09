import { Box } from '@mui/material';
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
      
      <Sidebar />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          width: `calc(100% - ${DRAWER_WIDTH}px)`,
          bgcolor: 'background.default',
        }}
      >
        <Header />

        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            px: 5, 
            pt: '35px', 
            
            pb: 5 
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};