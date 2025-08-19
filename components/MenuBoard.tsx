
import React from 'react';
import type { Product } from '../types';
import { Category } from '../types';
import { ProductCard } from './ProductCard';
import { PlusIcon } from './icons/PlusIcon';
import { Button } from './Button';

interface MenuBoardProps {
  products: Product[];
  isLoading: boolean;
  selectedDay: string;
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

const categoryOrder: Category[] = [Category.Desayuno, Category.Comida, Category.Bebidas, Category.Especialidad];

export const MenuBoard: React.FC<MenuBoardProps> = ({
  products,
  isLoading,
  selectedDay,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
}) => {
  const groupedProducts = products.reduce((acc, product) => {
    const key = product.category;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(product);
    return acc;
  }, {} as Record<Category, Product[]>);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-full">
            <div className="text-center text-slate-500">
                <svg className="animate-spin mx-auto h-10 w-10 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-2 text-lg">Cargando menú...</p>
            </div>
        </div>
      );
    }
    
    const categoriesWithProducts = categoryOrder.filter(cat => groupedProducts[cat]?.length > 0);

    if (products.length === 0) {
      return (
        <div className="text-center text-slate-500 py-16">
          <h3 className="text-2xl font-semibold">No hay productos para {selectedDay}</h3>
          <p className="mt-2">¡Comienza agregando el primer platillo del día!</p>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {categoriesWithProducts.map((category) => (
          <section key={category}>
            <h2 className="text-3xl font-bold text-slate-800 border-b-2 border-brand-primary pb-2 mb-6">
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedProducts[category].map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={onEditProduct}
                  onDelete={onDeleteProduct}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  };
  
  return (
    <main className="flex-1 p-8 overflow-y-auto">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Menú de {selectedDay}
        </h1>
        <Button onClick={onAddProduct}>
          <PlusIcon className="w-5 h-5" />
          Agregar Producto
        </Button>
      </header>
      {renderContent()}
    </main>
  );
};
