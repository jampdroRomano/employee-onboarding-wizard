import { Box, Stack, Typography } from '@mui/material';
import { AppButton } from '../components/common/AppButton';
import { EmployeeTable } from '../components/collaborators/EmployeeTable';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={'31px'}
        sx={{ flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}
      >
        <Typography variant="h4" color="text.primary">
          Colaboradores
        </Typography>

        <AppButton
          onClick={() => navigate('/criar')}
          sx={{
            height: '48px',
            padding: '11px 16px',
            width: { xs: '100%', sm: 'auto' }
          }}
        >
          Novo Colaborador
        </AppButton>
      </Stack>

      <EmployeeTable />
    </Box>
  );
};