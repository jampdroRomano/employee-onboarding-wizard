import { useState } from 'react';
import { 
  Typography, 
  Button, 
  useMediaQuery, 
  useTheme, 
  Stack,
  Box
} from '@mui/material';

import { 
  AuthCard, 
  SignInContainer, 
  SignUpContainer, 
  OverlayContainer, 
  Overlay, 
  LeftOverlayPanel, 
  RightOverlayPanel 
} from '../components/auth/AuthLayout';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';

const GhostButton = (props: any) => (
  <Button
    variant="outlined"
    sx={{
      color: '#FFFFFF',
      borderColor: '#FFFFFF',
      borderRadius: '8px',
      borderWidth: '1px',
      padding: '10px 40px',
      fontWeight: 'bold',
      textTransform: 'none',
      fontSize: '1rem',
      mt: 3,
      '&:hover': {
        borderColor: '#FFFFFF',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
      }
    }}
    {...props}
  />
);

export const AuthPage = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // VERSÃO MOBILE 
  if (isMobile) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#fff', width: '100vw' }}>
        <Stack spacing={4} sx={{ p: 4, pt: 8, alignItems: 'center', minHeight: '100vh', justifyContent: 'center' }}>
          
          {isSignIn ? <LoginForm /> : <RegisterForm />}
          
          <Box textAlign="center" mt={4}>
            <Typography variant="body2" color="text.secondary">
              {isSignIn ? "Ainda não tem conta?" : "Já possui cadastro?"}
            </Typography>
            <Button 
              onClick={() => setIsSignIn(!isSignIn)} 
              sx={{ fontWeight: 'bold', textTransform: 'none' }}
            >
              {isSignIn ? "Cadastre-se aqui" : "Faça login"}
            </Button>
          </Box>

        </Stack>
      </Box>
    );
  }

  // VERSÃO DESKTOP (FULLSCREEN SPLIT)
  return (
    <AuthCard elevation={0}>
      
      {/* Formulário de Cadastro (Direita) */}
      <SignUpContainer isSignIn={isSignIn}>
        <RegisterForm />
      </SignUpContainer>

      {/* Formulário de Login (Esquerda) */}
      <SignInContainer isSignIn={isSignIn}>
        <LoginForm />
      </SignInContainer>

      {/* Animação Verde (Overlay) */}
      <OverlayContainer isSignIn={isSignIn}>
        <Overlay isSignIn={isSignIn}>

          <LeftOverlayPanel isSignIn={isSignIn}>
            <Typography variant="h3" fontWeight="bold"> 
              Já tem cadastro?
            </Typography>
            <Typography variant="h6" sx={{ mt: 2, maxWidth: '70%', fontWeight: 400 }}>
              Para se manter conectado conosco, faça login com suas informações pessoais.
            </Typography>
            <GhostButton onClick={() => setIsSignIn(true)}>
              Entrar
            </GhostButton>
          </LeftOverlayPanel>

          <RightOverlayPanel isSignIn={isSignIn}>
            <Typography variant="h3" fontWeight="bold"> 
              Novo por aqui?
            </Typography>
            <Typography variant="h6" sx={{ mt: 2, maxWidth: '70%', fontWeight: 400 }}>
              Insira seus dados pessoais e comece sua jornada conosco.
            </Typography>
            <GhostButton onClick={() => setIsSignIn(false)}>
              Cadastrar
            </GhostButton>
          </RightOverlayPanel>

        </Overlay>
      </OverlayContainer>

    </AuthCard>
  );
};