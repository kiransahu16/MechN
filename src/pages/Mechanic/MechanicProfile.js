import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { supabase } from '../../config/supabase';
import '../../styles/MechanicProfile.css';

var mechanicIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MechanicProfile() {
  var params = useParams();
  var mechanicId = params.id;

  var _s1 = useState(null); var mechanic = _s1[0]; var setMechanic = _s1[1];
  var _s2 = useState([]); var reviews = _s2[0]; var setReviews = _s2[1];
  var _s3 = useState(true); var loading = _s3[0]; var setLoading = _s3[1];

  useEffect(function() {
    fetchMechanic();
    fetchReviews();
  }, [mechanicId]);

  function fetchMechanic() {
    setLoading(true);
    supabase
      .from('mechanics')
      .select('*')
      .eq('id', mechanicId)
      .single()
      .then(function(result) {
        if (result.error) {
          console.error('Error:', result.error);
        } else {
          setMechanic(result.data);
        }
        setLoading(false);
      });
  }

  function fetchReviews() {
    supabase
      .from('reviews')
      .select('*')
      .eq('mechanic_id', mechanicId)
      .order('created_at', { ascending: false })
      .then(function(result) {
        if (!result.error) {
          setReviews(result.data || []);
        }
      });
  }

  function handleCall() {
    window.location.href = 'tel:' + mechanic.phone;
  }

  function handleWhatsApp() {
    var num = mechanic.whatsapp || mechanic.phone;
    window.open('https://wa.me/91' + num, '_blank');
  }

  function handleDirections() {
    var url = 'https://www.google.com/maps/dir/?api=1&destination=' + mechanic.latitude + ',' + mechanic.longitude;
    window.open(url, '_blank');
  }

  function renderStars(count) {
    var stars = '';
    for (var i = 0; i < count; i++) {
      stars += '\u2B50';
    }
    return stars;
  }

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-topbar">
          <Link to="/" className="logo">
            <div className="logo-icon">🔧</div>
            <div className="logo-text">Mech<span>N</span></div>
          </Link>
        </div>
        <div className="profile-loading">
          <div className="spinner"></div>
          <p>Loading mechanic details...</p>
        </div>
      </div>
    );
  }

  if (!mechanic) {
    return (
      <div className="profile-page">
        <div className="profile-topbar">
          <Link to="/" className="logo">
            <div className="logo-icon">🔧</div>
            <div className="logo-text">Mech<span>N</span></div>
          </Link>
        </div>
        <div className="profile-loading">
          <p>Mechanic not found.</p>
          <Link to="/search" className="btn-back" style={{ display: 'inline-flex', marginTop: '16px' }}>Back to Search</Link>
        </div>
      </div>
    );
  }

  var statusClass = mechanic.status === 'available' ? 'available' : mechanic.status === 'busy' ? 'busy' : 'closed';

  return (
    <div className="profile-page">
      <div className="auth-blob-1"></div>

      {/* Top Bar */}
      <div className="profile-topbar">
        <Link to="/" className="logo">
          <div className="logo-icon">🔧</div>
          <div className="logo-text">Mech<span>N</span></div>
        </Link>
        <Link to="/search" className="btn-back">
          ← Back to Search
        </Link>
      </div>

      <div className="profile-container">

        {/* Header Card */}
        <div className="profile-header-card">
          <div className="profile-header-top">
            <div>
              <h1 className="profile-shop-name">{mechanic.shop_name}</h1>
              <p className="profile-address">📍 {mechanic.address}, {mechanic.city}, {mechanic.state}</p>
            </div>
            <div className={'profile-status ' + statusClass}>
              {mechanic.status}
            </div>
          </div>

          {/* Stats */}
          <div className="profile-stats">
            <div className="profile-stat">
              <span className="star">★</span>
              <span className="value">{mechanic.rating > 0 ? mechanic.rating.toFixed(1) : 'New'}</span>
              <span>({mechanic.total_reviews} reviews)</span>
            </div>
            <div className="profile-stat">
              <span>🕐</span>
              <span className="value">
                {mechanic.is_24x7 ? '24/7 Available' : mechanic.opening_time + ' - ' + mechanic.closing_time}
              </span>
            </div>
            <div className="profile-stat">
              <span>📅</span>
              <span className="value">{mechanic.years_experience || 0} years experience</span>
            </div>
            {mechanic.is_mobile && (
              <div className="profile-stat">
                <span>🏍️</span>
                <span className="value">Comes to your location</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="profile-actions">
            <button className="profile-btn-call" onClick={handleCall}>
              📞 Call Now
            </button>
            <button className="profile-btn-whatsapp" onClick={handleWhatsApp}>
              💬 WhatsApp
            </button>
            <button className="profile-btn-directions" onClick={handleDirections}>
              🗺️ Get Directions
            </button>
          </div>
        </div>

        {/* Vehicle Types */}
        <div className="profile-section">
          <div className="profile-section-title">
            <span>🚗</span> Vehicle Types
          </div>
          <div className="profile-tags">
            {mechanic.vehicle_types && mechanic.vehicle_types.map(function(type) {
              return <span key={type} className="profile-tag">{type}</span>;
            })}
          </div>
        </div>

        {/* Services */}
        <div className="profile-section">
          <div className="profile-section-title">
            <span>🛠️</span> Services Offered
          </div>
          <div className="profile-tags">
            {mechanic.services && mechanic.services.map(function(service) {
              return <span key={service} className="profile-tag">{service}</span>;
            })}
          </div>
        </div>

        {/* Specializations */}
        {mechanic.specializations && mechanic.specializations.length > 0 && (
          <div className="profile-section">
            <div className="profile-section-title">
              <span>⭐</span> Specializations
            </div>
            <div className="profile-tags">
              {mechanic.specializations.map(function(spec) {
                return <span key={spec} className="profile-tag">{spec}</span>;
              })}
            </div>
          </div>
        )}

        {/* Details */}
        <div className="profile-section">
          <div className="profile-section-title">
            <span>📋</span> Details
          </div>
          <div className="profile-info-grid">
            <div className="profile-info-item">
              <span className="label">Phone</span>
              <span className="value">{mechanic.phone}</span>
            </div>
            <div className="profile-info-item">
              <span className="label">WhatsApp</span>
              <span className="value">{mechanic.whatsapp || mechanic.phone}</span>
            </div>
            <div className="profile-info-item">
              <span className="label">City</span>
              <span className="value">{mechanic.city}, {mechanic.state}</span>
            </div>
            <div className="profile-info-item">
              <span className="label">Pincode</span>
              <span className="value">{mechanic.pincode || 'N/A'}</span>
            </div>
            {mechanic.languages_spoken && mechanic.languages_spoken.length > 0 && (
              <div className="profile-info-item">
                <span className="label">Languages</span>
                <span className="value">{mechanic.languages_spoken.join(', ')}</span>
              </div>
            )}
            {mechanic.payment_modes && mechanic.payment_modes.length > 0 && (
              <div className="profile-info-item">
                <span className="label">Payment Modes</span>
                <span className="value">{mechanic.payment_modes.join(', ')}</span>
              </div>
            )}
            {mechanic.towing_available && (
              <div className="profile-info-item">
                <span className="label">Towing</span>
                <span className="value">Available (up to {mechanic.towing_range_km || 0} km)</span>
              </div>
            )}
          </div>
        </div>

        {/* Location Map */}
        {mechanic.latitude && mechanic.longitude && (
          <div className="profile-section">
            <div className="profile-section-title">
              <span>📍</span> Location
            </div>
            <div className="profile-map">
              <MapContainer
                center={[mechanic.latitude, mechanic.longitude]}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
                zoomControl={true}
              >
                <TileLayer
                  attribution="OpenStreetMap"
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                <Marker position={[mechanic.latitude, mechanic.longitude]} icon={mechanicIcon}>
                  <Popup>
                    <div>
                      <strong>{mechanic.shop_name}</strong>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        )}

        {/* Reviews */}
        <div className="profile-section">
          <div className="profile-section-title">
            <span>💬</span> Reviews ({reviews.length})
          </div>

          {reviews.length === 0 && (
            <div className="no-reviews">
              No reviews yet. Be the first to review!
            </div>
          )}

          {reviews.map(function(review) {
            return (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <span className="review-user">Customer</span>
                  <span className="review-stars">{renderStars(review.rating)}</span>
                </div>
                {review.review_text && (
                  <p className="review-text">{review.review_text}</p>
                )}
                <div className="review-meta">
                  {review.service_type && <span>{review.service_type}</span>}
                  {review.price_paid && <span> | Paid: Rs. {review.price_paid}</span>}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

export default MechanicProfile;
