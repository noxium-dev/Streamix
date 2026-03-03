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
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT DEFAULT (datetime('now'))
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_videos_featured ON videos(isFeatured);
CREATE INDEX IF NOT EXISTS idx_videos_created ON videos(createdAt DESC);

-- Genres table for storing movie/video genres
CREATE TABLE IF NOT EXISTS genres (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT, -- URL for the icon
  description TEXT,
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT DEFAULT (datetime('now'))
);
