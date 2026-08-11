UPDATE articles
SET title = 'My 9 Favourite Musicians'
WHERE slug = 'my-9-favourite-albums';

UPDATE article_items
SET title = 'Yeat',
    meta = '2000 · RAGE RAP',
    image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Yeat.png/500px-Yeat.png'
WHERE article_id = (SELECT id FROM articles WHERE slug = 'my-9-favourite-albums') AND position = 1;

UPDATE article_items
SET title = 'Kanye West',
    meta = '1977 · HIP-HOP',
    image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Kanye_West_at_the_2009_Tribeca_Film_Festival_%28crop_2%29.jpg/500px-Kanye_West_at_the_2009_Tribeca_Film_Festival_%28crop_2%29.jpg'
WHERE article_id = (SELECT id FROM articles WHERE slug = 'my-9-favourite-albums') AND position = 2;

UPDATE article_items
SET title = '$uicideBoy$',
    meta = '2013 · HORRORCORE',
    image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Suicideboys_%28%24UICIDEBOY%24%29_logo.svg/500px-Suicideboys_%28%24UICIDEBOY%24%29_logo.svg.png'
WHERE article_id = (SELECT id FROM articles WHERE slug = 'my-9-favourite-albums') AND position = 3;

UPDATE article_items
SET title = 'Men I Trust',
    meta = '2014 · DREAM POP',
    image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Men_I_Trust_%40_The_Belasco_10_16_2021_%2851784136254%29.jpg/500px-Men_I_Trust_%40_The_Belasco_10_16_2021_%2851784136254%29.jpg'
WHERE article_id = (SELECT id FROM articles WHERE slug = 'my-9-favourite-albums') AND position = 4;

UPDATE article_items
SET title = 'LOCKED CLUB',
    meta = '2017 · ELECTRO PUNK',
    image_url = NULL
WHERE article_id = (SELECT id FROM articles WHERE slug = 'my-9-favourite-albums') AND position = 5;

UPDATE article_items
SET title = 'Biggie Smalls',
    meta = '1972 · HIP-HOP',
    image_url = 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/Biggie_Smalls_1997.jpg/500px-Biggie_Smalls_1997.jpg'
WHERE article_id = (SELECT id FROM articles WHERE slug = 'my-9-favourite-albums') AND position = 6;

UPDATE article_items
SET title = 'Death Grips',
    meta = '2010 · EXPERIMENTAL HIP-HOP',
    image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Death_grips_2014.jpg/500px-Death_grips_2014.jpg'
WHERE article_id = (SELECT id FROM articles WHERE slug = 'my-9-favourite-albums') AND position = 7;

UPDATE article_items
SET title = 'Megadeth',
    meta = '1983 · THRASH METAL',
    image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Megadeth_at_the_O2_Arena%2C_London%2C_26_October_2025.jpg/500px-Megadeth_at_the_O2_Arena%2C_London%2C_26_October_2025.jpg'
WHERE article_id = (SELECT id FROM articles WHERE slug = 'my-9-favourite-albums') AND position = 8;

UPDATE article_items
SET title = 'Wolfgang Amadeus Mozart',
    meta = '1756 · CLASSICAL',
    image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/The_Mozart_Family_-_Wolfgang_Amadeus_Mozart_headshot.jpg/500px-The_Mozart_Family_-_Wolfgang_Amadeus_Mozart_headshot.jpg'
WHERE article_id = (SELECT id FROM articles WHERE slug = 'my-9-favourite-albums') AND position = 9;
