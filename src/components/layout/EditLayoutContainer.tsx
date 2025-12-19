import type { ReactNode } from 'react';
import { Box, Paper, Grid, Typography } from '@mui/material';

interface EditLayoutContainerProps {
  children: ReactNode;
  activeTab: 'profile' | 'registration';
  onChangeTab: (tab: 'profile' | 'registration') => void;
}

export const EditLayoutContainer = ({ children, activeTab, onChangeTab }: EditLayoutContainerProps) => {
  
  const getTabStyle = (tabName: string) => ({
    borderRight: activeTab === tabName ? '3px solid #00C853' : '3px solid transparent',
    pr: 2, 
    cursor: 'pointer',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start', 
    transition: 'all 0.2s'
  });

  const getTextStyle = (tabName: string) => ({
    color: activeTab === tabName ? '#00C853' : '#9E9E9E', 
    fontWeight: activeTab === tabName ? 600 : 500,
    fontSize: '0.9rem'
  });

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 4, 
        borderRadius: 3, 
        boxShadow: '0px 4px 20px rgba(0,0,0,0.05)',
        minHeight: '600px'
      }}
    >
      <Grid container spacing={{ xs: 2, md: 6 }}>
        {/* SIDEBAR (ESQUERDA) */}
        <Grid item xs={12} md={3}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            
            {/* Botão: Perfil */}
            <Box 
              sx={getTabStyle('profile')} 
              onClick={() => onChangeTab('profile')}
            >
              <Typography sx={getTextStyle('profile')}>
                Perfil
              </Typography>
            </Box>

            {/* Botão: Dados de Cadastro */}
            <Box 
              sx={getTabStyle('registration')}
              onClick={() => onChangeTab('registration')}
            >
              <Typography sx={getTextStyle('registration')}>
                Dados de Cadastro
              </Typography>
            </Box>

          </Box>
        </Grid>

        {/* CONTEÚDO (DIREITA) */}
        <Grid item xs={12} md={9}>
          <Box sx={{ width: '100%', pr: { xs: 0, md: 6.25 } }}> {/* 6.25 * 8px = 50px */}
            {/* Título Dinâmico */}
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 4, color: '#333' }}>
              {activeTab === 'profile' ? 'Perfil' : 'Dados de Cadastro'}
            </Typography>
            
            {children}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};