// src/hooks/useProfessionalInfo.ts
import { useState, useEffect } from 'react';
import { departmentService } from '../services/departmentService';
import type { Department } from '../services/departmentService';

export const useProfessionalInfo = () => {
  const [department, setDepartment] = useState('');
  const [departmentList, setDepartmentList] = useState<Department[]>([]); // Lista dinâmica
  const [isLoadingDepts, setIsLoadingDepts] = useState(false);
  const [error, setError] = useState('');

  // Busca os departamentos ao iniciar
  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoadingDepts(true);
      try {
        const data = await departmentService.getAll();
        setDepartmentList(data);
      } catch (err) {
        console.error("Erro ao buscar departamentos", err);
      } finally {
        setIsLoadingDepts(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleChange = (value: string) => {
    setDepartment(value);
    if (value) setError('');
  };

  const validateStep = () => {
    if (!department) {
      setError('Selecione um departamento.');
      return false;
    }
    return true;
  };

  return {
    department,
    departmentList, // Exportamos a lista
    isLoadingDepts, // Exportamos o loading
    error,
    handleChange,
    validateStep
  };
};