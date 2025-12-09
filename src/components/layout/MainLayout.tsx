import { Box, useMediaQuery, useTheme } from '@mui/material';
import { type ReactNode, useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

const DRAWER_WIDTH = 280;

export const MainLayout = ({ children }: MainLayoutProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      
      <Sidebar 
        isMobile={isMobile}
        drawerOpen={drawerOpen}
        onDrawerClose={handleDrawerClose}
      />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          width: isMobile ? '100%' : `calc(100% - ${DRAWER_WIDTH}px)`,
          bgcolor: 'background.default',
        }}
      >
        <Header isMobile={isMobile} onMenuClick={handleDrawerOpen} />

        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            px: { xs: 2, lg: 5 }, 
            pt: '12px', 
            pb: 5 
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};