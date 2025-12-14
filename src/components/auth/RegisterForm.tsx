import { useState } from 'react';
import { Typography, Stack, Box, Alert } from '@mui/material';
import { AppTextField } from '../common/AppTextField';
import { AppButton } from '../common/AppButton';
import logoFlugo from '../../assets/flugoLogo.png';
import { useAuthForm } from '../../hooks/useAuthForm'; 

export const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { register, loading, error } = useAuthForm();

  const handleRegister = () => {
    register(name, email, password);
  };

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

      {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}

      <Stack spacing={2} width="100%">
        <AppTextField 
          label="Nome" 
          fullWidth 
          placeholder="João da Silva"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
      </Stack>

      <AppButton 
        fullWidth 
        size="large"
        onClick={handleRegister}
        loading={loading}
      >
        Cadastrar
      </AppButton>

    </Stack>
  );
};