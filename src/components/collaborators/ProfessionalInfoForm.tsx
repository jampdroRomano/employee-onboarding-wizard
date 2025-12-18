import { Box, Typography, MenuItem, CircularProgress, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AppTextField } from '../common/AppTextField';
import { StickyActionMenuItem } from '../common/StickyActionMenuItem';
import type { Department } from '../../types';
import type { ProfessionalData } from '../../hooks/useProfessionalInfo';
import { SENIORITY_OPTIONS } from '../../utils/constants';

interface ProfessionalInfoFormProps {
  formData: ProfessionalData;
  departmentList: Department[];
  isLoading: boolean;
  errors: Partial<ProfessionalData>;
  handleChange: (field: keyof ProfessionalData, value: string) => void;
}

export const ProfessionalInfoForm = ({
  formData,
  departmentList,
  isLoading,
  errors,
  handleChange
}: ProfessionalInfoFormProps) => {
  const navigate = useNavigate();

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

        {/* Departamento */}
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
            renderValue: (value: unknown) => {
              if (isLoading) return <span style={{ color: '#919EAB' }}>Carregando...</span>;
              if (!value || typeof value !== 'string') return <span style={{ color: '#919EAB' }}>Selecione um departamento</span>;
              
              const selectedId = value as string; 
              const selectedDept = departmentList.find(d => d.id === selectedId);
              return selectedDept ? selectedDept.name : selectedId;
            },
            MenuProps: {
              disablePortal: true,
              PaperProps: {
                sx: {
                  maxHeight: 300,
                  '& .MuiList-root': { pb: 0 }
                }
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
          ) : (
            [
              departmentList.length === 0 && (
                <MenuItem key="empty" disabled value="">
                  <Typography variant="body2" color="text.secondary">
                    Nenhum departamento encontrado.
                  </Typography>
                </MenuItem>
              ),

              ...departmentList.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>
                  {dept.name}
                </MenuItem>
              )),

              <StickyActionMenuItem
                key="add-sticky"
                onClick={() => navigate('/departamentos/criar')}
              />
            ]
          )}
        </AppTextField>

        {/* 2. Cargo */}
        <AppTextField
          label="Cargo"
          placeholder="Ex: Desenvolvedor Front-end"
          fullWidth
          value={formData.role}
          onChange={(e) => handleChange('role', e.target.value)}
          error={!!errors.role}
          helperText={errors.role}
        />

        {/* 3. Senioridade e Data de Admissão */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ width: '100%' }}>

          {/* Senioridade */}
          <AppTextField
            select
            label="Senioridade"
            fullWidth
            value={formData.seniority}
            onChange={(e) => handleChange('seniority', e.target.value)}
            error={!!errors.seniority}
            helperText={errors.seniority}
            SelectProps={{ displayEmpty: true }}
          >
            {SENIORITY_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
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