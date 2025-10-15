/**
 * DATABASE CLIENT CONFIGURATION
 *
 * This file sets up the PostgreSQL database connection for the Jukebox application.
 * It uses the 'pg' (node-postgres) library to create a database client that can
 * execute SQL queries against our PostgreSQL database.
 *
 * The DATABASE_URL environment variable should contain the full connection string
 * in the format: postgresql://username:password@host:port/database_name
 *
 * Usage:
 * - Import this client in other files to execute database queries
 * - Always call db.connect() before using and db.end() when finished
 * - Use parameterized queries ($1, $2, etc.) to prevent SQL injection
 */

import pg from "pg";

// Create a new PostgreSQL client using the connection string from environment variables
// This approach keeps sensitive database credentials out of the source code
const db = new pg.Client(process.env.DATABASE_URL);

// Export the client so other modules can import and use it
export default db;
