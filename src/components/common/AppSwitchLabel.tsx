import { FormControlLabel, Switch, Typography } from '@mui/material';

interface AppSwitchLabelProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export const AppSwitchLabel = ({ checked, onChange, label = "Ativar ao criar" }: AppSwitchLabelProps) => {
  return (
    <FormControlLabel
      sx={{ ml: -1.5 }} 
      control={
        <Switch
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
      }
      label={
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {label}
        </Typography>
      }
    />
  );
};