import { useEffect, useState, useMemo, memo } from 'react';
import { 
  TableCell, 
  TableRow, 
  Typography, 
  Avatar, 
  Chip, 
  Stack,
  Box
} from '@mui/material';

// Firebase
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';

// Services
import { departmentService } from '../../services/departmentService';
import type { Employee, Department } from '../../types';

import { GenericTable } from '../common/GenericTable';
import type { TableColumn } from '../common/GenericTable';

// Helper: Formata Moeda
const formatCurrency = (value?: string | number) => {
  if (!value) return '-';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return value;
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
};

// Helper: Formata Data (YYYY-MM-DD para DD/MM/AAAA)
const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  try {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  } catch {
    return dateString;
  }
};

export const EmployeeTable = memo(() => {
  const [rows, setRows] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]); 
  const [loadingDepts, setLoadingDepts] = useState(true);
  const [loadingEmps, setLoadingEmps] = useState(true);

  const columns: TableColumn[] = [
    { id: 'colaborador', label: 'Colaborador', width: '30%' },
    { id: 'ocupacao', label: 'Cargo & Dept.', width: '25%' },
    { id: 'detalhes', label: 'Nível & Admissão', width: '20%' }, 
    { id: 'contrato', label: 'Gestão & Salário', width: '15%' }, 
    { id: 'status', label: 'Status', align: 'right' },
  ];

  useEffect(() => {
        // 1. Carrega Departamentos
    const loadDepartments = async () => {
      try {
        const data = await departmentService.getAll();
        setDepartments(data);
      } catch (error) {
        console.error("Erro ao carregar departamentos", error);
      } finally {
        setLoadingDepts(false);
      }
    };
    loadDepartments();

    // 2. Ouve os funcionários em tempo real
    const q = query(collection(db, "employees"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const employees = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          nome: data.nome,
          email: data.email,
          departamento: data.departamento || '',
          status: data.status,
          img: data.img || '',
          role: data.role,
          seniority: data.seniority,
          admissionDate: data.admissionDate,
          managerId: data.managerId,
          salary: data.salary,
        };
      }) as Employee[];
      
      setRows(employees);
      setLoadingEmps(false);
    });

    return () => unsubscribe();
  }, []);

  // Mapas para tradução rápida de IDs
  const departmentsMap = useMemo(() => {
    return departments.reduce((acc, dept) => {
      acc[dept.id] = dept.name;
      return acc;
    }, {} as Record<string, string>);
  }, [departments]);

  const employeesMap = useMemo(() => {
    return rows.reduce((acc, emp) => {
      acc[emp.id] = emp.nome;
      return acc;
    }, {} as Record<string, string>);
  }, [rows]);

    // Helpers de exibição
  const getDepartmentName = (id: string) => {
    if (!id) return 'Não atribuído';
    return departmentsMap[id] || 'Desconhecido';
  };

  const getManagerName = (id?: string | null) => {
    if (!id) return '-';
    return employeesMap[id] || 'Não encontrado';
  };

  const isStatusActive = (status: boolean | string) => {
    return status === true || status === 'Ativo';
  };

  return (
    <GenericTable<Employee>
      columns={columns}
      rows={rows}
      isLoading={loadingDepts || loadingEmps}
      emptyMessage="Nenhum colaborador encontrado."
      minWidth={900}
      renderRow={(row) => (
        <TableRow key={row.id} hover>
            {/* 1. Colaborador: Avatar + Nome + Email */}
            <TableCell>
              <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar src={row.img} alt={row.nome} />
                  <Box>
                    <Typography variant="subtitle2" color="text.primary" noWrap>
                        {row.nome}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap sx={{ fontSize: '0.80rem' }}>
                        {row.email}
                    </Typography>
                  </Box>
              </Stack>
            </TableCell>
            
            {/* 2. Ocupação: Cargo (negrito) + Departamento (cinza) */}
            <TableCell>
              <Box>
                <Typography variant="subtitle2" color="text.primary" noWrap>
                    {row.role || 'Sem cargo'}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                    {getDepartmentName(row.departamento)}
                </Typography>
              </Box>
            </TableCell>

            {/* 3. Detalhes: Senioridade + Data Admissão */}
            <TableCell>
               <Box>
                    <Typography variant="subtitle2" sx={{ color: 'text.primary', fontSize: '0.85rem' }}>
                        {row.seniority || '-'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {formatDate(row.admissionDate)}
                    </Typography>
               </Box>
            </TableCell>

            {/* 4. Contrato: Gestor + Salário */}
            <TableCell>
                <Box>
                    <Typography variant="body2" color="text.primary" sx={{ fontSize: '0.875rem' }}>
                        {getManagerName(row.managerId)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                        {formatCurrency(row.salary)}
                    </Typography>
                </Box>
            </TableCell>
            
            {/* 5. Status: Chip Ativo/Inativo */}
            <TableCell align="right">
              <Chip 
                  label={isStatusActive(row.status) ? 'Ativo' : 'Inativo'} 
                  size="small"
                  sx={{
                    fontWeight: 700,
                    borderRadius: '6px',
                    height: '24px',
                    bgcolor: isStatusActive(row.status) ? 'rgba(34, 197, 94, 0.16)' : 'rgba(255, 86, 48, 0.16)',
                    color: isStatusActive(row.status) ? '#118D57' : '#B71D18',
                  }}
              />
            </TableCell>
        </TableRow>
      )}
    />
  );
});

EmployeeTable.displayName = 'EmployeeTable';