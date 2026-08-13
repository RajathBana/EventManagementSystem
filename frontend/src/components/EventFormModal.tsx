import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, Users, FileText, CheckCircle2, Image as ImageIcon, Upload, Link, Sparkles, Trash2 } from 'lucide-react';
import { EventItem, EventFormData } from '../types';

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: EventFormData) => Promise<void>;
  initialData?: EventItem | null;
  isEditing?: boolean;
}

const PRESET_PHOTOS = [
  {
    name: 'Tech & AI Summit',
    url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Coding Workshop',
    url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Campus Hackathon',
    url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Campus Fest / Concert',
    url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Seminar & Drive',
    url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
  },
];

export const EventFormModal: React.FC<EventFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    max_attendees: 50,
    image_url: '',
  });

  const [photoMode, setPhotoMode] = useState<'upload' | 'url' | 'presets'>('upload');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData && isEditing) {
      setFormData({
        title: initialData.title,
        description: initialData.description || '',
        date: initialData.date,
        time: initialData.time,
        location: initialData.location,
        max_attendees: initialData.max_attendees,
        image_url: initialData.image_url || '',
      });
    } else {
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        title: '',
        description: '',
        date: today,
        time: '10:00',
        location: '',
        max_attendees: 50,
        image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
      });
    }
    setError(null);
  }, [initialData, isEditing, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WEBP, etc.).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError('Image size exceeds 8MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setFormData((prev) => ({
          ...prev,
          image_url: reader.result as string,
        }));
        setError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError('Event Title is required.');
      return;
    }
    if (!formData.date) {
      setError('Event Date is required.');
      return;
    }
    if (!formData.time) {
      setError('Event Time is required.');
      return;
    }
    if (!formData.location.trim()) {
      setError('Event Location is required.');
      return;
    }

    const maxVal = Number(formData.max_attendees);
    if (isNaN(maxVal) || maxVal <= 0) {
      setError('Maximum Attendees must be a positive number greater than 0.');
      return;
    }

    if (isEditing && initialData) {
      if (maxVal < initialData.registered_count) {
        setError(`Cannot reduce capacity below the ${initialData.registered_count} currently registered attendees.`);
        return;
      }
    }

    try {
      setLoading(true);
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving the event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {isEditing ? 'Edit Event / Drive' : 'Create New Event / Drive'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditing ? 'Update event parameters, banner photo, and capacity' : 'Fill in event details and upload a photo banner for users'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Event / Drive Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Annual Tech & AI Innovation Summit 2026"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 text-sm font-medium"
              required
            />
          </div>

          {/* Upload Event Photo Section */}
          <div className="p-4 rounded-2xl border border-indigo-100 bg-indigo-50/30 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-indigo-950 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-indigo-600" /> Event Cover Photo / Banner
              </label>

              <div className="inline-flex items-center bg-white p-1 rounded-xl border border-slate-200 text-[11px] font-semibold text-slate-600">
                <button
                  type="button"
                  onClick={() => setPhotoMode('upload')}
                  className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                    photoMode === 'upload' ? 'bg-indigo-600 text-white shadow-2xs font-bold' : 'hover:text-slate-900'
                  }`}
                >
                  <Upload className="w-3 h-3" /> Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoMode('presets')}
                  className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                    photoMode === 'presets' ? 'bg-indigo-600 text-white shadow-2xs font-bold' : 'hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-3 h-3" /> Presets
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoMode('url')}
                  className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                    photoMode === 'url' ? 'bg-indigo-600 text-white shadow-2xs font-bold' : 'hover:text-slate-900'
                  }`}
                >
                  <Link className="w-3 h-3" /> Image URL
                </button>
              </div>
            </div>

            {photoMode === 'upload' && (
              <div>
                <label className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/50 p-4 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors group text-center">
                  <Upload className="w-6 h-6 text-indigo-500 group-hover:scale-110 transition-transform mb-1" />
                  <span className="text-xs font-semibold text-slate-700">Click to upload photo from device</span>
                  <span className="text-[11px] text-slate-400 mt-0.5">Supports PNG, JPG, WEBP (up to 8MB)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {photoMode === 'presets' && (
              <div className="space-y-2">
                <p className="text-[11px] text-slate-500">Select a high-resolution stock event banner:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PRESET_PHOTOS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, image_url: preset.url }))}
                      className={`relative h-20 rounded-xl overflow-hidden border-2 text-left transition-all ${
                        formData.image_url === preset.url
                          ? 'border-indigo-600 ring-2 ring-indigo-500/30'
                          : 'border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-1.5 flex items-end">
                        <span className="text-[10px] font-bold text-white line-clamp-1">{preset.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {photoMode === 'url' && (
              <div>
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url || ''}
                  onChange={handleChange}
                  placeholder="Paste direct photo URL (e.g. https://images.unsplash.com/...)"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                />
              </div>
            )}

            {formData.image_url ? (
              <div className="relative h-36 rounded-xl overflow-hidden border border-slate-200 shadow-2xs group bg-slate-900">
                <img
                  src={formData.image_url}
                  alt="Event Cover Preview"
                  className="w-full h-full object-cover"
                  onError={() => setError('Failed to load image preview. Please check URL or choose another photo.')}
                />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, image_url: '' }))}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-md"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove Photo
                  </button>
                </div>
                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                  Active Banner Photo
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 italic">No photo attached yet. A default gradient banner will be generated if left blank.</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" /> Description / Agenda
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Brief description of the agenda, speakers, and drive instructions..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 text-sm resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Main Auditorium, Science Building"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400" /> Maximum Capacity (Seats) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="max_attendees"
              min={isEditing && initialData ? initialData.registered_count : 1}
              value={formData.max_attendees}
              onChange={handleChange}
              placeholder="e.g. 50"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 text-sm"
              required
            />
            {isEditing && initialData && (
              <p className="text-xs text-slate-500 mt-1">
                Currently registered attendees: <strong className="text-indigo-600">{initialData.registered_count}</strong>
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Saving Event...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  {isEditing ? 'Update Event' : 'Save & Publish Event'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
