import { Box } from '@mui/material';
import { AppBreadcrumbs } from '../components/common/AppBreadcrumbs';
import { OnboardingProgress } from '../components/common/OnboardingProgress';
import { StepperVertical } from '../components/onboarding/StepperVertical';
import { BasicInfoForm } from '../components/onboarding/BasicInfoForm';
import { AppButton } from '../components/common/AppButton'; //

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

      <Box sx={{ pr: { xs: 0, md: '94px' } }}>
        {/* 2. Barra de Progresso */}
        <Box>
          <OnboardingProgress progress={0} />
        </Box>

        {/* 3. Container Principal (Stepper + Form) */}
        <Box
          sx={{
            mt: '39px',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: '40px',
            // O container total tem 1026px (153 + 40 + 833)
          }}
        >
          {/* Coluna Esquerda: Frame 2 (Stepper) */}
          <Box sx={{ width: { xs: '100%', md: '153px' }, flexShrink: 0 }}>
            <StepperVertical />
          </Box>

          {/* Coluna Direita: Formulário + Botões */}
          <Box sx={{ width: '100%' }}> {/* Ocupa o restante (aprox 833px) */}

            <BasicInfoForm />

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
                sx={{
                  width: '64px',
                  height: '48px',
                  minWidth: '64px',
                  backgroundColor: 'transparent',
                  boxShadow: 'none',
                  color: '#919EABCC',
                  fontFamily: '"Public Sans", sans-serif',
                  fontWeight: 700,
                  fontSize: '15px',
                  lineHeight: '26px',
                  textTransform: 'none',
                  borderRadius: '8px',
                  paddingLeft: 0,
                  paddingRight: 0,
                  '&:hover': {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    color: '#919EAB',
                  }
                }}
              >
                Voltar
              </AppButton>

              {/* Botão PRÓXIMO */}
              <AppButton
                sx={{
                  width: '91px',
                  height: '48px',
                  minWidth: '64px',
                  fontFamily: '"Public Sans", sans-serif',
                  fontWeight: 700,
                  fontSize: '15px',
                  lineHeight: '26px',
                  textTransform: 'none',
                  borderRadius: '8px',
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