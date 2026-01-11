import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Alert } from 'react-bootstrap';
import MapPicker from './MapPicker';

// API base can be overridden by public/config.js which sets window.appConfig.apiBase
const API_BASE = (window.appConfig && window.appConfig.apiBase) || 'http://localhost:8081';

const Home = () => {
  const [source, setSource] = useState(null);
  const [dest, setDest] = useState(null);
  const [sourceText, setSourceText] = useState('');
  const [destText, setDestText] = useState('');
  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [routeTitle, setRouteTitle] = useState('Route');
  const [routeDistance, setRouteDistance] = useState('–');
  const [routeDuration, setRouteDuration] = useState('–');
  const [avgPrice, setAvgPrice] = useState('–');

  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const [filter, setFilter] = useState('all');
  const [showMap, setShowMap] = useState(false);
  const [mapFor, setMapFor] = useState('source');

  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail');
    const savedName = localStorage.getItem('userName');
    if (savedEmail) {
      setUser({ email: savedEmail, name: savedName || '' });
      document.body.classList.add('has-right-sidebar');
    }

    const openLoginHandler = () => setShowLogin(true);
    const openSignupHandler = () => setShowSignup(true);
    window.addEventListener('openLogin', openLoginHandler);
    window.addEventListener('openSignup', openSignupHandler);

    return () => {
      window.removeEventListener('openLogin', openLoginHandler);
      window.removeEventListener('openSignup', openSignupHandler);
    };
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('isLoggedIn');
    document.body.classList.remove('has-right-sidebar');
  };

  const handleAuthSubmit = async (mode) => {
    setAuthLoading(true);
    setAuthError('');

    try {
      const res = await fetch(`${API_BASE}/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword })
      });

      const data = await res.json();

      if (!res.ok) {
        setAuthError(data.error || 'Something went wrong.');
        return;
      }

      setUser({ email: authEmail });
      localStorage.setItem('userEmail', authEmail);
      localStorage.setItem('isLoggedIn', 'true');
      document.body.classList.add('has-right-sidebar');

      setShowLogin(false);
      setShowSignup(false);
      setAuthEmail('');
      setAuthPassword('');
      setAuthError('');
      alert(data.message || (mode === 'signup' ? 'Signed up!' : 'Logged in!'));
    } catch (err) {
      console.error('Auth error', err);
      setAuthError('Could not reach auth server.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = form.name.value.trim();

    setUser((prev) => ({ ...prev, name }));
    localStorage.setItem('userName', name);
    setShowProfile(false);
  };

  const handleSearch = async (text, type) => {
    if (type === 'source') {
      setSourceText(text);
    } else {
      setDestText(text);
    }

    if (text.length > 2) {
      try {
        const res = await axios.get(
          `https://api.openrouteservice.org/geocode/search?api_key=${window.orsConfig.apiKey}&text=${encodeURIComponent(
            text
          )}&size=5`
        );
        if (type === 'source') {
          setSourceSuggestions(res.data.features || []);
        } else {
          setDestSuggestions(res.data.features || []);
        }
      } catch (error) {
        console.error('ORS Geocoding API error', error.response?.data || error.message);
      }
    } else {
      setSourceSuggestions([]);
      setDestSuggestions([]);
    }
  };

  const handleSelect = (suggestion, type) => {
    const coords = suggestion.geometry.coordinates;
    const name = suggestion.properties.label || suggestion.properties.name;

    if (type === 'source') {
      setSource({ name, coordinates: coords });
      setSourceText(name);
      setSourceSuggestions([]);
    } else {
      setDest({ name, coordinates: coords });
      setDestText(name);
      setDestSuggestions([]);
    }
  };

  const openMap = (type) => {
    setMapFor(type);
    setShowMap(true);
  };

  const handleMapSelect = (place) => {
    if (mapFor === 'source') {
      setSource(place);
      setSourceText(place.name);
    } else {
      setDest(place);
      setDestText(place.name);
    }
  };

  const calculatePrices = async () => {
    // If user typed a location but didn't click a suggestion, try to geocode the text
    setError('');
    setLoading(true);
    try {
      let geocodedSource = null;
      let geocodedDest = null;

      if (!source && sourceText && sourceText.trim().length > 2) {
        try {
          const geoRes = await axios.get(
            `https://api.openrouteservice.org/geocode/search?api_key=${window.orsConfig.apiKey}&text=${encodeURIComponent(
              sourceText
            )}&size=1`
          );
          const feat = geoRes.data.features && geoRes.data.features[0];
          if (feat) {
            const coords = feat.geometry.coordinates;
            geocodedSource = { name: feat.properties.label || sourceText, coordinates: coords };
            setSource(geocodedSource);
          }
        } catch (gErr) {
          console.error('Geocode source error', gErr.response?.data || gErr.message);
        }
      }

      if (!dest && destText && destText.trim().length > 2) {
        try {
          const geoRes = await axios.get(
            `https://api.openrouteservice.org/geocode/search?api_key=${window.orsConfig.apiKey}&text=${encodeURIComponent(
              destText
            )}&size=1`
          );
          const feat = geoRes.data.features && geoRes.data.features[0];
          if (feat) {
            const coords = feat.geometry.coordinates;
            geocodedDest = { name: feat.properties.label || destText, coordinates: coords };
            setDest(geocodedDest);
          }
        } catch (gErr) {
          console.error('Geocode dest error', gErr.response?.data || gErr.message);
        }
      }

      const finalSource = source || geocodedSource;
      const finalDest = dest || geocodedDest;

      if (!finalSource || !finalDest) {
        setError('Please enter pickup and dropoff locations.');
        setLoading(false);
        return;
      }

      // continue with rest of function inside same try block
      setError('');
      setRides([]);

      const srcCoords = {
        lat: finalSource.coordinates[1],
        lon: finalSource.coordinates[0]
      };
      const destCoords = {
        lat: finalDest.coordinates[1],
        lon: finalDest.coordinates[0]
      };

      // Uber via backend
      let uberRides = [];
      try {
        const uberApiUrl = `${API_BASE}/api/uber/estimates?start_latitude=${srcCoords.lat}&start_longitude=${srcCoords.lon}&end_latitude=${destCoords.lat}&end_longitude=${destCoords.lon}`;
        const uberRes = await axios.get(uberApiUrl);
        if (uberRes.data && uberRes.data.prices) {
          uberRides = uberRes.data.prices.map((price) => ({
            provider: 'Uber',
            price: price.high_estimate,
            vehicle: price.display_name,
            eta: (price.duration / 60).toFixed(0) + ' min',
            surgeMultiplier: price.surge_multiplier || 1,
            isFair: !price.surge_multiplier || price.surge_multiplier <= 1.2,
            fairPrice: Math.round(price.high_estimate / (price.surge_multiplier || 1))
          }));
        }
      } catch (uberError) {
        console.error('Could not fetch Uber prices', uberError.response?.data || uberError.message);
      }

      // ORS distance
      const routeUrl = 'https://api.openrouteservice.org/v2/directions/driving-car';

      let routeRes;
      try {
        routeRes = await axios.post(
          `${routeUrl}?api_key=${window.orsConfig.apiKey}`,
          {
            coordinates: [
              [srcCoords.lon, srcCoords.lat],
              [destCoords.lon, destCoords.lat]
            ]
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            }
          }
        );
      } catch (e) {
        console.error('ORS directions error', e.response?.status, e.response?.data || e.message);
        setError(
          e.response?.data?.error ||
            e.response?.data?.error?.message ||
            'Could not get route from OpenRouteService. Check API key and quota or CORS settings.'
        );
        setLoading(false);
        return;
      }

      let summary;
      if (
        Array.isArray(routeRes.data.features) &&
        routeRes.data.features[0]?.properties?.summary
      ) {
        summary = routeRes.data.features[0].properties.summary;
      } else if (
        Array.isArray(routeRes.data.routes) &&
        routeRes.data.routes[0]?.summary
      ) {
        // ORS may return a `routes` array with `summary` (different response shape)
        summary = routeRes.data.routes[0].summary;
      } else {
        console.error('ORS unexpected response', routeRes.data);
        setError('Unexpected response from routing service.');
        setLoading(false);
        return;
      }
      const distanceMeters = summary.distance;
      const durationSeconds = summary.duration;
      const distanceKm = distanceMeters / 1000;
      const durationMin = Math.round(durationSeconds / 60);

      setRouteTitle(`${source.name || 'Pickup'} → ${dest.name || 'Dropoff'}`);
      setRouteDistance(`${distanceKm.toFixed(1)} km`);
      setRouteDuration(`${durationMin} min`);
      const approxPrice = Math.round(10 * distanceKm + 40);
      setAvgPrice(`₹${approxPrice}`);

      const anchorPrice =
        uberRides.length > 0
          ? uberRides[0].price
          : Math.round(50 + distanceKm * 14 + durationMin * 2);

      const olaPrice = Math.round(anchorPrice * 0.95);
      const rapidoPrice = Math.round(anchorPrice * 0.6);

      const allRides = [
        ...uberRides,
        {
          provider: 'Ola',
          price: olaPrice,
          vehicle: 'Sedan',
          eta: '6 min',
          surgeMultiplier: 1.3,
          isFair: false,
          fairPrice: Math.round(olaPrice * 0.8)
        },
        {
          provider: 'Rapido',
          price: rapidoPrice,
          vehicle: 'Bike',
          eta: '2 min',
          surgeMultiplier: 1.0,
          isFair: true,
          fairPrice: rapidoPrice
        }
      ].sort((a, b) => a.price - b.price);

      setRides(allRides);

      // Save a simple trip history entry for logged-in users
      try {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const email = localStorage.getItem('userEmail');
        if (loggedIn && email) {
          const historyKey = 'tripHistory';
          const raw = localStorage.getItem(historyKey);
          const allHistory = raw ? JSON.parse(raw) : {};
          const entry = {
            id: Date.now(),
            route: `${finalSource.name || sourceText} → ${finalDest.name || destText}`,
            distance: `${distanceKm.toFixed(1)} km`,
            duration: `${durationMin} min`,
            cheapestProvider: allRides[0]?.provider || null,
            cheapestPrice: allRides[0]?.price || null,
            timestamp: new Date().toISOString()
          };
          if (!Array.isArray(allHistory[email])) allHistory[email] = [];
          allHistory[email].unshift(entry);
          // keep recent 100 entries per user
          allHistory[email] = allHistory[email].slice(0, 100);
          localStorage.setItem(historyKey, JSON.stringify(allHistory));
        }
      } catch (e) {
        console.error('Could not save trip history', e);
      }
    } catch (err) {
      console.error(err);
      setError("Could not calculate route. Try simpler city names (e.g., 'Delhi', 'Noida').");
    } finally {
      setLoading(false);
    }
  };

  const cheapestPrice = rides.length > 0 ? Math.min(...rides.map((r) => r.price)) : null;

  const filteredRides = (() => {
    if (filter === 'cheapest' && cheapestPrice != null) {
      return rides.filter((r) => r.price === cheapestPrice);
    }
    if (filter === 'fastest') {
      return [...rides]
        .sort((a, b) => parseInt(a.eta) - parseInt(b.eta))
        .slice(0, 1);
    }
    return rides;
  })();

  return (
    <div>
      <section className="hero">
        <div className="hero-content">
          <h1>Compare Cab Fares Instantly</h1>
          <p>Get the best price across all major ride-sharing platforms in one place</p>
        </div>
      </section>

      <section className="search-form" id="search">
        <div className="form-grid">
          <div className="form-group" style={{ position: 'relative' }}>
            <label>Pickup Location</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                className="form-control"
                value={sourceText}
                onChange={(e) => handleSearch(e.target.value, 'source')}
                placeholder="Enter pickup location"
                style={{ flex: 1 }}
              />
              <button className="btn btn-outline-light" onClick={() => openMap('source')}>Map</button>
            </div>
            {sourceSuggestions.length > 0 && (
              <ul
                className="list-group"
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  zIndex: 1000,
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}
              >
                {sourceSuggestions.map((suggestion, index) => (
                  <li
                    key={
                      suggestion.properties.id ||
                      suggestion.properties.osm_id ||
                      suggestion.properties.place_id ||
                      index
                    }
                    className="list-group-item"
                    onClick={() => handleSelect(suggestion, 'source')}
                    style={{
                      backgroundColor: '#333',
                      color: '#fff',
                      cursor: 'pointer',
                      borderBottom: '1px solid #444'
                    }}
                  >
                    {suggestion.properties.label || suggestion.properties.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="form-group" style={{ position: 'relative' }}>
            <label>Dropoff Location</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                className="form-control"
                value={destText}
                onChange={(e) => handleSearch(e.target.value, 'dest')}
                placeholder="Enter dropoff location"
                style={{ flex: 1 }}
              />
              <button className="btn btn-outline-light" onClick={() => openMap('dest')}>Map</button>
            </div>
            {destSuggestions.length > 0 && (
              <ul
                className="list-group"
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  zIndex: 1000,
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}
              >
                {destSuggestions.map((suggestion, index) => (
                  <li
                    key={
                      suggestion.properties.id ||
                      suggestion.properties.osm_id ||
                      suggestion.properties.place_id ||
                      index
                    }
                    className="list-group-item"
                    onClick={() => handleSelect(suggestion, 'dest')}
                    style={{
                      backgroundColor: '#333',
                      color: '#fff',
                      cursor: 'pointer',
                      borderBottom: '1px solid #444'
                    }}
                  >
                    {suggestion.properties.label || suggestion.properties.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="form-group">
            <label>Ride Type</label>
            <select className="form-select">
              <option>Local</option>
              <option>Outstation</option>
              <option>Airport</option>
            </select>
          </div>
          <div className="form-group">
            <label>Time</label>
            <select className="form-select">
              <option>Now</option>
              <option>Schedule Later</option>
            </select>
          </div>
          <button
            className="btn-compare"
            onClick={calculatePrices}
            disabled={
              loading || !((source || (sourceText && sourceText.trim().length > 2)) && (dest || (destText && destText.trim().length > 2)))
            }
          >
            {loading ? 'Calculating…' : 'Compare'}
          </button>
        </div>
        {error && <Alert variant="danger">{error}</Alert>}
      </section>

        <MapPicker
          show={showMap}
          initial={mapFor === 'source' ? (source ? source.coordinates : null) : mapFor === 'dest' ? (dest ? dest.coordinates : null) : null}
          onClose={() => setShowMap(false)}
          onSelect={(place) => handleMapSelect(place)}
        />

      {rides.length > 0 && (
        <div className="results-section" id="results-section">
          <div className="results-header">
            <div className="route-info">
              <h3>{routeTitle}</h3>
              <div className="route-details">
                <span>
                  📏 <strong id="distance">{routeDistance}</strong>
                </span>
                <span>
                  ⏱️ <strong id="duration">{routeDuration}</strong>
                </span>
                <span>
                  💰 Avg: <strong id="avg-price">{avgPrice}</strong>
                </span>
              </div>
            </div>
            <div className="filter-section">
              <button
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                className={`filter-btn ${filter === 'cheapest' ? 'active' : ''}`}
                onClick={() => setFilter('cheapest')}
              >
                💰 Cheapest
              </button>
              <button
                className={`filter-btn ${filter === 'fastest' ? 'active' : ''}`}
                onClick={() => setFilter('fastest')}
              >
                ⚡ Fastest
              </button>
            </div>
          </div>

          <div className="results-table">
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Provider</th>
                    <th>Vehicle Type</th>
                    <th>ETA</th>
                    <th>Price Range</th>
                    <th>Availability</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRides.map((ride, index) => {
                    const logoClass = ride.provider.toLowerCase() + '-logo';
                    const isCheapest = cheapestPrice != null && ride.price === cheapestPrice;
                    const priceMin = ride.price;
                    const priceMax = ride.price + 20;
                    const surge = ride.surgeMultiplier && ride.surgeMultiplier > 1;
                    const surgeText = `${(ride.surgeMultiplier || 1).toFixed(1)}x`;

                    return (
                      <tr key={index}>
                        <td>
                          <div className="provider-cell">
                            <div className={`provider-logo ${logoClass}`}>
                              {ride.provider.toUpperCase()}
                            </div>
                            <span>{ride.provider}</span>
                          </div>
                        </td>
                        <td>
                          <div className="vehicle-info">
                            <span className="vehicle-name">{ride.vehicle}</span>
                            <span className="vehicle-capacity">Up to 4 passengers</span>
                          </div>
                        </td>
                        <td>{ride.eta}</td>
                        <td>
                          <div className="price-cell">
                            <span className="price-range">
                              ₹{priceMin}–₹{priceMax}
                            </span>
                            {surge && (
                              <span className="surge-badge">🔥 {surgeText} Surge</span>
                            )}
                            {isCheapest && (
                              <span className="cheapest-badge">✓ Cheapest</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="availability">
                            <div className="status-dot" />
                            <div>
                              <div className="availability-text">Available</div>
                              <div className="availability-count">5+ nearby</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <button
                            className="action-btn"
                            onClick={() =>
                              alert('Booking demo – integrate provider API later')
                            }
                          >
                            Book Now
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

<section
  id="how-it-works"
  style={{
    maxWidth: '1200px',
    margin: '60px auto',
    padding: '0 24px'
  }}
>
  <h2
    style={{
      textAlign: 'center',
      marginBottom: '40px',
      fontSize: '32px',
      color: 'var(--text-primary)'      // main heading color
    }}
  >
    How It Works
  </h2>

  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '24px'
    }}
  >
    <div
      style={{
        textAlign: 'center',
        padding: '24px',
        background: 'var(--bg-secondary)',
        borderRadius: '12px'
      }}
    >
      <div style={{ fontSize: '40px', marginBottom: '16px' }}>📍</div>
      <h3 style={{ color: 'var(--text-primary)' }}>Enter Locations</h3>
      <p style={{ color: 'var(--text-tertiary)', fontSize: '14px' }}>
        Enter your pickup and dropoff locations
      </p>
    </div>

    <div
      style={{
        textAlign: 'center',
        padding: '24px',
        background: 'var(--bg-secondary)',
        borderRadius: '12px'
      }}
    >
      <div style={{ fontSize: '40px', marginBottom: '16px' }}>⚡</div>
      <h3 style={{ color: 'var(--text-primary)' }}>Instant Comparison</h3>
      <p style={{ color: 'var(--text-tertiary)', fontSize: '14px' }}>
        Get fares from all platforms instantly
      </p>
    </div>

    <div
      style={{
        textAlign: 'center',
        padding: '24px',
        background: 'var(--bg-secondary)',
        borderRadius: '12px'
      }}
    >
      <div style={{ fontSize: '40px', marginBottom: '16px' }}>💰</div>
      <h3 style={{ color: 'var(--text-primary)' }}>Save Money</h3>
      <p style={{ color: 'var(--text-tertiary)', fontSize: '14px' }}>
        Choose the best deal and book directly
      </p>
    </div>
  </div>
</section>


      <footer>
        <p>
          &copy; 2025 FairRide. All rights reserved. | Bringing transparency to ride-sharing
        </p>
      </footer>

      {(showLogin || showSignup) && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
        >
          <div className="modal-dialog">
            <div className="modal-content" style={{ backgroundColor: '#282828' }}>
              <div className="modal-header">
                <h5 className="modal-title">
                  {showSignup ? 'Sign Up' : 'Login'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowLogin(false);
                    setShowSignup(false);
                  }}
                />
              </div>
              <div className="modal-body">
                {authError && (
                  <Alert variant="danger" className="py-1">
                    {authError}
                  </Alert>
                )}

                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!authEmail || !authPassword) {
                      setAuthError('Email and password are required.');
                      return;
                    }
                    handleAuthSubmit(showSignup ? 'signup' : 'login');
                  }}
                >
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="you@example.com"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="At least 6 characters"
                    />
                  </Form.Group>
                  <Button
                    type="submit"
                    variant="dark"
                    className="w-100"
                    disabled={authLoading}
                  >
                    {authLoading
                      ? 'Please wait...'
                      : showSignup
                      ? 'Create Account'
                      : 'Login'}
                  </Button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      )}

      {user && showProfile && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
        >
          <div className="modal-dialog">
            <div className="modal-content" style={{ backgroundColor: '#282828' }}>
              <div className="modal-header">
                <h5 className="modal-title">Profile</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowProfile(false)}
                />
              </div>
              <div className="modal-body">
                <Form onSubmit={handleProfileSave}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" value={user.email} disabled />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      defaultValue={user.name || ''}
                      placeholder="Enter your name"
                    />
                  </Form.Group>
                  <Button type="submit" variant="dark">
                    Save
                  </Button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
