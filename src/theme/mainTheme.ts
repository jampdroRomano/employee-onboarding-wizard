import { createTheme } from '@mui/material/styles';
import { ptBR } from '@mui/material/locale';

export const mainTheme = createTheme({
  typography: {
    fontFamily: '"Public Sans", sans-serif',
    h4: { // Título "Colaboradores"
      fontWeight: 700,
      fontSize: '24px',
      lineHeight: '36px',
    },
    subtitle2: { // Labels e textos menores
      fontWeight: 600,
    },
    button: {
      textTransform: 'none', // Remove o CAPS LOCK 
      fontWeight: 700,
    },
  },
  palette: {
    primary: {
      main: '#22C55E', // O Verde "Novo Colaborador"
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FFFFFF', // Fundo geral da App
      paper: '#FFFFFF',   // Fundo dos Cards
    },
    text: {
      primary: '#212B36', // Cor dos títulos e textos fortes
      secondary: '#637381', // Cor do texto da Sidebar e subtítulos
    },
    divider: '#919EAB', // Cor base das bordas
  },
  shape: {
    borderRadius: 8, // Arredondamento padrão de botões e inputs
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
          height: '48px', // Altura especificada no botão "Novo Colaborador"
          padding: '0 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px', // Arredondamento do Card da Tabela
          boxShadow: '0px 12px 24px -4px rgba(145, 158, 171, 0.12)', // Sombra suave 
        },
      },
    },
  },
}, ptBR);