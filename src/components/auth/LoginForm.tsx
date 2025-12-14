import { Typography, Stack, Box, Link } from '@mui/material';
// Ajuste de imports para a estrutura src/components/auth/
import { AppTextField } from '../common/AppTextField';
import { AppButton } from '../common/AppButton';
import logoFlugo from '../../assets/flugoLogo.png';

export const LoginForm = () => {
  return (
    <Stack spacing={4} alignItems="center" width="100%" maxWidth="400px">
      
      <Box textAlign="center">
        <img src={logoFlugo} alt="Flugo" style={{ height: 40, marginBottom: 16 }} />
        <Typography variant="h4" fontWeight="bold" color="primary.main">
          Bem-vindo!
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          Entre com sua conta
        </Typography>
      </Box>

      <Stack spacing={2} width="100%">
        <AppTextField label="E-mail" fullWidth placeholder="e.g. john@gmail.com" />
        <AppTextField label="Senha" type="password" fullWidth placeholder="****************" />
        
        <Box display="flex" justifyContent="flex-end">
          <Link href="#" underline="hover" variant="body2" color="text.primary" fontWeight={500}>
            Esqueceu a senha?
          </Link>
        </Box>
      </Stack>

      <AppButton fullWidth size="large" sx={{ mt: 1 }}>
        Entrar
      </AppButton>

    </Stack>
  );
};