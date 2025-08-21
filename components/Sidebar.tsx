
import React from 'react';
import type { Day, SelectedView } from '../types';
import { DAYS_OF_WEEK } from '../constants';
import { LogoutIcon } from './icons/LogoutIcon';

interface SidebarProps {
  selectedDay: SelectedView;
  onSelectDay: (day: SelectedView) => void;
  onLogout: () => void;
  isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ selectedDay, onSelectDay, onLogout, isOpen }) => {
  const baseClasses = 'w-full text-left px-4 py-3 rounded-md text-lg font-medium transition-colors duration-200 flex items-center space-x-3';
  const activeClasses = 'bg-brand-primary text-white shadow-lg';
  const inactiveClasses = 'text-slate-200 hover:bg-pink-800 hover:text-white';

  const menuItems: SelectedView[] = [...DAYS_OF_WEEK, 'Especialidad', 'Fin de Semana'];
  
  const sidebarClasses = `
    bg-brand-dark text-white w-64 p-4 space-y-2 flex flex-col flex-shrink-0
    fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out
    md:relative md:translate-x-0
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  `;

  return (
    <aside className={sidebarClasses}>
      <h1 className="text-2xl font-bold text-center mb-6 text-white tracking-wider">
        Menú Semanal
      </h1>
      <nav className="flex-grow">
        <ul className="space-y-2">
          {menuItems.map((day) => (
            <li key={day}>
              <button
                onClick={() => onSelectDay(day)}
                className={`${baseClasses} ${selectedDay === day ? activeClasses : inactiveClasses}`}
              >
                <span>{day}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
       {/* Logout Button */}
      <div className="pt-4 mt-auto border-t border-pink-700">
        <button
          onClick={onLogout}
          className={`${baseClasses} ${inactiveClasses}`}
        >
          <LogoutIcon className="w-5 h-5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};
