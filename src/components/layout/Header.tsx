import { AppBar, Avatar, Box, Stack, Toolbar } from '@mui/material';

// Largura da Sidebar para descontar do Header
const DRAWER_WIDTH = 280;

export const Header = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
        ml: `${DRAWER_WIDTH}px`,
        boxShadow: 'none',
        bgcolor: 'background.default', // Fundo branco
        height: 80, 
        borderBottom: '1px solid transparent', 
      }}
    >
      <Toolbar sx={{ height: 1, px: { xs: 2, sm: 5 } }}>
        <Box sx={{ flexGrow: 1 }} /> {/* Empurra o conteúdo para a direita */}

        <Stack direction="row" alignItems="center" spacing={2}>
          {/* Avatar com o anel de borda */}
          <Box
            sx={{
              p: '2px', // Espaço entre a borda e a foto
              border: '2px solid rgba(145, 158, 171, 0.14)', // Cor #919EAB14
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
            }}
          >
             {/* Foto avatar */}
            <Avatar 
                src="https://i.pravatar.cc/150?img=12" 
                alt="User" 
                sx={{ width: 32, height: 32 }} 
            />
          </Box>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};