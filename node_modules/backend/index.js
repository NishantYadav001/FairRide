const express = require('express');
const cors = require('cors');
const PropertiesReader = require('properties-reader');
const fetch = require('node-fetch');

const app = express();
const properties = PropertiesReader('application.properties');

const port = properties.get('server.port') || 8080;
const uberApiBaseUrl = properties.get('uber.api.base-url');
const uberClientId = properties.get('uber.client-id');
const uberServerToken = properties.get('uber.server-token');

app.use(cors());
app.use(express.json());

app.post('/api/search-rides', (req, res) => {
  const { source, destination } = req.body;

  // In a real application, you would use the source and destination
  // to fetch ride data from various cab services APIs.
  // For this demo, we'll return some mock data.

  const mockRides = [
    { provider: 'Uber', price: 450, eta: '4 min', vehicle: 'Sedan', isFair: false, fairPrice: 380 },
    { provider: 'Ola', price: 430, eta: '6 min', vehicle: 'Mini', isFair: false, fairPrice: 380 },
    { provider: 'Rapido', price: 190, eta: '2 min', vehicle: 'Bike', isFair: true, fairPrice: 200 },
    // Add more mock data as needed
  ];

  res.json(mockRides);
});

app.get('/api/uber/estimates', async (req, res) => {
    const { start_latitude, start_longitude, end_latitude, end_longitude } = req.query;

    if (!start_latitude || !start_longitude || !end_latitude || !end_longitude) {
        return res.status(400).json({ error: 'Missing required query parameters.' });
    }

    const url = `${uberApiBaseUrl}/estimates/price?start_latitude=${start_latitude}&start_longitude=${start_longitude}&end_latitude=${end_latitude}&end_longitude=${end_longitude}`;

    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Token ${uberServerToken}`,
                'Accept-Language': 'en_US',
                'Content-Type': 'application.json'
            }
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching Uber estimates:', error);
        res.status(500).json({ error: 'Failed to fetch estimates from Uber.' });
    }
});

app.get('/', (req, res) => {
  res.send('Backend server is running.');
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
