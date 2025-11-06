const express = require('express');

const app = express();
const PORT = 5000;

const connectToMongo = require('./util/dbConfig.js');
const reservationRoutes = require('./routes/reservationRoutes.js');
const userRoutes = require('./routes/userRoutes.js');

// Enable CORS for local development (required for browser requests from different port)
// If you haven't installed the `cors` package yet, run `npm install cors` in the backend folder.
try {
    const cors = require('cors');
    app.use(cors());
    // handle preflight requests
    app.options('*', cors());
    console.log('CORS enabled');
} catch (e) {
    console.warn('CORS package not found. To enable CORS for the browser, run `npm install cors` in the backend folder.');
}

app.use(express.json());

// health endpoint (helps with 404 at root and quick checks)
app.get('/', (req, res) => res.send('OK'));

app.use('/api/reservation', reservationRoutes);
app.use('/api/user', userRoutes);

connectToMongo();
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});