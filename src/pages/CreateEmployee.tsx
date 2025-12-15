import { Box } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AppBreadcrumbs } from '../components/common/AppBreadcrumbs';
import { OnboardingProgress } from '../components/common/OnboardingProgress';
import { StepperVertical } from '../components/common/StepperVertical';
import { BasicInfoForm } from '../components/onboarding/BasicInfoForm';
import { ProfessionalInfoForm } from '../components/onboarding/ProfessionalInfoForm';
import { AppButton } from '../components/common/AppButton';
import { useBasicInfo } from '../hooks/useBasicInfo';
import { useProfessionalInfo } from '../hooks/useProfessionalInfo';
import { createEmployee, checkEmailExists } from '../services/employeeService';

export const CreateEmployee = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const steps = ["Infos Básicas", "Infos Profissionais"];

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
    } else {
      const isValid = profInfo.validateStep();

      if (isValid) {
        setIsSaving(true);
        const payload = {
          ...basicInfo.formData,
          departamento: profInfo.department
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
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const progressValue = currentStep === 1 ? 0 : 50;

  return (
    <Box>
      <Box
        sx={{
          width: '100%',
          maxWidth: '100%',
          mx: 'auto',
          pr: { xs: 0, lg: '5%' }
        }}
      >

        <Box sx={{ mb: 2 }}>
          <AppBreadcrumbs
            items={[
              { label: 'Colaboradores', path: '/' },
              { label: 'Cadastrar Colaborador' }
            ]}
          />
        </Box>

        <OnboardingProgress progress={progressValue} />

        <Box
          sx={{
            mt: '39px',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: '40px',
            alignItems: 'flex-start',
          }}
        >
          <Box sx={{ width: { xs: '100%', md: '153px' }, flexShrink: 0 }}>
            <StepperVertical currentStep={currentStep} steps={steps} />
          </Box>

          {/* COLUNA DA DIREITA (FORM + BOTÕES) */}
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '440px'
            }}
          >

            {/* Container do Formulário */}
            <Box>
              {currentStep === 1 ? (
                <BasicInfoForm
                  formData={basicInfo.formData}
                  errors={basicInfo.errors}
                  handleChange={basicInfo.handleChange}
                  handleStatusChange={basicInfo.handleStatusChange}
                />
              ) : (
                <ProfessionalInfoForm
                  department={profInfo.department}
                  departmentList={profInfo.departmentList} 
                  isLoading={profInfo.isLoadingDepts}
                  error={profInfo.error}
                  handleChange={profInfo.handleChange}
                />
              )}
            </Box>

            {/* Container dos Botões */}
            <Box
              sx={{
                mt: 'auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: '48px',
                width: '100%',
                pt: 4
              }}
            >
              <AppButton
                onClick={handleBack}
                variant="text"
                disableRipple
                disabled={currentStep === 1 || isSaving || isValidating}
                sx={{
                  width: '64px', height: '48px', minWidth: '64px',
                  boxShadow: 'none',
                  pl: 0,
                  justifyContent: 'flex-start',
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    color: 'text.secondary',
                  },
                  '&.Mui-disabled': {
                    color: (theme) => alpha(theme.palette.grey[500], 0.8),
                  },
                  '&:focus': { backgroundColor: 'transparent' },
                  '&:active': { backgroundColor: 'transparent' }
                }}
              >
                Voltar
              </AppButton>

              <AppButton
                onClick={handleNext}
                loading={isSaving || isValidating}
                sx={{
                  width: '91px', height: '48px', minWidth: '64px',
                  fontWeight: 700, borderRadius: '8px',
                }}
              >
                {currentStep === 2 ? 'Concluir' : 'Próximo'}
              </AppButton>
            </Box>

          </Box>
        </Box>
      </Box>
    </Box>
  );
};