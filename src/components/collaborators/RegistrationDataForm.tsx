import { useEffect, useState } from 'react';
import { Box, Grid, TextField, Button, MenuItem, CircularProgress } from '@mui/material';
import { toast } from 'sonner';
import { useProfessionalInfo } from '../../hooks/useProfessionalInfo';
import { employeeService } from '../../services/employeeService';
import type { Employee } from '../../types';

interface RegistrationDataFormProps {
  employeeId: string;
  initialData: Employee;
  onSuccess: () => void;
}

export const RegistrationDataForm = ({ employeeId, initialData, onSuccess }: RegistrationDataFormProps) => {
  const { 
    formData, 
    errors, 
    isLoading, 
    departmentList, 
    employeesList,
    handleChange, 
    setValues, 
    validateStep2, 
    validateStep3 
  } = useProfessionalInfo();
  
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setValues({
        department: initialData.departamento || '',
        role: initialData.role || '',
        seniority: initialData.seniority || '',
        admissionDate: initialData.admissionDate || '',
        managerId: initialData.managerId || null,
        salary: initialData.salary ? String(initialData.salary) : ''
      });
    }
  }, [initialData, setValues]);

  const handleSave = async () => {
    const isStep2Valid = validateStep2();
    const isStep3Valid = validateStep3();

    if (!isStep2Valid || !isStep3Valid) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsSaving(true);
    try {
     const payload = {
        ...formData,
        departamento: formData.department, 
        managerId: formData.managerId === null ? undefined : formData.managerId,
      };
      await employeeService.update(employeeId, payload);
      toast.success('Dados cadastrais atualizados com sucesso!');
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Erro ao atualizar dados cadastrais:', error);
      toast.error('Não foi possível atualizar os dados.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <CircularProgress />
        </Box>
    );
  }

  return (
    <Box component="form" noValidate autoComplete="off" sx={{ mt: 1 }}>
      <Grid container spacing={2}>
        
        <Grid item xs={12}>
          <TextField 
            select 
            label="Departamento"
            value={formData.department}
            onChange={(e) => handleChange('department', e.target.value)}
            error={!!errors.department}
            helperText={errors.department}
            fullWidth 
          >
            <MenuItem value="">Selecione um departamento</MenuItem>
            {departmentList.map(dep => (
              <MenuItem key={dep.id} value={dep.id}>{dep.name}</MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Cargo"
            value={formData.role}
            onChange={(e) => handleChange('role', e.target.value)}
            error={!!errors.role}
            helperText={errors.role}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField 
            select 
            label="Senioridade"
            value={formData.seniority}
            onChange={(e) => handleChange('seniority', e.target.value)}
            error={!!errors.seniority}
            helperText={errors.seniority}
            fullWidth 
          >
            <MenuItem value="Júnior">Júnior</MenuItem>
            <MenuItem value="Pleno">Pleno</MenuItem>
            <MenuItem value="Sênior">Sênior</MenuItem>
            <MenuItem value="Gestor">Gestor</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField 
            label="Data de Admissão" 
            type="date"
            value={formData.admissionDate}
            onChange={(e) => handleChange('admissionDate', e.target.value)}
            error={!!errors.admissionDate}
            helperText={errors.admissionDate}
            fullWidth 
            InputLabelProps={{ shrink: true }} 
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField 
            select 
            label="Gestor Responsável"
            value={formData.managerId || ''}
            onChange={(e) => handleChange('managerId', e.target.value)}
            fullWidth 
          >
            {/* Filtra para não listar o próprio funcionário como gestor */}
            {employeesList.filter(emp => emp.id !== employeeId && emp.seniority === 'Gestor').map(emp => (
              <MenuItem key={emp.id} value={emp.id}>{emp.nome}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField 
            label="Salário"
            value={formData.salary}
            onChange={(e) => handleChange('salary', e.target.value)}
            error={!!errors.salary}
            helperText={errors.salary}
            fullWidth 
            placeholder="0,00"
          />
        </Grid>

        <Grid item xs={12} sx={{ mt: 2 }}>
          <Button 
            variant="contained" 
            fullWidth
            onClick={handleSave}
            disabled={isSaving || isLoading}
            sx={{ 
              bgcolor: '#00C853', 
              color: '#fff', 
              height: '48px',
              fontWeight: 'bold',
              '&:hover': { bgcolor: '#009624' }
            }}
          >
            {isSaving ? <CircularProgress size={24} color="inherit" /> : 'Salvar'}
          </Button>
        </Grid>

      </Grid>
    </Box>
  );
};