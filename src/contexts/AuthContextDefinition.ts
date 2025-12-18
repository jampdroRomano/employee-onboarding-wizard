import { createContext } from "react";
import type { User } from "firebase/auth"; 

// Definindo o formato dos dados que o contexto vai prover
export interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  userLoggedIn: boolean;
}

// Criação do Contexto
export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  userLoggedIn: false,
});