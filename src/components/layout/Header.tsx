import { AppBar, Avatar, Box, Stack, Toolbar } from '@mui/material';

export const Header = () => {
  return (
    <AppBar
      position="sticky" 
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
          px: 5 
        }}
      > 
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