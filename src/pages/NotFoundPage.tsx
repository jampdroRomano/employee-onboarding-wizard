import { Box, Typography, Container, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f6f5f7' 
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center' }}>
          
          {/* Ícone Gigante (!) */}
          <ErrorOutlineIcon 
            sx={{ 
              fontSize: 150, 
              color: 'text.primary',
              mb: 4
            }} 
          />
          
          <Typography variant="h1" fontWeight="bold" color="text.primary" sx={{ mb: 2 }}>
            404
          </Typography>
          
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
            Página não encontrada
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}>
            Ops! A página que você está procurando parece que não existe ou foi movida. 
            Verifique o endereço digitado ou volte para o início.
          </Typography>

          <Button 
            variant="contained" 
            size="large" 
            onClick={() => navigate('/')}
            sx={{ px: 4, py: 1.5, borderRadius: 2 }}
          >
            Voltar para o Início
          </Button>

        </Box>
      </Container>
    </Box>
  );
};