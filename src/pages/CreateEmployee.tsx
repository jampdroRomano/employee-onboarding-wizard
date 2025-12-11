import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react'; 
import { AppBreadcrumbs } from '../components/common/AppBreadcrumbs';
import { OnboardingProgress } from '../components/common/OnboardingProgress';
import { StepperVertical } from '../components/onboarding/StepperVertical';
import { BasicInfoForm } from '../components/onboarding/BasicInfoForm';
import { ProfessionalInfoForm } from '../components/onboarding/ProfessionalInfoForm';
import { AppButton } from '../components/common/AppButton';
import { useBasicInfo } from '../hooks/useBasicInfo'; 

export const CreateEmployee = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const { formData, errors, handleChange, validateStep } = useBasicInfo();

  const handleNext = () => {
    if (currentStep === 1) {
      const isValid = validateStep();
      if (isValid) setCurrentStep(2);
    } else {
      console.log('Finalizar Cadastro', formData);
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else {
      navigate('/');
    }
  };

  const progressValue = currentStep === 1 ? 0 : 50;

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <AppBreadcrumbs
          items={[
            { label: 'Colaboradores', path: '/' },
            { label: 'Cadastrar Colaborador' }
          ]}
        />
      </Box>

      <Box sx={{ pr: { xs: 0, md: '94px' } }}>
        <OnboardingProgress progress={progressValue} />

        {/* CONTAINER PRINCIPAL  */}
        <Box
          sx={{
            mt: '39px',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: '40px',
            alignItems: 'flex-start', 
          }}
        >
          {/* 1. COLUNA ESQUERDA: Stepper (Fixo) */}
          <Box sx={{ width: { xs: '100%', md: '153px' }, flexShrink: 0 }}>
            <StepperVertical currentStep={currentStep} />
          </Box>

          {/* 2. COLUNA DIREITA: Formulário + Botões */}
          <Box sx={{ width: '100%' }}> 
            <Box sx={{ minHeight: '272px' }}>
                {currentStep === 1 ? (
                  <BasicInfoForm 
                    formData={formData}
                    errors={errors}
                    handleChange={handleChange}
                  />
                ) : (
                  <ProfessionalInfoForm />
                )}
            </Box>

            {/* B. ÁREA DOS BOTÕES*/}
            <Box
              sx={{
                mt: '120px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: '48px',
                width: '100%' 
              }}
            >
              <AppButton
                onClick={handleBack}
                sx={{
                  width: '64px', height: '48px', minWidth: '64px',
                  backgroundColor: 'transparent', boxShadow: 'none',
                  color: '#919EABCC',
                  pl: 0, 
                  justifyContent: 'flex-start', 
                  '&:hover': { backgroundColor: 'transparent', boxShadow: 'none', color: '#919EAB' }
                }}
              >
                Voltar
              </AppButton>

              <AppButton
                onClick={handleNext}
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