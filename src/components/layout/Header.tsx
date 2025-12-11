import { AppBar, Avatar, Box, IconButton, Stack, Toolbar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import userAvatar from '../../assets/avatar5.png';

interface HeaderProps {
  isMobile: boolean;
  onMenuClick: () => void;
}

export const Header = ({ isMobile, onMenuClick }: HeaderProps) => {
  return (
    <AppBar
      position="static" 
      sx={{
        top: 0,
        boxShadow: 'none',
        bgcolor: 'background.default',
        height: 80,
        zIndex: (theme) => theme.zIndex.drawer + 1,
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
            aria-label="open drawer"
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{
              p: '2px',
              border: '2px solid rgba(145, 158, 171, 0.14)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
            }}
          >
            <Avatar 
                src={userAvatar} 
                alt="User" 
                sx={{ width: 32, height: 32 }} 
            />
          </Box>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};