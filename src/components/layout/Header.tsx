import { useState } from 'react';
import { 
  AppBar, 
  Avatar, 
  Box, 
  IconButton, 
  Menu, 
  MenuItem, 
  Stack, 
  Toolbar, 
  Tooltip, 
  Typography,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import userAvatar from '../../assets/avatar5.png';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
  isMobile: boolean;
  onMenuClick: () => void;
}

export const Header = ({ isMobile, onMenuClick }: HeaderProps) => {
  const { logout, currentUser } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  const tooltipTitle = (
    <>
      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{currentUser?.displayName}</Typography>
      <Typography variant="caption">{currentUser?.email}</Typography>
    </>
  );

  return (
    <AppBar
      position="static"
      sx={{
        boxShadow: 'none',
        bgcolor: 'background.default',
        height: 80,
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          height: 1,
          px: { xs: 2, lg: 5 }
        }}
      >
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="abrir menu"
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 2, color: 'text.primary' }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" alignItems="center" spacing={2}>
          <Tooltip title={tooltipTitle}>
            <IconButton onClick={handleClick} sx={{ p: 0 }}>
              <Avatar
                src={userAvatar}
                alt={currentUser?.displayName || 'User'}
                sx={{ width: 40, height: 40 }}
              />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            sx={{
              '& .MuiPaper-root': {
                borderRadius: '8px',
                marginTop: '8px',
                minWidth: 220,
                boxShadow: '0 8px 16px 0 rgba(0,0,0,0.15)',
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {currentUser?.displayName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentUser?.email}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />
            
            <MenuItem onClick={handleLogout} sx={{ m: 1, color: 'error.main' }}>
              Logout
            </MenuItem>
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};