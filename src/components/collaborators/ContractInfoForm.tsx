import { Box, Typography, MenuItem, CircularProgress, Stack, InputAdornment } from '@mui/material';
import { AppTextField } from '../common/AppTextField';
import type { Employee } from '../../types';
import type { ProfessionalData } from '../../hooks/useProfessionalInfo';

interface ContractInfoFormProps {
  formData: ProfessionalData;
  employeesList: Employee[];
  isLoading: boolean;
  errors: Partial<ProfessionalData>;
  handleChange: (field: keyof ProfessionalData, value: string) => void;
}

export const ContractInfoForm = ({ 
  formData, 
  employeesList, 
  isLoading, 
  errors, 
  handleChange 
}: ContractInfoFormProps) => {

  const managersList = employeesList.filter(emp => emp.seniority === 'Gestor');
  const isManager = formData.seniority === 'Gestor';
  const managerLabel = isManager ? "Reporta a (Superior Imediato)" : "Gestor Responsável";
  const managerPlaceholder = isManager ? "Selecione a diretoria/superior" : "Selecione o gestor";

  return (
    <Box sx={{ width: '100%' }}>
      <Typography 
        component="h2"
        variant="h4"
        sx={{ mb: '31px', color: 'text.secondary' }}
      >
        Informações Contratuais
      </Typography>

      <Stack spacing={3} sx={{ width: '100%' }}> 
        
        {/* 1. Gestor Responsável (Select) */}
        <AppTextField 
            select
            fullWidth
            label={managerLabel}
            placeholder={managerPlaceholder}
            value={formData.managerId}
            onChange={(e) => handleChange('managerId', e.target.value)}
            error={!!errors.managerId}
            helperText={errors.managerId}
            disabled={isLoading}
            SelectProps={{
               displayEmpty: true,
               renderValue: (value: unknown) => {
                  if (isLoading) return <span style={{ color: '#919EAB' }}>Carregando...</span>;
                  if (!value || typeof value !== 'string') return <span style={{ color: '#919EAB' }}>{managerPlaceholder}</span>;
                  
                  const selectedId = value as string; 
                  const selectedEmp = employeesList.find(e => e.id === selectedId);
                  return selectedEmp ? selectedEmp.nome : selectedId;
               },
               MenuProps: {
                 PaperProps: { 
                   sx: { maxHeight: 300 } 
                 }
               }
            }}
        >
            {isLoading ? (
                <MenuItem disabled>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CircularProgress size={20} /> Carregando...
                    </Box>
                </MenuItem>
            ) : managersList.length === 0 ? (
                <MenuItem disabled value="">
                    Nenhum gestor encontrado. Cadastre um funcionário como 'Gestor' primeiro.
                </MenuItem>
            ) : (
                managersList.map((emp) => (
                    <MenuItem key={emp.id} value={emp.id}>
                        {emp.nome}
                    </MenuItem>
                ))
            )}
        </AppTextField>

        {/* 2. Salário Base */}
        <AppTextField
          label="Salário Base"
          placeholder="0,00"
          fullWidth
          value={formData.salary}
          onChange={(e) => handleChange('salary', e.target.value)}
          error={!!errors.salary}
          helperText={errors.salary}
          InputProps={{
            startAdornment: <InputAdornment position="start">R$</InputAdornment>,
          }}
        />

      </Stack>
    </Box>
  );
};