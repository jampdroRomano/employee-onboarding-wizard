import { useState } from 'react';
import { Typography, Stack, Box, Link, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { AppTextField } from '../common/AppTextField';
import { AppButton } from '../common/AppButton';
import { ForgotPasswordDialog } from './ForgotPasswordDialog'; 
import logoFlugo from '../../assets/flugoLogo.png';


export const LoginForm = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Estado para controlar o modal
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err: any) {
      setError('E-mail ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <AppTextField 
            label="Senha" 
            type="password" 
            fullWidth 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <Box display="flex" justifyContent="flex-end">
            <Link 
              component="button" 
              onClick={() => setForgotPasswordOpen(true)} 
              underline="hover" 
              variant="body2" 
              color="text.primary" 
              fontWeight={500}
            >
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

      <ForgotPasswordDialog 
        open={forgotPasswordOpen} 
        onClose={() => setForgotPasswordOpen(false)} 
      />
    </>
  );
};