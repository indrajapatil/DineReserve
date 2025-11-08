const express = require('express');

const app = express();
const PORT = 5000;

const connectToMongo = require('./util/dbConfig.js');
const reservationRoutes = require('./routes/reservationRoutes.js');
const userRoutes = require('./routes/userRoutes.js');

// CORS Configuration
const allowedBaseDomains = [
  'dine-reserve.vercel.app',
  'www.dine-reserve.vercel.app',
  'localhost'
];

// Helper to check if the request origin is allowed
const isAllowedOrigin = (origin) => {
  if (!origin) return true; // Allow requests like Postman / server-to-server
  try {
    const url = new URL(origin);
    const hostname = url.hostname;

    // ✅ Allow from known base domains
    if (allowedBaseDomains.includes(hostname)) return true;

    // ✅ Allow any preview subdomain from Vercel ending with 'vercel.app'
    if (hostname.endsWith('vercel.app') && hostname.includes('dine-reserve')) {
      return true;
    }

    return false;
  } catch (err) {
    return false;
  }
};

try {
    const cors = require('cors');
    app.use(
      cors({
        origin: (origin, callback) => {
          if (isAllowedOrigin(origin)) callback(null, true);
          else callback(new Error('Not allowed by CORS'));
        },
        credentials: true,
      })
    );
    // handle preflight requests
    app.options('*', cors({
      origin: (origin, callback) => {
        if (isAllowedOrigin(origin)) callback(null, true);
        else callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
    }));
    console.log('CORS enabled with origin validation');
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