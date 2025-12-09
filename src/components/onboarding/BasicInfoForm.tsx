import { Box, Typography, Stack } from '@mui/material';
import { AppTextField } from '../common/AppTextField';
import { AppSwitchLabel } from '../common/AppSwitchLabel';

export const BasicInfoForm = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography 
        component="h2"
        sx={{ 
            mb: '31px', 
            fontFamily: '"Public Sans", sans-serif',
            fontWeight: 700,
            fontSize: '24px', 
            color: '#212B36'
        }}
      >
        Informações Básicas
      </Typography>

      <Stack spacing={3}>

        <AppTextField 
            label="Título"
            placeholder="João da Silva"
            focusColor="#22C55E" 
        />

        <AppTextField 
            label="E-mail"
            placeholder="e.g. john@gmail.com"
            focusColor="#22C55E" 
        />

        <AppSwitchLabel />
        
      </Stack>
    </Box>
  );
};