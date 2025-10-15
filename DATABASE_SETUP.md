# Jukebox Database Setup Guide

This guide will help you set up and understand the Jukebox database schema and seeding process.

## 📋 Prerequisites

1. **PostgreSQL** must be installed and running on your system
2. **Node.js** (version 22 or higher) must be installed
3. **npm** for package management

## 🗄️ Database Schema Overview

The Jukebox database uses a **many-to-many relationship** between playlists and tracks:

```
playlists ←→ playlists_tracks ←→ tracks
```

### Tables:

1. **`playlists`** - Stores playlist information (id, name, description)
2. **`tracks`** - Stores track information (id, name, duration_ms)
3. **`playlists_tracks`** - Junction table implementing the many-to-many relationship

### Key Features:

- **Cascading Deletes**: When a playlist or track is deleted, all related associations are automatically removed
- **Unique Constraint**: Each track can only appear once per playlist
- **Referential Integrity**: Foreign keys ensure data consistency

## 🚀 Setup Instructions

### Step 1: Create the Database

First, create a new PostgreSQL database named `jukebox`:

```bash
# Connect to PostgreSQL as a superuser
psql postgres

# Create the database
CREATE DATABASE jukebox;

# Exit psql
\q
```

### Step 2: Configure Environment Variables

Copy the example environment file and update it with your database credentials:

```bash
cp example.env .env
```

Edit `.env` file with your actual database connection details:

```
DATABASE_URL=postgres://your_username:your_password@localhost:5432/jukebox
```

### Step 3: Create the Schema

Run the schema creation script to set up all tables:

```bash
npm run db:schema
```

This executes the SQL commands in `db/schema.sql` to create:

- `playlists` table
- `tracks` table
- `playlists_tracks` junction table with proper foreign keys and constraints

### Step 4: Seed the Database

Populate the database with sample data:

```bash
npm run db:seed
```

This will create:

- **24 sample tracks** with realistic names and durations
- **12 diverse playlists** with different themes/moods
- **35+ playlist-track associations** demonstrating the relationships

### Step 5: Reset Database (Optional)

To recreate the entire database from scratch:

```bash
npm run db:reset
```

This runs both schema creation and seeding in sequence.

## 📊 Sample Data Included

### Tracks (24 total)

- Classic rock anthems (Bohemian Rhapsody, Stairway to Heaven)
- Pop hits (Billie Jean, Hey Ya!)
- Alternative/Grunge (Smells Like Teen Spirit, Creep)
- And many more diverse genres

### Playlists (12 total)

- **Classic Rock Legends** - Timeless rock anthems
- **Chill Vibes** - Relaxing tracks for unwinding
- **Workout Pump** - High-energy exercise music
- **Road Trip Essentials** - Perfect for long drives
- **90s Nostalgia** - Best hits from the 90s
- And 7 more themed collections

## 🔍 Understanding the Code

### Schema Design (`db/schema.sql`)

- **Serial Primary Keys**: Auto-incrementing IDs for each table
- **Foreign Key Constraints**: Ensure referential integrity
- **ON DELETE CASCADE**: Automatic cleanup of related records
- **UNIQUE Constraint**: Prevents duplicate track entries per playlist

### Seed Logic (`db/seed.js`)

- **Parameterized Queries**: Prevents SQL injection attacks
- **Transaction Safety**: Clears existing data before seeding
- **Error Handling**: Graceful handling of duplicate entries
- **Realistic Data**: Actual song names and appropriate durations

### Database Client (`db/client.js`)

- **Environment Variables**: Keeps credentials secure
- **Connection Pooling**: Efficient database connections
- **Module Export**: Reusable across the application

## 🧪 Testing Your Setup

After setup, verify everything works by connecting to your database:

```bash
psql -d jukebox
```

Then run some queries to explore the data:

```sql
-- See all playlists
SELECT * FROM playlists;

-- See all tracks
SELECT * FROM tracks;

-- See playlist-track relationships
SELECT p.name as playlist, t.name as track
FROM playlists p
JOIN playlists_tracks pt ON p.id = pt.playlist_id
JOIN tracks t ON t.id = pt.track_id
ORDER BY p.name, t.name;

-- Count tracks per playlist
SELECT p.name, COUNT(pt.track_id) as track_count
FROM playlists p
LEFT JOIN playlists_tracks pt ON p.id = pt.playlist_id
GROUP BY p.id, p.name
ORDER BY track_count DESC;
```

## 🎓 Learning Points

This database design demonstrates several important concepts:

1. **Many-to-Many Relationships**: How to model complex relationships between entities
2. **Junction Tables**: The standard approach for implementing many-to-many relationships
3. **Referential Integrity**: Using foreign keys to maintain data consistency
4. **Cascading Operations**: Automatic cleanup of related data
5. **Unique Constraints**: Preventing logical duplicates in your data
6. **Parameterized Queries**: Secure database interactions
7. **Environment Configuration**: Keeping sensitive data out of source code

## 📚 Next Steps

Now that your database is set up, you can:

1. Build API endpoints to interact with this data
2. Create user interfaces for playlist management
3. Add more complex queries for music recommendations
4. Implement user accounts and personal playlists
5. Add features like playlist sharing and collaborative editing

Happy coding! 🎵
