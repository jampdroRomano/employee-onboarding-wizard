import { Box, Stack, Typography } from '@mui/material';
import { AppButton } from '../components/common/AppButton';
import { DepartmentTable } from '../components/departments/DepartmentTable';
import { useNavigate } from 'react-router-dom';

export const DepartmentsPage = () => {
  const navigate = useNavigate();

  return (
    <Box>

      <Stack 
        direction="row" 
        alignItems="center" 
        justifyContent="space-between" 
        mb={4}
        sx={{ flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}
      >
        <Typography variant="h4" color="text.primary" fontWeight="bold">
          Departamentos
        </Typography>
        
        <AppButton 
          onClick={() => navigate('/departamentos/criar')}
          sx={{
            height: '48px',
            padding: '11px 16px',
            width: { xs: '100%', sm: 'auto' } 
          }}
        >
          Novo Departamento
        </AppButton>
      </Stack>

      <DepartmentTable />
    </Box>
  );
};