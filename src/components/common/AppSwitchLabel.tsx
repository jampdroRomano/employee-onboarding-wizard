import { Box, Switch, Typography } from '@mui/material';

export const AppSwitchLabel = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '9px', 
        width: '833px', 
        mt: '24px',
      }}
    >
      <Switch 
        defaultChecked 
        sx={{
            '& .MuiSwitch-switchBase.Mui-checked': {
                color: '#22C55E', 
                '&:hover': {
                    backgroundColor: 'rgba(34, 197, 94, 0.08)',
                },
            },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: '#22C55E',
            },
        }}
      />
      
      <Typography
        sx={{
            fontFamily: '"Public Sans", sans-serif',
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '22px',
            color: '#212B36',
            whiteSpace: 'nowrap',
        }}
      >
        Ativar ao criar
      </Typography>
    </Box>
  );
};