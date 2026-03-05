import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { supabase } from '../../config/supabase';
import MechanicCard from '../../components/MechanicCard';
import '../../styles/Search.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

var mechanicIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

var userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function ChangeMapView({ center }) {
  var map = useMap();
  useEffect(function() {
    if (center) {
      map.setView(center, 14);
    }
  }, [center, map]);
  return null;
}

function MechanicPopup({ mech }) {
  var statusText = 'Closed';
  var statusColor = 'red';
  var statusEmoji = '\uD83D\uDD34';
  if (mech.status === 'available') {
    statusText = 'Available';
    statusColor = 'green';
    statusEmoji = '\uD83D\uDFE2';
  } else if (mech.status === 'busy') {
    statusText = 'Busy';
    statusColor = 'orange';
    statusEmoji = '\uD83D\uDFE1';
  }

  return React.createElement('div', { style: { minWidth: '180px' } },
    React.createElement('div', { style: { fontSize: '14px', fontWeight: 'bold' } }, mech.shop_name),
    React.createElement('div', { style: { fontSize: '12px', color: '#666', marginTop: '4px' } }, mech.address),
    React.createElement('div', { style: { fontSize: '12px', marginTop: '4px' } }, '\u2B50 ' + mech.rating + ' (' + mech.total_reviews + ' reviews)'),
    React.createElement('div', { style: { fontSize: '12px', marginTop: '4px', color: statusColor } }, statusEmoji + ' ' + statusText),
    React.createElement('div', { style: { marginTop: '6px' } },
      React.createElement('a', {
        href: 'tel:' + mech.phone,
        style: {
          display: 'inline-block',
          padding: '4px 12px',
          background: '#00FF88',
          color: '#000',
          borderRadius: '6px',
          textDecoration: 'none',
          fontSize: '12px',
          fontWeight: 'bold',
        }
      }, '\uD83D\uDCDE Call Now')
    )
  );
}

function SearchMechanic() {
  var _useState1 = useState([]);
  var mechanics = _useState1[0];
  var setMechanics = _useState1[1];

  var _useState2 = useState([]);
  var filtered = _useState2[0];
  var setFiltered = _useState2[1];

  var _useState3 = useState(true);
  var loading = _useState3[0];
  var setLoading = _useState3[1];

  var _useState4 = useState({ lat: 17.385, lng: 78.4867 });
  var userLocation = _useState4[0];
  var setUserLocation = _useState4[1];

  var _useState5 = useState('Detecting location...');
  var locationName = _useState5[0];
  var setLocationName = _useState5[1];

  var _useState6 = useState('');
  var searchText = _useState6[0];
  var setSearchText = _useState6[1];

  var _useState7 = useState('All');
  var vehicleFilter = _useState7[0];
  var setVehicleFilter = _useState7[1];

  var _useState8 = useState('All');
  var serviceFilter = _useState8[0];
  var setServiceFilter = _useState8[1];

  var _useState9 = useState('All');
  var statusFilter = _useState9[0];
  var setStatusFilter = _useState9[1];

  var _useState10 = useState([17.385, 78.4867]);
  var mapCenter = _useState10[0];
  var setMapCenter = _useState10[1];

  var vehicleTypes = ['All', 'Bike', 'Car', 'Auto', 'EV'];
  var serviceTypes = ['All', 'Puncture', 'Engine', 'Battery', 'Towing', 'Oil Change', 'AC Repair'];
  var statusTypes = ['All', 'Available', 'Busy'];

  useEffect(function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          var loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(loc);
          setMapCenter([loc.lat, loc.lng]);
          setLocationName(loc.lat.toFixed(4) + ', ' + loc.lng.toFixed(4));
        },
        function(error) {
          console.log('Location error:', error);
          setLocationName('Location not available');
        }
      );
    }
  }, []);

  useEffect(function() {
    fetchMechanics();
  }, [userLocation]);

  function fetchMechanics() {
    setLoading(true);
    supabase
      .from('mechanics')
      .select('*')
      .order('rating', { ascending: false })
      .then(function(result) {
        if (result.error) {
          console.error('Error fetching mechanics:', result.error);
        } else {
          var mechanicsWithDistance = result.data.map(function(mech) {
            return Object.assign({}, mech, {
              distance: calculateDistance(
                userLocation.lat,
                userLocation.lng,
                mech.latitude,
                mech.longitude
              ),
            });
          });

          mechanicsWithDistance.sort(function(a, b) {
            if (a.distance === null) return 1;
            if (b.distance === null) return -1;
            return a.distance - b.distance;
          });

          setMechanics(mechanicsWithDistance);
          setFiltered(mechanicsWithDistance);
        }
        setLoading(false);
      });
  }

  function calculateDistance(lat1, lon1, lat2, lon2) {
    if (!lat2 || !lon2) return null;
    var R = 6371;
    var dLat = ((lat2 - lat1) * Math.PI) / 180;
    var dLon = ((lon2 - lon1) * Math.PI) / 180;
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  useEffect(function() {
    var result = mechanics.slice();

    if (searchText) {
      result = result.filter(function(m) {
        return (
          (m.shop_name && m.shop_name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1) ||
          (m.address && m.address.toLowerCase().indexOf(searchText.toLowerCase()) !== -1) ||
          (m.city && m.city.toLowerCase().indexOf(searchText.toLowerCase()) !== -1)
        );
      });
    }

    if (vehicleFilter !== 'All') {
      result = result.filter(function(m) {
        return m.vehicle_types && m.vehicle_types.indexOf(vehicleFilter) !== -1;
      });
    }

    if (serviceFilter !== 'All') {
      result = result.filter(function(m) {
        return m.services && m.services.indexOf(serviceFilter) !== -1;
      });
    }

    if (statusFilter !== 'All') {
      result = result.filter(function(m) {
        return m.status && m.status.toLowerCase() === statusFilter.toLowerCase();
      });
    }

    setFiltered(result);
  }, [searchText, vehicleFilter, serviceFilter, statusFilter, mechanics]);

  function handleRelocate() {
    setLocationName('Detecting location...');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          var loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(loc);
          setMapCenter([loc.lat, loc.lng]);
          setLocationName(loc.lat.toFixed(4) + ', ' + loc.lng.toFixed(4));
        },
        function() {
          setLocationName('Location not available');
        }
      );
    }
  }

  return (
    <div className="search-page">
      <div className="search-topbar">
        <Link to="/" className="logo">
          <div className="logo-icon">🔧</div>
          <div className="logo-text">Mech<span>N</span></div>
        </Link>
        <div className="topbar-actions">
          <button className="btn-sos-small">🚨 <span>SOS</span></button>
          <button className="btn-profile">👤</button>
        </div>
      </div>

      <div className="search-layout">
        <div className="search-panel">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search mechanic, area, service..."
              value={searchText}
              onChange={function(e) { setSearchText(e.target.value); }}
            />
          </div>

          <div className="location-bar">
            <span className="loc-icon">📍</span>
            <div className="loc-text">
              {locationName}
              <span>Your current location</span>
            </div>
            <button className="btn-relocate" onClick={handleRelocate}>
              Refresh
            </button>
          </div>

          <div className="filters-section">
            <div className="filters-title">Vehicle Type</div>
            <div className="filter-chips">
              {vehicleTypes.map(function(type) {
                return (
                  <button
                    key={type}
                    className={'filter-chip' + (vehicleFilter === type ? ' active' : '')}
                    onClick={function() { setVehicleFilter(type); }}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="filters-section">
            <div className="filters-title">Problem Type</div>
            <div className="filter-chips">
              {serviceTypes.map(function(type) {
                return (
                  <button
                    key={type}
                    className={'filter-chip' + (serviceFilter === type ? ' active' : '')}
                    onClick={function() { setServiceFilter(type); }}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="filters-section">
            <div className="filters-title">Status</div>
            <div className="filter-chips">
              {statusTypes.map(function(type) {
                return (
                  <button
                    key={type}
                    className={'filter-chip' + (statusFilter === type ? ' active' : '')}
                    onClick={function() { setStatusFilter(type); }}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="results-header">
            <div className="results-count">
              Showing <span>{filtered.length}</span> mechanics
            </div>
            <button className="sort-btn">Nearest first</button>
          </div>

          {loading && (
            <div className="search-loading">
              <div className="spinner"></div>
              <p>Finding mechanics near you...</p>
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="no-results">
              <span className="icon">🔍</span>
              <h3>No mechanics found</h3>
              <p>Try changing your filters or search in a different area</p>
            </div>
          )}

          {!loading &&
            filtered.map(function(mechanic) {
              return <MechanicCard key={mechanic.id} mechanic={mechanic} />;
            })}
        </div>

        <div className="map-container">
          <MapContainer
            center={mapCenter}
            zoom={14}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
          >
            <ChangeMapView center={mapCenter} />
            <TileLayer
              attribution="OpenStreetMap"
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
              <Popup>
                <div><strong>You are here</strong></div>
              </Popup>
            </Marker>

            {filtered.map(function(mech) {
              if (mech.latitude && mech.longitude) {
                return (
                  <Marker
                    key={mech.id}
                    position={[mech.latitude, mech.longitude]}
                    icon={mechanicIcon}
                  >
                    <Popup>
                      <MechanicPopup mech={mech} />
                    </Popup>
                  </Marker>
                );
              }
              return null;
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default SearchMechanic;




