import React, { useState, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Ensure marker icons load correctly in CRA
let iconSetupDone = false;
function setupLeafletIcons() {
  if (iconSetupDone) return;
  try {
    const iconRetina = require('leaflet/dist/images/marker-icon-2x.png');
    const icon = require('leaflet/dist/images/marker-icon.png');
    const shadow = require('leaflet/dist/images/marker-shadow.png');
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: iconRetina,
      iconUrl: icon,
      shadowUrl: shadow
    });
  } catch (e) {
    // ignore require errors in non-standard environments
    // icons may still work if served differently
  }
  iconSetupDone = true;
}

export default function MapPicker({ show, onClose, onSelect, initial }) {
  const [pos, setPos] = useState(initial || null);
  const [label, setLabel] = useState('');
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    setupLeafletIcons();
  }, []);

  useEffect(() => {
    setPos(initial || null);
    setLabel('');
  }, [initial, show]);

  useEffect(() => {
    if (!show) return;

    const center = pos ? [pos[1], pos[0]] : [28.6139, 77.209];
    const map = L.map('mappicker-map', { center, zoom: 13, preferCanvas: true });
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const onMapClick = async (e) => {
      const coords = [e.latlng.lng, e.latlng.lat];
      setPos(coords);
      if (markerRef.current) {
        markerRef.current.setLatLng([coords[1], coords[0]]);
      } else {
        markerRef.current = L.marker([coords[1], coords[0]]).addTo(map);
      }

      try {
        const res = await fetch(
          `https://api.openrouteservice.org/geocode/reverse?api_key=${window.orsConfig.apiKey}&point.lon=${coords[0]}&point.lat=${coords[1]}&size=1`
        );
        const data = await res.json();
        const lab = data.features && data.features[0]?.properties?.label;
        if (lab) setLabel(lab);
      } catch (err) {
        console.error('Reverse geocode failed', err);
      }
    };

    map.on('click', onMapClick);

    return () => {
      map.off('click', onMapClick);
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [show]);

  if (!show) return null;

  return (
    <div style={modalStyle}>
      <div style={modalContentStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ margin: 0 }}>Choose on map</h4>
          <div>
            <button className="btn" onClick={onClose} style={{ marginRight: 8 }}>Cancel</button>
            <button
              className="btn btn-primary"
              onClick={() => {
                if (!pos) return;
                const name = label || `${pos[1].toFixed(5)}, ${pos[0].toFixed(5)}`;
                onSelect({ name, coordinates: pos });
                onClose();
              }}
            >
              Confirm
            </button>
          </div>
        </div>

        <div id="mappicker-map" style={{ height: '60vh', marginTop: 12 }} />

        <div style={{ marginTop: 8 }}>
          <small style={{ color: '#cbd5e1' }}>Clicked label: </small>
          <div style={{ color: '#fff' }}>{label || (pos ? `${pos[1].toFixed(5)}, ${pos[0].toFixed(5)}` : 'None')}</div>
        </div>
      </div>
    </div>
  );
}

const modalStyle = {
  position: 'fixed',
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999
};

const modalContentStyle = {
  width: '90%',
  maxWidth: 920,
  background: '#0f172a',
  padding: 16,
  borderRadius: 8,
  border: '1px solid #334155'
};