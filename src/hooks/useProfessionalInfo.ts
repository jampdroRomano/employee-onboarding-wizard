// src/hooks/useProfessionalInfo.ts
import { useState, useEffect } from 'react';
import { departmentService } from '../services/departmentService';
import { getAllEmployees } from '../services/employeeService';
import type { Department, Employee } from '../types';

export interface ProfessionalData {
  department: string;
  role: string;
  seniority: string;
  admissionDate: string;
  managerId: string;
  salary: string;
}

export const useProfessionalInfo = () => {
  const [formData, setFormData] = useState<ProfessionalData>({
    department: '',
    role: '',
    seniority: '',
    admissionDate: '',
    managerId: '',
    salary: ''
  });

  const [departmentList, setDepartmentList] = useState<Department[]>([]);
  const [employeesList, setEmployeesList] = useState<Employee[]>([]); 
  const [isLoading, setIsLoading] = useState(false); 
  const [errors, setErrors] = useState<Partial<ProfessionalData>>({});

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [deptData, empData] = await Promise.all([
          departmentService.getAll(),
          getAllEmployees()
        ]);
        setDepartmentList(deptData);
        setEmployeesList(empData);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (field: keyof ProfessionalData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Validação do Step 2 (Profissional)
  const validateStep2 = () => {
    const newErrors: Partial<ProfessionalData> = {};
    let isValid = true;

    if (!formData.department) {
        newErrors.department = 'Selecione um departamento.';
        isValid = false;
    }
    if (!formData.role.trim()) {
        newErrors.role = 'O cargo é obrigatório.';
        isValid = false;
    }
    if (!formData.seniority) {
        newErrors.seniority = 'Selecione a senioridade.';
        isValid = false;
    }
    if (!formData.admissionDate) {
        newErrors.admissionDate = 'Informe a data de admissão.';
        isValid = false;
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
    return isValid;
  };

  // Validação do Step 3 (Contratual)
  const validateStep3 = () => {
    const newErrors: Partial<ProfessionalData> = {};
    let isValid = true;

    if (!formData.salary.trim()) {
        newErrors.salary = 'Informe o salário base.';
        isValid = false;
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
    return isValid;
  };

  return {
    formData,
    departmentList,
    employeesList, 
    isLoading,
    errors,
    handleChange,
    validateStep2,
    validateStep3
  };
};