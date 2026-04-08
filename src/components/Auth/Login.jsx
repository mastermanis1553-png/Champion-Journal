import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';

export default function Login() {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err) { 
      setError(err.message); 
    }
  };

  return (
    <div className="h-screen bg-[#050B14] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#050B14] to-[#02040A] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Premium Glow Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="w-full max-w-md z-10 space-y-8">
        <div className="text-center">
          <div className="inline-flex p-4 bg-slate-900/50 border border-slate-700/50 rounded-2xl mb-6 shadow-2xl shadow-blue-900/20">
            <Activity className="text-blue-500" size={36} />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase">R Trades <span className="text-blue-500">Terminal</span></h2>
          <p className="text-slate-400 text-sm mt-3 font-medium">Institutional Grade Trading Journal</p>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl">
          {error && <p className="text-xs font-bold text-red-400 bg-red-900/20 p-3 rounded-lg text-center mb-6 border border-red-900/50">{error}</p>}
          
          <button 
            onClick={handleGoogleLogin} 
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-slate-900 font-black py-4 rounded-xl transition-all active:scale-95 shadow-lg"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            SECURE LOGIN WITH GOOGLE
          </button>
        </div>
      </div>
    </div>
  );
}