import { useState } from 'react';

export const useBasicInfo = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    status: true, 
  });

  const [errors, setErrors] = useState({
    nome: '',
    email: ''
  });

  const setValues = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleStatusChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, status: checked }));
  };

  const setFieldError = (field: 'nome' | 'email', message: string) => {
    setErrors(prev => ({ ...prev, [field]: message }));
  };

  const validateStep = (): boolean => {
    let isValid = true;
    const newErrors = { nome: '', email: '' };

    if (!formData.nome.trim()) {
      newErrors.nome = 'O título é obrigatório.'; 
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
    handleStatusChange,
    setFieldError, 
    validateStep,
    setValues 
  };
};