import React, { useState } from 'react';
import { UserCheck, ShieldCheck, Mail, Lock, User, LogIn, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { UserAccount } from '../types';

interface LoginLandingProps {
  onLoginSuccess: (user: UserAccount) => void;
}

export const LoginLanding: React.FC<LoginLandingProps> = ({ onLoginSuccess }) => {
  // User Form State
  const [userIsSignUp, setUserIsSignUp] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userError, setUserError] = useState<string | null>(null);

  // Creator Form State
  const [creatorIsSignUp, setCreatorIsSignUp] = useState(false);
  const [creatorName, setCreatorName] = useState('');
  const [creatorEmail, setCreatorEmail] = useState('');
  const [creatorPassword, setCreatorPassword] = useState('');
  const [creatorError, setCreatorError] = useState<string | null>(null);

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserError(null);

    if (!userEmail || !userPassword) {
      setUserError('Please fill in both email and password.');
      return;
    }
    if (userIsSignUp && !userName) {
      setUserError('Please enter your full name.');
      return;
    }
    if (!userEmail.includes('@')) {
      setUserError('Please enter a valid Gmail / Email address.');
      return;
    }

    const newUser: UserAccount = {
      id: `usr_${Date.now()}`,
      name: userIsSignUp ? userName : (userEmail.split('@')[0].replace('.', ' ') || 'Registered User'),
      email: userEmail.toLowerCase(),
      role: 'user',
    };

    onLoginSuccess(newUser);
  };

  const handleCreatorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCreatorError(null);

    if (!creatorEmail || !creatorPassword) {
      setCreatorError('Please fill in both email and password.');
      return;
    }
    if (creatorIsSignUp && !creatorName) {
      setCreatorError('Please enter your full name.');
      return;
    }
    if (!creatorEmail.includes('@')) {
      setCreatorError('Please enter a valid Gmail / Email address.');
      return;
    }

    const newCreator: UserAccount = {
      id: `crt_${Date.now()}`,
      name: creatorIsSignUp ? creatorName : (creatorEmail.split('@')[0].replace('.', ' ') || 'Event Organizer'),
      email: creatorEmail.toLowerCase(),
      role: 'creator',
    };

    onLoginSuccess(newCreator);
  };

  const handleQuickDemoLogin = (role: 'user' | 'creator') => {
    if (role === 'user') {
      onLoginSuccess({
        id: 'usr_attendee_demo',
        name: 'Alex Morgan',
        email: 'alex.morgan@gmail.com',
        role: 'user',
      });
    } else {
      onLoginSuccess({
        id: 'usr_creator_demo',
        name: 'Sarah Connor',
        email: 'sarah.creator@gmail.com',
        role: 'creator',
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-12 space-y-10">
      {/* Header Banner */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 border border-indigo-200">
          <Sparkles className="w-3.5 h-3.5" /> Portal Authentication
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Welcome to EventHub
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Please log in or sign up with your account to access your dedicated dashboard.
        </p>
      </div>

      {/* Two Dedicated Portal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* User / Attendee Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden flex flex-col justify-between group hover:border-indigo-300 transition-all duration-300">
          <div>
            {/* Card Header */}
            <div className="bg-gradient-to-r from-indigo-700 to-slate-900 p-6 text-white relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-indigo-500/20 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white border border-white/20">
                  Attendee Portal
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md text-indigo-200 border border-white/10">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white">User & Attendee Login</h3>
                  <p className="text-xs text-indigo-100/80">Browse events and register instantly</p>
                </div>
              </div>
            </div>

            {/* Form Area */}
            <div className="p-6 space-y-4">
              {userError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                  {userError}
                </div>
              )}

              <form onSubmit={handleUserSubmit} className="space-y-3.5">
                {userIsSignUp && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="e.g. Alex Morgan"
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
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="alex.morgan@gmail.com"
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
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 placeholder-slate-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{userIsSignUp ? 'Sign Up & Access User Dashboard' : 'Log In to User Dashboard'}</span>
                </button>
              </form>

              <div className="text-center pt-2 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  {userIsSignUp ? 'Already have a User account?' : "Don't have an Attendee account?"}{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setUserIsSignUp(!userIsSignUp);
                      setUserError(null);
                    }}
                    className="font-bold text-indigo-600 hover:text-indigo-700 underline ml-1"
                  >
                    {userIsSignUp ? 'Log In' : 'Sign Up'}
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Quick Demo Footer Button for User */}
          <div className="p-4 bg-slate-50 border-t border-slate-100">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('user')}
              className="w-full py-2.5 px-4 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-2xs"
            >
              <UserCheck className="w-4 h-4 text-indigo-600" />
              <span>⚡ One-Click Login as Demo User (Alex)</span>
            </button>
          </div>
        </div>

        {/* Event Creator Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden flex flex-col justify-between group hover:border-purple-300 transition-all duration-300">
          <div>
            {/* Card Header */}
            <div className="bg-gradient-to-r from-purple-800 to-indigo-900 p-6 text-white relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-purple-500/20 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white border border-white/20">
                  Creator Console
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md text-purple-200 border border-white/10">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white">Event Creator Login</h3>
                  <p className="text-xs text-purple-100/80">Publish events and track attendee lists</p>
                </div>
              </div>
            </div>

            {/* Form Area */}
            <div className="p-6 space-y-4">
              {creatorError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                  {creatorError}
                </div>
              )}

              <form onSubmit={handleCreatorSubmit} className="space-y-3.5">
                {creatorIsSignUp && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Full Name / Organization</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={creatorName}
                        onChange={(e) => setCreatorName(e.target.value)}
                        placeholder="e.g. Sarah Connor"
                        className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800 placeholder-slate-400"
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
                      value={creatorEmail}
                      onChange={(e) => setCreatorEmail(e.target.value)}
                      placeholder="sarah.creator@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800 placeholder-slate-400"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={creatorPassword}
                      onChange={(e) => setCreatorPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800 placeholder-slate-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{creatorIsSignUp ? 'Sign Up & Access Creator Console' : 'Log In to Creator Dashboard'}</span>
                </button>
              </form>

              <div className="text-center pt-2 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  {creatorIsSignUp ? 'Already registered as Creator?' : 'New Event Organizer?'}{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setCreatorIsSignUp(!creatorIsSignUp);
                      setCreatorError(null);
                    }}
                    className="font-bold text-purple-600 hover:text-purple-700 underline ml-1"
                  >
                    {creatorIsSignUp ? 'Log In' : 'Sign Up'}
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Quick Demo Footer Button for Creator */}
          <div className="p-4 bg-slate-50 border-t border-slate-100">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('creator')}
              className="w-full py-2.5 px-4 rounded-xl bg-white border border-slate-200 hover:border-purple-300 text-slate-700 hover:text-purple-700 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-2xs"
            >
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>⚡ One-Click Login as Demo Creator (Sarah)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
