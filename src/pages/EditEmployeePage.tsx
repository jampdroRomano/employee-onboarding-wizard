import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { EditLayoutContainer } from '../components/layout/EditLayoutContainer';
import { ProfileForm } from '../components/collaborators/ProfileForm';
import { RegistrationDataForm } from '../components/collaborators/RegistrationDataForm';
import { employeeService } from '../services/employeeService';
import type { Employee } from '../types';

export const EditEmployeePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(!!id);
  
  const [activeTab, setActiveTab] = useState<'profile' | 'registration'>('profile');

  useEffect(() => {
    if (id) {
      
      employeeService.getById(id)
        .then(data => {
          if (data) {
            setEmployee(data);
          }
          setLoading(false);
        })
        .catch(error => {
          console.error("Failed to fetch employee", error);
          setLoading(false);
        });
    }
  }, [id]);

  const handleSuccess = () => {
    if (id) {
      setLoading(true);
      employeeService.getById(id).then(data => {
        if (data) setEmployee(data);
        setLoading(false);
      });
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

    if (!id || !employee) {
      return <Typography>Funcionário não encontrado.</Typography>;
    }

    if (activeTab === 'profile') {
      const profileData = {
        nome: employee.nome,
        email: employee.email,
        status: employee.status === 'Ativo',
        img: employee.img,
      };

      return (
        <ProfileForm 
          employeeId={id} 
          initialData={profileData} 
          onSuccess={handleSuccess}
        />
      );
    }

    if (activeTab === 'registration') {
      return <RegistrationDataForm employeeId={id} initialData={employee} onSuccess={handleSuccess} />;
    }

    return null;
  };

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <IconButton onClick={() => navigate(-1)} size="small" sx={{ mr: 1 }}>
                <ArrowBackIcon />
            </IconButton>
            <Typography variant="body2" color="text.secondary">
                Colaborador
            </Typography>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
          Editar Colaborador
        </Typography>
      </Box>

      <EditLayoutContainer activeTab={activeTab} onChangeTab={setActiveTab}>
        {renderContent()}
      </EditLayoutContainer>
      
    </Box>
  );
};