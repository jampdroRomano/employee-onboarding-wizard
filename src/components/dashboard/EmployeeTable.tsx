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
  Avatar, 
  Chip, 
  Stack,
  CircularProgress,
  Box
} from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

// Firebase Imports
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface Employee {
  id: string;
  nome: string;
  email: string;
  cargo: string; // ou departamento
  status: string;
  img: string;
}

const columns = [
  { id: 'nome', label: 'Nome', width: '25%' },
  { id: 'email', label: 'Email', width: '25%' },
  { id: 'cargo', label: 'Departamento' },
  { id: 'status', label: 'Status', align: 'right' as const },
];

export const EmployeeTable = () => {
  const [rows, setRows] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cria a query ordenando por data de criação (mais novos primeiro)
    const q = query(collection(db, "employees"), orderBy("createdAt", "desc"));

    // onSnapshot escuta o banco em TEMPO REAL. 
    // Se alguém cadastrar, a tabela atualiza sozinha sem F5.
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const employees = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Employee[];
      
      setRows(employees);
      setLoading(false);
    });

    // Limpa o listener quando o componente desmonta
    return () => unsubscribe();
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
                  sx={{ 
                    width: col.width || 'auto', 
                    fontWeight: 600, 
                    color: 'text.secondary' 
                  }}
                >
                  <Stack 
                    direction="row" 
                    alignItems="center" 
                    spacing={0.5}
                    justifyContent={col.align === 'right' ? 'flex-end' : 'flex-start'}
                  >
                    <span>{col.label}</span>
                    {/* Ícone apenas decorativo por enquanto */}
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
                    <Typography variant="body2" noWrap>{row.cargo}</Typography>
                    </TableCell>
                    
                    <TableCell align="right">
                    <Chip 
                        label={row.status} 
                        size="small"
                        sx={{
                        fontWeight: 700,
                        borderRadius: '6px',
                        // Lógica de cor baseada no status texto
                        bgcolor: row.status === 'Ativo' ? 'rgba(34, 197, 94, 0.16)' : 'rgba(255, 86, 48, 0.16)',
                        color: row.status === 'Ativo' ? '#118D57' : '#B71D18',
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
};