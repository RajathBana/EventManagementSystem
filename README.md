
# Event Management System MVP

A complete full-stack Event Management System supporting event creation, editing, deletion, viewing, attendee registration, capacity checks, duplicate prevention, and attendee list viewing.

---

## 📁 Directory Structure

```text
event-project/
├── backend/
│   ├── src/
│   │   ├── index.ts
│   │   ├── db.ts
│   │   └── eventsRouter.ts
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── UserDashboard.tsx
│   │   │   ├── CreatorDashboard.tsx
│   │   │   ├── EventCard.tsx
│   │   │   ├── EventFormModal.tsx
│   │   │   ├── EventDetailsModal.tsx
│   │   │   ├── RegistrationModal.tsx
│   │   │   ├── AttendeesModal.tsx
│   │   │   └── DeleteConfirmModal.tsx
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── index.css
│   │   └── types.ts
│   ├── Dockerfile
│   ├── index.html
│   ├── nginx.conf
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── db/
│   └── init.sql
│
├── .env
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md
```

---

## 🚀 How to Run the Application

### Option 1: Docker Compose (Recommended)

Make sure Docker and Docker Compose are installed, then run:

```bash
docker compose up --build
```

Access the frontend at `http://localhost:3000` and backend API at `http://localhost:5000`.

---

### Option 2: Local Node.js Development

```bash
# 1. Install dependencies
npm install

# 2. Run dev server (backend + frontend combined)
npm run dev
```

---

## 🔌 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/events` | List all events with available seats |
| `GET` | `/api/events/:id` | Get details for a single event |
| `POST` | `/api/events` | Create a new event |
| `PUT` | `/api/events/:id` | Update an existing event |
| `DELETE` | `/api/events/:id` | Delete an event and its registrations |
| `POST` | `/api/events/:id/register` | Register an attendee (`name`, `email`) |
| `GET` | `/api/events/:id/attendees` | Get list of registered attendees |

---

## 📋 Features Checklist
1. **CREATE EVENT**: Name, description, date, time, location, capacity.
2. **VIEW EVENTS**: Dashboard grid displaying details and seat availability.
3. **EDIT EVENT**: Update event fields with validation.
4. **DELETE EVENT**: Remove event with modal confirmation.
5. **REGISTER FOR EVENT**: Name & email collection with duplicate and full-capacity prevention.
6. **VIEW ATTENDEES**: Table view of registered attendees with count.
=======
# EventManagementSystem
event registration system
>>>>>>> 353087512e0fc1e8a6e7c34ebff3e66545ecbbdc
