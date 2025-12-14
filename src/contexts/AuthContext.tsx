import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react"; 
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth"; 
import { auth } from "../config/firebase";

// Definindo o formato dos dados que o contexto vai prover
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  userLoggedIn: boolean;
}

// Criação do Contexto
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  userLoggedIn: false,
});

// Hook customizado para facilitar o uso
export const useAuth = () => {
  return useContext(AuthContext);
};

// O Provedor que vai envolver a aplicação
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setUserLoggedIn(true);
      } else {
        setCurrentUser(null);
        setUserLoggedIn(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userLoggedIn,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};