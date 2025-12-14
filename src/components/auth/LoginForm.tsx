import { useState } from 'react';
import { Typography, Stack, Box, Link, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { AppTextField } from '../common/AppTextField';
import { AppButton } from '../common/AppButton';
import logoFlugo from '../../assets/flugoLogo.png';
import { ForgotPasswordDialog } from './ForgotPasswordDialog';

export const LoginForm = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Estado para controlar a abertura do modal
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Validação de e-mail obrigatória
      if (!userCredential.user.emailVerified) {
        await signOut(auth);
        setError('Por favor, valide seu e-mail antes de entrar.');
        setLoading(false);
        return;
      }

      navigate('/'); 
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('E-mail ou senha incorretos.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Muitas tentativas. Tente novamente mais tarde.');
      } else {
        setError('Ocorreu um erro ao fazer login.');
      }
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

        {error && (
          <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>
        )}

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
            <Link 
              component="button"
              onClick={() => setForgotPasswordOpen(true)} // <--- Abre o modal aqui
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

      {/* Componente do Modal (fica oculto até o state mudar) */}
      <ForgotPasswordDialog 
        open={forgotPasswordOpen} 
        onClose={() => setForgotPasswordOpen(false)} 
      />
    </>
  );
};