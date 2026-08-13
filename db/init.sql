-- Database Initialization Script for Event Management System

CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time VARCHAR(50) NOT NULL,
  location VARCHAR(255) NOT NULL,
  max_attendees INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS registrations (
  id SERIAL PRIMARY KEY,
  event_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  CONSTRAINT unique_event_email UNIQUE (event_id, email)
);

-- Seed Data
INSERT INTO events (title, description, date, time, location, max_attendees)
VALUES 
  ('Tech & AI Innovation Summit 2026', 'A full-day conference covering agentic AI systems, web frameworks, and cloud architecture.', '2026-09-15', '09:00', 'Main Auditorium, Science Block', 50),
  ('Full-Stack Web Development Workshop', 'Hands-on coding session building reactive web apps with React, Express, and modern styling.', '2026-09-20', '14:00', 'Lab 3, Computer Science Dept', 25),
  ('Annual Campus Hackathon', '24-hour hackathon to prototype software solutions for real-world campus and urban problems.', '2026-10-05', '10:00', 'Student Center Complex', 100);

INSERT INTO registrations (event_id, name, email)
VALUES 
  (1, 'Alex Morgan', 'alex.morgan@university.edu'),
  (1, 'Sophia Chen', 'sophia.chen@example.com'),
  (2, 'Jordan Lee', 'jordan.lee@example.com');
