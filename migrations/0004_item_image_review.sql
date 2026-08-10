-- Migration number: 0004 	2026-08-10T00:00:00.000Z

-- Both optional. `image_url` is a pasted link (no upload storage built yet
-- — R2 would be its own project); rows without one render a placeholder.
-- `review` presence is what makes a row clickable on the public list page
-- and gives it a detail page at /articles/:slug/:position — not a separate
-- flag, the content itself is the switch.
ALTER TABLE article_items ADD COLUMN image_url TEXT;
ALTER TABLE article_items ADD COLUMN review TEXT;
