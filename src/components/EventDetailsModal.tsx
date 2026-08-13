import React from 'react';
import { X, Calendar, Clock, MapPin, Users, Ticket, UserPlus, CheckCircle } from 'lucide-react';
import { EventItem } from '../types';

interface EventDetailsModalProps {
  isOpen: boolean;
  event: EventItem | null;
  onClose: () => void;
  onOpenRegister: (event: EventItem) => void;
  onOpenAttendees: (event: EventItem) => void;
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  isOpen,
  event,
  onClose,
  onOpenRegister,
  onOpenAttendees,
}) => {
  if (!isOpen || !event) return null;

  const isFull = event.available_seats <= 0;
  const occupancyPercent = Math.min(100, Math.round((event.registered_count / event.max_attendees) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Banner Photo if available */}
        {event.image_url ? (
          <div className="relative h-48 w-full overflow-hidden bg-slate-900">
            <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-2 rounded-xl text-white/80 hover:text-white bg-black/40 hover:bg-black/60 backdrop-blur-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="absolute bottom-4 left-6 right-6">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500 text-white mb-1.5 shadow-xs">
                Event Details
              </span>
              <h2 className="text-xl font-bold text-white leading-snug drop-shadow-md">{event.title}</h2>
            </div>
          </div>
        ) : (
          <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between bg-gradient-to-br from-indigo-50/70 to-slate-50">
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 mb-2">
                Event Details
              </span>
              <h2 className="text-xl font-bold text-slate-800 leading-snug">{event.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Description */}
          {event.description ? (
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              {event.description}
            </p>
          ) : (
            <p className="text-sm text-slate-400 italic">No description provided for this event.</p>
          )}

          {/* Key Parameters */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-100 bg-white shadow-2xs space-y-1">
              <span className="text-slate-400 font-medium flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Date
              </span>
              <p className="font-semibold text-slate-800 text-sm">{event.date}</p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-100 bg-white shadow-2xs space-y-1">
              <span className="text-slate-400 font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-500" /> Time
              </span>
              <p className="font-semibold text-slate-800 text-sm">{event.time}</p>
            </div>

            <div className="col-span-2 p-3.5 rounded-xl border border-slate-100 bg-white shadow-2xs space-y-1">
              <span className="text-slate-400 font-medium flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-500" /> Location
              </span>
              <p className="font-semibold text-slate-800 text-sm">{event.location}</p>
            </div>
          </div>

          {/* Seat Capacity Gauge */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Ticket className="w-4 h-4 text-indigo-600" /> Attendance Capacity
              </span>
              <span className="font-bold text-slate-800">
                {event.registered_count} / {event.max_attendees} Seats
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  isFull ? 'bg-red-500' : occupancyPercent > 80 ? 'bg-amber-500' : 'bg-indigo-600'
                }`}
                style={{ width: `${occupancyPercent}%` }}
              />
            </div>

            <div className="flex justify-between text-[11px] text-slate-500">
              <span>{event.available_seats} available seats</span>
              <span>{occupancyPercent}% occupied</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              onOpenAttendees(event);
            }}
            className="px-4 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/60 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5" /> View Attendees
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors"
            >
              Close
            </button>
            <button
              disabled={isFull}
              onClick={() => {
                onClose();
                onOpenRegister(event);
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:bg-slate-400"
            >
              <UserPlus className="w-3.5 h-3.5" />
              {isFull ? 'Event Full' : 'Register Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
