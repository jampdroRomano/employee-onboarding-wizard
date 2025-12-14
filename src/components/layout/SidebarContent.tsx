import { Box, List, ListItemButton, ListItemIcon, ListItemText, Stack } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import logoFlugo from '../../assets/flugoLogo.png';
import { UsersIcon } from '../icons/UsersIcon';

export const SidebarContent = () => (
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
      }}
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
      <ListItemButton
        disableRipple
        sx={{
          height: 44,
          mx: 2,
          borderRadius: 1,
          color: 'text.secondary',
          bgcolor: 'transparent',
          '&:hover': {
            backgroundColor: 'transparent',
            color: 'text.primary',
            '& .MuiSvgIcon-root': {
              opacity: 1,
              color: 'text.primary',
            }
          },
        }}
      >
        <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
          <UsersIcon sx={{ fontSize: 24 }} />
        </ListItemIcon>

        <ListItemText
          primary="Colaboradores"
          primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
        />

        <KeyboardArrowRightIcon sx={{ fontSize: 16, opacity: 0.5 }} />

      </ListItemButton>
    </List>
  </Stack>
);