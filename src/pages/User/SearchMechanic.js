import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import MechanicCard from '../../components/MechanicCard';
import '../../styles/Search.css';

function SearchMechanic() {
  const [mechanics, setMechanics] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [locationName, setLocationName] = useState('Detecting location...');
  const [searchText, setSearchText] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('All');
  const [serviceFilter, setServiceFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const vehicleTypes = ['All', 'Bike', 'Car', 'Auto', 'EV'];
  const serviceTypes = ['All', 'Puncture', 'Engine', 'Battery', 'Towing', 'Oil Change', 'AC Repair'];
  const statusTypes = ['All', 'Available', 'Busy'];

  // Get user's GPS location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(loc);
          setLocationName(`${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`);
        },
        (error) => {
          console.log('Location error:', error);
          setLocationName('Location not available');
          // Default to Hyderabad
          setUserLocation({ lat: 17.385, lng: 78.4867 });
        }
      );
    }
  }, []);

  // Fetch mechanics from Supabase
  useEffect(() => {
    fetchMechanics();
  }, []);

  const fetchMechanics = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('mechanics')
      .select('*')
      .order('rating', { ascending: false });

    if (error) {
      console.error('Error fetching mechanics:', error);
    } else {
      // Calculate distance for each mechanic
      const mechanicsWithDistance = data.map((mech) => ({
        ...mech,
        distance: userLocation
          ? calculateDistance(
              userLocation.lat,
              userLocation.lng,
              mech.latitude,
              mech.longitude
            )
          : null,
      }));

      // Sort by distance
      mechanicsWithDistance.sort((a, b) => {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });

      setMechanics(mechanicsWithDistance);
      setFiltered(mechanicsWithDistance);
    }
    setLoading(false);
  };

  // Calculate distance between two points (km)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat2 || !lon2) return null;
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Apply filters
  useEffect(() => {
    let result = [...mechanics];

    // Search text filter
    if (searchText) {
      result = result.filter(
        (m) =>
          m.shop_name?.toLowerCase().includes(searchText.toLowerCase()) ||
          m.address?.toLowerCase().includes(searchText.toLowerCase()) ||
          m.city?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Vehicle type filter
    if (vehicleFilter !== 'All') {
      result = result.filter(
        (m) => m.vehicle_types && m.vehicle_types.includes(vehicleFilter)
      );
    }

    // Service filter
    if (serviceFilter !== 'All') {
      result = result.filter(
        (m) => m.services && m.services.includes(serviceFilter)
      );
    }

    // Status filter
    if (statusFilter !== 'All') {
      result = result.filter(
        (m) => m.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFiltered(result);
  }, [searchText, vehicleFilter, serviceFilter, statusFilter, mechanics]);

  // Relocate
  const handleRelocate = () => {
    setLocationName('Detecting location...');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(loc);
          setLocationName(`${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`);
          fetchMechanics();
        },
        () => {
          setLocationName('Location not available');
        }
      );
    }
  };

  return (
    <div className="search-page">
      {/* Top Bar */}
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

      {/* Main Layout */}
      <div className="search-layout">
        {/* Left Panel */}
        <div className="search-panel">
          {/* Search Box */}
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search mechanic, area, service..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          {/* Location Bar */}
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

          {/* Vehicle Type Filter */}
          <div className="filters-section">
            <div className="filters-title">Vehicle Type</div>
            <div className="filter-chips">
              {vehicleTypes.map((type) => (
                <button
                  key={type}
                  className={`filter-chip ${vehicleFilter === type ? 'active' : ''}`}
                  onClick={() => setVehicleFilter(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Service Filter */}
          <div className="filters-section">
            <div className="filters-title">Problem Type</div>
            <div className="filter-chips">
              {serviceTypes.map((type) => (
                <button
                  key={type}
                  className={`filter-chip ${serviceFilter === type ? 'active' : ''}`}
                  onClick={() => setServiceFilter(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div className="filters-section">
            <div className="filters-title">Status</div>
            <div className="filter-chips">
              {statusTypes.map((type) => (
                <button
                  key={type}
                  className={`filter-chip ${statusFilter === type ? 'active' : ''}`}
                  onClick={() => setStatusFilter(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="results-header">
            <div className="results-count">
              Showing <span>{filtered.length}</span> mechanics
            </div>
            <button className="sort-btn">↕ Nearest first</button>
          </div>

          {/* Loading */}
          {loading && (
            <div className="search-loading">
              <div className="spinner"></div>
              <p>Finding mechanics near you...</p>
            </div>
          )}

          {/* No Results */}
          {!loading && filtered.length === 0 && (
            <div className="no-results">
              <span className="icon">🔍</span>
              <h3>No mechanics found</h3>
              <p>Try changing your filters or search in a different area</p>
            </div>
          )}

          {/* Mechanic Cards */}
          {!loading &&
            filtered.map((mechanic) => (
              <MechanicCard key={mechanic.id} mechanic={mechanic} />
            ))}
        </div>

        {/* Right Panel - Map */}
        <div className="map-container">
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#0a0a0a',
              color: '#64748b',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <span style={{ fontSize: '48px' }}>🗺️</span>
            <p>Map will load here</p>
            <p style={{ fontSize: '13px' }}>
              {userLocation
                ? `Your location: ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`
                : 'Detecting location...'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchMechanic;