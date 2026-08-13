import React from 'react';
import { Calendar, Clock, MapPin, Users, Eye, Edit2, Trash2, UserPlus, List } from 'lucide-react';
import { EventItem } from '../types';

interface EventCardProps {
  event: EventItem;
  onView: (event: EventItem) => void;
  onEdit: (event: EventItem) => void;
  onDelete: (event: EventItem) => void;
  onRegister: (event: EventItem) => void;
  onAttendees: (event: EventItem) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onView,
  onEdit,
  onDelete,
  onRegister,
  onAttendees,
}) => {
  const isFull = event.available_seats <= 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      {/* Event Banner Photo */}
      {event.image_url ? (
        <div className="relative h-40 w-full overflow-hidden bg-slate-900">
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
              {isFull ? 'Event Full' : `${event.available_seats} Seats Available`}
            </span>

            <div className="flex items-center gap-1 text-white bg-black/40 backdrop-blur-md p-1 rounded-xl">
              <button
                onClick={() => onEdit(event)}
                className="p-1 rounded-lg hover:text-indigo-300 hover:bg-white/20 transition-colors"
                title="Edit Event"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete(event)}
                className="p-1 rounded-lg hover:text-red-300 hover:bg-white/20 transition-colors"
                title="Delete Event"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 pb-0 flex items-center justify-between gap-2">
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

          <div className="flex items-center gap-1 text-slate-400">
            <button
              onClick={() => onEdit(event)}
              className="p-1.5 rounded-lg hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              title="Edit Event"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(event)}
              className="p-1.5 rounded-lg hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Delete Event"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Info Body */}
      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <h3
            onClick={() => onView(event)}
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
              Registered: <strong className="text-slate-700">{event.registered_count}</strong> / {event.max_attendees}
            </span>
          </div>
        </div>
      </div>

      <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 grid grid-cols-3 gap-2 text-xs font-semibold">
        <button
          onClick={() => onView(event)}
          className="py-1.5 px-2 rounded-xl text-slate-700 hover:bg-slate-200/60 border border-slate-200/80 transition-colors flex items-center justify-center gap-1 text-[11px]"
          title="View Event Details"
        >
          <Eye className="w-3 h-3 text-slate-500" /> View
        </button>

        <button
          onClick={() => onAttendees(event)}
          className="py-1.5 px-2 rounded-xl text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200/60 transition-colors flex items-center justify-center gap-1 text-[11px]"
          title="View Registered Attendees"
        >
          <List className="w-3 h-3 text-indigo-600" /> Attendees
        </button>

        <button
          disabled={isFull}
          onClick={() => onRegister(event)}
          className="py-1.5 px-2 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1 text-[11px] shadow-2xs disabled:opacity-50 disabled:bg-slate-400"
          title={isFull ? 'Event is full' : 'Register for Event'}
        >
          <UserPlus className="w-3 h-3" /> Register
        </button>
      </div>
    </div>
  );
};
