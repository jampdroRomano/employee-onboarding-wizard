import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'; 
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
          borderRight: '1px dashed rgba(145, 158, 171, 0.24)', 
          backgroundColor: 'background.default',
        },
      }}
    >
      <Box sx={{ p: 3, mb: 2, display: 'flex', alignItems: 'center' }}>
        <img 
            src={logoFlugo} 
            alt="Flugo Logo" 
            style={{ height: 28 }} 
            onError={(e) => { e.currentTarget.style.display = 'none'; }} 
        />
      </Box>

      <List disablePadding>
        <ListItemButton
          sx={{
            height: 48,
            mx: 1, 
            borderRadius: 1,
            color: 'text.secondary', 
            bgcolor: 'transparent',  
            '&:hover': { 
                bgcolor: 'rgba(145, 158, 171, 0.08)', 
                color: 'text.primary', 
            },
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

          <KeyboardArrowRightIcon sx={{ fontSize: 20, opacity: 0.5 }} />
          
        </ListItemButton>
      </List>
    </Drawer>
  );
};