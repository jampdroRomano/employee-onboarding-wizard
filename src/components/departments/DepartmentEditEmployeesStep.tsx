import { useEffect, useState, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Stack, 
  Avatar, 
  Checkbox, 
  TableRow, 
  TableCell,
  TextField,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { getAllEmployees } from '../../services/employeeService'; // employeeService importado não é mais usado para update direto
import { departmentService } from '../../services/departmentService';
import type { Employee, Department } from '../../types';
import { GenericTable } from '../common/GenericTable';
import type { TableColumn } from '../common/GenericTable';
import { TableToolbar } from '../common/TableToolbar';
import { CHECKBOX_GREEN } from '../../theme/mainTheme';

interface EmployeeChange {
  employeeId: string;
  newDepartmentId: string | null;
}

interface DepartmentEditEmployeesStepProps {
  currentDepartmentId: string;
  onEmployeeChanges: (changes: EmployeeChange[]) => void;
  initialEmployeeChanges?: EmployeeChange[];
}

export const DepartmentEditEmployeesStep = ({ currentDepartmentId, onEmployeeChanges, initialEmployeeChanges }: DepartmentEditEmployeesStepProps) => {
  const [rows, setRows] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState(currentDepartmentId); 
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [targetTransferDept, setTargetTransferDept] = useState('');

  // Estado para armazenar as alterações que serão enviadas ao pai
  const [localEmployeeChanges, setLocalEmployeeChanges] = useState<EmployeeChange[]>(initialEmployeeChanges || []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [empData, deptData] = await Promise.all([
          getAllEmployees(),
          departmentService.getAll()
        ]);
        setRows(empData);
        setDepartments(deptData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Notificar o pai sobre as mudanças locais
  useEffect(() => {
    onEmployeeChanges(localEmployeeChanges);
  }, [localEmployeeChanges, onEmployeeChanges]);


  useEffect(() => {
    setSelectedIds([]);
  }, [filterDept]);

  const deptNameMap = useMemo(() => {
    return departments.reduce((acc, d) => ({ ...acc, [d.id]: d.name }), {} as Record<string, string>);
  }, [departments]);

  // Mapa de departamentos efetivos (original + mudanças locais)
  const effectiveDepartmentMap = useMemo(() => {
    const map = new Map<string, string | null>();
    rows.forEach(emp => map.set(emp.id, emp.departamento || null)); // original

    localEmployeeChanges.forEach(change => {
      map.set(change.employeeId, change.newDepartmentId); // override with local change
    });
    return map;
  }, [rows, localEmployeeChanges]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const currentEmployeeDept = effectiveDepartmentMap.get(row.id);

      const matchText = row.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        row.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchDept = filterDept === 'todos' ? true :
                        filterDept === 'sem_departamento' ? !currentEmployeeDept :
                        currentEmployeeDept === filterDept;

      return matchText && matchDept;
    });
  }, [rows, searchTerm, filterDept, effectiveDepartmentMap]);
  
  const isSelectionFromCurrentDept = useMemo(() => {
    if (selectedIds.length === 0) return false;
    const firstSelectedId = selectedIds[0];
    const firstEmployeeDept = effectiveDepartmentMap.get(firstSelectedId);
    return firstEmployeeDept === currentDepartmentId;
  }, [selectedIds, currentDepartmentId, effectiveDepartmentMap]);

  const handleSelectionChange = (newSelectedIds: string[]) => {
    if (newSelectedIds.length === 0) {
      setSelectedIds([]);
      return;
    }

    const firstSelectedId = newSelectedIds[0];
    const firstEmployeeDept = effectiveDepartmentMap.get(firstSelectedId);
    
    const isFirstFromCurrentDept = firstEmployeeDept === currentDepartmentId;

    const filteredSelection = newSelectedIds.filter(id => {
      const employeeDept = effectiveDepartmentMap.get(id);
      const isEmployeeFromCurrentDept = employeeDept === currentDepartmentId;
      return isEmployeeFromCurrentDept === isFirstFromCurrentDept;
    });
    
    setSelectedIds(filteredSelection);
  };

  const applyChanges = (employeeIds: string[], newDeptId: string | null) => {
    setLocalEmployeeChanges(prevChanges => {
      const updatedChanges = [...prevChanges];
      employeeIds.forEach(empId => {
        const existingIndex = updatedChanges.findIndex(c => c.employeeId === empId);
        if (existingIndex > -1) {
          updatedChanges[existingIndex].newDepartmentId = newDeptId;
        } else {
          updatedChanges.push({ employeeId: empId, newDepartmentId: newDeptId });
        }
      });
      // Remove changes that revert to original
      return updatedChanges.filter(change => {
        const originalDept = rows.find(r => r.id === change.employeeId)?.departamento || null;
        return originalDept !== change.newDepartmentId;
      });
    });
  };

  const handleActionClick = () => {
    if (isSelectionFromCurrentDept) {
      setTargetTransferDept('');
      setIsTransferDialogOpen(true);
    } else {
      setIsAddDialogOpen(true);
    }
  };

  const handleConfirmTransfer = () => { // Não é mais async
    if (!targetTransferDept) return;
    applyChanges(selectedIds, targetTransferDept);
    setSelectedIds([]);
    setIsTransferDialogOpen(false);
  };

  const handleConfirmAdd = () => { // Não é mais async
    applyChanges(selectedIds, currentDepartmentId);
    setSelectedIds([]);
    setIsAddDialogOpen(false);
  };

  const columns: TableColumn[] = [
    { id: 'colaborador', label: 'Colaborador', width: '40%' },
    { id: 'email', label: 'E-mail', width: '30%' },
    { id: 'atual_dept', label: 'Departamento Atual', width: '30%' },
  ];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontSize: '18px', fontWeight: 700, mb: 1 }}>
          Gestão de Membros
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Selecione colaboradores para <b>Adicionar</b> a este departamento ou <b>Transferir</b> para outro.
        </Typography>
      </Box>

      <GenericTable<Employee>
        columns={columns}
        rows={filteredRows}
        isLoading={loading}
        maxHeight={400}
        
        enableSelection={true}
        selectedIds={selectedIds}
        onSelectionChange={handleSelectionChange}

        filters={
          <TableToolbar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Buscar por nome ou e-mail..."
          >
            {selectedIds.length > 0 && (
                <Button 
                    variant="contained"
                    color={isSelectionFromCurrentDept ? "info" : "primary"}
                    startIcon={isSelectionFromCurrentDept ? <SwapHorizIcon /> : <PersonAddIcon />}
                    onClick={handleActionClick}
                    sx={{ mr: 2, fontWeight: 'bold' }}
                >
                    {isSelectionFromCurrentDept 
                        ? `Transferir (${selectedIds.length})` 
                        : `Adicionar (${selectedIds.length})`
                    }
                </Button>
            )}

            <TextField
              select
              size="small"
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              sx={{ minWidth: '220px' }}
            >
              <MenuItem value="todos">Todos Departamentos</MenuItem>
              <MenuItem value="sem_departamento">Sem Departamento</MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>
                    {dept.id === currentDepartmentId ? `📍 ${dept.name} (Atual)` : dept.name}
                </MenuItem>
              ))}
            </TextField>
          </TableToolbar>
        }

        renderRow={(row, isSelected, toggleSelect) => {
          const currentEmployeeDept = effectiveDepartmentMap.get(row.id);
          let isDisabled = false;
          if (selectedIds.length > 0) {
             const isRowFromCurrentDept = currentEmployeeDept === currentDepartmentId;
             if (isSelectionFromCurrentDept !== isRowFromCurrentDept) {
                isDisabled = true;
             }
          }

          return (
            <TableRow 
                key={row.id} 
                hover 
                onClick={() => !isDisabled && toggleSelect()} 
                selected={isSelected}
                sx={{ 
                    cursor: isDisabled ? 'not-allowed' : 'pointer', 
                    opacity: isDisabled ? 0.5 : 1,
                    bgcolor: isSelected 
                      ? (isSelectionFromCurrentDept ? 'rgba(2, 136, 209, 0.08) !important' : 'rgba(34, 197, 94, 0.08) !important') 
                      : 'inherit'
                }}
            >
              <TableCell padding="checkbox">
                <Checkbox
                  checked={isSelected}
                  disabled={isDisabled}
                  sx={{ 
                      '&.Mui-checked': { 
                          color: isSelectionFromCurrentDept ? '#0288d1' : CHECKBOX_GREEN 
                      } 
                  }}
                />
              </TableCell>

              <TableCell>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar src={row.img} alt={row.nome} sx={{ width: 32, height: 32 }} />
                  <Typography variant="subtitle2" noWrap>{row.nome}</Typography>
                </Stack>
              </TableCell>

              <TableCell>
                <Typography variant="body2" color="text.secondary" noWrap>{row.email}</Typography>
              </TableCell>

              <TableCell>
                 <Typography variant="caption" sx={{ 
                     bgcolor: currentEmployeeDept ? 'rgba(145, 158, 171, 0.12)' : 'transparent',
                     px: 1, py: 0.5, borderRadius: 1,
                     color: currentEmployeeDept ? 'text.primary' : 'text.disabled'
                 }}>
                    {deptNameMap[currentEmployeeDept || ''] || 'Sem departamento'}
                 </Typography>
              </TableCell>
            </TableRow>
          );
        }}
      />

      <Dialog open={isTransferDialogOpen} onClose={() => setIsTransferDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Transferir Colaboradores</DialogTitle>
        <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
                Selecione o novo departamento para os <b>{selectedIds.length}</b> colaboradores.
            </DialogContentText>
            <FormControl fullWidth size="small">
                <InputLabel>Novo Departamento</InputLabel>
                <Select
                    value={targetTransferDept}
                    label="Novo Departamento"
                    onChange={(e) => setTargetTransferDept(e.target.value)}
                >
                    {departments
                        .filter(d => d.id !== currentDepartmentId)
                        .map(d => (
                            <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setIsTransferDialogOpen(false)} color="inherit">Cancelar</Button>
            <Button 
                onClick={handleConfirmTransfer} 
                variant="contained" 
                color="info"
                disabled={!targetTransferDept}
            >
                Transferir
            </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)}>
        <DialogTitle>Adicionar ao Departamento</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Deseja mover os <b>{selectedIds.length}</b> colaboradores para este departamento?
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setIsAddDialogOpen(false)} color="inherit">Cancelar</Button>
            <Button 
                onClick={handleConfirmAdd} 
                variant="contained" 
                color="primary"
            >
                Adicionar
            </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};