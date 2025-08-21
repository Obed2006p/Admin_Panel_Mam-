import React, { useState } from 'react';
import { auth, firebaseAuth } from '../services/firebaseService';
import { Button } from './Button';
import { EyeIcon } from './icons/EyeIcon';
import { EyeOffIcon } from './icons/EyeOffIcon';


export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await firebaseAuth.signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged in App.tsx will handle navigation
    } catch (err: any) {
      console.error(err);
       if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-email') {
        setError('El correo o la contraseña son incorrectos.');
      } else {
        setError('Ocurrió un error al iniciar sesión. Inténtalo de nuevo.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col justify-center items-center p-4" style={{
      backgroundImage: `url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div className="relative w-full max-w-md bg-slate-900/80 rounded-2xl shadow-2xl p-8 border border-slate-700">
        <div className="text-center mb-8">
            <img src="https://res.cloudinary.com/dsmzpsool/image/upload/v1755814950/Logo_mi_lore_dogazs.png" alt="Logo del Restaurante" className="mx-auto h-24 w-auto" />
            <h2 className="text-2xl font-bold text-brand-secondary mt-4 tracking-wide [text-shadow:0_0_8px_#EC4899,0_0_12px_#EC4899]">Panel de Administrador</h2>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300">Correo Electrónico</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm p-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent" 
              placeholder="tu@correo.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300">Contraseña</label>
            <div className="relative mt-1">
              <input 
                type={showPassword ? "text" : "password"} 
                id="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm p-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent pr-10" 
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>
          
          {error && <p className="text-red-400 text-sm text-center bg-red-900/50 p-3 rounded-md">{error}</p>}
          
          <Button type="submit" variant="primary" isLoading={isLoading} className="w-full !py-3 !text-lg">
            Iniciar Sesión
          </Button>
        </form>
      </div>
    </div>
  );
};