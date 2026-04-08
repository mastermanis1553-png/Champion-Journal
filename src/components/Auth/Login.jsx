import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) { alert("Invalid Credentials"); }
  };

  return (
    <div className="h-screen bg-[#0b1220] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-flex p-4 bg-blue-600/10 rounded-2xl border border-blue-500/20 mb-4">
            <Shield className="text-blue-500" size={32} />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tighter">WELCOME BACK, CHAMPION</h2>
          <p className="text-slate-500 text-sm mt-2">Enter your credentials to access your terminal.</p>
        </div>

        <form onSubmit={handleLogin} className="bg-[#111a2e] border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Address</label>
            <input type="email" required className="w-full bg-[#0b1220] border border-slate-800 p-4 rounded-xl focus:border-blue-500 transition outline-none" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Secure Password</label>
            <input type="password" required className="w-full bg-[#0b1220] border border-slate-800 p-4 rounded-xl focus:border-blue-500 transition outline-none" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all transform active:scale-95">
            ACCESS TERMINAL
          </button>
        </form>
      </div>
    </div>
  );
}