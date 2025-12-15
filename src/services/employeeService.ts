import { db } from "../config/firebase";
import { 
  collection, 
  addDoc, 
  getCountFromServer, 
  serverTimestamp,
  query,
  where,
  getDocs,
  orderBy
} from "firebase/firestore";

const AVATARS = [
  '/avatars/avatar1.png', 
  '/avatars/avatar2.png',
  '/avatars/avatar3.png',
  '/avatars/avatar4.png',
];

export interface IEmployee {
  id: string;
  nome: string;
  email: string;
  departamento: string;
  status: boolean | string;
  img: string;
  role?: string;
  seniority?: string;
  admissionDate?: string;
  managerId?: string;
  salary?: string;
}

// Interface para escrita (o que o formulário envia)
interface NewEmployeeData {
  nome: string;
  email: string;
  status: boolean;
  departamento: string; 
  role: string;
  seniority: string;
  admissionDate: string;
  managerId: string;
  salary: string;
}

export const getAllEmployees = async (): Promise<IEmployee[]> => {
  try {
    const employeesRef = collection(db, "employees");
    const q = query(employeesRef, orderBy("nome", "asc")); 
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as IEmployee));
  } catch (error) {
    console.error("Erro ao buscar colaboradores:", error);
    return [];
  }
};

export const checkEmailExists = async (email: string) => {
  const employeesRef = collection(db, "employees");
  const q = query(employeesRef, where("email", "==", email));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty; 
};

export const createEmployee = async (data: NewEmployeeData) => {
  const employeesRef = collection(db, "employees");

  try {
    const exists = await checkEmailExists(data.email);
    if (exists) {
      throw new Error("Este e-mail já está cadastrado no sistema.");
    }

    // Gera um avatar aleatório baseado na contagem 
    const snapshot = await getCountFromServer(employeesRef);
    const count = snapshot.data().count;
    const avatarUrl = AVATARS[count % AVATARS.length];

    // Salva o objeto completo no Firestore
    await addDoc(employeesRef, {
      nome: data.nome,
      email: data.email,
      status: data.status ? 'Ativo' : 'Inativo',
      img: avatarUrl,
      createdAt: serverTimestamp(),
      departamento: data.departamento,
      role: data.role,
      seniority: data.seniority,
      admissionDate: data.admissionDate,
      managerId: data.managerId || null, 
      salary: data.salary
    });

    return true;
  } catch (error) {
    console.error("Erro ao criar funcionário:", error);
    throw error;
  }
};