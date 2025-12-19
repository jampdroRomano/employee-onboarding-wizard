import { useState } from 'react';
import { Box } from '@mui/material';
import { toast } from 'sonner';
import { AppButton } from '../common/AppButton';
import { DepartmentEditEmployeesStep } from './DepartmentEditEmployeesStep';
import { departmentService } from '../../services/departmentService';

interface EmployeeChange {
  employeeId: string;
  newDepartmentId: string | null;
}

interface DepartmentMembersTabProps {
  departmentId: string;
  onSuccess: () => void;
}

export const DepartmentMembersTab = ({ departmentId, onSuccess }: DepartmentMembersTabProps) => {
  const [employeeChanges, setEmployeeChanges] = useState<EmployeeChange[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (employeeChanges.length === 0) {
      toast.info('Nenhuma alteração de membro realizada.');
      return;
    }

    setLoading(true);
    try {
      await departmentService.updateDepartmentAndMembers(
        departmentId,
        {}, 
        employeeChanges
      );
      
      toast.success('Membros do departamento atualizados!');
      setEmployeeChanges([]); 
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error('Erro ao salvar membros.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <DepartmentEditEmployeesStep 
        currentDepartmentId={departmentId}
        onEmployeeChanges={setEmployeeChanges}
      />

      <AppButton 
        onClick={handleSave} 
        loading={loading}
        disabled={employeeChanges.length === 0}
        sx={{ width: '100%', mt: 4 }}
      >
        Salvar 
      </AppButton>
    </Box>
  );
};