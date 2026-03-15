-- Database seed file for starter tutorial and instructor content

BEGIN;

-- Drop existing tables in reverse depencency order
DROP TABLE IF EXISTS tutorial_steps CASCADE;
DROP TABLE IF EXISTS tutorials CASCADE;
DROP TABLE IF EXISTS instructors CASCADE;

-- Create instructors table
CREATE TABLE instructors (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(200) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    username VARCHAR(100) NOT NULL,
    img_url VARCHAR(300) NOT NULL,
    biography_text TEXT
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create tutorials table
CREATE TABLE tutorials (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(200) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    author VARCHAR(200) NOT NULL,
    likes INTEGER DEFAULT 0
);

-- create tutorial steps table
CREATE TABLE tutorial_steps (
    id INTEGER PRIMARY KEY,
    slug VARCHAR(200) UNIQUE NOT NULL,
    img_url VARCHAR(300) NOT NULL,
    text_content TEXT
);

-- Insert instructors
INSERT INTO instructors (slug, name, username, img_url, biography_text) VALUES
('emily-johnson', 'Emily Johnson', 'emilyknits1234', '/images/instructors/emily-johnson.jpg', 'Hi! I’m Emily and I’ve been knitting for 5 years. I love sharing my knowledge with others.'),
('amber-brown', 'Amber Brown', 'crazycrochet89', '/images/instructors/amber-brown.jpg', 'Hi! I’m Amber and I’ve been crocheting for 8 years. I love sharing my knowledge with others.'),
('jennifer-clarke', 'Jennifer Clarke', 'craftingwithjennifer54', '/images/instructors/jennifer-clarke.jpg', 'Hi! I’m Jennifer and I’ve been knitting for 7 years. I love sharing my knowledge with others.');

INSERT INTO tutorials (slug, title, description, author) VALUES
('cast-on-knit', 'Casting On for Knitting', 'Learn how to cast on to start your knitting project.', 'Emily Johnson'),
('cast-on-crochet', 'Casting On for Crochet', 'Learn how to cast on to start your crochet project.', 'Amber Brown'),
('knit-stitch', 'The Knit Stitch', 'Learn how to do the basic knit stitch, also called the "stockinette" stitch.', 'Jennifer Clarke');

INSERT INTO tutorial_steps (id, slug, img_url, text_content) VALUES;
-- To be written