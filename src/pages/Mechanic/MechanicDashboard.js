import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import '../../styles/MechanicDash.css';

function MechanicDashboard() {
  var navigate = useNavigate();

  var _s1 = useState(null); var user = _s1[0]; var setUser = _s1[1];
  var _s2 = useState(null); var mechanic = _s2[0]; var setMechanic = _s2[1];
  var _s3 = useState([]); var reviews = _s3[0]; var setReviews = _s3[1];
  var _s4 = useState([]); var requests = _s4[0]; var setRequests = _s4[1];
  var _s5 = useState('overview'); var activeTab = _s5[0]; var setActiveTab = _s5[1];
  var _s6 = useState(true); var loading = _s6[0]; var setLoading = _s6[1];
  var _s7 = useState(''); var error = _s7[0]; var setError = _s7[1];

  useEffect(function() {
    loadMechanicData();
  }, []);

  function loadMechanicData() {
    setLoading(true);
    supabase.auth.getUser().then(function(result) {
      if (result.error || !result.data.user) {
        navigate('/login');
        return;
      }

      setUser(result.data.user);

      // Get mechanic profile
      supabase
        .from('mechanics')
        .select('*')
        .eq('user_id', result.data.user.id)
        .single()
        .then(function(mechResult) {
          if (mechResult.error) {
            setError('No mechanic shop found. Please register your shop first.');
            setLoading(false);
            return;
          }

          setMechanic(mechResult.data);

          // Get reviews
          supabase
            .from('reviews')
            .select('*')
            .eq('mechanic_id', mechResult.data.id)
            .order('created_at', { ascending: false })
            .then(function(revResult) {
              if (!revResult.error) {
                setReviews(revResult.data || []);
              }
            });

          // Get service requests
          supabase
            .from('service_requests')
            .select('*')
            .eq('mechanic_id', mechResult.data.id)
            .order('created_at', { ascending: false })
            .then(function(reqResult) {
              if (!reqResult.error) {
                setRequests(reqResult.data || []);
              }
              setLoading(false);
            });
        });
    });
  }

  function updateStatus(newStatus) {
    if (!mechanic) return;

    supabase
      .from('mechanics')
      .update({ status: newStatus })
      .eq('id', mechanic.id)
      .then(function(result) {
        if (!result.error) {
          setMechanic(Object.assign({}, mechanic, { status: newStatus }));
        }
      });
  }

  function handleLogout() {
    supabase.auth.signOut().then(function() {
      navigate('/login');
    });
  }

  function renderStars(count) {
    var stars = '';
    for (var i = 0; i < count; i++) {
      stars += '\u2B50';
    }
    return stars;
  }

  function getAvgRating() {
    if (reviews.length === 0) return '0.0';
    var total = 0;
    for (var i = 0; i < reviews.length; i++) {
      total += reviews[i].rating;
    }
    return (total / reviews.length).toFixed(1);
  }

  function getTotalEarnings() {
    var total = 0;
    for (var i = 0; i < reviews.length; i++) {
      if (reviews[i].price_paid) {
        total += reviews[i].price_paid;
      }
    }
    return total;
  }

  if (loading) {
    return (
      <div className="mech-dash-page">
        <div className="mech-topbar">
          <Link to="/" className="logo">
            <div className="logo-icon">🔧</div>
            <div className="logo-text">Mech<span>N</span></div>
          </Link>
        </div>
        <div style={{ textAlign: 'center', paddingTop: '100px', color: '#64748b' }}>
          <p>Loading mechanic dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !mechanic) {
    return (
      <div className="mech-dash-page">
        <div className="mech-topbar">
          <Link to="/" className="logo">
            <div className="logo-icon">🔧</div>
            <div className="logo-text">Mech<span>N</span></div>
          </Link>
        </div>
        <div style={{ textAlign: 'center', paddingTop: '100px' }}>
          <p style={{ color: '#ff6b6b', fontSize: '16px', marginBottom: '20px' }}>{error || 'No mechanic shop found.'}</p>
          <Link to="/mechanic/register" style={{
            padding: '14px 28px',
            background: 'linear-gradient(135deg, #00FF88, #00cc6a)',
            color: '#050505',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: '700',
            fontSize: '15px'
          }}>
            Register Your Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mech-dash-page">
      <div className="auth-blob-1"></div>

      {/* Top Bar */}
      <div className="mech-topbar">
        <Link to="/search" className="logo">
          <div className="logo-icon">🔧</div>
          <div className="logo-text">Mech<span>N</span></div>
        </Link>
        <div className="mech-topbar-actions">
          <Link to="/search" className="btn-mech-action">🔍 Search</Link>
          <button className="btn-mech-logout" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="mech-dash-container">

        {/* Shop Header */}
        <div className="mech-shop-card">
          <div className="mech-shop-header">
            <div className="mech-shop-info">
              <h1>🔧 {mechanic.shop_name}</h1>
              <p className="shop-address">📍 {mechanic.address}, {mechanic.city}, {mechanic.state}</p>
            </div>
            <div className="mech-status-toggle">
              <button
                className={'status-btn' + (mechanic.status === 'available' ? ' available-active' : '')}
                onClick={function() { updateStatus('available'); }}
              >
                🟢 Available
              </button>
              <button
                className={'status-btn' + (mechanic.status === 'busy' ? ' busy-active' : '')}
                onClick={function() { updateStatus('busy'); }}
              >
                🟡 Busy
              </button>
              <button
                className={'status-btn' + (mechanic.status === 'closed' ? ' closed-active' : '')}
                onClick={function() { updateStatus('closed'); }}
              >
                🔴 Closed
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mech-stats-grid">
          <div className="mech-stat-card">
            <span className="stat-icon">⭐</span>
            <span className="stat-value">{mechanic.rating > 0 ? mechanic.rating.toFixed(1) : getAvgRating()}</span>
            <span className="stat-label">Rating</span>
          </div>
          <div className="mech-stat-card">
            <span className="stat-icon">💬</span>
            <span className="stat-value">{reviews.length}</span>
            <span className="stat-label">Reviews</span>
          </div>
          <div className="mech-stat-card">
            <span className="stat-icon">🔧</span>
            <span className="stat-value">{requests.length}</span>
            <span className="stat-label">Requests</span>
          </div>
          <div className="mech-stat-card">
            <span className="stat-icon">💰</span>
            <span className="stat-value">{getTotalEarnings()}</span>
            <span className="stat-label">Earnings (Rs)</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="mech-tabs">
          <button
            className={'mech-tab' + (activeTab === 'overview' ? ' active' : '')}
            onClick={function() { setActiveTab('overview'); }}
          >
            📊 Overview
          </button>
          <button
            className={'mech-tab' + (activeTab === 'reviews' ? ' active' : '')}
            onClick={function() { setActiveTab('reviews'); }}
          >
            💬 Reviews
          </button>
          <button
            className={'mech-tab' + (activeTab === 'requests' ? ' active' : '')}
            onClick={function() { setActiveTab('requests'); }}
          >
            📋 Requests
          </button>
          <button
            className={'mech-tab' + (activeTab === 'shopinfo' ? ' active' : '')}
            onClick={function() { setActiveTab('shopinfo'); }}
          >
            🏪 Shop Info
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Recent Reviews */}
            <div className="mech-section">
              <div className="mech-section-title">
                <span>💬</span> Recent Reviews
              </div>
              {reviews.length === 0 && (
                <div className="mech-empty">
                  <span className="empty-icon">💬</span>
                  <p>No reviews yet. Reviews from customers will appear here.</p>
                </div>
              )}
              {reviews.slice(0, 3).map(function(review) {
                return (
                  <div key={review.id} className="mech-review-card">
                    <div className="mech-review-header">
                      <span className="mech-review-user">Customer</span>
                      <span className="mech-review-stars">{renderStars(review.rating)}</span>
                    </div>
                    {review.review_text && (
                      <p className="mech-review-text">{review.review_text}</p>
                    )}
                    <div className="mech-review-meta">
                      {review.service_type && <span>{review.service_type}</span>}
                      {review.price_paid && <span>Rs. {review.price_paid}</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recent Requests */}
            <div className="mech-section">
              <div className="mech-section-title">
                <span>📋</span> Recent Service Requests
              </div>
              {requests.length === 0 && (
                <div className="mech-empty">
                  <span className="empty-icon">📋</span>
                  <p>No service requests yet. When customers request help, it will appear here.</p>
                </div>
              )}
              {requests.slice(0, 5).map(function(req) {
                var isCompleted = req.status === 'completed';
                return (
                  <div key={req.id} className="mech-request-card">
                    <div className={'request-icon' + (isCompleted ? ' completed' : '')}>
                      {isCompleted ? '✅' : '🔧'}
                    </div>
                    <div className="request-details">
                      <h4>{req.problem_type || 'Service Request'}</h4>
                      <div className="request-meta">
                        <span>{req.description || 'No description'}</span>
                        <span>{new Date(req.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className={'request-status ' + (isCompleted ? 'completed' : 'searching')}>
                      {req.status}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="mech-section">
            <div className="mech-section-title">
              <span>💬</span> All Reviews ({reviews.length})
            </div>
            {reviews.length === 0 && (
              <div className="mech-empty">
                <span className="empty-icon">💬</span>
                <p>No reviews yet.</p>
              </div>
            )}
            {reviews.map(function(review) {
              return (
                <div key={review.id} className="mech-review-card">
                  <div className="mech-review-header">
                    <span className="mech-review-user">Customer</span>
                    <span className="mech-review-stars">{renderStars(review.rating)}</span>
                  </div>
                  {review.review_text && (
                    <p className="mech-review-text">{review.review_text}</p>
                  )}
                  <div className="mech-review-meta">
                    {review.service_type && <span>{review.service_type}</span>}
                    {review.price_paid && <span>Rs. {review.price_paid}</span>}
                    <span>{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div className="mech-section">
            <div className="mech-section-title">
              <span>📋</span> All Service Requests ({requests.length})
            </div>
            {requests.length === 0 && (
              <div className="mech-empty">
                <span className="empty-icon">📋</span>
                <p>No service requests yet.</p>
              </div>
            )}
            {requests.map(function(req) {
              var isCompleted = req.status === 'completed';
              return (
                <div key={req.id} className="mech-request-card">
                  <div className={'request-icon' + (isCompleted ? ' completed' : '')}>
                    {isCompleted ? '✅' : '🔧'}
                  </div>
                  <div className="request-details">
                    <h4>{req.problem_type || 'Service Request'}</h4>
                    <div className="request-meta">
                      <span>{req.description || 'No description'}</span>
                      <span>{new Date(req.created_at).toLocaleDateString()}</span>
                      {req.actual_cost && <span>Rs. {req.actual_cost}</span>}
                    </div>
                  </div>
                  <div className={'request-status ' + (isCompleted ? 'completed' : 'searching')}>
                    {req.status}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Shop Info Tab */}
        {activeTab === 'shopinfo' && (
          <div className="mech-section">
            <div className="mech-section-title">
              <span>🏪</span> Shop Information
            </div>
            <div className="mech-info-grid">
              <div className="mech-info-item">
                <div className="info-label">Shop Name</div>
                <div className="info-value">{mechanic.shop_name}</div>
              </div>
              <div className="mech-info-item">
                <div className="info-label">Phone</div>
                <div className="info-value">{mechanic.phone}</div>
              </div>
              <div className="mech-info-item">
                <div className="info-label">WhatsApp</div>
                <div className="info-value">{mechanic.whatsapp || mechanic.phone}</div>
              </div>
              <div className="mech-info-item">
                <div className="info-label">Address</div>
                <div className="info-value">{mechanic.address}</div>
              </div>
              <div className="mech-info-item">
                <div className="info-label">City</div>
                <div className="info-value">{mechanic.city}, {mechanic.state}</div>
              </div>
              <div className="mech-info-item">
                <div className="info-label">Pincode</div>
                <div className="info-value">{mechanic.pincode || 'N/A'}</div>
              </div>
              <div className="mech-info-item">
                <div className="info-label">Working Hours</div>
                <div className="info-value">{mechanic.is_24x7 ? '24/7' : mechanic.opening_time + ' - ' + mechanic.closing_time}</div>
              </div>
              <div className="mech-info-item">
                <div className="info-label">Experience</div>
                <div className="info-value">{mechanic.years_experience || 0} years</div>
              </div>
              <div className="mech-info-item">
                <div className="info-label">Mobile Service</div>
                <div className="info-value">{mechanic.is_mobile ? 'Yes - Comes to you' : 'No - Visit shop'}</div>
              </div>
              <div className="mech-info-item">
                <div className="info-label">Towing</div>
                <div className="info-value">{mechanic.towing_available ? 'Available (' + (mechanic.towing_range_km || 0) + ' km)' : 'Not available'}</div>
              </div>
            </div>

            {mechanic.vehicle_types && mechanic.vehicle_types.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <div className="info-label" style={{ marginBottom: '8px', fontSize: '12px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Vehicle Types</div>
                <div className="mech-tags">
                  {mechanic.vehicle_types.map(function(type) {
                    return <span key={type} className="mech-tag">{type}</span>;
                  })}
                </div>
              </div>
            )}

            {mechanic.services && mechanic.services.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <div className="info-label" style={{ marginBottom: '8px', fontSize: '12px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Services</div>
                <div className="mech-tags">
                  {mechanic.services.map(function(service) {
                    return <span key={service} className="mech-tag">{service}</span>;
                  })}
                </div>
              </div>
            )}

            {mechanic.languages_spoken && mechanic.languages_spoken.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <div className="info-label" style={{ marginBottom: '8px', fontSize: '12px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Languages</div>
                <div className="mech-tags">
                  {mechanic.languages_spoken.map(function(lang) {
                    return <span key={lang} className="mech-tag">{lang}</span>;
                  })}
                </div>
              </div>
            )}

            {mechanic.payment_modes && mechanic.payment_modes.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <div className="info-label" style={{ marginBottom: '8px', fontSize: '12px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Payment Modes</div>
                <div className="mech-tags">
                  {mechanic.payment_modes.map(function(mode) {
                    return <span key={mode} className="mech-tag">{mode}</span>;
                  })}
                </div>
              </div>
            )}

            <div style={{ marginTop: '24px' }}>
              <Link to="/mechanic/register" style={{
                padding: '12px 24px',
                background: 'rgba(0, 255, 136, 0.1)',
                border: '1px solid rgba(0, 255, 136, 0.2)',
                color: '#00FF88',
                borderRadius: '10px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                ✏️ Edit Shop Details
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default MechanicDashboard;
