import { db } from "../config/firebase";
import { 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  orderBy, 
  serverTimestamp,
  where,
  doc,
  deleteDoc,
  writeBatch
} from "firebase/firestore";
import type { Department } from "../types";

export const departmentService = {
  getAll: async (): Promise<Department[]> => {
    try {
      const deptRef = collection(db, "departments");
      const q = query(deptRef, orderBy("name", "asc"));
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

  checkNameExists: async (name: string) => {
    const deptRef = collection(db, "departments");
    const q = query(deptRef, where("name", "==", name));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  },

  create: async (data: Omit<Department, 'id'>) => {
    const deptRef = collection(db, "departments");
    const exists = await departmentService.checkNameExists(data.name);
    
    if (exists) {
      throw new Error("Já existe um departamento com este nome.");
    }

    const docRef = await addDoc(deptRef, {
      ...data,
      createdAt: serverTimestamp()
    });
    
    return docRef.id; 
  },
  
  delete: async (id: string) => {
    const employeesRef = collection(db, 'employees');
    const q = query(employeesRef, where('departamento', '==', id));
    const snapshot = await getDocs(q);

    const batch = writeBatch(db);
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, { departamento: '' });
    });
    await batch.commit();

    const docRef = doc(db, 'departments', id);
    await deleteDoc(docRef);
  },

  deleteMany: async (ids: string[]) => {
    const deletePromises = ids.map(async (id) => {
      const employeesRef = collection(db, 'employees');
      const q = query(employeesRef, where('departamento', '==', id));
      const snapshot = await getDocs(q);

      const batch = writeBatch(db);
      snapshot.docs.forEach(doc => {
        batch.update(doc.ref, { departamento: '' });
      });
      await batch.commit();

      return deleteDoc(doc(db, 'departments', id));
    });

    await Promise.all(deletePromises);
  }
};