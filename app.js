/**
 * JUKEBOX EXPRESS APPLICATION
 *
 * This file sets up the main Express application for the Jukebox API.
 * It provides RESTful endpoints for managing tracks and playlists in the music service.
 *
 * API Endpoints:
 *
 * TRACKS:
 * - GET /tracks - Get all tracks
 * - GET /tracks/:id - Get specific track by ID
 *
 * PLAYLISTS:
 * - GET /playlists - Get all playlists
 * - POST /playlists - Create new playlist
 * - GET /playlists/:id - Get specific playlist by ID
 * - GET /playlists/:id/tracks - Get all tracks in a playlist
 * - POST /playlists/:id/tracks - Add track to playlist
 *
 * All endpoints include proper error handling and appropriate HTTP status codes.
 */

import express from "express";
import db from "#db/client";

const app = express();

// Middleware to parse JSON request bodies
// This allows us to access req.body in our route handlers
app.use(express.json());

/**
 * UTILITY FUNCTIONS
 *
 * Helper functions for common operations like validation and error handling
 */

/**
 * Validates if a string represents a valid positive integer
 * Used for ID validation in route parameters
 */
function isValidId(idString) {
  const id = parseInt(idString, 10);
  return !isNaN(id) && id > 0 && id.toString() === idString;
}

/**
 * Sends standardized error responses
 * Ensures consistent error format across all endpoints
 */
function sendError(res, status, message) {
  res.status(status).json({ error: message });
}

/* ========================================
 * TRACKS ROUTER - Handles all track-related endpoints
 * ======================================== */

/**
 * GET /tracks
 *
 * Returns an array of all tracks in the database
 * Each track includes: id, name, duration_ms
 *
 * Response: 200 OK with array of track objects
 * Error: 500 Internal Server Error if database query fails
 */
app.get("/tracks", async (req, res) => {
  try {
    console.log("📡 GET /tracks - Fetching all tracks");

    // Query database for all tracks, ordered by ID for consistency
    const result = await db.query(
      "SELECT id, name, duration_ms FROM tracks ORDER BY id"
    );

    const tracks = result.rows;
    console.log(`✅ Retrieved ${tracks.length} tracks`);

    // Return tracks array with 200 OK status
    res.status(200).json(tracks);
  } catch (error) {
    console.error("❌ Error fetching tracks:", error);
    sendError(res, 500, "Internal server error while fetching tracks");
  }
});

/**
 * GET /tracks/:id
 *
 * Returns a specific track by its ID
 *
 * Parameters:
 * - id: Track ID (must be a positive integer)
 *
 * Response: 200 OK with track object
 * Errors:
 * - 400 Bad Request if ID is not a valid number
 * - 404 Not Found if track doesn't exist
 * - 500 Internal Server Error if database query fails
 */
app.get("/tracks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📡 GET /tracks/${id} - Fetching specific track`);

    // Validate ID parameter
    if (!isValidId(id)) {
      console.log(`❌ Invalid track ID: ${id}`);
      return sendError(res, 400, "Track ID must be a valid positive integer");
    }

    // Query database for specific track
    const result = await db.query(
      "SELECT id, name, duration_ms FROM tracks WHERE id = $1",
      [id]
    );

    // Check if track exists
    if (result.rows.length === 0) {
      console.log(`❌ Track not found: ${id}`);
      return sendError(res, 404, "Track not found");
    }

    const track = result.rows[0];
    console.log(`✅ Retrieved track: ${track.name}`);

    // Return track object with 200 OK status
    res.status(200).json(track);
  } catch (error) {
    console.error("❌ Error fetching track:", error);
    sendError(res, 500, "Internal server error while fetching track");
  }
});

/* ========================================
 * PLAYLISTS ROUTER - Handles all playlist-related endpoints
 * ======================================== */

/**
 * GET /playlists
 *
 * Returns an array of all playlists in the database
 * Each playlist includes: id, name, description
 *
 * Response: 200 OK with array of playlist objects
 * Error: 500 Internal Server Error if database query fails
 */
app.get("/playlists", async (req, res) => {
  try {
    console.log("📡 GET /playlists - Fetching all playlists");

    // Query database for all playlists, ordered by ID for consistency
    const result = await db.query(
      "SELECT id, name, description FROM playlists ORDER BY id"
    );

    const playlists = result.rows;
    console.log(`✅ Retrieved ${playlists.length} playlists`);

    // Return playlists array with 200 OK status
    res.status(200).json(playlists);
  } catch (error) {
    console.error("❌ Error fetching playlists:", error);
    sendError(res, 500, "Internal server error while fetching playlists");
  }
});

/**
 * POST /playlists
 *
 * Creates a new empty playlist
 *
 * Request Body:
 * - name: String (required) - Name of the playlist
 * - description: String (required) - Description of the playlist
 *
 * Response: 201 Created with the new playlist object
 * Errors:
 * - 400 Bad Request if request body is missing or invalid
 * - 500 Internal Server Error if database query fails
 */
app.post("/playlists", async (req, res) => {
  try {
    console.log("📡 POST /playlists - Creating new playlist");

    // Validate request body exists
    if (!req.body) {
      console.log("❌ Missing request body");
      return sendError(res, 400, "Request body is required");
    }

    const { name, description } = req.body;

    // Validate required fields
    if (!name || !description) {
      console.log("❌ Missing required fields:", {
        name: !!name,
        description: !!description,
      });
      return sendError(res, 400, "Name and description are required fields");
    }

    // Validate field types
    if (typeof name !== "string" || typeof description !== "string") {
      console.log("❌ Invalid field types");
      return sendError(res, 400, "Name and description must be strings");
    }

    // Insert new playlist into database
    const result = await db.query(
      "INSERT INTO playlists (name, description) VALUES ($1, $2) RETURNING id, name, description",
      [name, description]
    );

    const newPlaylist = result.rows[0];
    console.log(
      `✅ Created playlist: ${newPlaylist.name} (ID: ${newPlaylist.id})`
    );

    // Return new playlist with 201 Created status
    res.status(201).json(newPlaylist);
  } catch (error) {
    console.error("❌ Error creating playlist:", error);
    sendError(res, 500, "Internal server error while creating playlist");
  }
});

/**
 * GET /playlists/:id
 *
 * Returns a specific playlist by its ID
 *
 * Parameters:
 * - id: Playlist ID (must be a positive integer)
 *
 * Response: 200 OK with playlist object
 * Errors:
 * - 400 Bad Request if ID is not a valid number
 * - 404 Not Found if playlist doesn't exist
 * - 500 Internal Server Error if database query fails
 */
app.get("/playlists/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📡 GET /playlists/${id} - Fetching specific playlist`);

    // Validate ID parameter
    if (!isValidId(id)) {
      console.log(`❌ Invalid playlist ID: ${id}`);
      return sendError(
        res,
        400,
        "Playlist ID must be a valid positive integer"
      );
    }

    // Query database for specific playlist
    const result = await db.query(
      "SELECT id, name, description FROM playlists WHERE id = $1",
      [id]
    );

    // Check if playlist exists
    if (result.rows.length === 0) {
      console.log(`❌ Playlist not found: ${id}`);
      return sendError(res, 404, "Playlist not found");
    }

    const playlist = result.rows[0];
    console.log(`✅ Retrieved playlist: ${playlist.name}`);

    // Return playlist object with 200 OK status
    res.status(200).json(playlist);
  } catch (error) {
    console.error("❌ Error fetching playlist:", error);
    sendError(res, 500, "Internal server error while fetching playlist");
  }
});

/**
 * GET /playlists/:id/tracks
 *
 * Returns all tracks in a specific playlist
 * Uses JOIN to combine playlist and track information
 *
 * Parameters:
 * - id: Playlist ID (must be a positive integer)
 *
 * Response: 200 OK with array of track objects
 * Errors:
 * - 400 Bad Request if ID is not a valid number
 * - 404 Not Found if playlist doesn't exist
 * - 500 Internal Server Error if database query fails
 */
app.get("/playlists/:id/tracks", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📡 GET /playlists/${id}/tracks - Fetching tracks in playlist`);

    // Validate ID parameter
    if (!isValidId(id)) {
      console.log(`❌ Invalid playlist ID: ${id}`);
      return sendError(
        res,
        400,
        "Playlist ID must be a valid positive integer"
      );
    }

    // First, check if playlist exists
    const playlistCheck = await db.query(
      "SELECT id FROM playlists WHERE id = $1",
      [id]
    );

    if (playlistCheck.rows.length === 0) {
      console.log(`❌ Playlist not found: ${id}`);
      return sendError(res, 404, "Playlist not found");
    }

    // Query for tracks in the playlist using JOIN
    // This gets all track information for tracks associated with the playlist
    const result = await db.query(
      `
      SELECT t.id, t.name, t.duration_ms 
      FROM tracks t
      INNER JOIN playlists_tracks pt ON t.id = pt.track_id
      WHERE pt.playlist_id = $1
      ORDER BY t.id
    `,
      [id]
    );

    const tracks = result.rows;
    console.log(`✅ Retrieved ${tracks.length} tracks from playlist ${id}`);

    // Return tracks array with 200 OK status (empty array if no tracks)
    res.status(200).json(tracks);
  } catch (error) {
    console.error("❌ Error fetching playlist tracks:", error);
    sendError(res, 500, "Internal server error while fetching playlist tracks");
  }
});

/**
 * POST /playlists/:id/tracks
 *
 * Adds a track to a playlist by creating a new playlist_track association
 *
 * Parameters:
 * - id: Playlist ID (must be a positive integer)
 *
 * Request Body:
 * - trackId: Number (required) - ID of track to add to playlist
 *
 * Response: 201 Created with the new playlist_track object
 * Errors:
 * - 400 Bad Request if ID/trackId invalid, missing fields, or track already in playlist
 * - 404 Not Found if playlist doesn't exist
 * - 500 Internal Server Error if database query fails
 */
app.post("/playlists/:id/tracks", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📡 POST /playlists/${id}/tracks - Adding track to playlist`);

    // Validate playlist ID parameter
    if (!isValidId(id)) {
      console.log(`❌ Invalid playlist ID: ${id}`);
      return sendError(
        res,
        400,
        "Playlist ID must be a valid positive integer"
      );
    }

    // Validate request body exists
    if (!req.body) {
      console.log("❌ Missing request body");
      return sendError(res, 400, "Request body is required");
    }

    const { trackId } = req.body;

    // Validate trackId is provided
    if (trackId === undefined || trackId === null) {
      console.log("❌ Missing trackId");
      return sendError(res, 400, "trackId is required in request body");
    }

    // Validate trackId is a valid positive integer
    if (!Number.isInteger(trackId) || trackId <= 0) {
      console.log(`❌ Invalid trackId: ${trackId}`);
      return sendError(res, 400, "trackId must be a positive integer");
    }

    // Check if playlist exists
    const playlistCheck = await db.query(
      "SELECT id FROM playlists WHERE id = $1",
      [id]
    );

    if (playlistCheck.rows.length === 0) {
      console.log(`❌ Playlist not found: ${id}`);
      return sendError(res, 404, "Playlist not found");
    }

    // Check if track exists
    const trackCheck = await db.query("SELECT id FROM tracks WHERE id = $1", [
      trackId,
    ]);

    if (trackCheck.rows.length === 0) {
      console.log(`❌ Track not found: ${trackId}`);
      return sendError(res, 400, "Track does not exist");
    }

    // Try to insert the playlist_track association
    // This will fail if the track is already in the playlist due to unique constraint
    try {
      const result = await db.query(
        "INSERT INTO playlists_tracks (playlist_id, track_id) VALUES ($1, $2) RETURNING id, playlist_id, track_id",
        [id, trackId]
      );

      const playlistTrack = result.rows[0];
      console.log(`✅ Added track ${trackId} to playlist ${id}`);

      // Return new playlist_track with 201 Created status
      res.status(201).json(playlistTrack);
    } catch (dbError) {
      // Handle duplicate key constraint violation
      if (dbError.code === "23505") {
        // PostgreSQL unique constraint violation
        console.log(`❌ Track ${trackId} already in playlist ${id}`);
        return sendError(res, 400, "Track is already in this playlist");
      }

      // Re-throw other database errors
      throw dbError;
    }
  } catch (error) {
    console.error("❌ Error adding track to playlist:", error);
    sendError(res, 500, "Internal server error while adding track to playlist");
  }
});

/* ========================================
 * ERROR HANDLING
 * ======================================== */

/**
 * 404 Handler - Catches all undefined routes
 * This should be the last middleware to catch any unmatched routes
 */
app.use("*", (req, res) => {
  console.log(`❌ Route not found: ${req.method} ${req.originalUrl}`);
  sendError(res, 404, `Route ${req.method} ${req.originalUrl} not found`);
});

/**
 * Global Error Handler
 * Catches any unhandled errors in the application
 */
app.use((error, req, res, next) => {
  console.error("💥 Unhandled error:", error);
  sendError(res, 500, "Internal server error");
});

export default app;
