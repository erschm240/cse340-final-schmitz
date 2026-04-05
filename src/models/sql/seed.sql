-- Database seed file for starter tutorial and instructor content

BEGIN;

-- Drop existing tables in reverse depencency order
DROP TABLE IF EXISTS tutorial_comments CASCADE;
DROP TABLE IF EXISTS tutorial_steps CASCADE;
DROP TABLE IF EXISTS tutorials CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS instructors CASCADE;
DROP TABLE IF EXISTS contact_form CASCADE;

-- Create contact form table
CREATE TABLE IF NOT EXISTS contact_form (
    id SERIAL PRIMARY KEY,
    recipient VARCHAR(255) NOT NULL,
    message_type VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    sent_by VARCHAR(255) NOT NULL,
    submitted TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create instructors table
CREATE TABLE IF NOT EXISTS instructors (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(200) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL,
    img_file_type VARCHAR(300) NOT NULL,
    biography_text TEXT,
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(role_id) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create tutorials table
CREATE TABLE IF NOT EXISTS tutorials (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(200) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    author VARCHAR(200) NOT NULL,
    likes INTEGER DEFAULT 0
);

-- create tutorial steps table
CREATE TABLE IF NOT EXISTS tutorial_steps (
    id SERIAL PRIMARY KEY,
    step_order INTEGER NOT NULL,
    slug VARCHAR(200) NOT NULL,
    img_file_type VARCHAR(300) NOT NULL,
    text_content TEXT,
    FOREIGN KEY (slug) REFERENCES tutorials(slug)
);

-- Create tutorial comment table
CREATE TABLE IF NOT EXISTS tutorial_comments (
    id SERIAL PRIMARY KEY,
    sent_by VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    posted_in VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert instructors
INSERT INTO instructors (slug, name, username, img_file_type, biography_text) VALUES
    ('emily-johnson', 'Emily Johnson', 'emilyknits1234', 'jpg', 'Hi! I’m Emily and I’ve been knitting for 5 years. I love sharing my knowledge with others.'),
    ('amber-brown', 'Amber Brown', 'crazycrochet89', 'jpg', 'Hi! I’m Amber and I’ve been crocheting for 8 years. I enjoy creating cute amigurumi stuffed animals!'),
    ('jennifer-clarke', 'Jennifer Clarke', 'craftingwithjennifer54', 'jpg', 'Hi! I’m Jennifer and I’ve been knitting for 7 years. My favorite activity is working on a new sweater while rewatching TV shows and movies.');

-- Insert user roles
INSERT INTO roles (role_name, role_description) VALUES
    ('user', 'standard user with slightly more privileges than when not logged in, can view tutorials, post comments on them, react with a like, see the tutorials they have liked, can fill out contact form with suggestions'),
    ('instructor', 'Mid-level authorization on site, can create tutorials using the tutorial form, make changes to tutorials, react to tutorials with comments/likes, view liked tutorials, upload images to site, view and respond to messages sent to them'),
    ('admin', 'Administrator with full system access (full CRUD privileges), make changes to website and to tutorials, view and respond to all messages, may also react to tutorials but unlikely');

INSERT INTO users (name, username, email, password_hash, role_id) VALUES
    ('Ava Grace', 'gracethedog', 'admin1@example.com', '$2b$10$lQDOF8sILTLKu2L26zSViuzDI3YMBDhoL3lEFInD.i2nRrtTN0osC', 2),
    ('Emily Johnson', 'emilyknits1234', 'instructor1@example.com', '$2b$10$lQDOF8sILTLKu2L26zSViuzDI3YMBDhoL3lEFInD.i2nRrtTN0osC', 2),
    ('Amber Brown', 'crazycrochet89', 'instructor2@example.com', '$2b$10$lQDOF8sILTLKu2L26zSViuzDI3YMBDhoL3lEFInD.i2nRrtTN0osC', 2),
    ('Jennifer Clarke', 'jenniferclarke77', 'instructor3@example.com', '$2b$10$lQDOF8sILTLKu2L26zSViuzDI3YMBDhoL3lEFInD.i2nRrtTN0osC', 2),
    ('Molly Weaver', 'knittinggremlin77', 'user1@example.com', '$2b$10$lQDOF8sILTLKu2L26zSViuzDI3YMBDhoL3lEFInD.i2nRrtTN0osC', 1);

-- Insert tutorials
INSERT INTO tutorials (slug, title, description, author) VALUES
    ('cast-on-knit', 'Casting On for Knitting', 'Learn how to cast on to start your knitting project. The needles shown here are double pointed needles (abbreviated as DPNs), but you can also use single pointed needles. You may prefer them as a beginner since the stitches won’t fall off the bottom. I like circular needles, which are like DPNs but are connected on one end by a cord.', 'Emily Johnson'),
    ('cast-on-crochet', 'Casting On for Crochet', 'Learn how to cast on to start your crochet project. The technique shown here is chaining, when the stitches are created in a continuous chain. There is also a technique called Magic Ring where you make stitches along a circular ring of yarn.', 'Amber Brown'),
    ('knit-stitch', 'The Knit Stitch', 'The knit stitch (also called the stockinette stitch) is one of the foundational stitches (along with the purl stitch which is basically the opposite of the knit stitch). You can use the knit and purl stitches together to create dozens of interesting patterns, like cabling, ribbing, or checkering (alternating squares of knit and purl). The needles shown here are double pointed needles (abbreviated as DPNs), but you can also use single pointed needles. You may prefer them as a beginner since the stitches won’t fall off the bottom. I like circular needles, which are like DPNs but are connected on one end by a cord. This tutorial is a continuation from the cast on knitting tutorial.', 'Jennifer Clarke'),
    ('slipknot', 'Creating a Slipknot', 'There are many ways to cast on, this method uses a slipknot. When you create the slipknot, There are two strands of yarn: one you pull on to tighten and the other to loosen. In casting on for knitting, you will use both to create the stitches. The one that leads to the end of the yarn (called the tail) and not into the yarn ball (called the working yarn) needs to be enough to make the amount of stitches you need (basically, you will use the same length of both strands of yarn, so you have to be careful about how long you make the tail). A good rule of thumb is to determine the length of all the stitches you will need (like if you are making a twin size blanket or a 22-inch circumference hat) and make the tail three times that length. In crochet, you can make a long or short tail depending on the project. You should make a short tail if you’re just going to weave it in later (prevent the project from unraveling). If you need a strand of yarn to sew pieces of a project together, you should make a long tail (similar to having enough yarn to make stitches, you need a long enough tail to comfortably sew on the piece).', 'Emily Johnson');

-- Insert tutorial steps
INSERT INTO tutorial_steps (step_order, slug, img_file_type, text_content) VALUES
    (1, 'cast-on-knit', 'jpg', 'Create a slipknot with a long tail (enough length to make the amount of stitches you need).'),
    (2, 'cast-on-knit', 'jpg', 'Slide the slipknot loop on your knitting needle. Make sure the tail is “facing” you (best shown in the image), on the front side of the needle (the side you are closest to). The working yarn (the end of the yarn that leads into the yarn ball) should be on the opposite side.'),
    (3, 'cast-on-knit', 'jpg', 'Hold the needle in one hand and with the other, facing palm-down, put your pointer finger and thumb in between the two yarn strands. Hold both of them with your bottom three fingers. '),
    (4, 'cast-on-knit', 'jpg', 'Now twist your hand up to the left, so your palm is not fully up, but angled up and facing towards the right. Now you are ready to cast on loops.'),
    (5, 'cast-on-knit', 'jpg', 'Now four little strands form a V shape formed by your fingers. I will refer to them as inner/outer thumb or inner/outer pointer. Start by sliding your needle underneath the outer thumb strand, coming from the outer edge, and pulling up.'),
    (6, 'cast-on-knit', 'jpg', 'Once you have the first one, then you will go for the inner pointer strand, coming from between the two pointer strands and pulling up.'),
    (7, 'cast-on-knit', 'jpg', 'Now move the loop on your thumb over the needle and slide your thumb out.'),
    (8, 'cast-on-knit', 'jpg', 'Pull the two strands gently until they form a snug loop on the needle, with enough space to slide your second needle through it (doing the first row is very difficult when your stitches are too tight to get your second needle through it.'),
    (9, 'cast-on-knit', 'jpg', 'Repeat steps 2-8 until you have the desired amount of stitches. Don’t worry if your stitches end up too tight or too loose, or it end up being a tangled mess. It takes time to develop the muscle memory for this technique (as it goes with lots of things!).'),
    (1, 'cast-on-crochet', 'jpg', 'Make a long tailed or short tailed slipknot (enough to weave in or sew with).'),
    (2, 'cast-on-crochet', 'jpg', 'Attach the loop to your hook. Hold the working yarn (the end of the yarn that leads into the yarn ball) whichever way is comfortable for you. You might want to wrap it as pictured. This way allows you to pinch the base of the slipknot as you work, which makes creating the chain stitches a lot easier.'),
    (3, 'cast-on-crochet', 'jpg', 'Wrap working yarn around the hook from the back to the front, going clockwise. I’ve made the loop bigger to better show what I mean, usually the loop should fit the hook (but not so tight the that it’s hard to slide it back and forth).'),
    (4, 'cast-on-crochet', 'jpg', 'Slide the working yarn into the hook, as we are going to slide our loop over it to create another loop. '),
    (5, 'cast-on-crochet', 'jpg', 'Slide the loop over the hook and pull the new loop through. You’ve just made your first chain!'),
    (6, 'cast-on-crochet', 'jpg', 'Repeat steps 2-5 until you have the desired amount of chains for your project.'),
    (1, 'knit-stitch', 'jpg', 'Once you have a cast on row of stitches, transfer your needle with stitches from the right to the left hand. Flip it so the yarn strands are on the right end of the needle instead of the left. Hold your other needle in your right hand. For this tutorial I will hold the working yarn (the end of the yarn that leads into the yarn ball) in my right hand which is called the English style of knitting. Make sure to keep the working yarn behind your needles for the knit stitch.'),
    (2, 'knit-stitch', 'jpg', 'On each stitch, there is a front leg and a back leg. Slide your right needle into the front leg, coming from the back of the stitch and going behind the left needle.'),
    (3, 'knit-stitch', 'jpg', 'Wrap the working yarn around the right needle, coming from the back to the front (counterclockwise). Slide it under the left needle as we will be sliding the stitch on the left needle over the working yarn. In the picture the working yarn is just above, just slide the yarn slightly below that (pictured this way to show the wrapping direction easier).'),
    (4, 'knit-stitch', 'jpg', 'Slide the stitch on the left needle carefully up and over the right needle. Make sure the working yarn does not come off the right needle (if it does, just replace your left stich back on its needle/slide the stitch back down the right needle and try again). There should be a loop on the right needles now.'),
    (5, 'knit-stitch', 'jpg', 'Slide the stitch on the left needle carefully up and off of the left needle. Now you have made a new knit stitch! Adjust the tightness of the new stitch as needed using the working yarn.'),
    (6, 'knit-stitch', 'jpg', 'Repeat steps 2-4 for every stitch on the left needle. Once you have finished a row (pictured here) repeat all steps again to make a second row, third row, etc.'),
    (1, 'slipknot', 'jpg', 'Pull out as much yarn as you need in the tail, then drape it over your finger (likely your pointer, but whichever one you will wrap the yarn around) with the tail end in the front. If you are holding your hand with your palm facing you, it should be on the palm side of your hand. Then wrap the yarn behind you (leading to the yarn ball) around your finger twice, going behind your finger, then bringing it up to the front. '),
    (2, 'slipknot', 'jpg', 'There should be two loops on your finger now. Take the loop on the left and pull it until it rests over the right loop, but don’t slide it off your finger. It is now the right loop, crossing over the second loop.'),
    (3, 'slipknot', 'jpg', 'Now take the new left loop and pull it over the new right loop. This one you will slide off your finger. Pull tight from either the loop on your finger or the yarn strands below, both will work.');

COMMIT;