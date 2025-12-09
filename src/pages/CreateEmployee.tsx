import { Box, Typography } from '@mui/material';
import { AppButton } from '../components/common/AppButton';

export const CreateEmployee = () => {
  return (
    <Box>
      <Typography variant="h4" mb={4}>
        Cadastrar Colaborador
      </Typography>

      <AppButton>
        Próximo
      </AppButton>
    </Box>
  );
};