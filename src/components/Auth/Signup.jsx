import React, { useState } from 'react';
import { auth } from '../../utils/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Target, TrendingUp, Lock, Mail, Key, ArrowRight, Activity } from 'lucide-react';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const[inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // TERA SECRET INVITE CODE
  const MASTER_INVITE_CODE = "CHAMPION_2026"; 

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (inviteCode !== MASTER_INVITE_CODE) {
      setError("Invalid Invite Code. Access Denied.");
      setLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/trades');
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f9] relative flex flex-col font-sans selection:bg-blue-200 overflow-hidden">
      
      {/* --- BACKGROUND GRADIENT BLOBS (Glassmorphism Effect) --- */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400/20 rounded-full blur-[100px] pointer-events-none"></div>

      {/* --- NAVBAR --- */}
      <nav className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-6">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Activity size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tighter italic uppercase">
            R Trades <span className="text-blue-600">Journal</span>
          </h1>
        </div>
        <Link to="/login" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">
          Already a member? <span className="underline">Sign in</span>
        </Link>
      </nav>

      {/* --- MAIN HERO & FORM SECTION --- */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-6 lg:px-12 py-10">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT SIDE: Hero Section & Features */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/50 border border-blue-200 text-blue-600 text-xs font-black uppercase tracking-widest">
                <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span></span>
                Invite Only Access
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tight">
                Master your trading edge with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">mathematics.</span>
              </h2>
              <p className="text-slate-500 text-base font-medium leading-relaxed max-w-lg">
                Built for institutional-grade risk management. Track your R-Multiples, calculate expectancy, and monitor your exact position sizing in real-time.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-5">
              <FeatureItem icon={Target} title="Position Sizing Engine" desc="Auto-calculates perfect quantity based on your specific R-value and SL distance." />
              <FeatureItem icon={TrendingUp} title="Expectancy Matrix" desc="Know your mathematical edge before you take the next trade in the market." />
              <FeatureItem icon={ShieldCheck} title="Strict Risk Control" desc="Monitor Total Open Risk (TOR) to protect your capital from market crashes." />
            </div>
          </div>

          {/* RIGHT SIDE: Glassmorphism Signup Form */}
          <div className="w-full max-w-md mx-auto lg:ml-auto relative">
            {/* Glowing Border Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[2.5rem] blur opacity-20"></div>
            
            <div className="relative bg-white/70 backdrop-blur-xl border border-white/80 p-8 sm:p-10 rounded-[2rem] shadow-2xl">
              <h3 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">Claim Your Terminal</h3>
              <p className="text-sm font-semibold text-slate-500 mb-8">Enter your credentials and secret invite code.</p>

              {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-bold text-red-600 text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSignup} className="space-y-5">
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

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-blue-600 uppercase tracking-widest ml-1 flex items-center gap-1"><Lock size={12}/> Secret Invite Code</label>
                  <input type="text" required className="w-full bg-blue-50/50 border border-blue-200 p-3.5 rounded-xl text-sm font-black text-blue-700 outline-none focus:border-blue-500 focus:bg-blue-50 transition-all placeholder:text-blue-300 shadow-sm" placeholder="ENTER CODE HERE" value={inviteCode} onChange={e => setInviteCode(e.target.value)} />
                </div>

                <button disabled={loading} type="submit" className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white p-4 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex justify-center items-center gap-2">
                  {loading ? 'Authenticating...' : 'Initialize Account'} <ArrowRight size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="relative z-10 text-center pb-8 pt-4">
        <p className="text-xs font-semibold text-slate-400">© 2026 R Trades Journal. Institutional Grade Trading System.</p>
      </footer>
    </div>
  );
}

// Feature List Component
const FeatureItem = ({ icon: Icon, title, desc }) => (
  <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/40 transition-colors border border-transparent hover:border-white/60">
    <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100">
      <Icon className="text-blue-600" size={24} />
    </div>
    <div>
      <h4 className="text-sm font-black text-slate-900">{title}</h4>
      <p className="text-xs font-medium text-slate-500 mt-1 leading-relaxed">{desc}</p>
    </div>
  </div>
);