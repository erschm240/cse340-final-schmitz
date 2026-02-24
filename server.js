/**
 * Imports
 */
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

/**
 * Server Configuration
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;


/**
 * Setup Express Server
 */
const app = express();

/**
 * Configure Express
 */
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

/**
 * Routes
 */
app.get('/', (req, res) => {
    const title = 'Welcome to the homepage.'
    res.render('index', { title });
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});