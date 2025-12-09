import { Box, Stack, Typography } from '@mui/material';
import { AppButton } from '../components/common/AppButton';
import { EmployeeTable } from '../components/dashboard/EmployeeTable';

export const Dashboard = () => {
  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" color="text.primary">
          Colaboradores
        </Typography>

        <AppButton
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