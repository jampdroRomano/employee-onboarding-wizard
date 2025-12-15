import { Box, Typography, Stack } from '@mui/material';
import { AppTextField } from '../common/AppTextField';
import type { DepartmentErrors } from '../../hooks/useDepartmentForm';
interface DepartmentFormProps {
  name: string;
  description: string;
  errors: DepartmentErrors; 
  onChangeName: (value: string) => void;
  onChangeDesc: (value: string) => void;
}

export const DepartmentForm = ({ name, description, errors, onChangeName, onChangeDesc }: DepartmentFormProps) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography 
        component="h2"
        variant="h4" 
        sx={{ 
          mb: '31px',
          color: 'text.secondary' 
        }}
      >
        Informações do Departamento
      </Typography>

      <Stack spacing={3}>
        <AppTextField 
          label="Nome do Departamento" 
          placeholder="Ex: Marketing"
          value={name}
          onChange={(e) => onChangeName(e.target.value)}
          error={!!errors.name}
          helperText={errors.name}
        />

        <AppTextField 
          label="Descrição"
          placeholder="Descreva as responsabilidades..."
          multiline
          rows={4}
          value={description}
          onChange={(e) => onChangeDesc(e.target.value)}
          error={!!errors.description}
          helperText={errors.description}
          
          InputLabelProps={{ shrink: true }} 
          sx={{
            '& .MuiInputBase-root': {
                height: 'auto !important', 
                minHeight: '120px', 
                alignItems: 'flex-start', 
                padding: '12px', 
            },
            '& .MuiInputBase-input': {
                height: 'auto !important',
                overflow: 'auto',
            }
          }}
        />
      </Stack>
    </Box>
  );
};