import { useEffect, useState } from 'react';
import { 
  TableCell, 
  TableRow, 
  Typography
} from '@mui/material';
import { departmentService } from '../../services/departmentService';
import { getAllEmployees } from '../../services/employeeService';
import type { Department } from '../../types'; 

import { GenericTable } from '../common/GenericTable';
import type { TableColumn } from '../common/GenericTable';

const columns: TableColumn[] = [
  { id: 'name', label: 'Nome', width: '30%' },
  { id: 'description', label: 'Descrição', width: '40%' },
  { id: 'manager', label: 'Gestor Responsável' },
  { id: 'employees', label: 'Colaboradores', align: 'center' },
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

  return (
    <GenericTable<Department>
      columns={columns}
      rows={rows}
      isLoading={loading}
      emptyMessage="Nenhum departamento cadastrado."
      minWidth={800}
      renderRow={(row) => (
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
      )}
    />
  );
};