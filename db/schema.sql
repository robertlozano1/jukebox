/*
 * JUKEBOX DATABASE SCHEMA
 * 
 * This schema implements a digital music service where users can create playlists
 * and add tracks to them. The database uses a many-to-many relationship between
 * playlists and tracks, implemented through a junction table.
 * 
 * Key Features:
 * - Playlists can contain multiple tracks
 * - Tracks can belong to multiple playlists
 * - Each track can only appear once per playlist (unique constraint)
 * - Cascading deletes to maintain referential integrity
 */

-- Drop existing tables if they exist (in reverse order due to foreign key constraints)
-- This allows us to safely recreate the schema
DROP TABLE IF EXISTS playlists_tracks;
DROP TABLE IF EXISTS tracks;
DROP TABLE IF EXISTS playlists;

/*
 * PLAYLISTS TABLE
 * 
 * Stores information about user-created playlists
 * Each playlist has a unique ID, name, and description
 */
CREATE TABLE playlists (
    id SERIAL PRIMARY KEY,              -- Auto-incrementing unique identifier
    name TEXT NOT NULL,                 -- Playlist name (required)
    description TEXT NOT NULL           -- Playlist description (required)
);

/*
 * TRACKS TABLE
 * 
 * Stores information about individual music tracks
 * Each track has a unique ID, name, and duration in milliseconds
 */
CREATE TABLE tracks (
    id SERIAL PRIMARY KEY,              -- Auto-incrementing unique identifier
    name TEXT NOT NULL,                 -- Track name/title (required)
    duration_ms INTEGER NOT NULL        -- Track duration in milliseconds (required)
);

/*
 * PLAYLISTS_TRACKS JUNCTION TABLE
 * 
 * Implements the many-to-many relationship between playlists and tracks
 * This table allows:
 * - One playlist to contain multiple tracks
 * - One track to be in multiple playlists
 * - Prevents duplicate track entries in the same playlist
 */
CREATE TABLE playlists_tracks (
    id SERIAL PRIMARY KEY,              -- Auto-incrementing unique identifier
    playlist_id INTEGER NOT NULL,       -- Foreign key reference to playlists table
    track_id INTEGER NOT NULL,          -- Foreign key reference to tracks table
    
    -- Foreign key constraints with cascading deletes
    -- If a playlist is deleted, all its track associations are removed
    FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE,
    
    -- If a track is deleted, all its playlist associations are removed
    FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE,
    
    -- Unique constraint ensures each track can only appear once per playlist
    -- This prevents duplicate entries of the same track in a single playlist
    UNIQUE(playlist_id, track_id)
);
