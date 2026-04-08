// src/components/Auth/Login.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Activity, Mail, Lock } from 'lucide-react';

export default function Login() {
  const { loginWithGoogle, loginWithEmail } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await loginWithEmail(email, password);
      navigate('/');
    } catch (err) { setError(err.message); }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err) { setError(err.message); }
  };

  return (
    <div className="h-screen bg-[#050B14] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-md z-10 space-y-6">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-slate-900/50 border border-slate-800 rounded-2xl mb-4 shadow-2xl">
            <Activity className="text-blue-500" size={32} />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">R Trades <span className="text-blue-500">Terminal</span></h2>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-[2rem] shadow-2xl">
          {error && <p className="text-[10px] font-bold text-red-400 bg-red-900/20 p-3 rounded-lg text-center mb-6 border border-red-900/50 uppercase">{error}</p>}
          
          {/* EMAIL FORM */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-4 text-slate-500" size={18} />
              <input 
                type="email" 
                placeholder="Email Address"
                className="w-full bg-slate-950 border border-slate-800 p-4 pl-12 rounded-xl text-sm focus:border-blue-500 outline-none text-white font-bold"
                value={email} onChange={e => setEmail(e.target.value)} required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-4 text-slate-500" size={18} />
              <input 
                type="password" 
                placeholder="Secure Password"
                className="w-full bg-slate-950 border border-slate-800 p-4 pl-12 rounded-xl text-sm focus:border-blue-500 outline-none text-white font-bold"
                value={password} onChange={e => setPassword(e.target.value)} required
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-blue-900/20">
              LOGIN TO TERMINAL
            </button>
          </form>

          <div className="relative my-8 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
            <span className="relative bg-[#050B14] px-4 text-[10px] font-black text-slate-500 uppercase">Or Continue with</span>
          </div>

          {/* GOOGLE BUTTON */}
          <button 
            onClick={handleGoogleLogin} 
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-slate-900 font-black py-4 rounded-xl transition-all active:scale-95 shadow-lg"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            GOOGLE AUTH
          </button>
        </div>
      </div>
    </div>
  );
}