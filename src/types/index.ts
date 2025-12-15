export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string; // Cargo (ex: Desenvolvedor, Designer)
  departmentId: string; // Vínculo com o departamento
  admissionDate: string; // Data de admissão
  // Nível hierárquico
  seniority: 'Júnior' | 'Pleno' | 'Sênior' | 'Gestor';
  managerId?: string; // ID do gestor responsável (se houver)
  baseSalary?: number; // Opcional por enquanto
  status: 'Ativo' | 'Inativo'; // Para exclusão lógica ou filtros
}

// Definição do Departamento
export interface Department {
  id: string;
  name: string;
  managerId: string | null; // ID do Colaborador que é o Gestor
  description?: string;
  // A lista de colaboradores não fica salva aqui no banco para evitar duplicidade.
  // Sera calculado filtrando os employees pelo departmentId.
}