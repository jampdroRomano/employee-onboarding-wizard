import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { AppBreadcrumbs } from '../components/common/AppBreadcrumbs';
import { AppButton } from '../components/common/AppButton';
import { StepperVertical } from '../components/common/StepperVertical'; 
import { OnboardingProgress } from '../components/common/OnboardingProgress';

import { DepartmentForm } from '../components/departments/DepartmentForm';
import { DepartmentManagerStep } from '../components/departments/DepartmentManagerStep';
import { departmentService } from '../services/departmentService';
import { useDepartmentForm } from '../hooks/useDepartmentForm'; // Importe o hook

export const CreateDepartment = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0); 
  const [loading, setLoading] = useState(false);

  // Usando o Hook customizado
  const { formData, errors, handleChange, validateStep } = useDepartmentForm();

  const steps = [
    'Informações', 
    'Gestão', 
    'Colaboradores'
  ];

  const progressValue = activeStep === 0 ? 0 : activeStep === 1 ? 50 : 100;

  const handleNext = async () => {
    // Valida o passo atual antes de prosseguir
    const isValid = validateStep(activeStep);

    if (!isValid) {
        return; 
    }

    // Se validou o passo 0, vai pro 1
    if (activeStep === 0) {
      setActiveStep(1);
      return;
    }

    // Se validou o passo 1, vai pro 2
    if (activeStep === 1) {
      setActiveStep(2);
      return;
    }

    // Se estiver no passo 2, salva
    if (activeStep === 2) {
      await handleSave();
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await departmentService.create(formData);
      navigate('/departamentos');
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar."); 
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
            onChangeName={(v) => handleChange('name', v)}
            onChangeDesc={(v) => handleChange('description', v)}
          />
        );
      case 1:
        return (
          <DepartmentManagerStep 
            value={formData.managerId}
            error={errors.managerId} 
            onChange={(id) => handleChange('managerId', id)}
          />
        );
      case 2:
        return (
            <Box sx={{ width: '100%' }}>
                <Typography 
                    component="h2"
                    variant="h4" 
                    sx={{ 
                        mb: '31px',
                        color: 'text.secondary' 
                    }}
                >
                    Colaboradores
                </Typography>
                
                <Box 
                  sx={{ 
                      p: 4, 
                      border: '1px dashed #919EAB', 
                      borderRadius: 2, 
                      bgcolor: 'background.neutral',
                      textAlign: 'center' 
                  }}
                >
                    <Typography color="text.secondary">
                        Lista de seleção de colaboradores será implementada em breve.
                    </Typography>
                </Box>
            </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      <Box sx={{ width: '100%', maxWidth: '100%', mx: 'auto', pr: { xs: 0, lg: '5%' } }}>
        
        <Box sx={{ mb: 2 }}>
          <AppBreadcrumbs
            items={[
              { label: 'Departamentos', path: '/departamentos' },
              { label: 'Novo Departamento' }
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
             <StepperVertical currentStep={activeStep + 1} steps={steps} />
          </Box>

          <Box 
            sx={{ 
                width: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                minHeight: '440px' 
            }}
          >
             
             <Box>
                {renderStepContent()}
             </Box>

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
                {activeStep > 0 ? (
                  <AppButton 
                    onClick={handleBack}
                    variant="text"
                    disableRipple
                    disabled={loading}
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
                ) : (
                   <AppButton 
                    onClick={() => navigate('/departamentos')}
                    variant="text"
                    disableRipple
                    disabled={loading}
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
                      '&:focus': { backgroundColor: 'transparent' },
                      '&:active': { backgroundColor: 'transparent' }
                    }}
                  >
                    Cancelar
                  </AppButton>
                )}

                <AppButton 
                  onClick={handleNext}
                  loading={loading}
                  sx={{
                    width: '91px', height: '48px', minWidth: '64px',
                    fontWeight: 700, borderRadius: '8px',
                  }}
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