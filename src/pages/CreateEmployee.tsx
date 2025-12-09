import { Box } from '@mui/material';
import { AppBreadcrumbs } from '../components/common/AppBreadcrumbs';
import { OnboardingProgress } from '../components/common/OnboardingProgress';
import { StepperVertical } from '../components/onboarding/StepperVertical';
import { BasicInfoForm } from '../components/onboarding/BasicInfoForm';

export const CreateEmployee = () => {
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

      {/* 2. Barra de Progresso */}
      <Box> 
         <OnboardingProgress progress={0} />
      </Box>

      {/* 3. Container Principal (Stepper + Form) */}
      <Box
        sx={{
          mt: '39px',         
          display: 'flex',    
          gap: '40px',       
          width: '97%',
        }}
      >
        {/* Coluna Esquerda: Frame 2 (Stepper) */}
        <Box sx={{ width: '153px', flexShrink: 0 }}>
          <StepperVertical />
        </Box>

        {/* Coluna Direita: Formulário */}
        <Box sx={{ width: '100%' }}>
          <BasicInfoForm />
        </Box>
      </Box>
    </Box>
  );
};