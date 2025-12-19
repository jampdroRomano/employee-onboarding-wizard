import { useState, useEffect } from 'react';
import { Box, Stack } from '@mui/material';
import { toast } from 'sonner';
import { DepartmentForm } from './DepartmentForm';
import { DepartmentManagerStep } from './DepartmentManagerStep';
import { AppButton } from '../common/AppButton';
import { departmentService } from '../../services/departmentService';
import { getAllEmployees } from '../../services/employeeService';
import type { Department, Employee } from '../../types';
import type { DepartmentErrors } from '../../hooks/useDepartmentForm';

interface DepartmentDataTabProps {
  departmentId: string;
  initialData: Department;
  onSuccess: () => void;
}

export const DepartmentDataTab = ({ departmentId, initialData, onSuccess }: DepartmentDataTabProps) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    description: initialData.description || '',
    managerId: initialData.managerId || null
  });
  
  const [errors, setErrors] = useState<DepartmentErrors>({});
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoadingEmployees(true);
      try {
        const data = await getAllEmployees();
        setEmployees(data);
      } catch (error) {
        console.error('Erro ao buscar funcionários', error);
      } finally {
        setLoadingEmployees(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof DepartmentErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSave = async () => {
    const newErrors: DepartmentErrors = {};
    if (!formData.name.trim()) newErrors.name = "O nome é obrigatório";
    if (!formData.description.trim()) newErrors.description = "A descrição é obrigatória";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await departmentService.update(departmentId, {
        name: formData.name,
        description: formData.description,
        managerId: formData.managerId
      });
      toast.success('Informações do departamento atualizadas!');
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error('Erro ao atualizar departamento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
        
      <Stack spacing={4}>
        <DepartmentForm 
          name={formData.name}
          description={formData.description}
          errors={errors}
          onChangeName={(v) => handleChange('name', v)}
          onChangeDesc={(v) => handleChange('description', v)}
        />
        
        <DepartmentManagerStep 
          value={formData.managerId}
          error={errors.managerId}
          onChange={(v) => handleChange('managerId', v)}
          employees={employees}
          loading={loadingEmployees}
        />

        <AppButton 
          onClick={handleSave} 
          loading={loading}
          sx={{ width: '100%', mt: 2 }}
        >
          Salvar Alterações
        </AppButton>
      </Stack>
    </Box>
  );
};