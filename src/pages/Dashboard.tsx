import { Box, Button, Stack, Typography } from '@mui/material';
import { EmployeeTable } from '../components/dashboard/EmployeeTable';

export const Dashboard = () => {
  return (
    <Box>
      {/* Cabeçalho da Página */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" color="text.primary">
          Colaboradores
        </Typography>
        <Button 
          variant="contained" 
        >
          Novo Colaborador
        </Button>
      </Stack>

      {/* Tabela Isolada no Componente */}
      <EmployeeTable />
    </Box>
  );
};