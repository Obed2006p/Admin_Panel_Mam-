
import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { MenuBoard } from './components/MenuBoard';
import { AddProductModal } from './components/AddProductModal';
import { getMenuForDay, addProduct, updateProduct, deleteProduct, auth, firebaseAuth } from './services/firebaseService';
import { uploadImage } from './services/cloudinaryService';
import { Day, type Product, type SelectedView } from './types';
import { Login } from './components/Login';

const getInitialDay = (): SelectedView => {
    const dayIndex = new Date().getDay(); // Domingo: 0, Lunes: 1, ..., Sábado: 6
    switch (dayIndex) {
      case 1: return Day.Lunes;
      case 2: return Day.Martes;
      case 3: return Day.Miercoles;
      case 4: return Day.Jueves;
      case 5: return Day.Viernes;
      case 0: // Domingo
      case 6: // Sábado
        return 'Fin de Semana';
      default:
        return Day.Lunes;
    }
};

// The main application panel, shown after login
const AdminPanel = ({ onLogout }: { onLogout: () => void }) => {
  const [selectedDay, setSelectedDay] = useState<SelectedView>(getInitialDay());
  const [menuItems, setMenuItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchMenu = useCallback(async (day: Day | 'Especialidad') => {
    setIsLoading(true);
    try {
      const products = await getMenuForDay(day);
      setMenuItems(products);
    } catch (error) {
      console.error("Error al cargar el menú:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedDay !== 'Fin de Semana') {
      fetchMenu(selectedDay);
    } else {
        setMenuItems([]);
    }
  }, [selectedDay, fetchMenu]);

  const handleSelectDay = (day: SelectedView) => {
    setSelectedDay(day);
  };

  const handleAddProductClick = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditProductClick = (product: Product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm("¿Estás segura de que quieres eliminar este producto? Esta acción no se puede deshacer.")) {
      setIsLoading(true);
      try {
        await deleteProduct(productId);
        if (selectedDay !== 'Fin de Semana') {
          await fetchMenu(selectedDay);
        }
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const handleSaveProduct = async (productData: Omit<Product, 'id' | 'imageUrl'> & {imageUrl: string}, imageFile: File | null) => {
    setIsSaving(true);
    try {
        let imageUrl = productToEdit?.imageUrl || '';
        if (imageFile) {
            imageUrl = await uploadImage(imageFile);
        }
        
        const finalProductData = { ...productData, imageUrl };

        if (productToEdit) {
            await updateProduct(productToEdit.id, finalProductData);
        } else {
            await addProduct(finalProductData);
        }
        
        setIsModalOpen(false);
        setProductToEdit(null);
        if (selectedDay !== 'Fin de Semana') {
          await fetchMenu(selectedDay);
        }

    } catch (error) {
        console.error("Error al guardar el producto:", error);
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-brand-light font-sans">
      <Sidebar selectedDay={selectedDay} onSelectDay={handleSelectDay} onLogout={onLogout} />
      <MenuBoard
        selectedDay={selectedDay}
        products={menuItems}
        isLoading={isLoading}
        onAddProduct={handleAddProductClick}
        onEditProduct={handleEditProductClick}
        onDeleteProduct={handleDeleteProduct}
      />
      { selectedDay !== 'Fin de Semana' && (
         <AddProductModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveProduct}
            productToEdit={productToEdit}
            selectedDay={selectedDay as Day | 'Especialidad'} // Cast because it cannot be 'Fin de Semana' here
            isSaving={isSaving}
          />
        )
      }
    </div>
  );
};


function App() {
  const [user, setUser] = useState<any | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await firebaseAuth.signOut(auth);
      // onAuthStateChanged will handle setting user to null
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (authLoading) {
    // Optional: Show a full-screen loader while checking auth status
    return (
        <div className="flex h-screen w-screen justify-center items-center bg-brand-light">
            <svg className="animate-spin h-12 w-12 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
    );
  }
  
  if (!user) {
    return <Login />;
  }

  return <AdminPanel onLogout={handleLogout} />;
}

export default App;