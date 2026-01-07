import React, { useState } from 'react';
import axios from 'axios'; // We use this to call the Map API
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Card, Form, Button, Row, Col, Badge, Spinner, Alert } from 'react-bootstrap';
import Autocomplete from 'react-google-autocomplete';

function App() {
  const [source, setSource] = useState(null);
  const [dest, setDest] = useState(null);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // --- THE "FREE" PRICING ENGINE ---
  // This runs in the browser to ensure your demo ALWAYS works.
  const calculatePrices = async () => {
    setLoading(true);
    setError('');
    setRides([]);

    try {
      const srcCoords = {
        lat: source.geometry.location.lat(),
        lon: source.geometry.location.lng(),
      };
      const destCoords = {
        lat: dest.geometry.location.lat(),
        lon: dest.geometry.location.lng(),
      };

      // 2. Get Real-time Uber prices from our backend
      let uberRides = [];
      try {
        const uberApiUrl = `http://localhost:8080/api/uber/estimates?start_latitude=${srcCoords.lat}&start_longitude=${srcCoords.lon}&end_latitude=${destCoords.lat}&end_longitude=${destCoords.lon}`;
        const uberRes = await axios.get(uberApiUrl);
        if (uberRes.data.prices) {
            uberRides = uberRes.data.prices.map(price => ({
                provider: 'Uber',
                price: price.high_estimate,
                vehicle: price.display_name,
                eta: (price.duration / 60).toFixed(0) + ' min',
                isFair: !price.surge_multiplier || price.surge_multiplier <= 1.2,
                fairPrice: Math.round(price.high_estimate / (price.surge_multiplier || 1))
            }));
        }
      } catch (uberError) {
          console.error("Could not fetch Uber prices", uberError);
          // Don't throw error, we can still show other prices
      }


      // 3. Get Real Driving Distance from OSRM (Free) for other providers
      const routeUrl = `https://router.project-osrm.org/route/v1/driving/${srcCoords.lon},${srcCoords.lat};${destCoords.lon},${destCoords.lat}?overview=false`;
      const routeRes = await axios.get(routeUrl);
      
      const distanceMeters = routeRes.data.routes[0].distance;
      const distanceKm = (distanceMeters / 1000).toFixed(1); // Convert to KM
      const durationMin = Math.round(routeRes.data.routes[0].duration / 60);

      // 4. Calculate Prices for other providers based on Real Distance
      const anchorPrice = uberRides.length > 0 ? uberRides[0].price : Math.round(50 + (distanceKm * 14) + (durationMin * 2));
      
      // Ola (Simulated to be competitive)
      const olaPrice = Math.round(anchorPrice * 0.95); 
      
      // Rapido (Bike is cheaper)
      const rapidoPrice = Math.round(anchorPrice * 0.60);

      // 5. Set the Data for the UI
      setRides([
        ...uberRides,
        { 
          provider: 'Ola', 
          price: olaPrice, 
          vehicle: 'Sedan', 
          eta: '6 min', 
          isFair: false, 
          fairPrice: Math.round(olaPrice * 0.8) 
        },
        { 
          provider: 'Rapido', 
          price: rapidoPrice, 
          vehicle: 'Bike', 
          eta: '2 min', 
          isFair: true, // Bike is usually "Fair"
          fairPrice: rapidoPrice 
        }
      ].sort((a, b) => a.price - b.price));

    } catch (err) {
      console.error(err);
      setError("Could not calculate route. Try simpler city names (e.g., 'Delhi', 'Noida').");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '40px 0' }}>
      <Container style={{ maxWidth: '600px' }}>
        
        {/* Header */}
        <div className="text-center mb-5">
          <h1 style={{ color: '#4b0082', fontWeight: 'bold' }}>FairRide 🚖</h1>
          <p className="text-muted">Compare Prices. Spot Surge. Save Money.</p>
        </div>

        {/* Search Box */}
        <Card className="p-4 shadow-sm border-0 mb-4">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Pickup Location</Form.Label>
              <Autocomplete
                apiKey={window.config?.googleMapsApiKey}
                className="form-control form-control-lg"
                onPlaceSelected={(place) => setSource(place)}
                options={{
                  types: ["geocode", "establishment"],
                  componentRestrictions: { country: "in" },
                }}
                placeholder="e.g. Connaught Place"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Where to?</Form.Label>
              <Autocomplete
                apiKey={window.config?.googleMapsApiKey}
                className="form-control form-control-lg"
                onPlaceSelected={(place) => setDest(place)}
                options={{
                  types: ["geocode", "establishment"],
                  componentRestrictions: { country: "in" },
                }}
                placeholder="e.g. India Gate"
              />
            </Form.Group>
            <Button 
              variant="dark" 
              size="lg" 
              className="w-100 mt-2" 
              onClick={calculatePrices}
              disabled={loading || !source || !dest}
              style={{ backgroundColor: '#4b0082', border: 'none' }}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Calculating Routes...
                </>
              ) : 'Find Fair Prices'}
            </Button>
          </Form>
        </Card>

        {/* Error Message */}
        {error && <Alert variant="danger">{error}</Alert>}

        {/* Results List */}
        {rides.map((ride, index) => (
          <Card key={index} className="mb-3 shadow-sm border-0">
            <Card.Body>
              <Row className="align-items-center">
                {/* Provider Info */}
                <Col xs={4}>
                  <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{ride.provider}</div>
                  <div className="text-muted small">{ride.vehicle} • {ride.eta}</div>
                </Col>
                
                {/* Price */}
                <Col xs={4} className="text-center">
                  <div style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>₹{ride.price}</div>
                </Col>

                {/* Fairness Badge */}
                <Col xs={4} className="text-end">
                   {ride.isFair ? (
                     <Badge bg="success" className="p-2">✅ Fair Price</Badge>
                   ) : (
                     <Badge bg="danger" className="p-2">⚠️ High Surge</Badge>
                   )}
                </Col>
              </Row>
              
              {/* AI Insight */}
              {!ride.isFair && (
                <div className="mt-2 text-danger small text-end" style={{fontSize: '0.85rem'}}>
                  <strong>AI Insight:</strong> 40% higher than usual. Fair price: ₹{ride.fairPrice}
                </div>
              )}
            </Card.Body>
          </Card>
        ))}

      </Container>
    </div>
  );
}

export default App;