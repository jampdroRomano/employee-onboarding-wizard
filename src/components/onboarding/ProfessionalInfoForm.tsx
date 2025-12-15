import { Box, Typography, MenuItem, CircularProgress, Stack } from '@mui/material';
import { AppTextField } from '../common/AppTextField';
import type { Department } from '../../services/departmentService'; 
import type { ProfessionalData } from '../../hooks/useProfessionalInfo';

interface ProfessionalInfoFormProps {
  formData: ProfessionalData; 
  departmentList: Department[];
  isLoading: boolean;
  errors: Partial<ProfessionalData>; 
  handleChange: (field: keyof ProfessionalData, value: string) => void; 
}

const SENIORITY_OPTIONS = ['Júnior', 'Pleno', 'Sênior', 'Gestor'];

export const ProfessionalInfoForm = ({ 
  formData, 
  departmentList, 
  isLoading, 
  errors, 
  handleChange 
}: ProfessionalInfoFormProps) => {

  return (
    <Box sx={{ width: '100%' }}>
      <Typography 
        component="h2"
        variant="h4"
        sx={{ mb: '31px', color: 'text.secondary' }}
      >
        Informações Profissionais
      </Typography>

      <Stack spacing={3} sx={{ width: '100%' }}> 
        
        {/* 1. Departamento (Existente) */}
        <AppTextField 
            select
            fullWidth
            label="Departamento"
            placeholder="Selecione um departamento"
            value={formData.department}
            onChange={(e) => handleChange('department', e.target.value)}
            error={!!errors.department}
            helperText={errors.department}
            disabled={isLoading}
            SelectProps={{
               displayEmpty: true,
               renderValue: (selected: any) => {
                  if (isLoading) return <span style={{ color: '#919EAB' }}>Carregando...</span>;
                  if (!selected) return <span style={{ color: '#919EAB' }}>Selecione um departamento</span>;
                  const selectedDept = departmentList.find(d => d.id === selected);
                  return selectedDept ? selectedDept.name : selected;
               }
            }}
        >
            {isLoading ? (
                <MenuItem disabled>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CircularProgress size={20} /> Carregando...
                    </Box>
                </MenuItem>
            ) : departmentList.length === 0 ? (
                <MenuItem disabled>Nenhum departamento cadastrado</MenuItem>
            ) : (
                departmentList.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>
                        {dept.name}
                    </MenuItem>
                ))
            )}
        </AppTextField>

        {/* 2. Cargo (Novo - 100% width) */}
        <AppTextField
          label="Cargo"
          placeholder="Ex: Desenvolvedor Front-end"
          fullWidth
          value={formData.role}
          onChange={(e) => handleChange('role', e.target.value)}
          error={!!errors.role}
          helperText={errors.role}
        />

        {/* 3. Linha Dividida: Senioridade e Data */}
        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          spacing={1.5} 
          sx={{ width: '100%' }}
        >
          {/* Senioridade */}
          <AppTextField
            select
            label="Senioridade"
            fullWidth
            value={formData.seniority}
            onChange={(e) => handleChange('seniority', e.target.value)}
            error={!!errors.seniority}
            helperText={errors.seniority}
            SelectProps={{
                displayEmpty: true,
                renderValue: (selected: any) => {
                   if (!selected) return <span style={{ color: '#919EAB' }}>Selecione</span>;
                   return selected;
                }
             }}
          >
            {SENIORITY_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </AppTextField>

          {/* Data de Admissão */}
          <AppTextField
            type="date"
            label="Data de Admissão"
            fullWidth
            value={formData.admissionDate}
            onChange={(e) => handleChange('admissionDate', e.target.value)}
            error={!!errors.admissionDate}
            helperText={errors.admissionDate}
            InputLabelProps={{ shrink: true }} 
          />
        </Stack>

      </Stack>
    </Box>
  );
};