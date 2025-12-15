import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Department } from '../types'; 

const DEPARTMENT_COLLECTION = 'departments';

export const departmentService = {
  // Listar todos
  getAll: async (): Promise<Department[]> => {
    const querySnapshot = await getDocs(collection(db, DEPARTMENT_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Department));
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