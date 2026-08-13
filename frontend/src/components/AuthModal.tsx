import React, { useState } from 'react';
import { X, Mail, Lock, User, ShieldCheck, UserCheck, ArrowRight, LogIn, Sparkles, CheckCircle2 } from 'lucide-react';
import { UserAccount } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
  initialRole?: 'user' | 'creator';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialRole = 'user',
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState<'user' | 'creator'>(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (isSignUp && !name) {
      setError('Please enter your full name.');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid Gmail / Email address.');
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    // Construct logged in user
    const newUser: UserAccount = {
      id: `usr_${Date.now()}`,
      name: isSignUp ? name : (email.split('@')[0].replace('.', ' ') || 'Registered User'),
      email: email.toLowerCase(),
      role: role,
    };

    onLoginSuccess(newUser);
    onClose();
  };

  const handleDemoLogin = (demoRole: 'user' | 'creator') => {
    if (demoRole === 'creator') {
      onLoginSuccess({
        id: 'usr_creator_demo',
        name: 'Sarah Connor (Event Creator)',
        email: 'sarah.creator@gmail.com',
        role: 'creator',
      });
    } else {
      onLoginSuccess({
        id: 'usr_attendee_demo',
        name: 'Alex Morgan (Event Attendee)',
        email: 'alex.morgan@gmail.com',
        role: 'user',
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 relative">
        {/* Header */}
        <div className={`p-6 text-white relative overflow-hidden ${
          role === 'creator' 
            ? 'bg-gradient-to-r from-purple-800 to-indigo-900' 
            : 'bg-gradient-to-r from-indigo-700 to-slate-900'
        }`}>
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white/80 hover:text-white hover:bg-black/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/20">
              {role === 'creator' ? 'Creator Portal' : 'User Portal'}
            </span>
          </div>

          <h3 className="text-2xl font-black text-white">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h3>
          <p className="text-xs text-indigo-100/80 mt-1">
            {isSignUp 
              ? `Sign up as an ${role === 'creator' ? 'Event Creator' : 'Event Attendee'} to manage or join events.`
              : `Sign in with your email and password to access your ${role === 'creator' ? 'Creator' : 'User'} dashboard.`}
          </p>
        </div>

        <div className="p-6 space-y-5">
          {/* Role Toggle Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 block">Select Account Type:</label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setRole('user')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  role === 'user'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>User (Attendee)</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('creator')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  role === 'creator'
                    ? 'bg-white text-purple-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Event Creator</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah Connor"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 placeholder-slate-400"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Gmail / Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 placeholder-slate-400"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 placeholder-slate-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-3 rounded-xl font-bold text-xs text-white shadow-md transition-all flex items-center justify-center gap-2 ${
                role === 'creator'
                  ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/20'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>{isSignUp ? `Sign Up as ${role === 'creator' ? 'Creator' : 'User'}` : 'Log In'}</span>
            </button>
          </form>

          {/* Toggle Login / SignUp */}
          <div className="text-center pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              {isSignUp ? 'Already have an account?' : "Don't have an account yet?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                }}
                className="font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-2 ml-1"
              >
                {isSignUp ? 'Log In' : 'Sign Up'}
              </button>
            </p>
          </div>

          {/* Quick Demo Access */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 block text-center uppercase tracking-wider">
              ⚡ Quick Demo Account Login
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('user')}
                className="py-1.5 px-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
              >
                <UserCheck className="w-3 h-3 text-indigo-500" />
                <span>Demo User</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('creator')}
                className="py-1.5 px-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-purple-50 hover:text-purple-700 text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
              >
                <ShieldCheck className="w-3 h-3 text-purple-500" />
                <span>Demo Creator</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
