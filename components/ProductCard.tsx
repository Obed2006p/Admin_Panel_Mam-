
import React from 'react';
import type { Product } from '../types';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transform hover:scale-105 transition-transform duration-300">
      <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-slate-800">{product.name}</h3>
            <p className="text-lg font-bold text-brand-primary bg-pink-100 px-3 py-1 rounded-full">${product.price.toFixed(2)}</p>
        </div>
        <p className="text-slate-600 mt-2 flex-grow">{product.description}</p>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={() => onEdit(product)}
            className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-brand-primary transition-colors duration-200"
            aria-label={`Editar ${product.name}`}
          >
            <PencilIcon className="w-6 h-6" />
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="p-2 rounded-full text-red-500 hover:bg-red-100 hover:text-red-700 transition-colors duration-200"
            aria-label={`Eliminar ${product.name}`}
          >
            <TrashIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
