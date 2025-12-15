import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../config/firebase'; 

const DEPARTMENT_COLLECTION = 'departments';

export interface Department {
  id: string;
  name: string;
  description: string;
  managerId: string | null;
}

export const departmentService = {
  getAll: async (): Promise<Department[]> => {
    try {
      const departmentsRef = collection(db, DEPARTMENT_COLLECTION);
      const q = query(departmentsRef, orderBy('name', 'asc')); 
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Department));
    } catch (error) {
      console.error("Erro ao buscar departamentos:", error);
      return [];
    }
  },

  // Criar novo
  create: async (data: Omit<Department, 'id'>) => {
    const docRef = await addDoc(collection(db, DEPARTMENT_COLLECTION), data);
    return docRef.id;
  },

  // Atualizar
  update: async (id: string, data: Partial<Department>) => {
    const docRef = doc(db, DEPARTMENT_COLLECTION, id);
    await updateDoc(docRef, data);
  },

  // Excluir
  delete: async (id: string) => {
    const docRef = doc(db, DEPARTMENT_COLLECTION, id);
    await deleteDoc(docRef);
  },

  // Buscar por ID
  getById: async (id: string): Promise<Department | null> => {
    const docRef = doc(db, DEPARTMENT_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Department;
    }
    return null;
  }
};