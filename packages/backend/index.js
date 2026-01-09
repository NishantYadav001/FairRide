const express = require('express');
const cors = require('cors');
const PropertiesReader = require('properties-reader');
const fetch = require('node-fetch');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

const app = express();
const properties = PropertiesReader('application.properties');

const port = properties.get('server.port') || 8080;
const uberApiBaseUrl = properties.get('uber.api.base-url');
const uberClientId = properties.get('uber.client-id');
const uberServerToken = properties.get('uber.server-token');

// ---------- MySQL connection pool ----------
const pool = mysql.createPool({
  host: '127.0.0.1',      // your MySQL host
  user: 'root',           // your MySQL username
  password: 'root',       // your MySQL password
  database: 'cab_app',    // your DB name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.use(cors());
app.use(express.json());

// ---------- surge + formula fares ----------
function getSurgeMultiplier() {
  const hour = new Date().getHours();
  const isPeak = (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20);

  let baseSurge = 1.0;
  if (isPeak) {
    baseSurge = 1.2 + Math.random() * 0.6;
  } else {
    baseSurge = 1.0 + Math.random() * 0.2;
  }
  return baseSurge;
}

const formulaProviders = [
  { id: 'ola_mini',    name: 'Ola Mini',    providerLabel: 'Ola',    baseFare: 35, perKm: 11,  perMin: 1   },
  { id: 'uber_go',     name: 'Uber Go',     providerLabel: 'Uber',   baseFare: 40, perKm: 12,  perMin: 1.2 },
  { id: 'rapido_bike', name: 'Rapido Bike', providerLabel: 'Rapido', baseFare: 20, perKm: 7,   perMin: 0.8 }
];

app.post('/api/fare-estimates', (req, res) => {
  const { distanceKm, durationMin } = req.body;

  if (typeof distanceKm !== 'number' || typeof durationMin !== 'number') {
    return res.status(400).json({ error: 'distanceKm and durationMin (numbers) are required' });
  }

  const results = formulaProviders.map(p => {
    let surge = getSurgeMultiplier();
    if (p.id === 'rapido_bike') {
      surge = 1.0 + Math.random() * 0.1;
    }

    const rawFare = p.baseFare + p.perKm * distanceKm + p.perMin * durationMin;
    const total = Math.round(rawFare * surge);

    return {
      id: p.id,
      provider: p.providerLabel,
      vehicle: p.name,
      price: total,
      surge: surge
    };
  });

  results.sort((a, b) => a.price - b.price);
  res.json(results);
});

// ---------- Uber proxy ----------
app.get('/api/uber/estimates', async (req, res) => {
  const { start_latitude, start_longitude, end_latitude, end_longitude } = req.query;

  if (!start_latitude || !start_longitude || !end_latitude || !end_longitude) {
    return res.status(400).json({ error: 'Missing required query parameters.' });
  }

  const url = `${uberApiBaseUrl}/estimates/price?start_latitude=${start_latitude}` +
              `&start_longitude=${start_longitude}` +
              `&end_latitude=${end_latitude}` +
              `&end_longitude=${end_longitude}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Token ${uberServerToken}`,
        'Accept-Language': 'en_US',
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching Uber estimates:', error);
    res.status(500).json({ error: 'Failed to fetch estimates from Uber.' });
  }
});

// ---------- Auth routes (using MySQL) ----------

// POST /api/auth/signup
app.post('/api/auth/signup', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const conn = await pool.getConnection();

    const [rows] = await conn.query('SELECT id FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      conn.release();
      return res.status(409).json({ error: 'User already exists.' });
    }

    const hash = await bcrypt.hash(password, 10);
    await conn.query(
      'INSERT INTO users (email, password_hash) VALUES (?, ?)',
      [email, hash]
    );
    conn.release();

    return res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.query(
      'SELECT id, password_hash FROM users WHERE email = ?',
      [email]
    );
    conn.release();

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    return res.json({ message: 'Login successful.' });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

const path = require('path');

// ---------- Test DB route (optional) ----------
app.get('/api/db-test', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.query('SELECT 1 AS ok');
    conn.release();
    res.json(rows[0]);   // { ok: 1 }
  } catch (err) {
    console.error('DB test failed:', err);
    res.status(500).json({ error: 'DB connection failed' });
  }
});

// Serve the frontend
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
