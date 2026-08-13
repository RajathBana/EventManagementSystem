import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import initSqlJs, { Database } from "sql.js";

const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "events.sqlite");

let db: Database;

function saveDatabase() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_FILE, buffer);
  }
}

async function initDb() {
  const SQL = await initSqlJs();
  if (fs.existsSync(DB_FILE)) {
    const fileBuffer = fs.readFileSync(DB_FILE);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  // Enable Foreign Key constraints
  db.run("PRAGMA foreign_keys = ON;");

  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      location TEXT NOT NULL,
      max_attendees INTEGER NOT NULL,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Migration helper for existing DB files
  try {
    db.run("ALTER TABLE events ADD COLUMN image_url TEXT;");
  } catch (e) {
    // Column already exists
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
      UNIQUE(event_id, email)
    );
  `);

  // Seed initial sample data if empty
  try {
    const countResult = db.exec("SELECT COUNT(*) as cnt FROM events;");
    const count = countResult[0]?.values[0]?.[0] || 0;
    if (count === 0) {
      db.run(`
        INSERT INTO events (title, description, date, time, location, max_attendees, image_url)
        VALUES 
        ('Tech & AI Innovation Summit 2026', 'A full-day conference covering agentic AI systems, web frameworks, and cloud architecture.', '2026-09-15', '09:00', 'Main Auditorium, Science Block', 50, 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'),
        ('Full-Stack Web Development Workshop', 'Hands-on coding session building reactive web apps with React, Express, and modern styling.', '2026-09-20', '14:00', 'Lab 3, Computer Science Dept', 25, 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80'),
        ('Annual Campus Hackathon', '24-hour hackathon to prototype software solutions for real-world campus and urban problems.', '2026-10-05', '10:00', 'Student Center Complex', 100, 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80');
      `);

      const eventIdsResult = db.exec("SELECT id FROM events ORDER BY id ASC;");
      const eventIds = eventIdsResult[0]?.values?.map((v) => v[0]) || [];

      if (eventIds.length >= 2) {
        db.run(
          `
          INSERT INTO registrations (event_id, name, email)
          VALUES 
          (?, 'Alex Morgan', 'alex.morgan@university.edu'),
          (?, 'Sophia Chen', 'sophia.chen@example.com'),
          (?, 'Jordan Lee', 'jordan.lee@example.com');
        `,
          [eventIds[0], eventIds[0], eventIds[1]]
        );
      }
      saveDatabase();
    } else {
      saveDatabase();
    }
  } catch (seedErr) {
    console.error("Error during database seeding:", seedErr);
  }
}

// Helper query function returning array of objects
function queryAll<T = any>(sql: string, params: any[] = []): T[] {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const results: T[] = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject() as T);
  }
  stmt.free();
  return results;
}

function queryOne<T = any>(sql: string, params: any[] = []): T | null {
  const results = queryAll<T>(sql, params);
  return results.length > 0 ? results[0] : null;
}

async function startServer() {
  await initDb();
  const app = express();

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // Log requests
  app.use((req, res, next) => {
    console.log(`[API] ${req.method} ${req.url}`);
    next();
  });

  // --- API ROUTES ---

  // 1. GET ALL EVENTS with registered count and available seats
  app.get("/api/events", (req, res) => {
    try {
      const sql = `
        SELECT 
          e.*,
          COUNT(r.id) as registered_count,
          (e.max_attendees - COUNT(r.id)) as available_seats
        FROM events e
        LEFT JOIN registrations r ON e.id = r.event_id
        GROUP BY e.id
        ORDER BY e.date ASC, e.time ASC
      `;
      const events = queryAll(sql);
      res.json(events);
    } catch (err: any) {
      console.error("Error fetching events:", err);
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  // 2. GET SINGLE EVENT
  app.get("/api/events/:id", (req, res) => {
    try {
      const { id } = req.params;
      const sql = `
        SELECT 
          e.*,
          COUNT(r.id) as registered_count,
          (e.max_attendees - COUNT(r.id)) as available_seats
        FROM events e
        LEFT JOIN registrations r ON e.id = r.event_id
        WHERE e.id = ?
        GROUP BY e.id
      `;
      const event = queryOne(sql, [id]);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (err: any) {
      res.status(500).json({ error: "Failed to fetch event" });
    }
  });

  // 3. CREATE EVENT
  app.post("/api/events", (req, res) => {
    try {
      const { title, description, date, time, location, max_attendees, image_url } = req.body;

      if (!title || !date || !time || !location || max_attendees === undefined) {
        return res.status(400).json({ error: "Missing required fields: title, date, time, location, max_attendees" });
      }

      const parsedMax = parseInt(max_attendees, 10);
      if (isNaN(parsedMax) || parsedMax <= 0) {
        return res.status(400).json({ error: "Maximum attendees must be a positive number greater than 0" });
      }

      db.run(
        `INSERT INTO events (title, description, date, time, location, max_attendees, image_url, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [title.trim(), description ? description.trim() : "", date, time, location.trim(), parsedMax, image_url || null]
      );
      saveDatabase();

      const newIdResult = db.exec("SELECT last_insert_rowid() as id;");
      const newId = newIdResult[0].values[0][0];

      const createdEvent = queryOne("SELECT * FROM events WHERE id = ?", [newId]);
      res.status(201).json(createdEvent);
    } catch (err: any) {
      console.error("Error creating event:", err);
      res.status(500).json({ error: "Failed to create event" });
    }
  });

  // 4. EDIT EVENT
  app.put("/api/events/:id", (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, date, time, location, max_attendees, image_url } = req.body;

      const existing = queryOne("SELECT * FROM events WHERE id = ?", [id]);
      if (!existing) {
        return res.status(404).json({ error: "Event not found" });
      }

      if (!title || !date || !time || !location || max_attendees === undefined) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const parsedMax = parseInt(max_attendees, 10);
      if (isNaN(parsedMax) || parsedMax <= 0) {
        return res.status(400).json({ error: "Maximum attendees must be a positive integer" });
      }

      // Check current registration count to ensure new max_attendees isn't less than existing attendees
      const countRes = queryOne("SELECT COUNT(*) as count FROM registrations WHERE event_id = ?", [id]);
      const currentCount = countRes ? countRes.count : 0;
      if (parsedMax < currentCount) {
        return res.status(400).json({ 
          error: `Cannot reduce capacity to ${parsedMax}. There are already ${currentCount} registered attendees.` 
        });
      }

      db.run(
        `UPDATE events 
         SET title = ?, description = ?, date = ?, time = ?, location = ?, max_attendees = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [title.trim(), description ? description.trim() : "", date, time, location.trim(), parsedMax, image_url || null, id]
      );
      saveDatabase();

      const updated = queryOne("SELECT * FROM events WHERE id = ?", [id]);
      res.json(updated);
    } catch (err: any) {
      console.error("Error updating event:", err);
      res.status(500).json({ error: "Failed to update event" });
    }
  });

  // 5. DELETE EVENT
  app.delete("/api/events/:id", (req, res) => {
    try {
      const { id } = req.params;
      const existing = queryOne("SELECT * FROM events WHERE id = ?", [id]);
      if (!existing) {
        return res.status(404).json({ error: "Event not found" });
      }

      // Delete registrations first then event
      db.run("DELETE FROM registrations WHERE event_id = ?", [id]);
      db.run("DELETE FROM events WHERE id = ?", [id]);
      saveDatabase();

      res.json({ message: "Event deleted successfully", id: parseInt(id, 10) });
    } catch (err: any) {
      console.error("Error deleting event:", err);
      res.status(500).json({ error: "Failed to delete event" });
    }
  });

  // 6. REGISTER FOR EVENT
  app.post("/api/events/:id/register", (req, res) => {
    try {
      const { id } = req.params;
      const { name, email } = req.body;

      if (!name || !email) {
        return res.status(400).json({ error: "Both Name and Email are required for registration." });
      }

      const trimmedName = name.trim();
      const trimmedEmail = email.trim().toLowerCase();

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        return res.status(400).json({ error: "Please enter a valid email address." });
      }

      // Verify event exists
      const event = queryOne(
        `SELECT e.*, COUNT(r.id) as registered_count 
         FROM events e 
         LEFT JOIN registrations r ON e.id = r.event_id 
         WHERE e.id = ? 
         GROUP BY e.id`,
        [id]
      );

      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      // Prevent registration when event is full
      if (event.registered_count >= event.max_attendees) {
        return res.status(400).json({ error: "Registration failed: This event is already at maximum capacity." });
      }

      // Prevent duplicate registration using same email for same event
      const duplicate = queryOne(
        "SELECT * FROM registrations WHERE event_id = ? AND LOWER(email) = ?",
        [id, trimmedEmail]
      );

      if (duplicate) {
        return res.status(400).json({ error: "Registration failed: This email address is already registered for this event." });
      }

      db.run(
        "INSERT INTO registrations (event_id, name, email) VALUES (?, ?, ?)",
        [id, trimmedName, trimmedEmail]
      );
      saveDatabase();

      const newRegIdResult = db.exec("SELECT last_insert_rowid() as id;");
      const newRegId = newRegIdResult[0].values[0][0];

      const registration = queryOne("SELECT * FROM registrations WHERE id = ?", [newRegId]);
      res.status(201).json({
        message: "Registration successful!",
        registration
      });
    } catch (err: any) {
      console.error("Error registering attendee:", err);
      res.status(500).json({ error: "Failed to register for event" });
    }
  });

  // 7. VIEW ATTENDEES FOR AN EVENT
  app.get("/api/events/:id/attendees", (req, res) => {
    try {
      const { id } = req.params;
      const event = queryOne("SELECT * FROM events WHERE id = ?", [id]);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      const attendees = queryAll(
        "SELECT id, event_id, name, email, registered_at FROM registrations WHERE event_id = ? ORDER BY registered_at DESC",
        [id]
      );

      res.json({
        event,
        total_attendees: attendees.length,
        attendees
      });
    } catch (err: any) {
      console.error("Error fetching attendees:", err);
      res.status(500).json({ error: "Failed to fetch attendees" });
    }
  });

  // Serve static files / Vite dev server
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
