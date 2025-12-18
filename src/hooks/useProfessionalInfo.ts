import { useState, useCallback, useEffect } from 'react';
import { departmentService } from '../services/departmentService';
import { getAllEmployees } from '../services/employeeService';
import type { Department, Employee } from '../types';

export interface ProfessionalData {
  department: string;
  role: string;
  seniority: string;
  admissionDate: string;
  managerId: string | null;
  salary: string;
}

export const useProfessionalInfo = () => {
  const [formData, setFormData] = useState<ProfessionalData>({
    department: '',
    role: '',
    seniority: '',
    admissionDate: '',
    managerId: null,
    salary: ''
  });

  const [departmentList, setDepartmentList] = useState<Department[]>([]);
  const [employeesList, setEmployeesList] = useState<Employee[]>([]); 
  const [isLoading, setIsLoading] = useState(false); 
  const [errors, setErrors] = useState<Partial<ProfessionalData>>({});

  const setValues = useCallback((data: Partial<ProfessionalData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

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

  const handleChange = useCallback((field: keyof ProfessionalData, value: string) => {
    let finalValue: string | null = value;

    if (field === 'salary') {
      // Permite apenas dígitos, vírgulas e pontos
      finalValue = value.replace(/[^0-9,.]/g, ''); 
    }

    if (field === 'managerId' && value === '') {
        finalValue = null;
    }
    setFormData(prev => ({ ...prev, [field]: finalValue }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const validateStep2 = useCallback(() => {
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
  }, [formData]);

  const validateStep3 = useCallback(() => {
    const newErrors: Partial<ProfessionalData> = {};
    let isValid = true;

    if (!formData.salary.trim()) {
        newErrors.salary = 'Informe o salário base.';
        isValid = false;
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
    return isValid;
  }, [formData]);

  return {
    formData,
    departmentList,
    employeesList, 
    isLoading,
    errors,
    handleChange,
    validateStep2,
    validateStep3,
    setValues 
  };
};