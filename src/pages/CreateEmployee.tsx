import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AppBreadcrumbs } from '../components/common/AppBreadcrumbs';
import { OnboardingProgress } from '../components/common/OnboardingProgress';
import { StepperVertical } from '../components/onboarding/StepperVertical';
import { BasicInfoForm } from '../components/onboarding/BasicInfoForm'; //
import { AppButton } from '../components/common/AppButton';
import { useBasicInfo } from '../hooks/useBasicInfo'; 

export const CreateEmployee = () => {
  const navigate = useNavigate();
  const { formData, errors, handleChange, validateStep } = useBasicInfo();
  const handleNext = () => {
    const isValid = validateStep();
    
    if (isValid) {
      console.log('Dados Válidos:', formData);
    }
  };

  return (
    <Box>
      {/* 1. Cabeçalho com Breadcrumbs */}
      <Box sx={{ mb: 2 }}>
        <AppBreadcrumbs
          items={[
            { label: 'Colaboradores', path: '/' },
            { label: 'Cadastrar Colaborador' }
          ]}
        />
      </Box>

      <Box sx={{ pr: { xs: 0, md: '94px' } }}>
        {/* 2. Barra de Progresso */}
        <OnboardingProgress progress={0} />

        {/* 3. Container Principal (Stepper + Form) */}
        <Box
          sx={{
            mt: '39px',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: '40px',
          }}
        >
          <Box sx={{ width: { xs: '100%', md: '153px' }, flexShrink: 0 }}>
            <StepperVertical />
          </Box>

          <Box sx={{ width: '100%' }}> 
            
            {/* A View apenas passa os dados recebidos do Hook para o componente de form */}
            <BasicInfoForm 
              formData={formData}
              errors={errors}
              handleChange={handleChange}
            />

            {/* 4. Container dos Botões (Frame 4 - Botões) */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: '120px',
                width: '100%',
                height: '48px',
              }}
            >
              <AppButton
                onClick={() => navigate('/')}
                sx={{
                  width: '64px', height: '48px', minWidth: '64px',
                  backgroundColor: 'transparent', boxShadow: 'none',
                  color: '#919EABCC',
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
                Próximo
              </AppButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};