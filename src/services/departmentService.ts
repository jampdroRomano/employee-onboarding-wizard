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

let departmentsCache: Department[] | null = null;

export const departmentService = {
  getAll: async (): Promise<Department[]> => {
    if (departmentsCache) {
      return departmentsCache;
    }

    try {
      const departmentsRef = collection(db, DEPARTMENT_COLLECTION);
      const q = query(departmentsRef, orderBy('name', 'asc')); 
      const querySnapshot = await getDocs(q);
      
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Department));

      departmentsCache = data;
      return data;

    } catch (error) {
      console.error("Erro ao buscar departamentos:", error);
      return [];
    }
  },

  create: async (data: Omit<Department, 'id'>) => {
    departmentsCache = null; 
    const docRef = await addDoc(collection(db, DEPARTMENT_COLLECTION), data);
    return docRef.id;
  },

  update: async (id: string, data: Partial<Department>) => {
    departmentsCache = null; 
    const docRef = doc(db, DEPARTMENT_COLLECTION, id);
    await updateDoc(docRef, data);
  },

  delete: async (id: string) => {
    departmentsCache = null; 
    const docRef = doc(db, DEPARTMENT_COLLECTION, id);
    await deleteDoc(docRef);
  },

  getById: async (id: string): Promise<Department | null> => {
    const docRef = doc(db, DEPARTMENT_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Department;
    }
    return null;
  }
};