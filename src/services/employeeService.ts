import { db } from "../config/firebase";
import { 
  collection, 
  addDoc, 
  getCountFromServer, 
  serverTimestamp,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  orderBy,
  getDoc,
  updateDoc,
  writeBatch 
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

export const employeeService = {
  // --- EXCLUSÃO COM LIMPEZA DE REFERÊNCIAS (GESTOR) ---
  delete: async (id: string) => {
    // 1. Verificar se alguém tem este ID como managerId
    const employeesRef = collection(db, 'employees');
    const q = query(employeesRef, where('managerId', '==', id));
    const snapshot = await getDocs(q);

    // 2. Limpar a referência (Setar managerId como null ou string vazia)
    if (!snapshot.empty) {
      const batch = writeBatch(db);
      snapshot.docs.forEach(doc => {
        batch.update(doc.ref, { managerId: null }); 
      });
      await batch.commit();
    }

    // 3. Deletar o Funcionário
    const docRef = doc(db, 'employees', id);
    await deleteDoc(docRef);
  },

  deleteMany: async (ids: string[]) => {
    const deletePromises = ids.map(async (id) => {
      // 1. Limpar referências de gestor
      const employeesRef = collection(db, 'employees');
      const q = query(employeesRef, where('managerId', '==', id));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const batch = writeBatch(db);
        snapshot.docs.forEach(doc => {
          batch.update(doc.ref, { managerId: null });
        });
        await batch.commit();
      }

      // 2. Deletar
      return deleteDoc(doc(db, 'employees', id));
    });

    await Promise.all(deletePromises);
  },

  getById: async (id: string): Promise<Employee | null> => {
    const docRef = doc(db, 'employees', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Employee;
    } else {
      return null;
    }
  },

  update: async (id: string, data: Partial<NewEmployeePayload>) => {
    const docRef = doc(db, 'employees', id);
    
    const updateObject: Record<string, unknown> = {}; 

    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const value = data[key as keyof Partial<NewEmployeePayload>];
        
        if (key === 'status') {
          if (typeof value === 'boolean') {
            updateObject.status = value ? 'Ativo' : 'Inativo';
          } else if (value !== undefined) { 
            updateObject.status = value;
          }
        } else if (value !== undefined) {
          if (key === 'managerId' && value === '') {
            updateObject[key] = null;
          } else {
            updateObject[key] = value;
          }
        }
      }
    }

    await updateDoc(docRef, updateObject);
  },

  updateEmployeesDepartment: async (employeeIds: string[], departmentId: string) => {
    if (!employeeIds || employeeIds.length === 0) {
      return;
    }
    
    const batch = writeBatch(db);
    
    employeeIds.forEach(employeeId => {
      const employeeRef = doc(db, 'employees', employeeId);
      batch.update(employeeRef, { departamento: departmentId });
    });
    
    await batch.commit();
  }
};