import React, { useState } from 'react';
import { Plus, Search, Calendar, Users, Edit2, Trash2, List, ShieldCheck, Ticket, AlertCircle, RefreshCw, BarChart2 } from 'lucide-react';
import { EventItem } from '../types';

interface CreatorDashboardProps {
  events: EventItem[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onOpenCreateModal: () => void;
  onOpenEditModal: (event: EventItem) => void;
  onOpenDeleteModal: (event: EventItem) => void;
  onOpenAttendeesModal: (event: EventItem) => void;
  onViewDetailsModal: (event: EventItem) => void;
}

export const CreatorDashboard: React.FC<CreatorDashboardProps> = ({
  events,
  loading,
  error,
  onRefresh,
  onOpenCreateModal,
  onOpenEditModal,
  onOpenDeleteModal,
  onOpenAttendeesModal,
  onViewDetailsModal,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'full'>('all');

  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase()) ||
      (e.description && e.description.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;

    if (statusFilter === 'available') return e.available_seats > 0;
    if (statusFilter === 'full') return e.available_seats <= 0;

    return true;
  });

  const totalEvents = events.length;
  const totalRegistrations = events.reduce((sum, e) => sum + e.registered_count, 0);
  const totalCapacity = events.reduce((sum, e) => sum + e.max_attendees, 0);
  const overallOccupancy = totalCapacity > 0 ? Math.round((totalRegistrations / totalCapacity) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Banner / Hero for Event Creators */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/30 text-purple-200 border border-purple-400/30 backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-300" /> Event Creator & Admin Console
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              Create, Manage & Track Attendees
            </h2>
            <p className="text-sm text-purple-200/90 leading-relaxed">
              Publish new events to the User Dashboard, update capacities, monitor live registrations, and inspect registered attendee lists in real-time.
            </p>
          </div>

          <button
            onClick={onOpenCreateModal}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-purple-500/30 hover:shadow-xl transition-all flex items-center justify-center gap-2.5 shrink-0 self-start md:self-auto"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>Create New Event</span>
          </button>
        </div>

        {/* Analytics Summary */}
        <div className="mt-6 pt-6 border-t border-purple-700/50 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-white/5 backdrop-blur-xs p-3 rounded-xl border border-white/10">
            <span className="text-purple-300 block font-medium">Total Events Created</span>
            <span className="text-2xl font-extrabold text-white mt-0.5">{totalEvents}</span>
          </div>
          <div className="bg-white/5 backdrop-blur-xs p-3 rounded-xl border border-white/10">
            <span className="text-purple-300 block font-medium">Registered Attendees</span>
            <span className="text-2xl font-extrabold text-white mt-0.5">{totalRegistrations}</span>
          </div>
          <div className="bg-white/5 backdrop-blur-xs p-3 rounded-xl border border-white/10">
            <span className="text-purple-300 block font-medium">Total Capacity</span>
            <span className="text-2xl font-extrabold text-white mt-0.5">{totalCapacity}</span>
          </div>
          <div className="bg-white/5 backdrop-blur-xs p-3 rounded-xl border border-white/10">
            <span className="text-purple-300 block font-medium">Overall Occupancy</span>
            <span className="text-2xl font-extrabold text-amber-300 mt-0.5">{overallOccupancy}%</span>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search created events by title, description, or location..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800 placeholder-slate-400"
          />
        </div>

        <div className="flex items-center justify-between md:justify-end gap-3">
          <div className="inline-flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setStatusFilter('available')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'available' ? 'bg-white text-emerald-700 shadow-2xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              Seats Open
            </button>
            <button
              onClick={() => setStatusFilter('full')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'full' ? 'bg-white text-red-700 shadow-2xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              Full Capacity
            </button>
          </div>

          <button
            onClick={onRefresh}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
            title="Refresh Events"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-purple-600' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* List / Cards for Creator */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 font-medium text-sm">Loading event management data...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-4 shadow-2xs">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
            <BarChart2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">No Events Found in Creator Console</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
              {search
                ? 'No events match your current search query or capacity filter.'
                : 'Get started by creating your first event. Once created, it will automatically appear on the User Dashboard.'}
            </p>
          </div>
          {!search && (
            <button
              onClick={onOpenCreateModal}
              className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-semibold text-xs shadow-md shadow-purple-500/20 hover:bg-purple-700 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Create First Event
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const isFull = event.available_seats <= 0;
            const fillPercentage = Math.min(100, Math.round((event.registered_count / event.max_attendees) * 100));

            return (
              <div
                key={event.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-5 space-y-3">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                        isFull
                          ? 'bg-red-100 text-red-700 border border-red-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isFull ? 'bg-red-500' : 'bg-emerald-500'}`} />
                      {isFull ? 'Full' : `${event.available_seats} Seats Left`}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onOpenEditModal(event)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                        title="Edit Event"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onOpenDeleteModal(event)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete Event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3
                    onClick={() => onViewDetailsModal(event)}
                    className="text-base font-bold text-slate-800 line-clamp-1 group-hover:text-purple-600 cursor-pointer transition-colors"
                  >
                    {event.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 min-h-[32px] leading-relaxed">
                    {event.description || 'No description provided.'}
                  </p>

                  <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                    <div className="flex items-center justify-between font-semibold text-slate-700">
                      <span className="flex items-center gap-1 text-slate-500 font-normal">
                        <Users className="w-3.5 h-3.5 text-purple-500" /> Attendance:
                      </span>
                      <span>
                        <strong className="text-purple-700">{event.registered_count}</strong> / {event.max_attendees} ({fillPercentage}%)
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          isFull ? 'bg-red-500' : fillPercentage > 80 ? 'bg-amber-500' : 'bg-purple-600'
                        }`}
                        style={{ width: `${fillPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Creator Control Buttons */}
                <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs font-semibold">
                  <button
                    onClick={() => onOpenAttendeesModal(event)}
                    className="py-2 px-3 rounded-xl text-purple-700 bg-purple-50 hover:bg-purple-100/80 border border-purple-200/60 transition-colors flex items-center justify-center gap-1.5 text-xs"
                  >
                    <List className="w-3.5 h-3.5 text-purple-600" />
                    <span>View Attendees</span>
                  </button>

                  <button
                    onClick={() => onOpenEditModal(event)}
                    className="py-2 px-3 rounded-xl text-slate-700 hover:bg-slate-200/60 border border-slate-200/80 transition-colors flex items-center justify-center gap-1.5 text-xs"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Edit Details</span>
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
