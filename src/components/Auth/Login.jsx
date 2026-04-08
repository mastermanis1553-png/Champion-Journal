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
    <div className="h-screen bg-[#e5eaf5] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#8458B3]/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#a0d2eb]/10 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-md z-10 space-y-6">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-white/60 backdrop-blur-md border border-[#d0bdf4] rounded-2xl mb-4 shadow-lg">
            <Activity className="text-[#8458B3]" size={32} />
          </div>
          <h2 className="text-3xl font-black text-[#8458B3] uppercase tracking-tight">R Trades <span className="text-[#a0d2eb]">Terminal</span></h2>
        </div>

        <div className="bg-white/70 backdrop-blur-xl border-2 border-[#d0bdf4] p-8 rounded-[2rem] shadow-lg">
          {error && <p className="text-xs font-bold text-red-600 bg-red-50 p-3 rounded-lg text-center mb-6 border border-red-200 uppercase">{error}</p>}
          
          {/* EMAIL FORM */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-4 text-[#a28089]" size={18} />
              <input 
                type="email" 
                placeholder="Email Address"
                className="w-full bg-white border-2 border-[#d0bdf4] p-4 pl-12 rounded-xl text-sm focus:border-[#8458B3] focus:outline-none focus:ring-2 focus:ring-[#8458B3]/30 text-[#333] font-bold transition-all duration-200"
                value={email} onChange={e => setEmail(e.target.value)} required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-4 text-[#a28089]" size={18} />
              <input 
                type="password" 
                placeholder="Secure Password"
                className="w-full bg-white border-2 border-[#d0bdf4] p-4 pl-12 rounded-xl text-sm focus:border-[#8458B3] focus:outline-none focus:ring-2 focus:ring-[#8458B3]/30 text-[#333] font-bold transition-all duration-200"
                value={password} onChange={e => setPassword(e.target.value)} required
              />
            </div>
            <button type="submit" className="w-full bg-[#8458B3] hover:bg-[#a0d2eb] hover:text-[#8458B3] text-white font-black py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl uppercase text-sm tracking-wider">
              LOGIN TO TERMINAL
            </button>
          </form>

          <div className="relative my-8 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t-2 border-[#d0bdf4]"></div></div>
            <span className="relative bg-white/70 px-4 text-xs font-black text-[#a28089] uppercase">Or Continue with</span>
          </div>

          {/* GOOGLE BUTTON */}
          <button 
            onClick={handleGoogleLogin} 
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-[#f0f0f0] text-[#333] font-black py-4 rounded-xl transition-all duration-200 active:scale-95 shadow-md hover:shadow-lg border-2 border-[#d0bdf4]"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            GOOGLE AUTH
          </button>
        </div>
      </div>
    </div>
  );
}