import { useState } from 'react';
import { Typography, Stack, Box, Alert } from '@mui/material';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signOut
} from 'firebase/auth';
import { auth } from '../../config/firebase';
import { AppTextField } from '../common/AppTextField';
import { AppButton } from '../common/AppButton';
import logoFlugo from '../../assets/flugoLogo.png';

// 1. Defini a interface para aceitar a prop 'onSuccess'
interface RegisterFormProps {
  onSuccess?: () => void;
}

// 2. O componente recebe a prop aqui
export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  // Estados
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError('');

    // Validação básica
    if (!name || !email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      // 1. Cria a conta
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // 2. Atualiza o nome do usuário
      await updateProfile(userCredential.user, {
        displayName: name
      });

      // 3. Envia e-mail de verificação
      await sendEmailVerification(userCredential.user);

      // 4. IMPORTANTE: Desloga imediatamente para impedir acesso sem verificar
      await signOut(auth);

      alert(
        `✅ Conta criada com sucesso!

Enviamos um link de confirmação para:
${email}

⚠️ Atenção:
Se não encontrar na Caixa de Entrada, verifique o SPAM ou Lixo Eletrônico.`
      );

      // 5. Chama a função para voltar para a aba de login
      if (onSuccess) {
        onSuccess();
      }

    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está em uso.');
      } else if (err.code === 'auth/invalid-email') {
        setError('E-mail inválido.');
      } else {
        setError('Erro ao criar conta. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={4} alignItems="center" width="100%" maxWidth="400px">

      {/* Cabeçalho com Logo e Título */}
      <Box textAlign="center">
        <img src={logoFlugo} alt="Flugo" style={{ height: 40, marginBottom: 16 }} />
        <Typography variant="h4" fontWeight="bold" color="primary.main">
          Crie sua conta
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          Preencha seus dados abaixo
        </Typography>
      </Box>

      {/* Alerta de Erro */}
      {error && (
        <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>
      )}

      {/* Inputs */}
      <Stack spacing={2} width="100%">
        <AppTextField
          label="Nome"
          fullWidth
          placeholder="João da Silva"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <AppTextField
          label="E-mail"
          fullWidth
          placeholder="e.g. john@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <AppTextField
          label="Senha"
          type="password"
          fullWidth
          placeholder="****************"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Stack>

      {/* Botão de Cadastro */}
      <AppButton
        fullWidth
        size="large"
        onClick={handleRegister}
        loading={loading}
      >
        Cadastrar
      </AppButton>

    </Stack>
  );
};