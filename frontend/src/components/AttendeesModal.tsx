import React, { useState, useEffect } from 'react';
import { X, Users, Search, Mail, Calendar, UserCheck, RefreshCw } from 'lucide-react';
import { EventItem, Attendee } from '../types';

interface AttendeesModalProps {
  isOpen: boolean;
  event: EventItem | null;
  onClose: () => void;
}

export const AttendeesModal: React.FC<AttendeesModalProps> = ({
  isOpen,
  event,
  onClose,
}) => {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const fetchAttendees = async () => {
    if (!event) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/events/${event.id}/attendees`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to load attendees');
      }

      setAttendees(data.attendees || []);
    } catch (err: any) {
      setError(err.message || 'Error loading attendee list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && event) {
      fetchAttendees();
    } else {
      setAttendees([]);
      setSearch('');
    }
  }, [isOpen, event]);

  if (!isOpen || !event) return null;

  const filteredAttendees = attendees.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh]">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-bold text-slate-800">Registered Attendees</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Event: <strong className="text-slate-700">{event.title}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 bg-slate-50/40 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search attendee by name or email..."
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
            />
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100/60">
              Total: {attendees.length} / {event.max_attendees} seats
            </span>
            <button
              onClick={fetchAttendees}
              className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200/80 transition-colors"
              title="Refresh Attendees"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              Loading registered attendees...
            </div>
          ) : filteredAttendees.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <UserCheck className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-slate-600 font-medium text-sm">
                {search ? 'No attendees match your search query.' : 'No attendees registered yet for this event.'}
              </p>
              <p className="text-xs text-slate-400">
                Share the event page to start receiving attendee registrations.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Registration Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {filteredAttendees.map((attendee, idx) => (
                    <tr key={attendee.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{attendee.name}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 text-slate-600">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          {attendee.email}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(attendee.registered_at).toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-2xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
