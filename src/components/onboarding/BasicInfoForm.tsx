import { Box, Typography, Stack } from '@mui/material';
import { AppTextField } from '../common/AppTextField';
import { AppSwitchLabel } from '../common/AppSwitchLabel';

interface BasicInfoFormProps {
  formData: {
    nome: string;
    email: string;
  };
  errors: {
    nome: string;
    email: string;
  };
  handleChange: (field: string, value: string) => void;
}

export const BasicInfoForm = ({ formData, errors, handleChange }: BasicInfoFormProps) => {
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
            label="Nome"
            placeholder="João da Silva"
            focusColor="#22C55E" 

            value={formData.nome}
            onChange={(e) => handleChange('nome', e.target.value)}
            error={!!errors.nome}
            helperText={errors.nome}
        />

        <AppTextField 
            label="E-mail"
            placeholder="e.g. john@gmail.com"
            focusColor="#22C55E" 
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
        />

        <AppSwitchLabel />
        
      </Stack>
    </Box>
  );
};