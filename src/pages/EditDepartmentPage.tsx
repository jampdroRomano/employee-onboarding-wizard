import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { DepartmentDataTab } from '../components/departments/DepartmentDataTab';
import { DepartmentMembersTab } from '../components/departments/DepartmentMembersTab';
import { departmentService } from '../services/departmentService';
import type { Department } from '../types';
import { toast } from 'sonner';

export const EditDepartmentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [activeTab, setActiveTab] = useState<'data' | 'members'>('data');
  const loadDepartment = useCallback((deptId: string) => {
    departmentService.getAll()
      .then(allDepts => {
        const dept = allDepts.find(d => d.id === deptId);
        if (dept) {
          setDepartment(dept);
        } else {
          toast.error('Departamento não encontrado');
          navigate('/departamentos');
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch department", error);
        setLoading(false);
      });
  }, [navigate]);

  useEffect(() => {
    if (id) {
      loadDepartment(id);
    }
  }, [id, loadDepartment]);

  const handleSuccess = () => {
    if (id) {
      setLoading(true);
      loadDepartment(id);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <CircularProgress />
        </Box>
      );
    }

    if (!id || !department) {
      return <Typography>Departamento não encontrado.</Typography>;
    }

    if (activeTab === 'data') {
      return (
        <DepartmentDataTab 
            departmentId={id} 
            initialData={department} 
            onSuccess={handleSuccess} 
        />
      );
    }

    if (activeTab === 'members') {
      return (
        <DepartmentMembersTab 
            departmentId={id} 
            onSuccess={handleSuccess} 
        />
      );
    }

    return null;
  };

  const getTabStyle = (tabName: 'data' | 'members') => ({
    borderRight: activeTab === tabName ? '3px solid #00C853' : '3px solid transparent',
    pr: 2, 
    cursor: 'pointer',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start', 
    transition: 'all 0.2s'
  });

  const getTextStyle = (tabName: 'data' | 'members') => ({
    color: activeTab === tabName ? '#00C853' : '#9E9E9E', 
    fontWeight: activeTab === tabName ? 600 : 500,
    fontSize: '0.9rem'
  });

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <IconButton onClick={() => navigate('/departamentos')} size="small" sx={{ mr: 1 }}>
                <ArrowBackIcon />
            </IconButton>
            <Typography variant="body2" color="text.secondary">
                Departamento
            </Typography>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
          Editar Departamento
        </Typography>
      </Box>

      <Box 
        sx={{ 
            p: 4, 
            borderRadius: 3, 
            bgcolor: 'background.paper',
            boxShadow: '0px 4px 20px rgba(0,0,0,0.05)',
            minHeight: '600px'
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 2, md: 6 } }}>
            <Box sx={{ width: { xs: '100%', md: '25%' }, display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                <Box sx={getTabStyle('data')} onClick={() => setActiveTab('data')}>
                    <Typography sx={getTextStyle('data')}>
                        Dados do Departamento
                    </Typography>
                </Box>
                <Box sx={getTabStyle('members')} onClick={() => setActiveTab('members')}>
                    <Typography sx={getTextStyle('members')}>
                        Gestão de Membros
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ width: { xs: '100%', md: '75%' }, pr: { xs: 0, md: 6.25 } }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 4, color: '#333' }}>
                    {activeTab === 'data' ? 'Dados do Departamento' : 'Gestão de Membros'}
                </Typography>
                {renderContent()}
            </Box>
        </Box>
      </Box>
    </Box>
  );
};