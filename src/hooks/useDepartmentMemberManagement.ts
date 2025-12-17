import { useState, useEffect, useMemo, useCallback } from 'react';
import { getAllEmployees } from '../services/employeeService';
import { departmentService } from '../services/departmentService';
import type { Employee, Department } from '../types';

interface EmployeeChange {
  employeeId: string;
  newDepartmentId: string | null;
}

interface UseDepartmentMemberManagementProps {
  currentDepartmentId: string;
  initialEmployeeChanges?: EmployeeChange[];
  onEmployeeChanges: (changes: EmployeeChange[]) => void;
}

export const useDepartmentMemberManagement = ({
  currentDepartmentId,
  initialEmployeeChanges = [],
  onEmployeeChanges,
}: UseDepartmentMemberManagementProps) => {
  const [rows, setRows] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState(currentDepartmentId);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const [localEmployeeChanges, setLocalEmployeeChanges] = useState<EmployeeChange[]>(initialEmployeeChanges);

  const effectiveDepartmentMap = useMemo(() => {
    const map = new Map<string, string | null>();
    rows.forEach(emp => map.set(emp.id, emp.departamento || null));
    localEmployeeChanges.forEach(change => {
      map.set(change.employeeId, change.newDepartmentId);
    });
    return map;
  }, [rows, localEmployeeChanges]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [empData, deptData] = await Promise.all([
          getAllEmployees(),
          departmentService.getAll(),
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

  useEffect(() => {
    onEmployeeChanges(localEmployeeChanges);
  }, [localEmployeeChanges, onEmployeeChanges]);

  const deptNameMap = useMemo(() => {
    return departments.reduce((acc, d) => ({ ...acc, [d.id]: d.name }), {} as Record<string, string>);
  }, [departments]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const currentEmployeeDept = effectiveDepartmentMap.get(row.id);
      const matchText = row.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        row.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDept = filterDept === 'todos' ? true :
                        !currentEmployeeDept ? false : // Ajuste para não quebrar se for nulo
                        currentEmployeeDept === filterDept;
      return matchText && matchDept;
    });
  }, [rows, searchTerm, filterDept, effectiveDepartmentMap]);

  const isSelectionFromCurrentDept = useMemo(() => {
    if (selectedIds.length === 0) return false;
    const firstEmployeeDept = effectiveDepartmentMap.get(selectedIds[0]);
    return firstEmployeeDept === currentDepartmentId;
  }, [selectedIds, currentDepartmentId, effectiveDepartmentMap]);

  const isSelectionMixed = useMemo(() => {
    if (selectedIds.length < 2) return false;
    const firstGroup = effectiveDepartmentMap.get(selectedIds[0]) === currentDepartmentId;
    return selectedIds.slice(1).some(id => (effectiveDepartmentMap.get(id) === currentDepartmentId) !== firstGroup);
  }, [selectedIds, currentDepartmentId, effectiveDepartmentMap]);

  const handleChangeFilter = useCallback((newFilter: string) => {
    if (isSelectionFromCurrentDept) {
      setSelectedIds([]);
    }
    setFilterDept(newFilter);
  }, [isSelectionFromCurrentDept]);

  // --- Lógica de Seleção Aprimorada ---

  // Calcula quais IDs são "selecionáveis" na visão atual
  const allTogglableIds = useMemo(() => {
    const visibleIds = filteredRows.map(r => r.id);
    if (filterDept === 'todos') {
      return visibleIds.filter(id => effectiveDepartmentMap.get(id) !== currentDepartmentId);
    }
    return visibleIds;
  }, [filteredRows, filterDept, currentDepartmentId, effectiveDepartmentMap]);

  // Calcula o estado do checkbox principal
  const { isSelectAllChecked, isSelectAllIndeterminate } = useMemo(() => {
    if (allTogglableIds.length === 0) {
      return { isSelectAllChecked: false, isSelectAllIndeterminate: false };
    }
    const selectedVisibleCount = allTogglableIds.filter(id => selectedIds.includes(id)).length;
    
    return {
      isSelectAllChecked: selectedVisibleCount === allTogglableIds.length,
      isSelectAllIndeterminate: selectedVisibleCount > 0 && selectedVisibleCount < allTogglableIds.length,
    };
  }, [selectedIds, allTogglableIds]);

  const handleRowToggle = useCallback((id: string) => {
    const newSelectedIds = [...selectedIds];
    const currentIndex = selectedIds.indexOf(id);
    
    if (currentIndex === -1) {
      newSelectedIds.push(id);
    } else {
      newSelectedIds.splice(currentIndex, 1);
    }
    setSelectedIds(newSelectedIds);
  }, [selectedIds]);

  const handleSelectAllToggle = useCallback(() => {
    const visibleIds = filteredRows.map(r => r.id);
    
    // Define o conjunto de IDs que podem ser selecionados nesta visão
    let allPossibleToSelect = visibleIds;
    if (filterDept === 'todos') {
      allPossibleToSelect = visibleIds.filter(id => effectiveDepartmentMap.get(id) !== currentDepartmentId);
    }
    
    // Verifica se todos os itens "selecionáveis" na visão atual já estão no estado de seleção
    const areAllPossibleVisibleSelected = allPossibleToSelect.every(id => selectedIds.includes(id)) && allPossibleToSelect.length > 0;

    if (areAllPossibleVisibleSelected) {
      // Ação: Desselecionar todos os itens visíveis e selecionáveis
      const newSelecteds = selectedIds.filter(id => !allPossibleToSelect.includes(id));
      setSelectedIds(newSelecteds);
    } else {
      // Ação: Selecionar todos os itens visíveis e selecionáveis
      
      // Determina o "modo" da nova seleção (será para transferência ou adição?)
      // Usamos o primeiro item da lista de possíveis para inferir o modo do grupo.
      const isNewSelectionForTransfer = allPossibleToSelect.length > 0 &&
        effectiveDepartmentMap.get(allPossibleToSelect[0]) === currentDepartmentId;

      // Se já existe uma seleção e ela é de um modo diferente, descarta a seleção antiga.
      if (selectedIds.length > 0 && isSelectionFromCurrentDept !== isNewSelectionForTransfer) {
        setSelectedIds(allPossibleToSelect); // Começa uma nova seleção
      } else {
        // Caso contrário, acumula a seleção
        const newSelecteds = Array.from(new Set([...selectedIds, ...allPossibleToSelect]));
        setSelectedIds(newSelecteds);
      }
    }
  }, [
    filteredRows, 
    selectedIds, 
    filterDept, 
    currentDepartmentId, 
    effectiveDepartmentMap, 
    isSelectionFromCurrentDept
  ]);

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
      return updatedChanges.filter(change => {
        const originalDept = rows.find(r => r.id === change.employeeId)?.departamento || null;
        return originalDept !== change.newDepartmentId;
      });
    });
  };

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  return {
    loading,
    filteredRows,
    departments,
    deptNameMap,
    searchTerm,
    setSearchTerm,
    filterDept,
    handleChangeFilter,
    selectedIds,
    handleRowToggle,
    handleSelectAllToggle,
    clearSelection,
    isSelectionFromCurrentDept,
    isSelectionMixed,
    isSelectAllChecked,
    isSelectAllIndeterminate,
    applyChanges,
    effectiveDepartmentMap,
  };
};
