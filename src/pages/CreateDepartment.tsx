import { useState, useEffect } from 'react';
import { Box, CircularProgress, alpha } from '@mui/material'; 
import { useNavigate, useParams } from 'react-router-dom'; 
import { AppBreadcrumbs } from '../components/common/AppBreadcrumbs';
import { AppButton } from '../components/common/AppButton';
import { StepperVertical } from '../components/common/StepperVertical';
import { OnboardingProgress } from '../components/common/OnboardingProgress';
import { DepartmentForm } from '../components/departments/DepartmentForm';
import { DepartmentManagerStep } from '../components/departments/DepartmentManagerStep';
import { EmployeeSelectionStep } from '../components/departments/EmployeeSelectionStep';
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
        await departmentService.updateDepartmentAndMembers(
          id,
          {
            name: formData.name,
            description: formData.description,
            managerId: formData.managerId,
          },
          employeeChanges
        );
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
                disableRipple
                disabled={loading}
                sx={{ width: '64px', height: '48px', minWidth: '64px', boxShadow: 'none', pl: 0, justifyContent: 'flex-start', color: 'text.primary', '&:hover': { backgroundColor: 'transparent', boxShadow: 'none', color: 'text.secondary', }, '&.Mui-disabled': { color: (theme) => alpha(theme.palette.grey[500], 0.8), }, '&:focus': { backgroundColor: 'transparent' }, '&:active': { backgroundColor: 'transparent' } }}
              >
                Voltar
              </AppButton>

              <AppButton
                onClick={handleNext}
                loading={loading}
                sx={{ width: '91px', height: '48px', minWidth: '64px', fontWeight: 700, borderRadius: '8px' }}
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