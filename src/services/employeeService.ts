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
import { AVATARS } from "../utils/constants"; 
import type { Employee, NewEmployeePayload } from "../types"; 

export const getAllEmployees = async (): Promise<Employee[]> => {
  try {
    const employeesRef = collection(db, "employees");
    const q = query(employeesRef, orderBy("nome", "asc")); 
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Employee));
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

export const createEmployee = async (data: NewEmployeePayload) => {
  const employeesRef = collection(db, "employees");

  try {
    const exists = await checkEmailExists(data.email);
    if (exists) {
      throw new Error("Este e-mail já está cadastrado no sistema.");
    }

    const snapshot = await getCountFromServer(employeesRef);
    const count = snapshot.data().count;
    const avatarUrl = AVATARS[count % AVATARS.length];

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