import { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material'; // Adicione CircularProgress
import { useNavigate, useParams } from 'react-router-dom'; // Adicione useParams
import { AppBreadcrumbs } from '../components/common/AppBreadcrumbs';
import { AppButton } from '../components/common/AppButton';
import { StepperVertical } from '../components/common/StepperVertical';
import { OnboardingProgress } from '../components/common/OnboardingProgress';
import { DepartmentForm } from '../components/departments/DepartmentForm';
import { DepartmentManagerStep } from '../components/departments/DepartmentManagerStep';
import { EmployeeSelectionStep } from '../components/departments/EmployeeSelectionStep';
// Importe o novo componente de edição (crie o arquivo se não tiver ainda)
import { DepartmentEditEmployeesStep } from '../components/departments/DepartmentEditEmployeesStep'; 

import { departmentService } from '../services/departmentService';
import { employeeService, getAllEmployees } from '../services/employeeService';
import type { Employee } from '../types';
import { useDepartmentForm } from '../hooks/useDepartmentForm';

interface EmployeeChange {
  employeeId: string;
  newDepartmentId: string | null;
}

export const CreateDepartment = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const isEditMode = Boolean(id); 

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Estado para carregamento inicial (modo edição)
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [employeeChanges, setEmployeeChanges] = useState<EmployeeChange[]>([]);

  const { formData, errors, handleChange, validateStep, handleEmployeeSelection, setValues } =
    useDepartmentForm(); 

  // 1. Carregar Funcionários 
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoadingEmployees(true);
      try {
        const data = await getAllEmployees();
        setEmployees(data);
      } catch (error) {
        console.error('Erro ao buscar funcionários:', error);
      } finally {
        setLoadingEmployees(false);
      }
    };
    fetchEmployees();
  }, []);

  // 2. Se for Edição, carregar dados do Departamento
  useEffect(() => {
    if (isEditMode && id) {
      const loadDepartment = async () => {
        try {
          const allDepts = await departmentService.getAll(); 
          const dept = allDepts.find(d => d.id === id);

          if (dept) {
            setValues({
              name: dept.name,
              description: dept.description,
              managerId: dept.managerId
            });
          } else {
             alert('Departamento não encontrado');
             navigate('/departamentos');
          }
        } catch (error) {
          console.error(error);
        } finally {
          setInitialLoading(false);
        }
      };
      loadDepartment();
    }
  }, [id, isEditMode, setValues, navigate]);


  const steps = ['Informações', 'Gestão', 'Colaboradores'];  const progressValue = activeStep === 0 ? 0 : activeStep === 1 ? 50 : 100;

  const handleNext = async () => {
    // Validação
    const isValid = validateStep(activeStep);
    if (!isValid) return;

    if (activeStep < 2) {
      setActiveStep(prev => prev + 1);
    } else {
      await handleSave();
    }
  };

  const handleBack = () => {
    if (activeStep > 0) setActiveStep(prev => prev - 1);
    else navigate('/departamentos');
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (isEditMode && id) {
         // --- MODO EDIÇÃO ---
         await departmentService.update(id, {
             name: formData.name,
             description: formData.description,
             managerId: formData.managerId
         });
         
         // Processar mudanças de funcionários acumuladas do Step 3
         if (employeeChanges.length > 0) {
            const changesByDept = employeeChanges.reduce((acc, change) => {
                const key = change.newDepartmentId || 'none';
                if (!acc[key]) acc[key] = [];
                acc[key].push(change.employeeId);
                return acc;
            }, {} as Record<string, string[]>);

            const updatePromises = Object.entries(changesByDept).map(([deptId, empIds]) => {
                const targetDeptId = deptId === 'none' ? null : deptId;
                return employeeService.updateEmployeesDepartment(empIds, targetDeptId as string);
            });
            await Promise.all(updatePromises);
        }

      } else {
         // --- MODO CRIAÇÃO ---
         const newDepartmentId = await departmentService.create(formData);
         // Move colaboradores selecionados
         if (formData.employeeIds && formData.employeeIds.length > 0) {
            await employeeService.updateEmployeesDepartment(
              formData.employeeIds,
              newDepartmentId
            );
         }
      }
      navigate('/departamentos');
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <DepartmentForm
            name={formData.name}
            description={formData.description}
            errors={errors}
            onChangeName={v => handleChange('name', v)}
            onChangeDesc={v => handleChange('description', v)}
          />
        );
      case 1:
        return (
          <DepartmentManagerStep
            value={formData.managerId}
            error={errors.managerId}
            onChange={(id: string | null) => handleChange('managerId', id)}
            employees={employees}
            loading={loadingEmployees}
          />
        );
      case 2:
        if (isEditMode && id) {
            return (
                <DepartmentEditEmployeesStep 
                    currentDepartmentId={id}
                    onEmployeeChanges={setEmployeeChanges}
                />
            );
        } else {
            return (
                <EmployeeSelectionStep
                    onSelectionChange={handleEmployeeSelection}
                    selectedIds={formData.employeeIds}
                />
            );
        }
      default:
        return null;
    }
  };

  if (initialLoading) {
      return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  }

  return (
    <Box>
      <Box sx={{ width: '100%', maxWidth: '100%', mx: 'auto', pr: { xs: 0, lg: '5%' } }}>
        <Box sx={{ mb: 2 }}>
          <AppBreadcrumbs
            items={[
              { label: 'Departamentos', path: '/departamentos' },
              { label: isEditMode ? 'Editar Departamento' : 'Novo Departamento' }
            ]}
          />
        </Box>

        <OnboardingProgress progress={progressValue} />

        <Box sx={{ mt: '39px', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: '40px', alignItems: 'flex-start' }}>
          <Box sx={{ width: { xs: '100%', md: '153px' }, flexShrink: 0 }}>
            <StepperVertical currentStep={activeStep + 1} steps={steps} />
          </Box>

          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', minHeight: '440px' }}>
            <Box>{renderStepContent()}</Box>

            <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '48px', width: '100%', pt: 4 }}>
              
              <AppButton
                  onClick={handleBack}
                  variant="text"
                  disabled={loading}
                  // ... estilos do botão voltar
                  sx={{ color: 'text.secondary' }}
              >
                  {activeStep === 0 ? 'Cancelar' : 'Voltar'}
              </AppButton>

              <AppButton
                onClick={handleNext}
                loading={loading}
                variant="contained"
              >
                {activeStep === steps.length - 1 ? 'Salvar' : 'Próximo'}
              </AppButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};