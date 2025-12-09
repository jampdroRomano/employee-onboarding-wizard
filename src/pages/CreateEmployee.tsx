import { Box } from '@mui/material';
import { AppBreadcrumbs } from '../components/common/AppBreadcrumbs';

export const CreateEmployee = () => {
  return (
    <Box
      sx={{
        width: '1080px',
        height: '896px',
        borderRadius: '16px',
        
        // --- Estilo Visual ---
        bgcolor: '#FFFFFF', 
        opacity: 1,
        boxShadow: 'none', 
        position: 'relative', 
        marginTop: '-27px', 
      }}
    >
      <Box 
        sx={{ 
          position: 'absolute', 
          top: '4px', 
          left: '0px',
          width: '880px',
        }}
      >
        <AppBreadcrumbs 
          items={[
            { label: 'Colaboradores', path: '/' },
            { label: 'Cadastrar Colaborador' }
          ]} 
        />
      </Box>


    </Box>
  );
};