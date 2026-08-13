export interface EventItem {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  max_attendees: number;
  registered_count: number;
  available_seats: number;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Attendee {
  id: number;
  event_id: number;
  name: string;
  email: string;
  registered_at: string;
}

export interface EventWithAttendees {
  event: EventItem;
  total_attendees: number;
  attendees: Attendee[];
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'creator';
}

export interface AuthState {
  user: UserAccount | null;
}

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  max_attendees: number | string;
  image_url?: string;
}
