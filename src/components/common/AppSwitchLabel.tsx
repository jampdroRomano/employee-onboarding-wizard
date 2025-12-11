import { Box, Switch, Typography } from '@mui/material';

export const AppSwitchLabel = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '9px', 
        width: '100%', 
        mt: '24px',
      }}
    >
      <Switch 
        defaultChecked 
        sx={{
            '& .MuiSwitch-switchBase.Mui-checked': {
                color: 'primary.main', 
                '&:hover': {
                    backgroundColor: (theme) => `rgba(${theme.palette.primary.main}, 0.08)`, 
                },
            },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: 'primary.main', 
            },
        }}
      />
      
      <Typography
        sx={{
            fontFamily: '"Public Sans", sans-serif',
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '22px',
            color: 'text.primary', 
            whiteSpace: 'nowrap',
        }}
      >
        Ativar ao criar
      </Typography>
    </Box>
  );
};