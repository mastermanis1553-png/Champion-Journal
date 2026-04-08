import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, Mail, Lock, AlertCircle } from 'lucide-react';

export default function Login() {
  const { loginWithEmail, loginWithGoogle, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter email and password.');
      return;
    }

    try {
      setLoading(true);
      await loginWithEmail(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      setLoading(true);
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-3xl font-black text-[#8458B3] uppercase tracking-tight" style={{ fontStyle: 'normal' }}>
            R Trades <span className="text-[#a0d2eb]">Terminal</span>
          </h1>
          <p className="text-sm text-[#a28089] mt-2 font-medium">Professional Trading Journal</p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl border-2 border-[#d0bdf4] p-8 rounded-[2rem] shadow-lg">
          {/* ERROR MESSAGE */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
              <div>
                <p className="text-sm font-bold text-red-700 mb-1">Login Failed</p>
                <p className="text-xs text-red-600">{error}</p>
              </div>
            </div>
          )}
          
          {/* EMAIL FORM */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-4 text-[#a28089]" size={18} />
              <input 
                type="email" 
                placeholder="Email Address"
                disabled={loading}
                className="w-full bg-white border-2 border-[#d0bdf4] p-4 pl-12 rounded-xl text-sm focus:border-[#8458B3] focus:outline-none focus:ring-2 focus:ring-[#8458B3]/30 text-[#1a1a2e] font-medium transition-all duration-200 disabled:opacity-50"
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-4 text-[#a28089]" size={18} />
              <input 
                type="password" 
                placeholder="Secure Password"
                disabled={loading}
                className="w-full bg-white border-2 border-[#d0bdf4] p-4 pl-12 rounded-xl text-sm focus:border-[#8458B3] focus:outline-none focus:ring-2 focus:ring-[#8458B3]/30 text-[#1a1a2e] font-medium transition-all duration-200 disabled:opacity-50"
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#8458B3] hover:bg-[#a0d2eb] hover:text-[#8458B3] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl uppercase text-sm tracking-wider"
            >
              {loading ? 'Signing In...' : 'LOGIN TO TERMINAL'}
            </button>
          </form>

          <div className="relative my-8 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t-2 border-[#d0bdf4]"></div></div>
            <span className="relative bg-white/70 px-4 text-xs font-black text-[#a28089] uppercase">Or Continue with</span>
          </div>

          {/* GOOGLE BUTTON */}
          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-[#f0f0f0] disabled:opacity-50 disabled:cursor-not-allowed text-[#1a1a2e] font-black py-4 rounded-xl transition-all duration-200 active:scale-95 shadow-md hover:shadow-lg border-2 border-[#d0bdf4] uppercase text-xs tracking-wider"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            {loading ? 'SIGNING IN...' : 'GOOGLE AUTH'}
          </button>

          {/* NEW USER LINK */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t-2 border-[#d0bdf4]"></div></div>
            <span className="relative bg-white/70 px-4 text-xs font-black text-[#a28089] uppercase">New to R Trades?</span>
          </div>

          <Link 
            to="/" 
            className="w-full flex items-center justify-center bg-gradient-to-r from-[#8458B3]/20 to-[#a0d2eb]/20 hover:from-[#8458B3]/40 hover:to-[#a0d2eb]/40 text-[#8458B3] font-black py-3 rounded-xl transition-all duration-200 border-2 border-[#d0bdf4] uppercase text-xs tracking-wider"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}