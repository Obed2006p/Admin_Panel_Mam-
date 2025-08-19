
import React from 'react';
import type { Day } from '../types';
import { DAYS_OF_WEEK } from '../constants';
import { ClockIcon } from './icons/ClockIcon';

interface SidebarProps {
  selectedDay: Day | 'Especialidad';
  onSelectDay: (day: Day | 'Especialidad') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ selectedDay, onSelectDay }) => {
  const baseClasses = 'w-full text-left px-4 py-3 rounded-md text-lg font-medium transition-colors duration-200 flex items-center space-x-3';
  const activeClasses = 'bg-brand-primary text-white shadow-lg';
  const inactiveClasses = 'text-slate-200 hover:bg-violet-800 hover:text-white';

  const menuItems: (Day | 'Especialidad')[] = [...DAYS_OF_WEEK, 'Especialidad'];

  return (
    <aside className="bg-brand-dark text-white w-64 p-4 space-y-2 flex flex-col">
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
      
      {/* Horario de servicio */}
      <div className="pt-4 mt-4 border-t border-violet-700 text-center text-slate-300">
          <div className="flex items-center justify-center gap-2 font-semibold">
              <ClockIcon className="w-5 h-5"/>
              <span>Horario</span>
          </div>
          <p className="text-sm mt-1">Lunes a Viernes</p>
          <p className="text-sm">7:00 am - 3:00 pm</p>
      </div>

       <div className="text-center p-2 text-xs text-slate-400 mt-2">
        <p>Hecho con ❤️ para mamá</p>
      </div>
    </aside>
  );
};
