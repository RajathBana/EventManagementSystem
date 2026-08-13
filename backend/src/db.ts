import fs from "fs";
import path from "path";
import initSqlJs, { Database as SqlJsDatabase } from "sql.js";
import pg from "pg";

const DB_FILE = path.join(process.cwd(), "events.sqlite");

export interface DatabaseAdapter {
  queryAll<T = any>(sql: string, params?: any[]): Promise<T[]>;
  queryOne<T = any>(sql: string, params?: any[]): Promise<T | null>;
  run(sql: string, params?: any[]): Promise<void>;
}

class SqliteAdapter implements DatabaseAdapter {
  private db!: SqlJsDatabase;

  async init() {
    const SQL = await initSqlJs();
    if (fs.existsSync(DB_FILE)) {
      const fileBuffer = fs.readFileSync(DB_FILE);
      this.db = new SQL.Database(fileBuffer);
    } else {
      this.db = new SQL.Database();
    }

    this.db.run("PRAGMA foreign_keys = ON;");

    this.db.run(`
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        location TEXT NOT NULL,
        max_attendees INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    this.db.run(`
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

    const countResult = this.db.exec("SELECT COUNT(*) as cnt FROM events;");
    const count = countResult[0]?.values[0]?.[0] || 0;
    if (count === 0) {
      this.db.run(`
        INSERT INTO events (title, description, date, time, location, max_attendees)
        VALUES 
        ('Tech & AI Innovation Summit 2026', 'A full-day conference covering agentic AI systems, web frameworks, and cloud architecture.', '2026-09-15', '09:00', 'Main Auditorium, Science Block', 50),
        ('Full-Stack Web Development Workshop', 'Hands-on coding session building reactive web apps with React, Express, and modern styling.', '2026-09-20', '14:00', 'Lab 3, Computer Science Dept', 25),
        ('Annual Campus Hackathon', '24-hour hackathon to prototype software solutions for real-world campus and urban problems.', '2026-10-05', '10:00', 'Student Center Complex', 100);
      `);

      this.db.run(`
        INSERT INTO registrations (event_id, name, email)
        VALUES 
        (1, 'Alex Morgan', 'alex.morgan@university.edu'),
        (1, 'Sophia Chen', 'sophia.chen@example.com'),
        (2, 'Jordan Lee', 'jordan.lee@example.com');
      `);
      this.save();
    }
  }

  private save() {
    if (this.db) {
      const data = this.db.export();
      fs.writeFileSync(DB_FILE, Buffer.from(data));
    }
  }

  async queryAll<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    const stmt = this.db.prepare(sql);
    stmt.bind(params);
    const results: T[] = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject() as T);
    }
    stmt.free();
    return results;
  }

  async queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
    const res = await this.queryAll<T>(sql, params);
    return res.length > 0 ? res[0] : null;
  }

  async run(sql: string, params: any[] = []): Promise<void> {
    this.db.run(sql, params);
    this.save();
  }
}

class PostgresAdapter implements DatabaseAdapter {
  private pool: pg.Pool;

  constructor() {
    this.pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL || `postgres://${process.env.POSTGRES_USER || 'postgres'}:${process.env.POSTGRES_PASSWORD || 'postgres'}@${process.env.POSTGRES_HOST || 'localhost'}:${process.env.POSTGRES_PORT || 5432}/${process.env.POSTGRES_DB || 'events_db'}`
    });
  }

  async queryAll<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    // Convert ? parameters to $1, $2 if needed
    let pgSql = sql;
    let paramIndex = 1;
    while (pgSql.includes('?')) {
      pgSql = pgSql.replace('?', `$${paramIndex++}`);
    }
    const res = await this.pool.query(pgSql, params);
    return res.rows as T[];
  }

  async queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
    const res = await this.queryAll<T>(sql, params);
    return res.length > 0 ? res[0] : null;
  }

  async run(sql: string, params: any[] = []): Promise<void> {
    let pgSql = sql;
    let paramIndex = 1;
    while (pgSql.includes('?')) {
      pgSql = pgSql.replace('?', `$${paramIndex++}`);
    }
    await this.pool.query(pgSql, params);
  }
}

let dbInstance: DatabaseAdapter;

export async function getDb(): Promise<DatabaseAdapter> {
  if (dbInstance) return dbInstance;

  if (process.env.POSTGRES_HOST || process.env.DATABASE_URL) {
    dbInstance = new PostgresAdapter();
  } else {
    const sqliteAdapter = new SqliteAdapter();
    await sqliteAdapter.init();
    dbInstance = sqliteAdapter;
  }

  return dbInstance;
}
