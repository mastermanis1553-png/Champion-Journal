import React, { useState } from 'react';
import { auth } from '../../utils/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Key, ArrowRight, Activity, ShieldCheck } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const[password, setPassword] = useState('');
  const [error, setError] = useState('');
  const[loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/trades');
    } catch (err) {
      setError("Invalid Email or Password.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f9] relative flex flex-col font-sans selection:bg-blue-200 overflow-hidden">
      
      {/* BACKGROUND GRADIENT BLOBS */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400/20 rounded-full blur-[100px] pointer-events-none"></div>

      {/* NAVBAR */}
      <nav className="relative z-10 flex items-center justify-center pt-10">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/30">
            <Activity size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter italic uppercase">
            R Trades <span className="text-blue-600">Journal</span>
          </h1>
        </div>
      </nav>

      {/* LOGIN FORM SECTION */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md mx-auto relative">
          
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[2.5rem] blur opacity-20"></div>
          
          <div className="relative bg-white/70 backdrop-blur-xl border border-white/80 p-8 sm:p-10 rounded-[2rem] shadow-2xl">
            <div className="flex justify-center mb-6">
               <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100 text-blue-600">
                  <ShieldCheck size={28} />
               </div>
            </div>
            
            <h3 className="text-2xl font-black text-center text-slate-900 mb-1 tracking-tight uppercase">Welcome Back</h3>
            <p className="text-xs font-bold text-center text-slate-500 mb-8 uppercase tracking-widest">Enter credentials to access terminal</p>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-bold text-red-600 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
                  <input type="email" required className="w-full bg-white/50 border border-slate-200 pl-11 p-3.5 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm" placeholder="trader@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Secure Password</label>
                <div className="relative">
                  <Key className="absolute left-4 top-3.5 text-slate-400" size={18} />
                  <input type="password" required className="w-full bg-white/50 border border-slate-200 pl-11 p-3.5 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
              </div>

              <button disabled={loading} type="submit" className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white p-4 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex justify-center items-center gap-2">
                {loading ? 'Authenticating...' : 'Access Terminal'} <ArrowRight size={16} />
              </button>
            </form>

            {/* SIGNUP LINK VISIBLE HERE */}
            <div className="mt-8 text-center border-t border-slate-200/60 pt-6">
              <p className="text-xs font-bold text-slate-500">
                Don't have terminal access? <br className="sm:hidden" />
                <Link to="/signup" className="text-blue-600 hover:text-blue-700 hover:underline uppercase tracking-widest ml-1">Request Invite</Link>
              </p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}