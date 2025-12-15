import { Box, List, ListItemButton, ListItemIcon, ListItemText, Stack } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import BusinessIcon from '@mui/icons-material/Business';
import { useNavigate, useLocation } from 'react-router-dom';
import logoFlugo from '../../assets/flugoLogo.png';
import { UsersIcon } from '../icons/UsersIcon';

export const SidebarContent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      text: 'Colaboradores',
      icon: <UsersIcon sx={{ fontSize: 24 }} />,
      path: '/'
    },
    {
      text: 'Departamentos',
      icon: <BusinessIcon sx={{ fontSize: 24 }} />,
      path: '/departamentos'
    }
  ];

  return (
    <Stack spacing={0}>

      {/* 1. Stack da Logo */}
      <Box
        sx={{
          height: 60,
          display: 'flex',
          alignItems: 'center',
          pl: 4,
          pt: 3,
          pb: 1,
          cursor: 'pointer'
        }}
        onClick={() => navigate('/')}
      >
        <img
          src={logoFlugo}
          alt="Flugo Logo"
          style={{ height: 28 }}
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      </Box>

      {/* 2. Lista de Navegação */}
      <List disablePadding>
        {menuItems.map((item) => {
          const isActive = item.path === '/'
            ? (location.pathname === '/' || location.pathname === '/criar') 
            : location.pathname.startsWith(item.path); 

          return (
            <ListItemButton
              key={item.text}
              onClick={() => navigate(item.path)}
              disableRipple
              sx={{
                height: 44,
                mx: 2,
                borderRadius: 1,
                color: isActive ? 'primary.main' : 'text.secondary',
                bgcolor: 'transparent',

                '&:hover': {
                  backgroundColor: 'transparent',
                  color: isActive ? 'primary.main' : 'text.primary',
                  '& .MuiSvgIcon-root': {
                    opacity: 1,
                    color: isActive ? 'primary.main' : 'text.primary',
                  }
                },
                '& .MuiSvgIcon-root': {
                  color: isActive ? 'primary.main' : 'inherit'
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.text}
                primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
              />

              <KeyboardArrowRightIcon
                sx={{
                  fontSize: 16,
                  opacity: isActive ? 1 : 0.5,
                  color: isActive ? 'primary.main' : 'inherit'
                }}
              />

            </ListItemButton>
          );
        })}
      </List>
    </Stack>
  );
};