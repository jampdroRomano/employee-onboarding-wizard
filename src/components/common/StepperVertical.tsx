import { Box, Stack, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

interface StepperVerticalProps {
  currentStep: number;
  steps: string[]; 
}

export const StepperVertical = ({ currentStep, steps }: StepperVerticalProps) => {

  const renderCircle = (stepNumber: number, label: string) => {
    const isActive = currentStep === stepNumber;
    const isCompleted = currentStep > stepNumber;

    const bgColor = (isActive || isCompleted) ? 'primary.main' : 'grey.300'; 
    const textColor = (isActive || isCompleted) ? 'primary.contrastText' : 'text.secondary';
    const labelColor = isActive ? 'text.primary' : 'text.disabled';
    const fontWeight = isActive ? 600 : 400;

    return (
      <Stack direction="row" spacing={1} alignItems="center" sx={{ height: '24px' }}>
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            bgcolor: bgColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: textColor,
            fontFamily: '"Public Sans", sans-serif',
            fontWeight: 600,
            fontSize: '14px',
            lineHeight: '22px',
          }}
        >
          {isCompleted ? <CheckIcon sx={{ fontSize: 16 }} /> : stepNumber}
        </Box>
        
        <Typography
          sx={{
            fontFamily: '"Public Sans", sans-serif',
            fontWeight: fontWeight,
            fontSize: '14px',
            color: labelColor,
            lineHeight: '22px',
          }}
        >
          {label}
        </Typography>
      </Stack>
    );
  };

  return (
    <Stack spacing={0} sx={{ width: '153px' }}>
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isLastStep = index === steps.length - 1;
        const connectorHeight = currentStep === stepNumber ? '104px' : '24px';

        return (
          <Box key={label}>
            {/* Renderiza o Círculo e Texto */}
            {renderCircle(stepNumber, label)}

            {/* Renderiza o Conector (apenas se não for o último item) */}
            {!isLastStep && (
              <Box 
                sx={{ 
                  display: 'flex',
                  justifyContent: 'flex-start', 
                  pl: '11.5px', 
                  height: connectorHeight,
                  width: '24px',
                  transition: 'height 0.3s ease', 
                }} 
              >
                <Box 
                    sx={{
                        width: '1px',  
                        height: '100%', 
                        bgcolor: 'grey.500', 
                        opacity: 0.24,
                    }}
                />
              </Box>
            )}
          </Box>
        );
      })}
    </Stack>
  );
};