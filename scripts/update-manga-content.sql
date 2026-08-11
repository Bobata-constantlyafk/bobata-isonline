UPDATE articles
SET title = 'My 9 Favourite Anime/Manga'
WHERE slug = 'my-9-favourite-manga';

UPDATE article_items
SET title = 'Hunter x Hunter',
    meta = '1998 · YOSHIHIRO TOGASHI',
    image_url = 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e8/Hunter_%C3%97_Hunter_vol._1.png/500px-Hunter_%C3%97_Hunter_vol._1.png'
WHERE article_id = (SELECT id FROM articles WHERE slug = 'my-9-favourite-manga') AND position = 1;

UPDATE article_items
SET title = 'One Piece',
    meta = '1997 · EIICHIRO ODA',
    image_url = 'https://upload.wikimedia.org/wikipedia/en/thumb/9/90/One_Piece%2C_Volume_61_Cover_%28Japanese%29.jpg/500px-One_Piece%2C_Volume_61_Cover_%28Japanese%29.jpg'
WHERE article_id = (SELECT id FROM articles WHERE slug = 'my-9-favourite-manga') AND position = 2;

UPDATE article_items
SET title = 'Chainsaw Man',
    meta = '2018 · TATSUKI FUJIMOTO',
    image_url = 'https://upload.wikimedia.org/wikipedia/en/thumb/2/24/Chainsawman.jpg/500px-Chainsawman.jpg'
WHERE article_id = (SELECT id FROM articles WHERE slug = 'my-9-favourite-manga') AND position = 3;

UPDATE article_items
SET title = 'Samurai Champloo',
    meta = '2004 · SHINICHIRO WATANABE',
    image_url = 'https://upload.wikimedia.org/wikipedia/en/thumb/4/48/Samurai_Champloo_key_art.jpg/500px-Samurai_Champloo_key_art.jpg'
WHERE article_id = (SELECT id FROM articles WHERE slug = 'my-9-favourite-manga') AND position = 4;

UPDATE article_items
SET title = 'Konosuba',
    meta = '2013 · NATSUME AKATSUKI',
    image_url = 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3e/Kono_Subarashii_Sekai_ni_Shukufuku_o%21_light_novel_volume_1_cover.jpg/500px-Kono_Subarashii_Sekai_ni_Shukufuku_o%21_light_novel_volume_1_cover.jpg'
WHERE article_id = (SELECT id FROM articles WHERE slug = 'my-9-favourite-manga') AND position = 5;

UPDATE article_items
SET title = 'Death Note',
    meta = '2003 · T. OHBA & T. OBATA',
    image_url = 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6f/Death_Note_Vol_1.jpg/500px-Death_Note_Vol_1.jpg'
WHERE article_id = (SELECT id FROM articles WHERE slug = 'my-9-favourite-manga') AND position = 6;

UPDATE article_items
SET title = 'Steel Ball Run',
    meta = '2004 · HIROHIKO ARAKI',
    image_url = 'https://upload.wikimedia.org/wikipedia/en/thumb/8/87/Steel_Ball_Run_1.jpg/500px-Steel_Ball_Run_1.jpg'
WHERE article_id = (SELECT id FROM articles WHERE slug = 'my-9-favourite-manga') AND position = 7;

UPDATE article_items
SET title = 'Golden Boy',
    meta = '1992 · TATSUYA EGAWA',
    image_url = 'https://upload.wikimedia.org/wikipedia/en/thumb/a/ac/Golden_Boy_volume_1_cover_jap.png/500px-Golden_Boy_volume_1_cover_jap.png'
WHERE article_id = (SELECT id FROM articles WHERE slug = 'my-9-favourite-manga') AND position = 8;

UPDATE article_items
SET title = 'Spirited Away',
    meta = '2001 · HAYAO MIYAZAKI',
    image_url = 'https://upload.wikimedia.org/wikipedia/en/thumb/d/db/Spirited_Away_Japanese_poster.png/500px-Spirited_Away_Japanese_poster.png'
WHERE article_id = (SELECT id FROM articles WHERE slug = 'my-9-favourite-manga') AND position = 9;
