import type { Product } from '../types';
import { Category, Day } from '../types';
import firebase from "firebase/compat/app";
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";


// --- INSTRUCCIONES DE FIREBASE ---
// ¡Hola! Para que esta aplicación guarde los datos de forma permanente, necesitas conectar Firebase.
// Sigue estos pasos. ¡Tú puedes!

// 1. Ve a https://firebase.google.com/ y crea un nuevo proyecto (es gratis).
// 2. Dentro de tu proyecto, ve a "Firestore Database" en el menú de la izquierda y crea una base de datos.
//    Elige el modo de prueba para empezar, podrás cambiar las reglas de seguridad más adelante.
// 3. Vuelve a la página principal de tu proyecto, haz clic en el ícono de web "</>" para registrar una nueva aplicación web.
// 4. Dale un nombre y Firebase te dará un objeto de configuración llamado `firebaseConfig`. Cópialo.
// 5. Pega tu `firebaseConfig` aquí abajo donde dice "PEGA TU CONFIGURACIÓN DE FIREBASE AQUÍ".

const firebaseConfig = {
  apiKey: "AIzaSyCCuaPZhg4MtlTHV-JzDKEOiG1Lb3pVg4U",
  authDomain: "rincon-de-lore.firebaseapp.com",
  projectId: "rincon-de-lore",
  storageBucket: "rincon-de-lore.firebasestorage.app",
  messagingSenderId: "1023054561981",
  appId: "1:1023054561981:web:1a98228f741c1732cc2dd4",
  measurementId: "G-619DPFRWGS"
};

// Initialize Firebase using the compat library to avoid module resolution issues.
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Get Firestore instance using the modular API. It will use the initialized app by default.
const db = getFirestore();
const productsCollection = collection(db, 'products');


// --- Datos de ejemplo (YA NO SE USAN, PERO SE DEJAN POR SI ACASO) ---
/*
const initialMockData: Product[] = [
    { id: '1', name: 'Chilaquiles Rojos', description: 'Con pollo, crema, queso y cebolla.', imageUrl: 'https://picsum.photos/400/300?random=1', category: Category.Desayuno, day: Day.Lunes },
    { id: '2', name: 'Enchiladas Suizas', description: 'Rellenas de pollo bañadas en salsa verde.', imageUrl: 'https://picsum.photos/400/300?random=2', category: Category.Comida, day: Day.Lunes },
    { id: '3', name: 'Agua de Horchata', description: 'Refrescante agua de arroz con canela.', imageUrl: 'https://picsum.photos/400/300?random=3', category: Category.Bebidas, day: Day.Lunes },
    { id: '4', name: 'Tacos al Pastor', description: 'El clásico de siempre, con piña y cilantro.', imageUrl: 'https://picsum.photos/400/300?random=4', category: Category.Especialidad, day: 'Especialidad' },
    { id: '5', name: 'Mole Poblano', description: 'Pechuga de pollo bañada en mole tradicional.', imageUrl: 'https://picsum.photos/400/300?random=5', category: Category.Comida, day: Day.Miercoles },
];
let mockDatabase: Product[] = [...initialMockData];
*/
// --------------------------------------------------------------------


export const getMenuForDay = async (day: Day | 'Especialidad'): Promise<Product[]> => {
  console.log(`Buscando menú para: ${day} en Firebase`);
  /*
  // Lógica MOCK (desactivada)
  await new Promise(res => setTimeout(res, 500));
  const results = mockDatabase.filter(p => p.day === day);
  return results;
  */
  
  // Lógica REAL con FIREBASE
  const q = query(productsCollection, where("day", "==", day));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
};

export const addProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
    console.log('Agregando producto a Firebase:', productData);
    /*
    // Lógica MOCK (desactivada)
    await new Promise(res => setTimeout(res, 500));
    const newProduct: Product = { id: Date.now().toString(), ...productData };
    mockDatabase.push(newProduct);
    return newProduct;
    */
    
    // Lógica REAL con FIREBASE
    const docRef = await addDoc(productsCollection, productData);
    return { id: docRef.id, ...productData };
};


export const updateProduct = async (productId: string, productData: Partial<Omit<Product, 'id'>>): Promise<Product> => {
    console.log(`Actualizando producto ${productId} en Firebase:`, productData);
    /*
    // Lógica MOCK (desactivada)
    await new Promise(res => setTimeout(res, 500));
    let updatedProduct: Product | undefined;
    mockDatabase = mockDatabase.map(p => {
        if (p.id === productId) {
            updatedProduct = { ...p, ...productData };
            return updatedProduct;
        }
        return p;
    });
    if (!updatedProduct) throw new Error("Producto no encontrado");
    return updatedProduct;
    */
    
    // Lógica REAL con FIREBASE
    const productDoc = doc(db, "products", productId);
    await updateDoc(productDoc, productData);
    // Nota: Esto devuelve los datos enviados, no los datos actualizados de la DB.
    // Para la mayoría de los casos, esto es suficiente y más eficiente.
    const updatedProductData: Product = { id: productId, ...productData } as Product;
    return updatedProductData;
};


export const deleteProduct = async (productId: string): Promise<void> => {
    console.log(`Eliminando producto ${productId} de Firebase`);
    /*
    // Lógica MOCK (desactivada)
    await new Promise(res => setTimeout(res, 500));
    mockDatabase = mockDatabase.filter(p => p.id !== productId);
    return;
    */

    // Lógica REAL con FIREBASE
    const productDoc = doc(db, "products", productId);
    await deleteDoc(productDoc);
};