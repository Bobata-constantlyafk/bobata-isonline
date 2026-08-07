-- Migration number: 0001 	 2026-08-07T12:48:31.543Z

-- Contact form submissions. Rows are never deleted on read — `read` and
-- `archived` are flags an admin toggles, so nothing vanishes by accident.
CREATE TABLE messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  handle TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  read INTEGER NOT NULL DEFAULT 0 CHECK (read IN (0, 1)),
  archived INTEGER NOT NULL DEFAULT 0 CHECK (archived IN (0, 1)),
  -- SHA-256 of the submitter's IP, not the IP itself — enough to spot a
  -- spam burst from one source without storing anything identifying.
  ip_hash TEXT,
  user_agent TEXT
);

CREATE INDEX idx_messages_created_at ON messages (created_at DESC);
CREATE INDEX idx_messages_unread ON messages (read, archived);

-- Named counters, one row each, so a new counter is an INSERT, not a
-- migration. Seeds the visitor count to match the number the rail's
-- placeholder widget has been showing.
CREATE TABLE counters (
  key TEXT PRIMARY KEY,
  value INTEGER NOT NULL DEFAULT 0
);

INSERT INTO counters (key, value) VALUES ('visitors', 4092);
