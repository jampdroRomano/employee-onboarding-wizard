import { Box, CircularProgress } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react'; 
import { AppBreadcrumbs } from '../components/common/AppBreadcrumbs';
import { OnboardingProgress } from '../components/common/OnboardingProgress';
import { StepperVertical } from '../components/common/StepperVertical';
import { BasicInfoForm } from '../components/collaborators/BasicInfoForm';
import { ProfessionalInfoForm } from '../components/collaborators/ProfessionalInfoForm';
import { ContractInfoForm } from '../components/collaborators/ContractInfoForm';
import { AppButton } from '../components/common/AppButton';
import { useBasicInfo } from '../hooks/useBasicInfo';
import { useProfessionalInfo } from '../hooks/useProfessionalInfo';
import { createEmployee, checkEmailExists, employeeService } from '../services/employeeService'; 
import type { NewEmployeePayload } from '../types';
import { toast } from 'sonner';

export const CreateEmployee = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const isEditMode = Boolean(id); 

  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditMode); 

  const steps = [
    "Infos Básicas",
    "Infos Profissionais",
    "Infos Contratuais"
  ];

  const basicInfo = useBasicInfo();
  const profInfo = useProfessionalInfo();

  useEffect(() => {
    if (isEditMode && id) {
      const loadEmployee = async () => {
        try {
          const employee = await employeeService.getById(id);
          if (employee) {
            basicInfo.setValues({
              nome: employee.nome,
              email: employee.email,
              status: employee.status === 'Ativo' 
            });

            // Preenche Hook Info Profissional
            profInfo.setValues({
              department: employee.departamento || '',
              role: employee.role || '',
              seniority: employee.seniority || '',
              admissionDate: employee.admissionDate || '',
              managerId: employee.managerId || '',
              salary: employee.salary ? String(employee.salary) : ''
            });
          } else {
            toast.error("Colaborador não encontrado");
            navigate('/');
          }
        } catch (error) {
          console.error("Erro ao carregar colaborador:", error);
          toast.error("Erro ao carregar dados do colaborador.");
        } finally {
          setIsFetching(false);
        }
      };
      loadEmployee();
    } else {
      setIsFetching(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditMode, navigate]);

  const handleNext = async () => {
    if (currentStep === 1) {
      const isValid = basicInfo.validateStep();
      if (isValid) {
        if (!isEditMode) {
            setIsValidating(true);
            const emailExists = await checkEmailExists(basicInfo.formData.email);
            setIsValidating(false);

            if (emailExists) {
              basicInfo.setFieldError('email', 'Este e-mail já está em uso.');
              return;
            }
        }
        setCurrentStep(2);
      }
      return;
    }

    if (currentStep === 2) {
      const isValid = profInfo.validateStep2();
      if (isValid) {
        setCurrentStep(3);
      }
      return;
    }

    // --- SALVAR / ATUALIZAR ---
    if (currentStep === 3) {
      const isValid = profInfo.validateStep3();

      if (isValid) {
        setIsSaving(true);

        const rawPayload = {
          ...basicInfo.formData,
          ...profInfo.formData,
          departamento: profInfo.formData.department
        };

        // Filtra e remove chaves com valores 'undefined'
        const finalPayload = Object.fromEntries(
          Object.entries(rawPayload).filter(([, value]) => value !== undefined)
        ) as Partial<NewEmployeePayload>;

        try {
          if (isEditMode && id) {
            // MODO EDIÇÃO: Atualiza
            await employeeService.update(id, finalPayload);
            toast.success('Colaborador atualizado com sucesso!');
          } else {
            // MODO CRIAÇÃO: Cria novo
            await createEmployee(rawPayload as NewEmployeePayload);
            toast.success('Colaborador criado com sucesso!');
          }
          navigate('/');
        } catch (error) {
          console.error("Erro ao salvar:", error);
          let errorMessage = "Ocorreu um erro ao salvar.";
          if (error instanceof Error) {
            errorMessage = error.message;
          }
          toast.error(errorMessage);
        } finally {
          setIsSaving(false);
        }
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
        navigate('/'); 
    }
  };

  const progressValue = currentStep === 1 ? 0 : currentStep === 2 ? 50 : 100;

  if (isFetching) {
      return (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
              <CircularProgress />
          </Box>
      );
  }

  return (
    <Box>
      <Box sx={{ width: '100%', maxWidth: '100%', mx: 'auto', pr: { xs: 0, lg: '5%' } }}>
        <Box sx={{ mb: 2 }}>
          <AppBreadcrumbs
            items={[
              { label: 'Colaboradores', path: '/' },
              // Texto dinâmico: Editar ou Cadastrar
              { label: isEditMode ? 'Editar Colaborador' : 'Cadastrar Colaborador' }
            ]}
          />
        </Box>

        <OnboardingProgress progress={progressValue} />

        <Box sx={{ mt: '39px', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: '40px', alignItems: 'flex-start' }}>
          <Box sx={{ width: { xs: '100%', md: '153px' }, flexShrink: 0 }}>
            <StepperVertical currentStep={currentStep} steps={steps} />
          </Box>

          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', minHeight: '440px' }}>
            <Box>
              {currentStep === 1 && (
                <BasicInfoForm
                  formData={basicInfo.formData}
                  errors={basicInfo.errors}
                  handleChange={basicInfo.handleChange}
                  handleStatusChange={basicInfo.handleStatusChange}
                />
              )}

              {currentStep === 2 && (
                <ProfessionalInfoForm
                  formData={profInfo.formData}
                  departmentList={profInfo.departmentList}
                  isLoading={profInfo.isLoading}
                  errors={profInfo.errors}
                  handleChange={profInfo.handleChange}
                />
              )}

              {currentStep === 3 && (
                <ContractInfoForm
                  formData={profInfo.formData}
                  employeesList={profInfo.employeesList}
                  isLoading={profInfo.isLoading}
                  errors={profInfo.errors}
                  handleChange={profInfo.handleChange}
                />
              )}
            </Box>

            <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '48px', width: '100%', pt: 4 }}>
              <AppButton
                onClick={handleBack}
                variant="text"
                disableRipple
                disabled={isSaving || isValidating}
                sx={{ width: '64px', height: '48px', minWidth: '64px', boxShadow: 'none', pl: 0, justifyContent: 'flex-start', color: 'text.primary', '&:hover': { backgroundColor: 'transparent', boxShadow: 'none', color: 'text.secondary', }, '&.Mui-disabled': { color: (theme) => alpha(theme.palette.grey[500], 0.8), }, '&:focus': { backgroundColor: 'transparent' }, '&:active': { backgroundColor: 'transparent' } } }
              >
                Voltar
              </AppButton>

              <AppButton
                onClick={handleNext}
                loading={isSaving || isValidating}
                sx={{ width: '91px', height: '48px', minWidth: '64px', fontWeight: 700, borderRadius: '8px' }}
              >
                {currentStep === steps.length 
                    ? (isEditMode ? 'Salvar' : 'Concluir') 
                    : 'Próximo'
                }
              </AppButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};