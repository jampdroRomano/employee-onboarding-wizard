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
  Stack 
} from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

interface Column {
  id: 'nome' | 'email' | 'cargo' | 'status';
  label: string;
  width?: string;
  align?: 'left' | 'right' | 'center';
}

const columns: readonly Column[] = [
  { id: 'nome', label: 'Nome', width: '30%' },
  { id: 'email', label: 'Email', width: '30%' },
  { id: 'cargo', label: 'Departamento' },
  { id: 'status', label: 'Status', align: 'right' },
];

const rows = [
  { id: 1, nome: 'Fernanda Torres', email: 'fernandatorres@flugo.com', cargo: 'Design', status: 'Ativo', img: 'https://i.pravatar.cc/150?img=5' },
  { id: 2, nome: "Joana D'Arc", email: 'joanadarc@flugo.com', cargo: 'TI', status: 'Ativo', img: 'https://i.pravatar.cc/150?img=9' },
  { id: 3, nome: 'Mari Froes', email: 'marifroes@flugo.com', cargo: 'Marketing', status: 'Ativo', img: 'https://i.pravatar.cc/150?img=1' },
  { id: 4, nome: 'Clara Costa', email: 'claracosta@flugo.com', cargo: 'Produto', status: 'Inativo', img: 'https://i.pravatar.cc/150?img=8' },
];

export const EmployeeTable = () => {
  return (
    <Card>
      <TableContainer>
        <Table sx={{ minWidth: 800 }}>
          <TableHead sx={{ bgcolor: '#F4F6F8' }}>
            <TableRow>
              {columns.map((col) => (
                <TableCell 
                  key={col.id} 
                  align={col.align} 
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
                    <ArrowDownwardIcon sx={{ fontSize: 16, opacity: 0.5 }} />
                  </Stack>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row) => (
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
                      bgcolor: row.status === 'Ativo' ? 'rgba(34, 197, 94, 0.16)' : 'rgba(255, 86, 48, 0.16)',
                      color: row.status === 'Ativo' ? '#118D57' : '#B71D18',
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};