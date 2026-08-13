import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { EventItem, EventFormData, UserAccount } from './types';
import { Navbar } from './components/Navbar';
import { LoginLanding } from './components/LoginLanding';
import { UserDashboard } from './components/UserDashboard';
import { CreatorDashboard } from './components/CreatorDashboard';
import { EventFormModal } from './components/EventFormModal';
import { EventDetailsModal } from './components/EventDetailsModal';
import { RegistrationModal } from './components/RegistrationModal';
import { AttendeesModal } from './components/AttendeesModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { AuthModal } from './components/AuthModal';

export default function App() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Current logged in user account state
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('eventhub_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Auth modal state
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Local state for user registrations
  const [registeredEventIds, setRegisteredEventIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('eventhub_registered_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEventForForm, setSelectedEventForForm] = useState<EventItem | null>(null);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedEventForDetails, setSelectedEventForDetails] = useState<EventItem | null>(null);

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedEventForRegister, setSelectedEventForRegister] = useState<EventItem | null>(null);

  const [isAttendeesOpen, setIsAttendeesOpen] = useState(false);
  const [selectedEventForAttendees, setSelectedEventForAttendees] = useState<EventItem | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEventForDelete, setSelectedEventForDelete] = useState<EventItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch events from API
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/events');
      if (!res.ok) {
        throw new Error('Failed to fetch events from backend server');
      }
      const data = await res.json();
      setEvents(data);
    } catch (err: any) {
      setError(err.message || 'Error connecting to database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const showBanner = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('eventhub_user', JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save user to localStorage', e);
    }
    showBanner(`Welcome ${user.name}! Accessing ${user.role === 'creator' ? 'Creator Console' : 'User Dashboard'}.`);
  };

  const handleLogout = () => {
    const prevName = currentUser?.name || 'User';
    setCurrentUser(null);
    try {
      localStorage.removeItem('eventhub_user');
    } catch (e) {
      console.error('Failed to clear user from localStorage', e);
    }
    showBanner(`Goodbye ${prevName}! You have logged out.`);
  };

  // Create / Edit Event Handler
  const handleFormSubmit = async (formData: EventFormData) => {
    if (isEditing && selectedEventForForm) {
      const res = await fetch(`/api/events/${selectedEventForForm.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update event');
      showBanner(`Event "${formData.title}" updated successfully!`);
    } else {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create event');
      showBanner(`Event "${formData.title}" created successfully and published!`);
    }
    fetchEvents();
  };

  // Delete Event Handler
  const handleConfirmDelete = async () => {
    if (!selectedEventForDelete) return;
    try {
      setDeleteLoading(true);
      const res = await fetch(`/api/events/${selectedEventForDelete.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete event');
      showBanner(`Event "${selectedEventForDelete.title}" deleted.`);
      setIsDeleteOpen(false);
      setSelectedEventForDelete(null);
      fetchEvents();
    } catch (err: any) {
      alert(err.message || 'Error deleting event');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Registration Success Handler
  const handleRegistrationSuccess = (eventId: number, eventTitle: string) => {
    const updated = Array.from(new Set([...registeredEventIds, eventId]));
    setRegisteredEventIds(updated);
    try {
      localStorage.setItem('eventhub_registered_ids', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }

    showBanner(`Successfully registered for "${eventTitle}"!`);
    fetchEvents();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased flex flex-col justify-between">
      <div>
        <Navbar
          onOpenCreateModal={() => {
            setIsEditing(false);
            setSelectedEventForForm(null);
            setIsFormOpen(true);
          }}
          currentUser={currentUser}
          onOpenAuthModal={() => {
            setIsAuthOpen(true);
          }}
          onLogout={handleLogout}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Success Banner */}
          {notification && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-600 text-white font-medium text-sm shadow-lg shadow-emerald-600/20 flex items-center justify-between transition-all">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-200" />
                <span>{notification}</span>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="text-white/80 hover:text-white text-xs font-bold px-2 py-1 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* View Selection: Login Gateway if logged out, or dedicated dashboard if logged in */}
          {!currentUser ? (
            <LoginLanding onLoginSuccess={handleLoginSuccess} />
          ) : currentUser.role === 'creator' ? (
            <CreatorDashboard
              events={events}
              loading={loading}
              error={error}
              onRefresh={fetchEvents}
              onOpenCreateModal={() => {
                setIsEditing(false);
                setSelectedEventForForm(null);
                setIsFormOpen(true);
              }}
              onOpenEditModal={(evt) => {
                setIsEditing(true);
                setSelectedEventForForm(evt);
                setIsFormOpen(true);
              }}
              onOpenDeleteModal={(evt) => {
                setSelectedEventForDelete(evt);
                setIsDeleteOpen(true);
              }}
              onOpenAttendeesModal={(evt) => {
                setSelectedEventForAttendees(evt);
                setIsAttendeesOpen(true);
              }}
              onViewDetailsModal={(evt) => {
                setSelectedEventForDetails(evt);
                setIsDetailsOpen(true);
              }}
            />
          ) : (
            <UserDashboard
              events={events}
              loading={loading}
              error={error}
              onRefresh={fetchEvents}
              onViewDetails={(evt) => {
                setSelectedEventForDetails(evt);
                setIsDetailsOpen(true);
              }}
              onRegister={(evt) => {
                setSelectedEventForRegister(evt);
                setIsRegisterOpen(true);
              }}
              registeredEventIds={registeredEventIds}
            />
          )}
        </main>
      </div>

      <footer className="mt-12 py-6 border-t border-slate-200 bg-white text-center text-xs text-slate-500">
        <p>© 2026 EventHub Management System • Multi-Portal Architecture</p>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        initialRole="user"
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <EventFormModal
        isOpen={isFormOpen}
        isEditing={isEditing}
        initialData={selectedEventForForm}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <EventDetailsModal
        isOpen={isDetailsOpen}
        event={selectedEventForDetails}
        onClose={() => setIsDetailsOpen(false)}
        onOpenRegister={(evt) => {
          setSelectedEventForRegister(evt);
          setIsRegisterOpen(true);
        }}
        onOpenAttendees={(evt) => {
          setSelectedEventForAttendees(evt);
          setIsAttendeesOpen(true);
        }}
      />

      <RegistrationModal
        isOpen={isRegisterOpen}
        event={selectedEventForRegister}
        currentUser={currentUser}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={() => {
          if (selectedEventForRegister) {
            handleRegistrationSuccess(selectedEventForRegister.id, selectedEventForRegister.title);
          }
        }}
      />

      <AttendeesModal
        isOpen={isAttendeesOpen}
        event={selectedEventForAttendees}
        onClose={() => setIsAttendeesOpen(false)}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        event={selectedEventForDelete}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />
    </div>
  );
}
