import { Box, Paper, styled } from '@mui/material';

// O Card Principal
export const AuthCard = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  borderRadius: '16px',
  boxShadow: '0 14px 28px rgba(0,0,0,0.15), 0 10px 10px rgba(0,0,0,0.12)',
  position: 'relative',
  overflow: 'hidden',
  // Desktop: Tamanho fixo e largo
  width: '1000px',
  maxWidth: '100%',
  minHeight: '600px',
  // Mobile: Ocupa tudo
  [theme.breakpoints.down('md')]: {
    width: '100%',
    height: '100%',
    minHeight: '100vh',
    borderRadius: 0,
    boxShadow: 'none',
    display: 'flex',
    flexDirection: 'column',
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
  padding: theme.spacing(0, 5),
  backgroundColor: '#FFFFFF', // Fundo branco OBRIGATÓRIO para não vazar texto
  
  [theme.breakpoints.down('md')]: {
    position: 'relative',
    width: '100%',
    height: 'auto',
    padding: theme.spacing(4),
    top: 'auto',
    transform: 'none !important', // Desativa animação no mobile
    opacity: '1 !important',
    zIndex: '1 !important',
  }
}));

// Login (Fica na Esquerda)
export const SignInContainer = styled(FormContainer)<{ isSignIn: boolean }>(({ isSignIn }) => ({
  left: 0,
  width: '50%',
  zIndex: 2,
  opacity: isSignIn ? 1 : 0, // Some suavemente quando inativo
  pointerEvents: isSignIn ? 'all' : 'none', // Evita cliques quando invisível
}));

// Cadastro (Fica na Direita)
export const SignUpContainer = styled(FormContainer)<{ isSignIn: boolean }>(({ isSignIn }) => ({
  left: 0,
  width: '50%',
  opacity: isSignIn ? 0 : 1,
  zIndex: isSignIn ? 1 : 5,
  transform: 'translateX(100%)', // Fica posicionado na direita
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