import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { eventsRouter } from "./eventsRouter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Log requests
app.use((req, res, next) => {
  console.log(`[Backend API] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "event-management-backend" });
});

// Mount Events API routes
app.use("/api/events", eventsRouter);

app.listen(PORT, () => {
  console.log(`Backend Server running on port ${PORT}`);
});

export default app;
