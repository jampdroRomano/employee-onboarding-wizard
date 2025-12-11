import { Box } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react'; 
import { AppBreadcrumbs } from '../components/common/AppBreadcrumbs';
import { OnboardingProgress } from '../components/common/OnboardingProgress';
import { StepperVertical } from '../components/onboarding/StepperVertical';
import { BasicInfoForm } from '../components/onboarding/BasicInfoForm';
import { ProfessionalInfoForm } from '../components/onboarding/ProfessionalInfoForm';
import { AppButton } from '../components/common/AppButton';
import { useBasicInfo } from '../hooks/useBasicInfo'; 
import { useProfessionalInfo } from '../hooks/useProfessionalInfo'; 
import { createEmployee } from '../services/employeeService'; 

export const CreateEmployee = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  const basicInfo = useBasicInfo();
  const profInfo = useProfessionalInfo(); 

  const handleNext = async () => {
    if (currentStep === 1) {
      const isValid = basicInfo.validateStep();
      if (isValid) setCurrentStep(2);
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
        } catch (error) {
          console.error("Erro ao salvar funcionário:", error);
          alert("Ocorreu um erro ao salvar.");
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
            <StepperVertical currentStep={currentStep} />
          </Box>

          <Box sx={{ width: '100%' }}> 
            
            <Box sx={{ minHeight: '272px' }}>
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
                    error={profInfo.error}
                    handleChange={profInfo.handleChange}
                  />
                )}
            </Box>

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
                variant="text" 
                disableRipple
                disabled={currentStep === 1 || isSaving}
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
                disabled={isSaving}
                sx={{
                  width: '91px', height: '48px', minWidth: '64px',
                  fontWeight: 700, borderRadius: '8px',
                }}
              >
                {isSaving ? '...' : (currentStep === 2 ? 'Concluir' : 'Próximo')}
              </AppButton>
            </Box>

          </Box>
        </Box>
      </Box>
    </Box>
  );
};