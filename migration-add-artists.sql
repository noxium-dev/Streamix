-- Add new columns to videos table
ALTER TABLE videos ADD COLUMN genreId TEXT;
ALTER TABLE videos ADD COLUMN artistId TEXT;

-- Create artists table
CREATE TABLE IF NOT EXISTS artists (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  bio TEXT,
  avatar TEXT,
  socialLinks TEXT,
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT DEFAULT (datetime('now'))
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_videos_genre ON videos(genreId);
CREATE INDEX IF NOT EXISTS idx_videos_artist ON videos(artistId);
