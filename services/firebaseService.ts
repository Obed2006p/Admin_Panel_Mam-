import { db, auth } from '../firebase'; // Import instances from our new config file
import { 
    collection, 
    query, 
    where, 
    getDocs, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc 
} from 'firebase/firestore';
import { 
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from 'firebase/auth';

import type { Day, Product } from '../types';

const productsCollectionRef = collection(db, 'products');

export const getMenuForDay = async (day: Day | 'Especialidad'): Promise<Product[]> => {
  console.log(`Buscando menú para: ${day} (Firebase)`);
  const q = query(productsCollectionRef, where("day", "==", day));
  const querySnapshot = await getDocs(q);
  
  const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
  } as Product));

  return products;
};

export const addProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
    console.log('Agregando producto (Firebase):', productData);
    const docRef = await addDoc(productsCollectionRef, productData);
    return { id: docRef.id, ...productData };
};

export const updateProduct = async (productId: string, productData: Partial<Omit<Product, 'id'>>): Promise<void> => {
    console.log(`Actualizando producto ${productId} (Firebase):`, productData);
    const productDoc = doc(db, 'products', productId);
    await updateDoc(productDoc, productData);
};

export const deleteProduct = async (productId: string): Promise<void> => {
    console.log(`Eliminando producto ${productId} (Firebase)`);
    const productDoc = doc(db, 'products', productId);
    await deleteDoc(productDoc);
};

// Re-export auth functions to match the existing component imports
export const firebaseAuth = {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
};

// Re-export the auth instance as well, as components are importing it
export { auth };