import { useState } from 'react';

export const useProfessionalInfo = () => {
  const [department, setDepartment] = useState('');
  const [error, setError] = useState('');

  const handleChange = (value: string) => {
    setDepartment(value);
    // Limpa o erro assim que o usuário seleciona algo
    if (error) setError('');
  };

  const validateStep = (): boolean => {
    if (!department) {
      setError('Por favor, selecione um departamento.');
      return false;
    }
    return true;
  };

  return {
    department,
    error,
    handleChange,
    validateStep
  };
};