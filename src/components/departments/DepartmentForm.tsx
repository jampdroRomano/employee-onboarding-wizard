import { Stack } from '@mui/material';
import { AppTextField } from '../common/AppTextField';

interface DepartmentData {
  name: string;
  description: string;
  managerId: string | null;
}

interface Props {
  data: DepartmentData;
  onChange: (data: DepartmentData) => void;
}

export const DepartmentForm = ({ data, onChange }: Props) => {
  
  const handleChange = (field: keyof DepartmentData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <Stack spacing={3} sx={{ maxWidth: '600px' }}>
      <AppTextField
        label="Nome do Departamento"
        placeholder="Ex: Tecnologia da Informação"
        value={data.name}
        onChange={(e) => handleChange('name', e.target.value)}
        fullWidth
      />

      <AppTextField
        label="Descrição"
        placeholder="Breve descrição das responsabilidades..."
        value={data.description}
        onChange={(e) => handleChange('description', e.target.value)}
        fullWidth
        multiline
        rows={4}
      />
    </Stack>
  );
};