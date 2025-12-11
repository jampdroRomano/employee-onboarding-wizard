import { Box, Stack, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

interface StepperVerticalProps {
  currentStep: number;
}

export const StepperVertical = ({ currentStep }: StepperVerticalProps) => {
  
  const connectorHeight = currentStep === 1 ? '104px' : '24px';

  const renderCircle = (stepNumber: number, label: string) => {
    const isActive = currentStep === stepNumber;
    const isCompleted = currentStep > stepNumber;

    // Cores baseadas no mainTheme.ts
    const bgColor = (isActive || isCompleted) ? 'primary.main' : 'grey.300'; // #22C55E ou #DFE3E8
    const textColor = (isActive || isCompleted) ? 'primary.contrastText' : 'text.secondary'; // Branco ou #637381
    const labelColor = isActive ? 'text.primary' : 'text.disabled'; // #212B36 ou #919EAB
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
    <Stack spacing={1} sx={{ width: '153px' }}>
      {renderCircle(1, "Infos Básicas")}

      <Box 
        sx={{ 
          display: 'flex',
          justifyContent: 'center', 
          height: connectorHeight,
          width: '24px',
          transition: 'height 0.3s ease', 
        }} 
      >
        <Box 
            sx={{
                width: '1px',  
                height: '100%', 
                bgcolor: 'grey.500', // #919EAB
                opacity: 0.24,
            }}
        />
      </Box>

      {renderCircle(2, "Infos Profissionais")}
    </Stack>
  );
};