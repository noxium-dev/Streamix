-- Videos table for storing published videos
CREATE TABLE IF NOT EXISTS videos (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  poster TEXT,
  resolution TEXT,
  duration INTEGER,
  play INTEGER DEFAULT 0,
  like INTEGER DEFAULT 0,
  isFeatured INTEGER DEFAULT 0,
  description TEXT,
  tags TEXT,
  genreId TEXT,
  artistId TEXT,
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (genreId) REFERENCES genres(id) ON DELETE SET NULL,
  FOREIGN KEY (artistId) REFERENCES artists(id) ON DELETE SET NULL
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_videos_featured ON videos(isFeatured);
CREATE INDEX IF NOT EXISTS idx_videos_created ON videos(createdAt DESC);
CREATE INDEX IF NOT EXISTS idx_videos_genre ON videos(genreId);
CREATE INDEX IF NOT EXISTS idx_videos_artist ON videos(artistId);

-- Artists table for storing artist/creator profiles
CREATE TABLE IF NOT EXISTS artists (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  bio TEXT,
  avatar TEXT, -- URL for the artist avatar/photo
  socialLinks TEXT, -- JSON string for social media links
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT DEFAULT (datetime('now'))
);

-- Genres table for storing movie/video genres
CREATE TABLE IF NOT EXISTS genres (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT, -- URL for the icon
  description TEXT,
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT DEFAULT (datetime('now'))
);

-- Users table for authentication and profile
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  createdAt TEXT DEFAULT (datetime('now'))
);

-- Sessions table for persistent logins
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expiresAt INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
