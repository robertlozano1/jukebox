import db from "#db/client";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

/**
 * SEED FUNCTION - Populates the jukebox database with sample data
 *
 * This function creates:
 * - 20+ sample tracks with realistic names and durations
 * - 10+ playlists with different moods/themes
 * - 15+ playlist-track associations to demonstrate relationships
 *
 * The seed data demonstrates various music genres and playlist themes
 * to showcase the flexibility of the jukebox system.
 */
async function seed() {
  console.log("🌱 Starting database seeding...");

  try {
    // First, clear existing data (in correct order to avoid foreign key conflicts)
    console.log("🧹 Clearing existing data...");
    await db.query("DELETE FROM playlists_tracks");
    await db.query("DELETE FROM tracks");
    await db.query("DELETE FROM playlists");

    /*
     * SEED TRACKS DATA
     *
     * Creating 20+ tracks with diverse genres and realistic durations
     * Duration is stored in milliseconds (ms)
     * Average song length is 3-4 minutes (180,000-240,000 ms)
     */
    console.log("🎵 Seeding tracks...");
    const tracksData = [
      { name: "Bohemian Rhapsody", duration_ms: 355000 }, // 5:55
      { name: "Sweet Child O' Mine", duration_ms: 356000 }, // 5:56
      { name: "Hotel California", duration_ms: 391000 }, // 6:31
      { name: "Stairway to Heaven", duration_ms: 482000 }, // 8:02
      { name: "Imagine", duration_ms: 183000 }, // 3:03
      { name: "Billie Jean", duration_ms: 294000 }, // 4:54
      { name: "Like a Rolling Stone", duration_ms: 369000 }, // 6:09
      { name: "Smells Like Teen Spirit", duration_ms: 301000 }, // 5:01
      { name: "Purple Haze", duration_ms: 170000 }, // 2:50
      { name: "Good Vibrations", duration_ms: 218000 }, // 3:38
      { name: "What's Going On", duration_ms: 231000 }, // 3:51
      { name: "Respect", duration_ms: 147000 }, // 2:27
      { name: "Johnny B. Goode", duration_ms: 161000 }, // 2:41
      { name: "I Want to Hold Your Hand", duration_ms: 145000 }, // 2:25
      { name: "Born to Run", duration_ms: 270000 }, // 4:30
      { name: "Losing My Religion", duration_ms: 267000 }, // 4:27
      { name: "Wonderwall", duration_ms: 258000 }, // 4:18
      { name: "Black", duration_ms: 343000 }, // 5:43
      { name: "Creep", duration_ms: 238000 }, // 3:58
      { name: "Mr. Brightside", duration_ms: 202000 }, // 3:22
      { name: "Hey Ya!", duration_ms: 235000 }, // 3:55
      { name: "Crazy", duration_ms: 229000 }, // 3:49
      { name: "Somebody That I Used to Know", duration_ms: 244000 }, // 4:04
      { name: "Rolling in the Deep", duration_ms: 228000 }, // 3:48
    ];

    // Insert all tracks and collect their IDs for later use
    const trackIds = [];
    for (const track of tracksData) {
      const result = await db.query(
        "INSERT INTO tracks (name, duration_ms) VALUES ($1, $2) RETURNING id",
        [track.name, track.duration_ms]
      );
      trackIds.push(result.rows[0].id);
    }
    console.log(`✅ Inserted ${trackIds.length} tracks`);

    /*
     * SEED PLAYLISTS DATA
     *
     * Creating 10+ playlists with different themes and moods
     * Each playlist represents a different listening experience
     */
    console.log("📝 Seeding playlists...");
    const playlistsData = [
      {
        name: "Classic Rock Legends",
        description:
          "Timeless rock anthems that defined generations of music lovers",
      },
      {
        name: "Chill Vibes",
        description: "Relaxing tracks perfect for unwinding after a long day",
      },
      {
        name: "Workout Pump",
        description: "High-energy songs to keep you motivated during exercise",
      },
      {
        name: "Road Trip Essentials",
        description: "Perfect soundtrack for long drives and adventures",
      },
      {
        name: "90s Nostalgia",
        description:
          "The best hits from the decade that brought us grunge and alternative",
      },
      {
        name: "Feel Good Hits",
        description: "Uplifting songs guaranteed to boost your mood",
      },
      {
        name: "Late Night Vibes",
        description:
          "Mellow tunes for those quiet, contemplative evening hours",
      },
      {
        name: "Party Starters",
        description:
          "Get the crowd moving with these certified dance floor fillers",
      },
      {
        name: "Acoustic Sessions",
        description:
          "Stripped-down versions and acoustic gems for intimate listening",
      },
      {
        name: "Greatest Hits Collection",
        description:
          "The most iconic songs from legendary artists across decades",
      },
      {
        name: "Alternative Rock Mix",
        description:
          "Indie and alternative tracks that push creative boundaries",
      },
      {
        name: "Emotional Journey",
        description: "Songs that tell stories and evoke deep feelings",
      },
    ];

    // Insert all playlists and collect their IDs for associations
    const playlistIds = [];
    for (const playlist of playlistsData) {
      const result = await db.query(
        "INSERT INTO playlists (name, description) VALUES ($1, $2) RETURNING id",
        [playlist.name, playlist.description]
      );
      playlistIds.push(result.rows[0].id);
    }
    console.log(`✅ Inserted ${playlistIds.length} playlists`);

    /*
     * SEED PLAYLIST-TRACK ASSOCIATIONS
     *
     * Creating realistic associations between playlists and tracks
     * Each association represents a track being added to a playlist
     * We'll create 15+ associations to demonstrate the many-to-many relationship
     */
    console.log("🔗 Creating playlist-track associations...");

    const associations = [
      // Classic Rock Legends playlist
      { playlist: 0, tracks: [0, 1, 2, 3, 8] }, // Bohemian Rhapsody, Sweet Child O' Mine, Hotel California, Stairway to Heaven, Purple Haze

      // Chill Vibes playlist
      { playlist: 1, tracks: [4, 10, 15, 18] }, // Imagine, What's Going On, Losing My Religion, Creep

      // Workout Pump playlist
      { playlist: 2, tracks: [5, 7, 14, 19, 20] }, // Billie Jean, Smells Like Teen Spirit, Born to Run, Mr. Brightside, Hey Ya!

      // Road Trip Essentials playlist
      { playlist: 3, tracks: [1, 2, 6, 14, 16] }, // Sweet Child O' Mine, Hotel California, Like a Rolling Stone, Born to Run, Wonderwall

      // 90s Nostalgia playlist
      { playlist: 4, tracks: [7, 15, 17, 18] }, // Smells Like Teen Spirit, Losing My Religion, Black, Creep

      // Feel Good Hits playlist
      { playlist: 5, tracks: [9, 13, 19, 20, 21] }, // Good Vibrations, I Want to Hold Your Hand, Mr. Brightside, Hey Ya!, Crazy

      // Late Night Vibes playlist
      { playlist: 6, tracks: [4, 17, 18, 23] }, // Imagine, Black, Creep, Rolling in the Deep

      // Party Starters playlist
      { playlist: 7, tracks: [5, 12, 20, 21] }, // Billie Jean, Johnny B. Goode, Hey Ya!, Crazy

      // Greatest Hits Collection playlist (largest playlist with many tracks)
      { playlist: 9, tracks: [0, 1, 3, 4, 5, 6, 7, 13, 19] }, // Multiple classic hits

      // Alternative Rock Mix playlist
      { playlist: 10, tracks: [7, 15, 16, 17, 18] }, // Grunge and alternative tracks
    ];

    let associationCount = 0;
    for (const association of associations) {
      const playlistId = playlistIds[association.playlist];

      for (const trackIndex of association.tracks) {
        const trackId = trackIds[trackIndex];

        try {
          await db.query(
            "INSERT INTO playlists_tracks (playlist_id, track_id) VALUES ($1, $2)",
            [playlistId, trackId]
          );
          associationCount++;
        } catch (error) {
          // Skip if association already exists (due to unique constraint)
          if (!error.message.includes("duplicate key")) {
            throw error;
          }
        }
      }
    }

    console.log(`✅ Created ${associationCount} playlist-track associations`);
    console.log("🎉 Database seeding completed successfully!");

    // Display summary of seeded data
    const trackCount = await db.query("SELECT COUNT(*) FROM tracks");
    const playlistCount = await db.query("SELECT COUNT(*) FROM playlists");
    const associationCount2 = await db.query(
      "SELECT COUNT(*) FROM playlists_tracks"
    );

    console.log("\n📊 SEEDING SUMMARY:");
    console.log(`   🎵 Tracks: ${trackCount.rows[0].count}`);
    console.log(`   📝 Playlists: ${playlistCount.rows[0].count}`);
    console.log(`   🔗 Associations: ${associationCount2.rows[0].count}`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}
