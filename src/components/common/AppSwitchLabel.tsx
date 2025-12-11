import { Box, Switch, Typography } from '@mui/material';

// 1. Adicionamos a interface para receber dados
interface AppSwitchLabelProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const AppSwitchLabel = ({ checked, onChange }: AppSwitchLabelProps) => {
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
        // 2. Ligamos o Switch ao estado real
        checked={checked} 
        onChange={(e) => onChange(e.target.checked)}
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
        {/* Muda o texto visualmente para dar feedback */}
        {checked ? 'Ativo' : 'Inativo'}
      </Typography>
    </Box>
  );
};