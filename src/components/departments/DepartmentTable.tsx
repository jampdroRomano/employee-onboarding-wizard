import { useEffect, useState } from 'react';
import { 
  Card, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Typography, 
  CircularProgress,
  Box
} from '@mui/material';
import { departmentService } from '../../services/departmentService';
import { getAllEmployees } from '../../services/employeeService';
import type { Department } from '../../types'; 

const columns = [
  { id: 'name', label: 'Nome', width: '30%' },
  { id: 'description', label: 'Descrição', width: '40%' },
  { id: 'manager', label: 'Gestor Responsável' },
  { id: 'employees', label: 'Colaboradores', align: 'center' as const },
];

export const DepartmentTable = () => {
  const [rows, setRows] = useState<Department[]>([]);
  const [employeeCounts, setEmployeeCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [departmentsData, employeesData] = await Promise.all([
        departmentService.getAll(),
        getAllEmployees()
      ]);

      const counts: Record<string, number> = {};
      
      employeesData.forEach(emp => {
        if (emp.departamento) {
          counts[emp.departamento] = (counts[emp.departamento] || 0) + 1;
        }
      });

      setRows(departmentsData);
      setEmployeeCounts(counts);

    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
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
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                        <Typography variant="body1" color="text.secondary">
                            Nenhum departamento cadastrado.
                        </Typography>
                    </TableCell>
                </TableRow>
            ) : (
                rows.map((row) => (
                <TableRow key={row.id} hover>
                    <TableCell>
                        <Typography variant="subtitle2" color="text.primary">
                            {row.name}
                        </Typography>
                    </TableCell>
                    
                    <TableCell>
                        <Typography variant="body2" color="text.secondary" sx={{ 
                            display: '-webkit-box',
                            overflow: 'hidden',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2, 
                        }}>
                            {row.description || '-'}
                        </Typography>
                    </TableCell>
                    
                    <TableCell>
                        <Typography variant="body2" color={row.managerId ? 'text.primary' : 'text.disabled'}>
                            {row.managerId ? 'Definido' : 'Não atribuído'} 
                        </Typography>
                    </TableCell>
                    
                    <TableCell align="center">
                        <Typography variant="body2">
                            {employeeCounts[row.id] || 0}
                        </Typography>
                    </TableCell>
                </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};