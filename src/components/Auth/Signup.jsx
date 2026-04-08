import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Target, TrendingUp, Lock, Mail, Key, ArrowRight, Activity, AlertCircle, CheckCircle } from 'lucide-react';

export default function Signup() {
  const { signupWithEmail, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      const result = await signupWithEmail(email, password);
      setSuccess(true);
      setError('');
      
      // Keep success message for 5 seconds, then redirect
      setTimeout(() => {
        navigate('/login');
      }, 4000);
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e5eaf5] relative flex flex-col font-sans overflow-hidden">
      
      {/* BACKGROUND GRADIENT BLOBS */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#8458B3]/15 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#a0d2eb]/15 rounded-full blur-[100px] pointer-events-none"></div>

      {/* NAVBAR */}
      <nav className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-6">
        <div className="flex items-center gap-3">
          <div className="bg-[#8458B3] p-2.5 rounded-xl">
            <Activity size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-[#8458B3] tracking-tight" style={{ fontStyle: 'normal' }}>
            R Trades <span className="text-[#a0d2eb]">Journal</span>
          </h1>
        </div>
        <Link to="/login" className="text-sm font-bold text-[#a28089] hover:text-[#8458B3] transition-colors duration-200">
          Already a member? <span className="underline">Sign in</span>
        </Link>
      </nav>

      {/* MAIN CONTENT */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-6 lg:px-12 py-10">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT SIDE: Hero Section & Features */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#a0d2eb]/30 border border-[#a0d2eb] text-[#8458B3] text-xs font-black uppercase tracking-widest">
                <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8458B3] opacity-75"></span><span className="relative inline-flex h-2 w-2 rounded-full bg-[#8458B3]"></span></span>
                Institutional Trading Platform
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-[#8458B3] leading-tight tracking-tight" style={{ fontStyle: 'normal' }}>
                Master your trading edge with <span className="text-[#a0d2eb]">mathematics.</span>
              </h2>
              <p className="text-[#a28089] text-base font-medium leading-relaxed max-w-lg">
                Professional risk management platform. Track your R-Multiples, calculate expectancy, and monitor your exact position sizing in real-time.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-5">
              <FeatureItem icon={Target} title="Position Sizing Engine" desc="Auto-calculates perfect quantity based on your specific R-value and SL distance." />
              <FeatureItem icon={TrendingUp} title="Expectancy Matrix" desc="Know your mathematical edge before you take the next trade in the market." />
              <FeatureItem icon={ShieldCheck} title="Strict Risk Control" desc="Monitor Total Open Risk (TOR) to protect your capital from market crashes." />
            </div>
          </div>

          {/* RIGHT SIDE: Signup Form */}
          <div className="w-full max-w-md mx-auto lg:ml-auto relative">
            {/* Glowing Border Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#8458B3] to-[#a0d2eb] rounded-[2.5rem] blur opacity-20"></div>
            
            <div className="relative bg-white/70 backdrop-blur-xl border-2 border-[#d0bdf4] p-8 sm:p-10 rounded-[2rem] shadow-lg">
              <h3 className="text-2xl font-black text-[#8458B3] mb-1 tracking-tight" style={{ fontStyle: 'normal' }}>Create Account</h3>
              <p className="text-sm font-semibold text-[#a28089] mb-8">Join our professional trading community</p>

              {/* SUCCESS MESSAGE */}
              {success && (
                <div className="mb-6 p-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl flex items-start gap-3">
                  <CheckCircle className="text-emerald-600 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-sm font-bold text-emerald-700 mb-1">Account Created!</p>
                    <p className="text-xs text-emerald-600">Your account is pending admin approval. You'll receive an email notification once approved. Redirecting to login...</p>
                  </div>
                </div>
              )}

              {/* ERROR MESSAGE */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
                  <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                  <p className="text-xs font-bold text-red-600">{error}</p>
                </div>
              )}

              {/* APPROVAL MESSAGE */}
              {!success && (
                <div className="mb-6 p-4 bg-[#a0d2eb]/20 border-2 border-[#a0d2eb] rounded-xl">
                  <p className="text-xs font-semibold text-[#8458B3] text-center">
                    ✓ Your account will be activated after admin approval
                  </p>
                </div>
              )}

              <form onSubmit={handleSignup} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-black text-[#8458B3] uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 text-[#a28089]" size={18} />
                    <input 
                      type="email" 
                      required 
                      disabled={loading}
                      placeholder="your@email.com"
                      className="w-full bg-white border-2 border-[#d0bdf4] pl-11 p-3.5 rounded-xl text-sm font-bold text-[#1a1a2e] outline-none focus:border-[#8458B3] focus:ring-2 focus:ring-[#8458B3]/30 disabled:opacity-50 transition-all"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-[#8458B3] uppercase tracking-widest ml-1">Password</label>
                  <div className="relative">
                    <Key className="absolute left-4 top-3.5 text-[#a28089]" size={18} />
                    <input 
                      type="password" 
                      required 
                      disabled={loading}
                      placeholder="Minimum 6 characters"
                      className="w-full bg-white border-2 border-[#d0bdf4] pl-11 p-3.5 rounded-xl text-sm font-bold text-[#1a1a2e] outline-none focus:border-[#8458B3] focus:ring-2 focus:ring-[#8458B3]/30 disabled:opacity-50 transition-all"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-[#8458B3] uppercase tracking-widest ml-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 text-[#a28089]" size={18} />
                    <input 
                      type="password" 
                      required 
                      disabled={loading}
                      placeholder="Confirm password"
                      className="w-full bg-white border-2 border-[#d0bdf4] pl-11 p-3.5 rounded-xl text-sm font-bold text-[#1a1a2e] outline-none focus:border-[#8458B3] focus:ring-2 focus:ring-[#8458B3]/30 disabled:opacity-50 transition-all"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button 
                  disabled={loading || success} 
                  type="submit" 
                  className="w-full mt-2 bg-gradient-to-r from-[#8458B3] to-[#a0d2eb] hover:from-[#a0d2eb] hover:to-[#8458B3] disabled:opacity-50 disabled:cursor-not-allowed text-white p-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  {loading ? 'Creating Account...' : 'Create Account'} {!loading && !success && <ArrowRight size={16} />}
                </button>
              </form>

              {/* DIVIDER */}
              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t-2 border-[#d0bdf4]"></div></div>
                <span className="relative bg-white/70 px-4 text-xs font-black text-[#a28089] uppercase">Already have an account?</span>
              </div>

              {/* LOGIN LINK */}
              <Link 
                to="/login" 
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-[#f8fafc] text-[#8458B3] font-black py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg border-2 border-[#d0bdf4] uppercase text-xs tracking-wider"
              >
                Sign In Instead
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 text-center pb-8 pt-4">
        <p className="text-xs font-semibold text-[#a28089]">© 2026 R Trades Journal. Institutional Grade Trading System.</p>
      </footer>
    </div>
  );
}

const FeatureItem = ({ icon: Icon, title, desc }) => (
  <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/40 transition-colors duration-200 border border-transparent hover:border-[#d0bdf4]">
    <div className="bg-white p-3 rounded-xl shadow-sm border-2 border-[#d0bdf4]">
      <Icon className="text-[#8458B3]" size={24} />
    </div>
    <div>
      <h4 className="text-sm font-black text-[#1a1a2e]" style={{ fontStyle: 'normal' }}>{title}</h4>
      <p className="text-xs font-medium text-[#a28089] mt-1 leading-relaxed">{desc}</p>
    </div>
  </div>
);