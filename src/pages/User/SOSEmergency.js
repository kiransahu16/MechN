import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import '../../styles/SOS.css';

function SOSEmergency() {
  var _s1 = useState(null); var userLocation = _s1[0]; var setUserLocation = _s1[1];
  var _s2 = useState('Detecting your location...'); var locationText = _s2[0]; var setLocationText = _s2[1];
  var _s3 = useState(''); var selectedProblem = _s3[0]; var setSelectedProblem = _s3[1];
  var _s4 = useState(''); var description = _s4[0]; var setDescription = _s4[1];
  var _s5 = useState([]); var nearestMechanics = _s5[0]; var setNearestMechanics = _s5[1];
  var _s6 = useState(false); var sosActive = _s6[0]; var setSosActive = _s6[1];
  var _s7 = useState(0); var timer = _s7[0]; var setTimer = _s7[1];
  var _s8 = useState(true); var loading = _s8[0]; var setLoading = _s8[1];
  var _s9 = useState(false); var sendingSOS = _s9[0]; var setSendingSOS = _s9[1];

  var problems = [
    { id: 'puncture', name: 'Tyre Puncture', icon: '\uD83D\uDEDE' },
    { id: 'wont_start', name: "Won't Start", icon: '\uD83D\uDD0B' },
    { id: 'engine', name: 'Engine Issue', icon: '\u2699\uFE0F' },
    { id: 'overheating', name: 'Overheating', icon: '\uD83D\uDD25' },
    { id: 'accident', name: 'Accident', icon: '\uD83D\uDEA8' },
    { id: 'fuel', name: 'Out of Fuel', icon: '\u26FD' },
    { id: 'battery', name: 'Dead Battery', icon: '\uD83E\uDEAB' },
    { id: 'other', name: 'Other Issue', icon: '\uD83D\uDD27' }
  ];

  // Get GPS location
  useEffect(function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          var loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(loc);
          setLocationText(loc.lat.toFixed(4) + ', ' + loc.lng.toFixed(4));
          fetchNearestMechanics(loc.lat, loc.lng);
        },
        function(error) {
          setLocationText('Could not detect location');
          setLoading(false);
        }
      );
    } else {
      setLocationText('Geolocation not supported');
      setLoading(false);
    }
  }, []);

  // Timer for SOS active state
  useEffect(function() {
    var interval = null;
    if (sosActive) {
      interval = setInterval(function() {
        setTimer(function(prev) { return prev + 1; });
      }, 1000);
    }
    return function() {
      if (interval) clearInterval(interval);
    };
  }, [sosActive]);

  function fetchNearestMechanics(lat, lng) {
    setLoading(true);
    supabase
      .from('mechanics')
      .select('*')
      .eq('status', 'available')
      .then(function(result) {
        if (result.error) {
          console.error('Error:', result.error);
          setLoading(false);
          return;
        }

        var mechanicsWithDistance = result.data.map(function(mech) {
          return Object.assign({}, mech, {
            distance: calculateDistance(lat, lng, mech.latitude, mech.longitude)
          });
        });

        mechanicsWithDistance.sort(function(a, b) {
          if (a.distance === null) return 1;
          if (b.distance === null) return -1;
          return a.distance - b.distance;
        });

        // Get top 3 nearest
        setNearestMechanics(mechanicsWithDistance.slice(0, 3));
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

  function formatTime(seconds) {
    var mins = Math.floor(seconds / 60);
    var secs = seconds % 60;
    return (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs;
  }

  function formatDistance(dist) {
    if (dist === null) return 'Unknown';
    if (dist < 1) return (dist * 1000).toFixed(0) + 'm';
    return dist.toFixed(1) + 'km';
  }

  function handleSOSPress() {
    setSendingSOS(true);

    // Simulate sending SOS
    setTimeout(function() {
      setSosActive(true);
      setSendingSOS(false);
      setTimer(0);
    }, 1500);
  }

  function handleCancelSOS() {
    setSosActive(false);
    setTimer(0);
  }

  function handleCall(phone) {
    window.location.href = 'tel:' + phone;
  }

  function openGoogleMaps(query) {
    var url = 'https://www.google.com/maps/search/' + query;
    if (userLocation) {
      url += '/@' + userLocation.lat + ',' + userLocation.lng + ',14z';
    }
    window.open(url, '_blank');
  }

  return (
    <div className="sos-page">
      <div className="sos-blob-1"></div>
      <div className="sos-blob-2"></div>

      {/* Top Bar */}
      <div className="sos-topbar">
        <Link to="/search" className="logo">
          <div className="logo-icon">🚨</div>
          <div className="logo-text">Mech<span>N</span></div>
        </Link>
        <div className="emergency-label">EMERGENCY</div>
        <Link to="/search" className="btn-back-sos">
          ← Back
        </Link>
      </div>

      <div className="sos-container">

        {/* SOS Active State */}
        {sosActive && (
          <div className="sos-active-banner">
            <h2>🚨 SOS Alert Sent!</h2>
            <p>Notifying nearest mechanics and your emergency contacts</p>
            <div className="sos-timer">{formatTime(timer)}</div>
            <p>Waiting for mechanic response...</p>
            <button className="btn-cancel-sos" onClick={handleCancelSOS}>
              Cancel SOS
            </button>
          </div>
        )}

        {/* Big SOS Button */}
        {!sosActive && (
          <div className="sos-main-section">
            <h1>🚨 Emergency Assistance</h1>
            <p>Press the SOS button to alert nearby mechanics instantly</p>
            <button
              className="sos-big-button"
              onClick={handleSOSPress}
              disabled={sendingSOS}
            >
              {sendingSOS ? '...' : 'SOS'}
              <span className="sub-text">{sendingSOS ? 'SENDING' : 'TAP FOR HELP'}</span>
            </button>
          </div>
        )}

        {/* Your Location */}
        <div className="sos-section">
          <div className="sos-location">
            <span className="loc-icon">📍</span>
            <div className="loc-info">
              <div className="loc-title">Your Location</div>
              <div className="loc-coords">{locationText}</div>
            </div>
          </div>
        </div>

        {/* Select Problem */}
        {!sosActive && (
          <div className="sos-section">
            <div className="sos-section-title">
              <span>⚠️</span> What's the problem?
            </div>
            <div className="problem-grid">
              {problems.map(function(problem) {
                return (
                  <div
                    key={problem.id}
                    className={'problem-option' + (selectedProblem === problem.id ? ' selected' : '')}
                    onClick={function() { setSelectedProblem(problem.id); }}
                  >
                    <span className="problem-icon">{problem.icon}</span>
                    <span className="problem-name">{problem.name}</span>
                  </div>
                );
              })}
            </div>
            <textarea
              className="sos-description"
              placeholder="Describe your problem (optional)... e.g. 'Bike chain broke on highway'"
              value={description}
              onChange={function(e) { setDescription(e.target.value); }}
            ></textarea>
          </div>
        )}

        {/* 3 Nearest Mechanics */}
        <div className="sos-section">
          <div className="sos-section-title">
            <span>🔧</span> 3 Nearest Mechanics
          </div>

          {loading && (
            <div className="sos-loading">
              <div className="spinner"></div>
              <p>Finding nearest mechanics...</p>
            </div>
          )}

          {!loading && nearestMechanics.length === 0 && (
            <p style={{ color: '#64748b', textAlign: 'center', padding: '16px' }}>
              No available mechanics found nearby
            </p>
          )}

          {!loading && nearestMechanics.map(function(mech) {
            return (
              <div key={mech.id} className="sos-mechanic-card">
                <div className="sos-mechanic-info">
                  <h4>{mech.shop_name}</h4>
                  <div className="sos-meta">
                    <span className="green">{formatDistance(mech.distance)} away</span>
                    <span className="star">★ {mech.rating}</span>
                    {mech.is_mobile && <span>🏍️ Mobile</span>}
                    {mech.is_24x7 && <span>🟢 24/7</span>}
                  </div>
                </div>
                <button className="sos-call-btn" onClick={function() { handleCall(mech.phone); }}>
                  📞 Call
                </button>
              </div>
            );
          })}
        </div>

        {/* Nearby Safe Spots */}
        <div className="sos-section">
          <div className="sos-section-title">
            <span>🛡️</span> Nearby Safe Spots
          </div>
          <div className="safe-spots-grid">
            <div className="safe-spot" onClick={function() { openGoogleMaps('petrol+pump+near+me'); }}>
              <span className="spot-icon">⛽</span>
              <span className="spot-name">Petrol Pump</span>
            </div>
            <div className="safe-spot" onClick={function() { openGoogleMaps('police+station+near+me'); }}>
              <span className="spot-icon">👮</span>
              <span className="spot-name">Police Station</span>
            </div>
            <div className="safe-spot" onClick={function() { openGoogleMaps('hospital+near+me'); }}>
              <span className="spot-icon">🏥</span>
              <span className="spot-name">Hospital</span>
            </div>
            <div className="safe-spot" onClick={function() { openGoogleMaps('ATM+near+me'); }}>
              <span className="spot-icon">🏧</span>
              <span className="spot-name">ATM</span>
            </div>
            <div className="safe-spot" onClick={function() { openGoogleMaps('hotel+near+me'); }}>
              <span className="spot-icon">🏨</span>
              <span className="spot-name">Hotel</span>
            </div>
            <div className="safe-spot" onClick={function() { openGoogleMaps('restaurant+near+me'); }}>
              <span className="spot-icon">🍽️</span>
              <span className="spot-name">Restaurant</span>
            </div>
          </div>
        </div>

        {/* Emergency Numbers */}
        <div className="sos-section">
          <div className="sos-section-title">
            <span>📞</span> Emergency Numbers
          </div>
          <div className="sos-mechanic-card" onClick={function() { handleCall('112'); }}>
            <div className="sos-mechanic-info">
              <h4>Emergency Services</h4>
              <div className="sos-meta"><span>National Emergency Number</span></div>
            </div>
            <button className="sos-call-btn" onClick={function() { handleCall('112'); }}>
              📞 112
            </button>
          </div>
          <div className="sos-mechanic-card" onClick={function() { handleCall('100'); }}>
            <div className="sos-mechanic-info">
              <h4>Police</h4>
              <div className="sos-meta"><span>Police Control Room</span></div>
            </div>
            <button className="sos-call-btn" onClick={function() { handleCall('100'); }}>
              📞 100
            </button>
          </div>
          <div className="sos-mechanic-card" onClick={function() { handleCall('108'); }}>
            <div className="sos-mechanic-info">
              <h4>Ambulance</h4>
              <div className="sos-meta"><span>Medical Emergency</span></div>
            </div>
            <button className="sos-call-btn" onClick={function() { handleCall('108'); }}>
              📞 108
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default SOSEmergency;
