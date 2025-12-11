import { createTheme, alpha } from '@mui/material/styles';
import { ptBR } from '@mui/material/locale';

// Definição das cores para reutilização
const GREY = {
  300: '#DFE3E8', // Usado no fundo inativo do Stepper
  400: '#C4CDD5',
  500: '#919EAB', // Usado em bordas e textos secundários
};

const PRIMARY = {
  main: '#22C55E', // Verde principal
  contrastText: '#FFFFFF',
};

const TEXT = {
  primary: '#212B36', // Preto/Cinza Escuro (Títulos e Labels ativos)
  secondary: '#637381', // Cinza Texto (Subtítulos)
  disabled: '#919EAB',
};

const ERROR = {
  main: '#FF5630', // Um vermelho padrão moderno
};

export const mainTheme = createTheme({
  typography: {
    fontFamily: '"Public Sans", sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: '24px',
      lineHeight: '36px',
      color: TEXT.primary,
    },
    subtitle2: {
      fontWeight: 600,
      color: TEXT.secondary,
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
    },
  },
  palette: {
    primary: PRIMARY,
    error: ERROR,
    text: TEXT,
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    divider: alpha(GREY[500], 0.24), // Define a cor padrão das bordas (Divider)
    grey: GREY, // Paleta de cinza customizada
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        sizeLarge: {
          height: '48px',
          padding: '0 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0px 12px 24px -4px rgba(145, 158, 171, 0.12)',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(GREY[500], 0.32), // Borda inativa padrão
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: PRIMARY.main, // Borda hover
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: PRIMARY.main, // Borda focado
          },
        },
      },
    },
  },
}, ptBR);