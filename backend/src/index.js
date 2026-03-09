import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import modelRoutes from "./routes/models.js";
import errorHandler from "./middleware/errorHandler.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// Middleware Configuration
// ============================================

// Enable CORS for cross-origin requests
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const method = req.method;
  const path = req.path;
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${method} ${path}`);
  next();
});

// ============================================
// API Routes
// ============================================

/**
 * Model API Routes
 * All model-related endpoints
 */
app.use("/api/models", modelRoutes);

/**
 * Health Check Endpoint
 * GET /api/health
 * Returns server status and timestamp
 */
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "API is running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/**
 * Root Endpoint
 * GET /
 * API documentation
 */
app.get("/", (req, res) => {
  res.json({
    name: "3D Engineering Model Generator API",
    version: "1.0.0",
    description:
      "RESTful API for generating and managing 3D engineering models",
    endpoints: {
      health: "GET /api/health",
      generateModel: "POST /api/models/generate",
      listModels: "GET /api/models",
      getModel: "GET /api/models/:id",
      exportModel: "GET /api/models/export/:id?format=glb",
    },
    documentation: "See README.md for detailed API documentation",
  });
});

/**
 * 404 Not Found Handler
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// Error Handling Middleware
// ============================================

// Global error handler (must be last)
app.use(errorHandler);

// ============================================
// Server Startup
// ============================================

const server = app.listen(PORT, () => {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`  Engineering Model API running on port ${PORT}`);
  console.log(`  Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`  API URL: http://localhost:${PORT}`);
  console.log(`  Health Check: http://localhost:${PORT}/api/health`);
  console.log(`${"=".repeat(60)}\n`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("\nSIGINT received, shutting down gracefully...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

export default app;
