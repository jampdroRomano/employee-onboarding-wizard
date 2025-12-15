import { useEffect, useState, useMemo, memo } from 'react';
import { 
  Card, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Typography, 
  Avatar, 
  Chip, 
  Stack,
  CircularProgress,
  Box
} from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

// Firebase
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';

// Service e Tipos
import { departmentService } from '../../services/departmentService';
import type { Department } from '../../services/departmentService';

interface Employee {
  id: string;
  nome: string;
  email: string;
  departamento: string; 
  status: boolean;      
  img: string;
}

const columns = [
  { id: 'nome', label: 'Nome', width: '25%' },
  { id: 'email', label: 'Email', width: '25%' },
  { id: 'departamento', label: 'Departamento' },
  { id: 'status', label: 'Status', align: 'right' as const },
];

export const EmployeeTable = memo(() => {
  const [rows, setRows] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]); 
  const [loadingDepts, setLoadingDepts] = useState(true);
  const [loadingEmps, setLoadingEmps] = useState(true);

  useEffect(() => {
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
          img: data.img || ''
        };
      }) as Employee[];
      
      setRows(employees);
      setLoadingEmps(false);
    });

    return () => unsubscribe();
  }, []);

  const departmentsMap = useMemo(() => {
    return departments.reduce((acc, dept) => {
      acc[dept.id] = dept.name;
      return acc;
    }, {} as Record<string, string>);
  }, [departments]);

  const getDepartmentName = (id: string) => {
    if (!id) return 'Não atribuído';
    return departmentsMap[id] || 'Desconhecido';
  };

  const isStatusActive = (status: boolean | string) => {
    return status === true || status === 'Ativo';
  };

  if (loadingDepts || loadingEmps) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card>
      <TableContainer>
        <Table sx={{ minWidth: 800 }}>
          <TableHead sx={{ bgcolor: '#F4F6F8' }}>
            <TableRow>
              {columns.map((col) => (
                <TableCell 
                  key={col.id} 
                  align={col.align || 'left'} 
                  sx={{ width: col.width || 'auto', fontWeight: 600, color: 'text.secondary' }}
                >
                  <Stack direction="row" alignItems="center" spacing={0.5} justifyContent={col.align === 'right' ? 'flex-end' : 'flex-start'}>
                    <span>{col.label}</span>
                    <ArrowDownwardIcon sx={{ fontSize: 16, opacity: 0.5 }} />
                  </Stack>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                        <Typography variant="body1" color="text.secondary">
                            Nenhum colaborador encontrado.
                        </Typography>
                    </TableCell>
                </TableRow>
            ) : (
                rows.map((row) => (
                <TableRow key={row.id} hover>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar src={row.img} alt={row.nome} />
                          <Typography variant="subtitle2" color="text.primary" noWrap>
                          {row.nome}
                          </Typography>
                      </Stack>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2" noWrap>{row.email}</Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2" noWrap>
                          {getDepartmentName(row.departamento)}
                      </Typography>
                    </TableCell>
                    
                    <TableCell align="right">
                      <Chip 
                          label={isStatusActive(row.status) ? 'Ativo' : 'Inativo'} 
                          size="small"
                          sx={{
                            fontWeight: 700,
                            borderRadius: '6px',
                            bgcolor: isStatusActive(row.status) ? 'rgba(34, 197, 94, 0.16)' : 'rgba(255, 86, 48, 0.16)',
                            color: isStatusActive(row.status) ? '#118D57' : '#B71D18',
                          }}
                      />
                    </TableCell>
                </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
});

EmployeeTable.displayName = 'EmployeeTable';