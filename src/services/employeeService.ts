import { db } from "../config/firebase";
import { 
  collection, 
  addDoc, 
  getCountFromServer, 
  serverTimestamp,
  query,
  where,
  getDocs 
} from "firebase/firestore";

const AVATARS = [
  '/avatars/avatar1.png', 
  '/avatars/avatar2.png',
  '/avatars/avatar3.png',
  '/avatars/avatar4.png',
];

interface NewEmployeeData {
  nome: string;
  email: string;
  departamento: string;
  status?: boolean; 
}

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

    const snapshot = await getCountFromServer(employeesRef);
    const count = snapshot.data().count;
    const avatarUrl = AVATARS[count % AVATARS.length];

    // 2. Salva no Firestore
    await addDoc(employeesRef, {
      nome: data.nome,
      email: data.email,
      cargo: data.departamento, 
      departamento: data.departamento,
      status: data.status ? 'Ativo' : 'Inativo',
      img: avatarUrl, 
      createdAt: serverTimestamp() 
    });

    return true;
  } catch (error) {
    console.error("Erro ao criar funcionário:", error);
    throw error;
  }
};