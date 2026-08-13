import React, { useState } from 'react';
import { Search, Calendar, MapPin, Clock, Users, UserPlus, Eye, CheckCircle2, Ticket, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { EventItem } from '../types';

interface UserDashboardProps {
  events: EventItem[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onViewDetails: (event: EventItem) => void;
  onRegister: (event: EventItem) => void;
  registeredEventIds: number[];
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  events,
  loading,
  error,
  onRefresh,
  onViewDetails,
  onRegister,
  registeredEventIds,
}) => {
  const [search, setSearch] = useState('');
  const [seatFilter, setSeatFilter] = useState<'all' | 'available' | 'full'>('all');
  const [viewTab, setViewTab] = useState<'all' | 'my_registrations'>('all');

  // Filter events
  const filteredEvents = events.filter((e) => {
    // Check search query
    const matchesSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase()) ||
      (e.description && e.description.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;

    // Check my registrations tab
    if (viewTab === 'my_registrations') {
      if (!registeredEventIds.includes(e.id)) return false;
    }

    // Check seat availability filter
    if (seatFilter === 'available') return e.available_seats > 0;
    if (seatFilter === 'full') return e.available_seats <= 0;

    return true;
  });

  const myRegisteredCount = registeredEventIds.length;
  const availableSeatsCount = events.reduce((acc, e) => acc + Math.max(0, e.available_seats), 0);

  return (
    <div className="space-y-6">
      {/* Banner / Hero for Users */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" /> User & Attendee Portal
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Discover Upcoming Events & Register Instantly
          </h2>
          <p className="text-sm text-indigo-200/90 leading-relaxed">
            Browse through published events created by organizers, check live seat availability, and apply for your ticket in seconds.
          </p>
        </div>

        {/* Stats strip inside hero */}
        <div className="mt-6 pt-6 border-t border-indigo-700/50 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-indigo-300 block font-medium">Published Events</span>
            <span className="text-xl font-extrabold text-white">{events.length}</span>
          </div>
          <div>
            <span className="text-indigo-300 block font-medium">Available Seats Left</span>
            <span className="text-xl font-extrabold text-white">{availableSeatsCount}</span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="text-indigo-300 block font-medium">My Registrations</span>
            <span className="text-xl font-extrabold text-emerald-400">{myRegisteredCount} Event(s)</span>
          </div>
        </div>
      </div>

      {/* Tabs & Search Filter Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          {/* Main User Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewTab('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                viewTab === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>All Events</span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] ${viewTab === 'all' ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {events.length}
              </span>
            </button>

            <button
              onClick={() => setViewTab('my_registrations')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                viewTab === 'my_registrations'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>My Registrations</span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] ${viewTab === 'my_registrations' ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {myRegisteredCount}
              </span>
            </button>
          </div>

          <button
            onClick={onRefresh}
            className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200/80 transition-colors self-end sm:self-auto flex items-center gap-1.5 text-xs font-semibold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
            <span>Refresh List</span>
          </button>
        </div>

        {/* Search and Seat Filters */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events by title, description, or location..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 placeholder-slate-400"
            />
          </div>

          <div className="inline-flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600 self-start md:self-auto">
            <button
              onClick={() => setSeatFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                seatFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              All Seats
            </button>
            <button
              onClick={() => setSeatFilter('available')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                seatFilter === 'available' ? 'bg-white text-emerald-700 shadow-2xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              Available Only
            </button>
            <button
              onClick={() => setSeatFilter('full')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                seatFilter === 'full' ? 'bg-white text-red-700 shadow-2xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              Full
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid of Events for Users */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 font-medium text-sm">Fetching events from database...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3 shadow-2xs">
          <Ticket className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            {viewTab === 'my_registrations'
              ? "You haven't registered for any events yet."
              : 'No matching events found.'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {viewTab === 'my_registrations'
              ? 'Switch to "All Events" above, select an event, and click "Apply / Register" to secure your ticket.'
              : 'Try adjusting your search keywords or seat status filter.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const isFull = event.available_seats <= 0;
            const isRegistered = registeredEventIds.includes(event.id);

            return (
              <div
                key={event.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
              >
                {/* Event Photo / Banner */}
                {event.image_url ? (
                  <div className="relative h-44 w-full overflow-hidden bg-slate-900 group">
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
                    
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider backdrop-blur-md flex items-center gap-1 shadow-md ${
                          isFull
                            ? 'bg-red-900/80 text-red-200 border border-red-500/40'
                            : 'bg-emerald-950/80 text-emerald-200 border border-emerald-500/40'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isFull ? 'bg-red-400' : 'bg-emerald-400'}`} />
                        {isFull ? 'Event Full' : `${event.available_seats} Seats Left`}
                      </span>

                      {isRegistered && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-600 text-white border border-emerald-400 flex items-center gap-1 shadow-md backdrop-blur-md">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Registered
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="relative h-28 w-full bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-800 p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                          isFull
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isFull ? 'bg-red-500' : 'bg-emerald-500'}`} />
                        {isFull ? 'Event Full' : `${event.available_seats} Seats Available`}
                      </span>

                      {isRegistered && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1 shadow-2xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Registered
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3
                      onClick={() => onViewDetails(event)}
                      className="text-base font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 cursor-pointer transition-colors"
                    >
                      {event.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 min-h-[32px] leading-relaxed">
                      {event.description || 'No description provided.'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600 font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>{event.date}</span>
                      <span className="text-slate-300">•</span>
                      <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>{event.time}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-500 line-clamp-1">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>{event.location}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-500">
                      <Users className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>
                        Capacity: <strong className="text-slate-700">{event.registered_count}</strong> / {event.max_attendees}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3 text-xs font-semibold">
                  <button
                    onClick={() => onViewDetails(event)}
                    className="py-2 px-3 rounded-xl text-slate-700 hover:bg-slate-200/60 border border-slate-200/80 transition-colors flex items-center justify-center gap-1.5 text-xs font-semibold"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" /> Details
                  </button>

                  <button
                    disabled={isFull || isRegistered}
                    onClick={() => onRegister(event)}
                    className={`py-2 px-4 rounded-xl text-white transition-all flex items-center justify-center gap-1.5 text-xs font-bold shadow-2xs ${
                      isRegistered
                        ? 'bg-emerald-600 cursor-default opacity-90'
                        : isFull
                        ? 'bg-slate-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
                    }`}
                  >
                    {isRegistered ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Registered
                      </>
                    ) : isFull ? (
                      'Event Full'
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" /> Apply / Register
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
