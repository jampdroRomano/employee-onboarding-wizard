import { createTheme, alpha } from '@mui/material/styles';
import { ptBR } from '@mui/material/locale';

// Definição das cores para reutilização
const GREY = {
  300: '#DFE3E8', 
  400: '#C4CDD5',
  500: '#919EAB', 
};

const PRIMARY = {
  main: '#22C55E', 
  contrastText: '#FFFFFF',
};

export const CHECKBOX_GREEN = '#00A76F';


const TEXT = {
  primary: '#212B36', 
  secondary: '#637381', 
  disabled: '#919EAB',
};

const ERROR = {
  main: '#FF5630', 
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
    divider: alpha(GREY[500], 0.24),
    grey: GREY,
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
            borderColor: alpha(GREY[500], 0.32),
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: PRIMARY.main,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: PRIMARY.main,
          },
        },
      },
    },
    // Removida a estilização global do MuiCheckbox daqui
  },
}, ptBR);