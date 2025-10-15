/**
 * JUKEBOX SERVER ENTRY POINT
 *
 * This file starts the Jukebox Express server and establishes the database connection.
 * It imports the configured Express app and connects to PostgreSQL before starting
 * the HTTP server on the specified port.
 *
 * Environment Variables:
 * - PORT: Server port (defaults to 3000)
 * - DATABASE_URL: PostgreSQL connection string (required)
 *
 * Usage:
 * npm start - Start production server
 * npm run dev - Start development server with auto-restart
 */

import app from "#app";
import db from "#db/client";

// Get port from environment variable or default to 3000
const PORT = process.env.PORT ?? 3000;

console.log("🚀 Starting Jukebox server...");

// Connect to the database before starting the server
// This ensures the database is available when requests start coming in
await db.connect();
console.log("✅ Database connected successfully");

// Start the HTTP server
app.listen(PORT, () => {
  console.log(`🎵 Jukebox server is listening on port ${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}`);
  console.log("\n📋 Available Routes:");
  console.log("   GET    /tracks           - Get all tracks");
  console.log("   GET    /tracks/:id       - Get specific track");
  console.log("   GET    /playlists        - Get all playlists");
  console.log("   POST   /playlists        - Create new playlist");
  console.log("   GET    /playlists/:id    - Get specific playlist");
  console.log("   GET    /playlists/:id/tracks - Get tracks in playlist");
  console.log("   POST   /playlists/:id/tracks - Add track to playlist");
  console.log("\n🧪 Run tests with: npm test");
});
