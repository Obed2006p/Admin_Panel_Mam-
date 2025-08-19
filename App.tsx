
import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { MenuBoard } from './components/MenuBoard';
import { AddProductModal } from './components/AddProductModal';
import { getMenuForDay, addProduct, updateProduct, deleteProduct } from './services/firebaseService';
import { uploadImage } from './services/cloudinaryService';
import { Day, type Product } from './types';

const getInitialDay = (): Day | 'Especialidad' => {
    const dayIndex = new Date().getDay(); // Domingo: 0, Lunes: 1, ..., Sábado: 6
    switch (dayIndex) {
      case 1: return Day.Lunes;
      case 2: return Day.Martes;
      case 3: return Day.Miercoles;
      case 4: return Day.Jueves;
      case 5: return Day.Viernes;
      case 0: // Domingo
      case 6: // Sábado
      default:
        return Day.Lunes; // Por defecto Lunes si es fin de semana
    }
};


function App() {
  const [selectedDay, setSelectedDay] = useState<Day | 'Especialidad'>(getInitialDay());
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
      // Aquí podrías mostrar una notificación de error al usuario
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenu(selectedDay);
  }, [selectedDay, fetchMenu]);

  const handleSelectDay = (day: Day | 'Especialidad') => {
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
    if (window.confirm("¿Estás segura de que quieres eliminar este producto?")) {
      setIsLoading(true); // Muestra un feedback de carga general
      try {
        await deleteProduct(productId);
        // La recarga se maneja con un nuevo fetch, no se necesita actualizar el estado localmente
        await fetchMenu(selectedDay); 
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

        // Si hay un archivo de imagen nuevo, súbelo a Cloudinary
        if (imageFile) {
            imageUrl = await uploadImage(imageFile);
        }
        
        const finalProductData = { ...productData, imageUrl };

        if (productToEdit) {
            // Actualiza un producto existente en Firebase
            await updateProduct(productToEdit.id, finalProductData);
        } else {
            // Agrega un producto nuevo a Firebase
            await addProduct(finalProductData);
        }
        
        setIsModalOpen(false);
        setProductToEdit(null);
        await fetchMenu(selectedDay); // Vuelve a cargar el menú del día actual

    } catch (error) {
        console.error("Error al guardar el producto:", error);
        // Aquí podrías mostrar un error en el modal
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-brand-light font-sans">
      <Sidebar selectedDay={selectedDay} onSelectDay={handleSelectDay} />
      <MenuBoard
        selectedDay={selectedDay}
        products={menuItems}
        isLoading={isLoading}
        onAddProduct={handleAddProductClick}
        onEditProduct={handleEditProductClick}
        onDeleteProduct={handleDeleteProduct}
      />
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        productToEdit={productToEdit}
        selectedDay={selectedDay}
        isSaving={isSaving}
      />
    </div>
  );
}

export default App;