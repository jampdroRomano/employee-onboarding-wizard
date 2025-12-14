import { Box, Paper, styled } from '@mui/material';

export const AuthCard = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  borderRadius: 0, 
  boxShadow: 'none',
  position: 'relative',
  overflow: 'hidden',
  width: '100vw',
  height: '100vh', 
  maxWidth: '100%',
  
  // Mobile: Mantém comportamento de coluna
  [theme.breakpoints.down('md')]: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh', // Garante altura total no mobile também
    overflowY: 'auto', // Permite scroll se a tela for muito pequena verticalmente
  },
}));

// Container Base dos Formulários
export const FormContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  height: '100%',
  transition: 'all 0.6s ease-in-out',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(0, 10), 
  backgroundColor: '#FFFFFF',
  
  [theme.breakpoints.down('md')]: {
    position: 'relative',
    width: '100%',
    height: 'auto',
    minHeight: '100vh', // No mobile, cada form ocupa a tela toda
    padding: theme.spacing(4),
    top: 'auto',
    transform: 'none !important',
    opacity: '1 !important',
    zIndex: '1 !important',
  }
}));

// Login (Fica na Esquerda)
export const SignInContainer = styled(FormContainer)<{ isSignIn: boolean }>(({ isSignIn }) => ({
  left: 0,
  width: '50%',
  zIndex: 2,
  opacity: isSignIn ? 1 : 0,
  pointerEvents: isSignIn ? 'all' : 'none',
}));

// Cadastro (Fica na Direita)
export const SignUpContainer = styled(FormContainer)<{ isSignIn: boolean }>(({ isSignIn }) => ({
  left: 0,
  width: '50%',
  opacity: isSignIn ? 0 : 1,
  zIndex: isSignIn ? 1 : 5,
  transform: 'translateX(100%)',
  pointerEvents: isSignIn ? 'none' : 'all',
}));

// O Container Verde (Overlay)
export const OverlayContainer = styled(Box)<{ isSignIn: boolean }>(({ theme, isSignIn }) => ({
  position: 'absolute',
  top: 0,
  left: '50%',
  width: '50%',
  height: '100%',
  overflow: 'hidden',
  transition: 'transform 0.6s ease-in-out',
  zIndex: 100,
  transform: isSignIn ? 'translateX(0)' : 'translateX(-100%)',
  
  [theme.breakpoints.down('md')]: {
    display: 'none', // Esconde a animação complexa no mobile
  }
}));

// O Fundo Gradiente Verde
export const Overlay = styled(Box)<{ isSignIn: boolean }>(({ theme, isSignIn }) => ({
  background: `linear-gradient(to right, ${theme.palette.primary.main}, #1ea34d)`,
  color: '#FFFFFF',
  position: 'relative',
  left: '-100%',
  height: '100%',
  width: '200%',
  transform: isSignIn ? 'translateX(0)' : 'translateX(50%)',
  transition: 'transform 0.6s ease-in-out',
}));

// Painel de Texto (Verde)
export const OverlayPanel = styled(Box)(({ theme }) => ({
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(0, 4),
  textAlign: 'center',
  top: 0,
  height: '100%',
  width: '50%',
  transform: 'translateX(0)',
  transition: 'transform 0.6s ease-in-out',
}));

export const LeftOverlayPanel = styled(OverlayPanel)<{ isSignIn: boolean }>(({ isSignIn }) => ({
  transform: isSignIn ? 'translateX(-20%)' : 'translateX(0)',
}));

export const RightOverlayPanel = styled(OverlayPanel)<{ isSignIn: boolean }>(({ isSignIn }) => ({
  right: 0,
  transform: isSignIn ? 'translateX(0)' : 'translateX(20%)',
}));