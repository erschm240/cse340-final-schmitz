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
    biography_text TEXT,
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create tutorials table
CREATE TABLE tutorials (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(200) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    author VARCHAR(200) NOT NULL,
    likes INTEGER DEFAULT 0
);

-- create tutorial steps table
CREATE TABLE tutorial_steps (
    id SERIAL PRIMARY KEY,
    step_order INTEGER NOT NULL,
    slug VARCHAR(200) NOT NULL,
    img_url VARCHAR(300) NOT NULL,
    text_content TEXT,
    FOREIGN KEY (slug) REFERENCES tutorials(slug)
);

-- Insert instructors
INSERT INTO instructors (slug, name, username, img_url, biography_text) VALUES
('emily-johnson', 'Emily Johnson', 'emilyknits1234', '/images/instructors/emily-johnson.jpg', 'Hi! I’m Emily and I’ve been knitting for 5 years. I love sharing my knowledge with others.'),
('amber-brown', 'Amber Brown', 'crazycrochet89', '/images/instructors/amber-brown.jpg', 'Hi! I’m Amber and I’ve been crocheting for 8 years. I enjoy creating cute amigurumi stuffed animals!'),
('jennifer-clarke', 'Jennifer Clarke', 'craftingwithjennifer54', '/images/instructors/jennifer-clarke.jpg', 'Hi! I’m Jennifer and I’ve been knitting for 7 years. My favorite activity is working on a new sweater while rewatching TV shows and movies.');

-- Insert tutorials
INSERT INTO tutorials (slug, title, description, author) VALUES
('cast-on-knit', 'Casting On for Knitting', 'Learn how to cast on to start your knitting project.', 'Emily Johnson'),
('cast-on-crochet', 'Casting On for Crochet', 'Learn how to cast on to start your crochet project.', 'Amber Brown'),
('knit-stitch', 'The Knit Stitch', 'Learn how to do the basic knit stitch, also called the "stockinette" stitch.', 'Jennifer Clarke');

-- Insert tutorial steps
INSERT INTO tutorial_steps (step_order, slug, img_url, text_content) VALUES
(1, 'cast-on-knit', '/images/cast-on-knit/step-1.jpg', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut a mauris quis libero elementum pretium sit amet eu justo. Pellentesque id mauris ac nisi euismod laoreet. Morbi velit ligula, imperdiet ut sem vel, condimentum placerat arcu. Sed ligula dolor, venenatis a aliquet nec, molestie nec eros. Praesent tempor nulla ut tincidunt ultricies. Nunc mollis facilisis massa, quis ullamcorper nisi iaculis vitae. Nunc risus magna, fringilla eleifend leo eu, pulvinar laoreet leo.'),
(2, 'cast-on-knit', '/images/cast-on-knit/step-2.jpg', 'In vel enim mi. Cras facilisis enim eu tempor porta. Sed malesuada elit non imperdiet semper. Duis quis enim elementum, tempus ipsum eget, finibus dolor. Phasellus vulputate condimentum purus, et elementum turpis vehicula et. Phasellus quis tempus risus, ut facilisis libero. Donec rhoncus enim interdum erat vulputate ultrices. Cras dapibus sed nisl suscipit bibendum. Etiam id elit ut ex feugiat pretium et sit amet felis. Nunc auctor vestibulum est, ac ultrices elit rutrum at. Etiam sit amet dui massa. Nam maximus convallis lacinia.'),
(3, 'cast-on-knit', '/images/cast-on-knit/step-3.jpg', 'Suspendisse sed quam nec lectus porta egestas lobortis non ante. Quisque aliquam sapien vel magna dictum sollicitudin. Vivamus tincidunt orci id sapien placerat, at pellentesque mauris venenatis. Phasellus in imperdiet mi. Integer ultrices velit non dapibus congue. Praesent porta rutrum feugiat. Nulla sit amet volutpat quam. Proin non erat nisi. Aenean fringilla lacus quis bibendum ullamcorper. Ut iaculis risus id neque imperdiet, ut pulvinar nulla pretium. In blandit dapibus bibendum. Mauris sed ex velit. Duis dignissim tempor tincidunt. Nunc lacinia commodo vestibulum.'),
(1, 'cast-on-crochet', '/images/cast-on-crochet/step-1.jpg', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut a mauris quis libero elementum pretium sit amet eu justo. Pellentesque id mauris ac nisi euismod laoreet. Morbi velit ligula, imperdiet ut sem vel, condimentum placerat arcu. Sed ligula dolor, venenatis a aliquet nec, molestie nec eros. Praesent tempor nulla ut tincidunt ultricies. Nunc mollis facilisis massa, quis ullamcorper nisi iaculis vitae. Nunc risus magna, fringilla eleifend leo eu, pulvinar laoreet leo. Ut tempor ultrices mauris, sit amet viverra elit ornare id. Nulla facilisi.'),
(2, 'cast-on-crochet', '/images/cast-on-crochet/step-2.jpg', 'In vel enim mi. Cras facilisis enim eu tempor porta. Sed malesuada elit non imperdiet semper. Duis quis enim elementum, tempus ipsum eget, finibus dolor. Phasellus vulputate condimentum purus, et elementum turpis vehicula et. Phasellus quis tempus risus, ut facilisis libero. Donec rhoncus enim interdum erat vulputate ultrices. Cras dapibus sed nisl suscipit bibendum. Etiam id elit ut ex feugiat pretium et sit amet felis. Nunc auctor vestibulum est, ac ultrices elit rutrum at. Etiam sit amet dui massa. Nam maximus convallis lacinia.'),
(3, 'cast-on-crochet', '/images/cast-on-crochet/step-3.jpg', 'In vel enim mi. Cras facilisis enim eu tempor porta. Sed malesuada elit non imperdiet semper. Duis quis enim elementum, tempus ipsum eget, finibus dolor. Phasellus vulputate condimentum purus, et elementum turpis vehicula et. Phasellus quis tempus risus, ut facilisis libero. Donec rhoncus enim interdum erat vulputate ultrices. Cras dapibus sed nisl suscipit bibendum. Etiam id elit ut ex feugiat pretium et sit amet felis. Nunc auctor vestibulum est, ac ultrices elit rutrum at. Etiam sit amet dui massa. Nam maximus convallis lacinia.'),
(1, 'knit-stitch', '/images/knit-stitch/step-1.jpg', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut a mauris quis libero elementum pretium sit amet eu justo. Pellentesque id mauris ac nisi euismod laoreet. Morbi velit ligula, imperdiet ut sem vel, condimentum placerat arcu. Sed ligula dolor, venenatis a aliquet nec, molestie nec eros. Praesent tempor nulla ut tincidunt ultricies.'),
(2, 'knit-stitch', '/images/knit-stitch/step-2.jpg', 'Nunc mollis facilisis massa, quis ullamcorper nisi iaculis vitae. Nunc risus magna, fringilla eleifend leo eu, pulvinar laoreet leo. Ut tempor ultrices mauris, sit amet viverra elit ornare id. Nulla facilisi. Praesent sollicitudin tincidunt eros, et rhoncus velit egestas sed.'),
(3, 'knit-stitch', '/images/knit-stitch/step-3.jpg', 'In vel enim mi. Cras facilisis enim eu tempor porta. Sed malesuada elit non imperdiet semper. Duis quis enim elementum, tempus ipsum eget, finibus dolor. Phasellus vulputate condimentum purus, et elementum turpis vehicula et.'),
(4, 'knit-stitch', '/images/knit-stitch/step-4.jpg', 'Phasellus quis tempus risus, ut facilisis libero. Donec rhoncus enim interdum erat vulputate ultrices. Cras dapibus sed nisl suscipit bibendum. Etiam id elit ut ex feugiat pretium et sit amet felis. Nunc auctor vestibulum est, ac ultrices elit rutrum at. Etiam sit amet dui massa. Nam maximus convallis lacinia.');