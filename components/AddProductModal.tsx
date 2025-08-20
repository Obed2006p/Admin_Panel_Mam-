import React, { useState, useEffect, useRef } from 'react';
import type { Product, Day } from '../types';
import { Category } from '../types';
import { CATEGORIES } from '../constants';
import { Button } from './Button';
import { uploadImage } from '../services/cloudinaryService';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Omit<Product, 'id'>, imageFile: File | null) => void;
  productToEdit: Product | null;
  selectedDay: Day | 'Especialidad';
  isSaving: boolean;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  productToEdit,
  selectedDay,
  isSaving,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<Category>(Category.Comida);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setDescription(productToEdit.description);
      setCategory(productToEdit.category);
      setPrice(productToEdit.price.toString());
      setImagePreview(productToEdit.imageUrl);
      setImageFile(null);
    } else {
      resetForm();
    }
  }, [productToEdit, isOpen]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setCategory(Category.Comida);
    setImageFile(null);
    setImagePreview(null);
    setError('');
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !price) {
      setError('El nombre, la descripción y el precio son obligatorios.');
      return;
    }
    if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
      setError('Por favor, ingresa un precio válido.');
      return;
    }
    if (!productToEdit && !imageFile) {
        setError('Debes seleccionar una imagen para el nuevo producto.');
        return;
    }
    setError('');
    
    const finalCategory = selectedDay === 'Especialidad' ? Category.Especialidad : category;

    onSave({
        name,
        description,
        price: parseFloat(price),
        category: finalCategory,
        day: selectedDay,
        imageUrl: productToEdit?.imageUrl || ''
    }, imageFile);
  };
  
  if (!isOpen) return null;

  const availableCategories = selectedDay === 'Especialidad' ? [Category.Especialidad] : CATEGORIES;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-lg max-h-full overflow-y-auto">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          {productToEdit ? 'Editar Producto' : 'Agregar Nuevo Producto'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">Nombre del Producto</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-brand-primary focus:border-brand-primary" />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700">Descripción</label>
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-brand-primary focus:border-brand-primary"></textarea>
            </div>
            <div>
                <label htmlFor="price" className="block text-sm font-medium text-slate-700">Precio</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} min="0" step="0.50" className="block w-full rounded-md border-slate-300 pl-7 pr-2 p-2 focus:border-brand-primary focus:ring-brand-primary" placeholder="0.00" />
                </div>
            </div>
            {selectedDay !== 'Especialidad' && (
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-700">Categoría</label>
                <select id="category" value={category} onChange={(e) => setCategory(e.target.value as Category)} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-brand-primary focus:border-brand-primary">
                  {availableCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700">Imagen</label>
              <div className="mt-1 flex items-center space-x-4">
                {imagePreview && <img src={imagePreview} alt="Vista previa" className="w-24 h-24 rounded-md object-cover" />}
                <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-brand-primary hover:file:bg-pink-100"/>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <Button type="button" variant="secondary" onClick={() => { onClose(); resetForm(); }} className="bg-pink-100 text-pink-800 hover:bg-pink-200" disabled={isSaving}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" isLoading={isSaving}>
              {productToEdit ? 'Guardar Cambios' : 'Agregar Producto'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};