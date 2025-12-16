import { Box } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AppBreadcrumbs } from '../components/common/AppBreadcrumbs';
import { OnboardingProgress } from '../components/common/OnboardingProgress';
import { StepperVertical } from '../components/common/StepperVertical';
import { BasicInfoForm } from '../components/collaborators/BasicInfoForm';
import { ProfessionalInfoForm } from '../components/collaborators/ProfessionalInfoForm';
import { ContractInfoForm } from '../components/collaborators/ContractInfoForm';
import { AppButton } from '../components/common/AppButton';
import { useBasicInfo } from '../hooks/useBasicInfo';
import { useProfessionalInfo } from '../hooks/useProfessionalInfo';
import { createEmployee, checkEmailExists } from '../services/employeeService';

export const CreateEmployee = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const steps = [
    "Infos Básicas",
    "Infos Profissionais",
    "Infos Contratuais"
  ];

  const basicInfo = useBasicInfo();
  const profInfo = useProfessionalInfo();

  const handleNext = async () => {
    if (currentStep === 1) {
      const isValid = basicInfo.validateStep();
      if (isValid) {
        setIsValidating(true);
        const emailExists = await checkEmailExists(basicInfo.formData.email);
        setIsValidating(false);

        if (emailExists) {
          basicInfo.setFieldError('email', 'Este e-mail já está em uso.');
        } else {
          setCurrentStep(2);
        }
      }
      return;
    }

    // --- LÓGICA DO PASSO 2 ---
    if (currentStep === 2) {
      const isValid = profInfo.validateStep2();
      if (isValid) {
        setCurrentStep(3);
      }
      return;
    }

    // --- LÓGICA DO PASSO 3 (SALVAR) ---
    if (currentStep === 3) {
      const isValid = profInfo.validateStep3();

      if (isValid) {
        setIsSaving(true);

        const payload = {
          ...basicInfo.formData,
          ...profInfo.formData,
          departamento: profInfo.formData.department
        };

        try {
          await createEmployee(payload);
          navigate('/');
        } catch (error: any) {
          console.error("Erro ao salvar funcionário:", error);
          alert(error.message || "Ocorreu um erro ao salvar.");
        } finally {
          setIsSaving(false);
        }
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const progressValue = currentStep === 1 ? 0 : currentStep === 2 ? 50 : 100;

  return (
    <Box>
      <Box sx={{ width: '100%', maxWidth: '100%', mx: 'auto', pr: { xs: 0, lg: '5%' } }}>
        <Box sx={{ mb: 2 }}>
          <AppBreadcrumbs
            items={[
              { label: 'Colaboradores', path: '/' },
              { label: 'Cadastrar Colaborador' }
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
                disabled={currentStep === 1 || isSaving || isValidating}
                sx={{ width: '64px', height: '48px', minWidth: '64px', boxShadow: 'none', pl: 0, justifyContent: 'flex-start', color: 'text.primary', '&:hover': { backgroundColor: 'transparent', boxShadow: 'none', color: 'text.secondary', }, '&.Mui-disabled': { color: (theme) => alpha(theme.palette.grey[500], 0.8), }, '&:focus': { backgroundColor: 'transparent' }, '&:active': { backgroundColor: 'transparent' } }}
              >
                Voltar
              </AppButton>

              <AppButton
                onClick={handleNext}
                loading={isSaving || isValidating}
                sx={{ width: '91px', height: '48px', minWidth: '64px', fontWeight: 700, borderRadius: '8px' }}
              >
                {currentStep === steps.length ? 'Concluir' : 'Próximo'}
              </AppButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};