require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/userRoutes');
const listingsRoutes = require('./routes/listingsRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const secondAppRoutes = require('./routes/secondAppRoutes');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin === process.env.APP_URL) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use('/users', userRoutes);
app.use('/listings', listingsRoutes);
app.use('/', paymentRoutes);
app.use('/', secondAppRoutes);

// Test routes
app.get('/test', (_req, res) => res.send('It works!'));
app.get('/test-user/:id', async (req, res) => {
  const pool = require('./db');
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
