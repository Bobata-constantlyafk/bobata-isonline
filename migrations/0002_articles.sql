-- Migration number: 0002 	 2026-08-10T00:00:00.000Z

-- Ranked lists (`type = 'list'`) render their nine rows from article_items;
-- essays (`type = 'essay'`) render `body` as prose instead. `skin` is a name
-- looked up against the presets in app/lib/skins.ts, not stored here — the
-- palette stays in code, only the pick lives in the row.
CREATE TABLE articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  skin TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('list', 'essay')),
  sort_order INTEGER NOT NULL,
  date TEXT NOT NULL,
  kicker TEXT NOT NULL,
  badge TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  -- Lists only — the /blog page's Channel A tile.
  blog_kicker TEXT,
  blog_background TEXT,
  -- Essays only — the /blog page's Channel B row hover tint.
  blog_tint TEXT,
  -- Essays only — MDX body text.
  body TEXT,
  -- Not surfaced anywhere yet; exists now so the admin editor (a later
  -- task) has a draft state to write to without a second migration.
  published INTEGER NOT NULL DEFAULT 1 CHECK (published IN (0, 1))
);

-- The nine rows of a ranked-list article. `meta` is freeform
-- ("1998 · PETER WEIR", "YEAR · LABEL") rather than separate columns,
-- matching how the three list types (movies/albums/manga) each format it
-- differently.
CREATE TABLE article_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  article_id INTEGER NOT NULL REFERENCES articles (id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  title TEXT NOT NULL,
  meta TEXT NOT NULL
);

CREATE INDEX idx_articles_published ON articles (published, sort_order);
CREATE INDEX idx_article_items_article ON article_items (article_id, position);
