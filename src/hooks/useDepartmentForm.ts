import { useState } from 'react';

export interface DepartmentState {
  name: string;
  description: string;
  managerId: string | null;
}

export interface DepartmentErrors {
  name?: string;
  description?: string;
  managerId?: string;
}

export const useDepartmentForm = () => {
  const [formData, setFormData] = useState<DepartmentState>({
    name: '',
    description: '',
    managerId: null
  });

  const [errors, setErrors] = useState<DepartmentErrors>({});

  const handleChange = (field: keyof DepartmentState, value: string | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: DepartmentErrors = {};
    let isValid = true;

    // Validação do Passo 1: Informações Básicas
    if (step === 0) {
      if (!formData.name.trim()) {
        newErrors.name = 'O nome do departamento é obrigatório.';
        isValid = false;
      } else if (formData.name.length < 3) {
        newErrors.name = 'O nome deve ter pelo menos 3 caracteres.';
        isValid = false;
      }

      if (!formData.description.trim()) {
        newErrors.description = 'A descrição é obrigatória.';
        isValid = false;
      }
    }

    // Validação do Passo 2: Gestão 
    if (step === 1) {
      // if (!formData.managerId) {
      //   newErrors.managerId = 'Selecione um responsável pelo departamento.';
      //   isValid = false;
      // }
    }

    setErrors(newErrors);
    return isValid;
  };

  return {
    formData,
    errors,
    handleChange,
    validateStep
  };
};