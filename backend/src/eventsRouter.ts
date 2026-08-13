import { Router, Request, Response } from "express";
import { getDb } from "./db.js";

export const eventsRouter = Router();

// 1. GET ALL EVENTS
eventsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const db = await getDb();
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
    const events = await db.queryAll(sql);
    res.json(events);
  } catch (err: any) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// 2. GET SINGLE EVENT
eventsRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const db = await getDb();
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
    const event = await db.queryOne(sql, [id]);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(event);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch event" });
  }
});

// 3. CREATE EVENT
eventsRouter.post("/", async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const { title, description, date, time, location, max_attendees } = req.body;

    if (!title || !date || !time || !location || max_attendees === undefined) {
      return res.status(400).json({ error: "Missing required fields: title, date, time, location, max_attendees" });
    }

    const parsedMax = parseInt(max_attendees, 10);
    if (isNaN(parsedMax) || parsedMax <= 0) {
      return res.status(400).json({ error: "Maximum attendees must be a positive number greater than 0" });
    }

    await db.run(
      `INSERT INTO events (title, description, date, time, location, max_attendees, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [title.trim(), description ? description.trim() : "", date, time, location.trim(), parsedMax]
    );

    const createdEvent = await db.queryOne(
      "SELECT * FROM events WHERE id = (SELECT MAX(id) FROM events)"
    );
    res.status(201).json(createdEvent);
  } catch (err: any) {
    console.error("Error creating event:", err);
    res.status(500).json({ error: "Failed to create event" });
  }
});

// 4. EDIT EVENT
eventsRouter.put("/:id", async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    const { title, description, date, time, location, max_attendees } = req.body;

    const existing = await db.queryOne("SELECT * FROM events WHERE id = ?", [id]);
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

    const countRes = await db.queryOne("SELECT COUNT(*) as count FROM registrations WHERE event_id = ?", [id]);
    const currentCount = countRes ? Number(countRes.count) : 0;
    if (parsedMax < currentCount) {
      return res.status(400).json({ 
        error: `Cannot reduce capacity to ${parsedMax}. There are already ${currentCount} registered attendees.` 
      });
    }

    await db.run(
      `UPDATE events 
       SET title = ?, description = ?, date = ?, time = ?, location = ?, max_attendees = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [title.trim(), description ? description.trim() : "", date, time, location.trim(), parsedMax, id]
    );

    const updated = await db.queryOne("SELECT * FROM events WHERE id = ?", [id]);
    res.json(updated);
  } catch (err: any) {
    console.error("Error updating event:", err);
    res.status(500).json({ error: "Failed to update event" });
  }
});

// 5. DELETE EVENT
eventsRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    const existing = await db.queryOne("SELECT * FROM events WHERE id = ?", [id]);
    if (!existing) {
      return res.status(404).json({ error: "Event not found" });
    }

    await db.run("DELETE FROM registrations WHERE event_id = ?", [id]);
    await db.run("DELETE FROM events WHERE id = ?", [id]);

    res.json({ message: "Event deleted successfully", id: parseInt(id, 10) });
  } catch (err: any) {
    console.error("Error deleting event:", err);
    res.status(500).json({ error: "Failed to delete event" });
  }
});

// 6. REGISTER FOR EVENT
eventsRouter.post("/:id/register", async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Both Name and Email are required for registration." });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    const event = await db.queryOne(
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

    if (Number(event.registered_count) >= Number(event.max_attendees)) {
      return res.status(400).json({ error: "Registration failed: This event is already at maximum capacity." });
    }

    const duplicate = await db.queryOne(
      "SELECT * FROM registrations WHERE event_id = ? AND LOWER(email) = ?",
      [id, trimmedEmail]
    );

    if (duplicate) {
      return res.status(400).json({ error: "Registration failed: This email address is already registered for this event." });
    }

    await db.run(
      "INSERT INTO registrations (event_id, name, email) VALUES (?, ?, ?)",
      [id, trimmedName, trimmedEmail]
    );

    res.status(201).json({
      message: "Registration successful!"
    });
  } catch (err: any) {
    console.error("Error registering attendee:", err);
    res.status(500).json({ error: "Failed to register for event" });
  }
});

// 7. VIEW ATTENDEES FOR AN EVENT
eventsRouter.get("/:id/attendees", async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    const event = await db.queryOne("SELECT * FROM events WHERE id = ?", [id]);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const attendees = await db.queryAll(
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
