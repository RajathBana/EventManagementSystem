import React, { useState, useEffect } from 'react';
import { X, User, Mail, UserCheck, AlertCircle, Calendar, MapPin } from 'lucide-react';
import { EventItem, UserAccount } from '../types';

interface RegistrationModalProps {
  isOpen: boolean;
  event: EventItem | null;
  currentUser?: UserAccount | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  event,
  currentUser,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
    }
  }, [currentUser, isOpen]);

  if (!isOpen || !event) return null;

  const isFull = event.available_seats <= 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/events/${event.id}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to register');
      }

      setName('');
      setEmail('');
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/50 to-purple-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-indigo-600" /> Event Registration
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Secure your ticket for <strong className="text-slate-700">{event.title}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Quick Event Info Box */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-2 font-medium text-slate-800">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              <span>{event.date} at {event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-indigo-500" />
              <span>{event.location}</span>
            </div>
            <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between font-semibold">
              <span className="text-slate-500">Available Seats:</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${isFull ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'}`}>
                {event.available_seats} / {event.max_attendees} remaining
              </span>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {isFull ? (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm text-center font-medium">
              This event has reached its maximum capacity of {event.max_attendees} attendees. No further registrations are accepted.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" /> Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. john@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 text-sm"
                  required
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Note: Each email address can register only once for this event.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Confirm Registration'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
