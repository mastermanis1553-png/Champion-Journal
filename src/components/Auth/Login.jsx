import React, { useState, useEffect } from 'react'; // ✅ useEffect add kiya
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // ✅ FIX: 'user' ko extract kiya context se
  const { loginWithEmail, loginWithGoogle, user } = useAuth(); 
  const navigate = useNavigate();

  // ✅ FIX: Ye code check karega ki agar user already login hai, toh seedha andar bhejo
  useEffect(() => {
    if (user) {
      navigate('/trades');
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await loginWithEmail(email, password);
      // yahan ka navigate ab zaruri nahi kyunki useEffect sambhal lega, but rehne de sakte hain
    } catch (err) { 
      setError(err.message || "Invalid Credentials or Unauthorized."); 
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    try {
      await loginWithGoogle();
      // Google Auth ke baad ye line kabhi run nahi hoti page reload ki wajah se. 
      // Isiliye upar wala useEffect kaam aayega.
    } catch (err) {
      setError("Google Auth Failed or Unauthorized.");
    }
  };

  // ... (Baaki poora UI ka code same rahega, usme koi change nahi)
  return (
    <div className="min-h-screen bg-[#e5eaf5] flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md space-y-8">
        
        {/* Brand Header */}
        <div className="text-center flex flex-col items-center">
          <div className="inline-flex p-4 bg-white rounded-2xl border border-[#d0bdf4] mb-4 shadow-sm">
            <Activity className="text-[#a0d2eb]" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-[#8458B3] tracking-tight uppercase">R Trades <span className="text-[#a28089]">Terminal</span></h2>
          <p className="text-[#a28089] text-sm font-medium mt-2">Sign in to access your institutional dashboard.</p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-[#d0bdf4] p-8 rounded-[2rem] shadow-sm">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold p-3 rounded-xl mb-6 text-center uppercase tracking-widest">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-[#a28089] uppercase tracking-widest ml-1">Email Address</label>
              <input 
                type="email" 
                required 
                className="w-full bg-[#f8f9fc] border border-[#e5eaf5] p-3.5 rounded-xl focus:border-[#a0d2eb] outline-none text-[#494D5F] font-semibold transition-colors" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="trader@example.com"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-[#a28089] uppercase tracking-widest ml-1">Secure Password</label>
              <input 
                type="password" 
                required 
                className="w-full bg-[#f8f9fc] border border-[#e5eaf5] p-3.5 rounded-xl focus:border-[#a0d2eb] outline-none text-[#494D5F] font-semibold transition-colors" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="••••••••"
              />
            </div>
            
            <button type="submit" className="w-full bg-[#8458B3] hover:opacity-90 text-white font-bold py-4 rounded-xl shadow-md transition-opacity uppercase text-xs tracking-widest mt-2">
              Login to Terminal
            </button>
          </form>

          <div className="mt-6 relative flex items-center justify-center">
            <div className="border-t border-[#e5eaf5] w-full absolute"></div>
            <span className="bg-white px-4 text-[10px] font-bold text-[#a28089] uppercase tracking-widest relative z-10">Or Continue With</span>
          </div>

          <button type="button" onClick={handleGoogleAuth} className="w-full mt-6 bg-white border border-[#d0bdf4] hover:bg-[#f8f9fc] text-[#494D5F] font-bold py-3.5 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-3 text-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google Auth
          </button>

          <p className="text-center text-xs font-semibold text-[#a28089] mt-8">
            Don't have an account? <Link to="/signup" className="text-[#8458B3] hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}