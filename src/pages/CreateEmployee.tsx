import { Box, Paper } from '@mui/material';
import { AppBreadcrumbs } from '../components/common/AppBreadcrumbs';
import { OnboardingProgress } from '../components/common/OnboardingProgress';
import { StepperVertical } from '../components/onboarding/StepperVertical';

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

      {/* 3. FRAME 4 - Container Principal */}
      <Box
        sx={{
          mt: '39px',         
          display: 'flex',    
          gap: '40px',       
          width: '1026px',   
          maxWidth: '100%',  
        }}
      >
        {/* Coluna Esquerda: Frame 2 (Stepper) */}
        <Box sx={{ width: '153px', flexShrink: 0 }}>
          <StepperVertical />
        </Box>

        {/* Coluna Direita: Área do Formulário) */}
        <Paper
          sx={{
            width: '833px',        
            p: 3,                   
            borderRadius: '16px',
            bgcolor: '#FFFFFF',
            boxShadow: '0px 12px 24px -4px rgba(145, 158, 171, 0.12)', 
          }}
        >
          {/* O conteúdo do formulário (Inputs, Switches) */}
          <Box sx={{ height: '200px', border: '1px dashed #919EAB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
            Área do Frame 1 (Formulário)
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};