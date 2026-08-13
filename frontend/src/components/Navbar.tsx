import React from 'react';
import { UserCheck, ShieldCheck, Plus, LogIn, LogOut } from 'lucide-react';
import { UserAccount } from '../types';

interface NavbarProps {
  onOpenCreateModal: () => void;
  currentUser: UserAccount | null;
  onOpenAuthModal: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCreateModal,
  currentUser,
  onOpenAuthModal,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand logo & title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 font-extrabold text-xl">
            E
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">EventHub</h1>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-indigo-50 text-indigo-700 border border-indigo-100">
                MVP
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              Multi-Role Event Management Platform
            </p>
          </div>
        </div>

        {/* Current Portal Indicator */}
        {currentUser ? (
          <div className="flex items-center gap-2 bg-slate-100/80 px-3.5 py-1.5 rounded-2xl border border-slate-200/60 text-xs font-bold">
            {currentUser.role === 'creator' ? (
              <span className="flex items-center gap-1.5 text-purple-700">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>Creator Console</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-indigo-700">
                <UserCheck className="w-4 h-4 text-indigo-600" />
                <span>User Dashboard</span>
              </span>
            )}
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-100/80 px-3 py-1 rounded-full border border-slate-200/60">
            <span>Authentication Gateway</span>
          </div>
        )}

        {/* User Account State & Actions */}
        <div className="flex items-center gap-2.5">
          {currentUser ? (
            <div className="flex items-center gap-2 bg-slate-50 p-1.5 pl-3 rounded-2xl border border-slate-200/80">
              <div className="text-right hidden md:block">
                <span className="block text-xs font-bold text-slate-800 line-clamp-1">{currentUser.name}</span>
                <span className="block text-[10px] text-slate-500 line-clamp-1">{currentUser.email}</span>
              </div>
              
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                currentUser.role === 'creator' ? 'bg-purple-100 text-purple-700' : 'bg-indigo-100 text-indigo-700'
              }`}>
                {currentUser.role}
              </span>

              <button
                onClick={onLogout}
                className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In Portal</span>
            </button>
          )}

          {currentUser?.role === 'creator' && (
            <button
              onClick={onOpenCreateModal}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 hover:shadow-lg transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Create Event</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
