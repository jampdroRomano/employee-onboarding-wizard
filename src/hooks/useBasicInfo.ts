import { useState } from 'react';

export const useBasicInfo = () => {
  // 1. Estados (Dados e Erros)
  const [formData, setFormData] = useState({
    nome: '',
    email: ''
  });

  const [errors, setErrors] = useState({
    nome: '',
    email: ''
  });

  // 2. Ações (Handlers)
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpa o erro ao digitar
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // 3. Validação
  const validateStep = (): boolean => {
    let isValid = true;
    const newErrors = { nome: '', email: '' };

    if (!formData.nome.trim()) {
      newErrors.nome = 'O nome é obrigatório.';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'O e-mail é obrigatório.';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Insira um e-mail válido.';
      isValid = false;
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