import { Timestamp } from "firebase/firestore";

// Definição Central de Funcionário
export interface Employee {
  id: string;
  nome: string;
  email: string;
  status: boolean | string; 
  img: string;
  createdAt?: Timestamp; 
  
  // Dados Profissionais & Contratuais
  departamento: string; 
  role?: string;        
  seniority?: string;
  admissionDate?: string;
  managerId?: string | null;
  salary?: string;
}

// Payload para criação (sem ID, img e data de criação)
export interface NewEmployeePayload {
  nome: string;
  email: string;
  status: boolean;
  departamento: string; 
  role: string;
  seniority: string;
  admissionDate: string;
  managerId: string;
  salary: string;
}

// Definição Central de Departamento
export interface Department {
  id: string;
  name: string;
  description: string;
  managerId: string | null; 
}