import React from 'react';
import { CalendarDaysIcon } from './icons/CalendarDaysIcon';

export const WeekendView: React.FC = () => {
  return (
    <div className="text-center text-slate-500 p-8">
      <CalendarDaysIcon className="mx-auto h-20 w-20 text-slate-400 mb-4" />
      <h3 className="text-3xl font-bold text-slate-700">¡Es fin de semana!</h3>
      <p className="mt-2 text-lg max-w-md mx-auto">
        Durante el sábado y domingo no se agregan platillos al menú. ¡Disfruta tu descanso!
      </p>
    </div>
  );
};