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

    const bgColor = (isActive || isCompleted) ? 'primary.main' : '#DFE3E8';
    const textColor = (isActive || isCompleted) ? '#FFFFFF' : '#637381';
    const labelColor = isActive ? 'text.primary' : '#919EAB';
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
    <Stack 
      spacing={1} // Isso garante os 8px de distância entre (Bolinha) e (Linha)
      sx={{ 
        width: '153px', 
        // Removemos a altura fixa do container pai para ele se adaptar ao conteúdo
      }}
    >
      {/* Passo 1 */}
      {renderCircle(1, "Infos Básicas")}

      {/* Linha Conectora Dinâmica */}
      <Box 
        sx={{ 
          display: 'flex',
          justifyContent: 'center', 
          // A altura da linha é controlada aqui
          height: connectorHeight,
          // Garante a largura do container da linha para alinhar com o centro da bolinha (24px)
          width: '24px',
          transition: 'height 0.3s ease', 
        }} 
      >
        <Box 
            sx={{
                width: '1px',  
                height: '100%', 
                bgcolor: '#919EAB',
                opacity: 0.24,
            }}
        />
      </Box>

      {/* Passo 2 */}
      {renderCircle(2, "Infos Profissionais")}
    </Stack>
  );
};