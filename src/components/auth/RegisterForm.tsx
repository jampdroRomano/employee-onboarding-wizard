import { Typography, Stack, Box } from '@mui/material';
import { AppTextField } from '../common/AppTextField';
import { AppButton } from '../common/AppButton';
import logoFlugo from '../../assets/flugoLogo.png';

export const RegisterForm = () => {
  return (
    <Stack spacing={4} alignItems="center" width="100%" maxWidth="400px">
      
      <Box textAlign="center">
        <img src={logoFlugo} alt="Flugo" style={{ height: 40, marginBottom: 16 }} />
        <Typography variant="h4" fontWeight="bold" color="primary.main">
          Crie sua conta
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          Preencha seus dados abaixo
        </Typography>
      </Box>

      <Stack spacing={2} width="100%">
        <AppTextField label="Nome" fullWidth placeholder="João da Silva" />
        <AppTextField label="E-mail" fullWidth placeholder="e.g. john@gmail.com" />
        <AppTextField label="Senha" type="password" fullWidth placeholder="****************" />
      </Stack>

      <AppButton fullWidth size="large">
        Cadastrar
      </AppButton>

    </Stack>
  );
};