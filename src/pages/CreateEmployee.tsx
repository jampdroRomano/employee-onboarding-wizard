import { Box, Paper } from '@mui/material';
import { AppBreadcrumbs } from '../components/common/AppBreadcrumbs';
import { OnboardingProgress } from '../components/common/OnboardingProgress'; // Importe o componente

export const CreateEmployee = () => {
  return (
    <Box>
      {/* 1. Cabeçalho com Breadcrumbs */}
      <Box sx={{ mb: 2 }}>
        <AppBreadcrumbs 
          items={[
            { label: 'Colaboradores', path: '/' },
            { label: 'Cadastrar Colaborador' }
          ]} 
        />
      </Box>

      {/* 2. Barra de Progresso (Inserida aqui) */}
      <Box sx={{ mb: 4 }}> 
         <OnboardingProgress progress={0} />
      </Box>

      {/* 3. Área do Formulário */}
      <Paper
        sx={{
          width: '100%', 
          p: 3, 
          borderRadius: '16px',
          bgcolor: '#FFFFFF',
          boxShadow: 'none', 
        }}
      >
        {/* Conteúdo do formulário virá aqui */}
        
      </Paper>
    </Box>
  );
};