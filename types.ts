
export enum Category {
  Desayuno = 'Desayuno',
  Comida = 'Comida',
  Bebidas = 'Bebidas',
  Especialidad = 'Especialidad',
}

export enum Day {
  Lunes = 'Lunes',
  Martes = 'Martes',
  Miercoles = 'Miércoles',
  Jueves = 'Jueves',
  Viernes = 'Viernes',
}

export type SelectedView = Day | 'Especialidad' | 'Fin de Semana';

export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: Category;
  day: Day | 'Especialidad'; // Specialties are available every day
  price: number;
}