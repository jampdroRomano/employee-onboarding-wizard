import { useEffect, useState, useMemo, memo } from 'react';
import { 
  TableCell, 
  TableRow, 
  Typography, 
  Avatar, 
  Chip, 
  Stack,
  Box,
  TextField,
  MenuItem,
  IconButton,
  Tooltip
} from '@mui/material';

// Ícones
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

// Firebase e Services
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { departmentService } from '../../services/departmentService';
import type { Employee, Department } from '../../types';

// Componentes Comuns
import { GenericTable } from '../common/GenericTable';
import { TableToolbar } from '../common/TableToolbar'; // Certifique-se de ter criado este arquivo em common
import type { TableColumn } from '../common/GenericTable';

// --- HELPERS (Moeda e Data) ---
const formatCurrency = (value?: string | number) => {
  if (!value) return '-';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return value;
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
};

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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('todos');

  const columns: TableColumn[] = [
    { id: 'colaborador', label: 'Colaborador', width: '30%' },
    { id: 'ocupacao', label: 'Cargo & Dept.', width: '25%' },
    { id: 'detalhes', label: 'Nível & Admissão', width: '20%' }, 
    { id: 'contrato', label: 'Gestão & Salário', width: '15%' }, 
    { id: 'status', label: 'Status', align: 'right' },
  ];

  // --- 1. CARREGAMENTO DE DADOS ---
  useEffect(() => {
    // Carrega Departamentos (para o filtro e labels)
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

    // Ouve Funcionários em Tempo Real (Firebase)
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

  // --- 2. MAPAS DE DADOS ---
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

  // --- 3. LÓGICA DE FILTRAGEM ---
  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      // Filtro de Texto (Nome ou Email)
      const s = searchTerm.toLowerCase();
      const matchText = 
        row.nome.toLowerCase().includes(s) || 
        row.email.toLowerCase().includes(s);
      // Filtro de Departamento
      const matchDept = filterDept === 'todos' || row.departamento === filterDept;
      return matchText && matchDept;
    });
  }, [rows, searchTerm, filterDept]);

  // --- Helpers de Exibição ---
  const getDepartmentName = (id: string) => departmentsMap[id] || 'Não atribuído';
  
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
      rows={filteredRows} // Passamos a lista filtrada
      isLoading={loadingDepts || loadingEmps}
      emptyMessage="Nenhum colaborador encontrado."
      
      // --- INJEÇÃO DA BARRA DE FERRAMENTAS ---
      filters={
        <TableToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Buscar por nome ou e-mail..."
        >
          {/* Conteúdo Específico (Lado Direito da Toolbar) */}
          
          {/* 1. Dropdown de Departamentos */}
          <TextField
            select
            size="small"
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            sx={{ minWidth: '200px' }}
          >
            <MenuItem value="todos">Todos Departamentos</MenuItem>
            {departments.map((dept) => (
              <MenuItem key={dept.id} value={dept.id}>
                {dept.name}
              </MenuItem>
            ))}
          </TextField>

          {/* 2. Botão de Ação (Excluir) */}
          <Tooltip title="Excluir selecionados">
            <IconButton 
              onClick={() => console.log('Ação de excluir (Visual)')} 
              color="error"
            >
              <DeleteOutlineIcon />
            </IconButton>
          </Tooltip>
        </TableToolbar>
      }

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
            
            {/* 2. Ocupação: Cargo + Dept */}
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

            {/* 3. Detalhes: Nível + Admissão */}
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
            
            {/* 5. Status */}
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