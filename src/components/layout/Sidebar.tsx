import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import logoFlugo from '../../assets/flugo_logo.png'; 

const DRAWER_WIDTH = 280;

export const Sidebar = () => {
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          // Borda tracejada:
          borderRight: '1px dashed rgba(145, 158, 171, 0.24)', 
          backgroundColor: 'background.default',
        },
      }}
    >
      {/* Área da Logo */}
      <Box sx={{ p: 3, mb: 2, display: 'flex', alignItems: 'center' }}>
        <img 
            src={logoFlugo} 
            alt="Flugo Logo" 
            style={{ height: 40 }} 
            // Fallback caso a imagem não exista ainda (para não quebrar o layout):
            onError={(e) => { e.currentTarget.style.display = 'none'; }} 
        />
      </Box>

      {/* Lista de Navegação */}
      <List disablePadding>
        <ListItemButton
          selected // Fixo como selecionado 
          sx={{
            height: 48,
            mx: 1, // Margem lateral para ficar "flutuando" levemente
            borderRadius: 1,
            // Cores do estado Ativo (baseado no tema):
            bgcolor: (theme) => `${theme.palette.primary.main}14`, // 14 é hex para ~8% de opacidade
            color: 'primary.main',
            '&:hover': { 
                bgcolor: (theme) => `${theme.palette.primary.main}29` 
            },
            '&.Mui-selected': { 
                bgcolor: (theme) => `${theme.palette.primary.main}14` 
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
            <PeopleAltIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Colaboradores" 
            slotProps={{ 
              primary: { variant: 'body2', fontWeight: 600 } 
            }}
          />
        </ListItemButton>
      </List>
    </Drawer>
  );
};