import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile 
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '../config/firebase';

export const useAuthForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Lógica de Login
  const login = async (email: string, pass: string) => {
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      navigate('/');
    } catch (err) {
      if (err instanceof FirebaseError && (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password')) {
        setError('E-mail ou senha incorretos.');
      } else if (err instanceof FirebaseError && err.code === 'auth/too-many-requests') {
        setError('Muitas tentativas. Tente novamente mais tarde.');
      } else {
        setError('Ocorreu um erro ao fazer login.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Lógica de Cadastro
  const register = async (name: string, email: string, pass: string) => {
    // Validações básicas antes de chamar o firebase
    if (!name || !email || !pass) {
        setError('Por favor, preencha todos os campos.');
        return;
    }
    if (pass.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres.');
        return;
    }

    setLoading(true);
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(userCredential.user, { displayName: name });
      navigate('/');
    } catch (err) {
      if (err instanceof FirebaseError && err.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está em uso.');
      } else if (err instanceof FirebaseError && err.code === 'auth/invalid-email') {
        setError('E-mail inválido.');
      } else {
        setError('Erro ao criar conta. Tente novamente.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    register,
    loading,
    error,
    setError 
  };
};