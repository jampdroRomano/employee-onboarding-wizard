import { useState } from 'react';
import { Typography, Stack, Box, Link, Alert } from '@mui/material';
import { AppTextField } from '../common/AppTextField';
import { AppButton } from '../common/AppButton';
import logoFlugo from '../../assets/flugoLogo.png';
import { useAuthForm } from '../../hooks/useAuthForm'; 

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Usamos o hook para pegar a lógica e estados
  const { login, loading, error } = useAuthForm();

  const handleLogin = () => {
    login(email, password);
  };

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

      {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}

      <Stack spacing={2} width="100%">
        <AppTextField 
          label="E-mail" 
          fullWidth 
          placeholder="e.g. john@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <AppTextField 
          label="Senha" 
          type="password" 
          fullWidth 
          placeholder="****************"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <Box display="flex" justifyContent="flex-end">
          <Link href="#" underline="hover" variant="body2" color="text.primary" fontWeight={500}>
            Esqueceu a senha?
          </Link>
        </Box>
      </Stack>

      <AppButton 
        fullWidth 
        size="large" 
        sx={{ mt: 1 }}
        onClick={handleLogin}
        loading={loading}
      >
        Entrar
      </AppButton>

    </Stack>
  );
};