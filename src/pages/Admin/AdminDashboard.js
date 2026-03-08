import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import '../../styles/AdminDash.css';

function AdminDashboard() {
  var navigate = useNavigate();

  var _s1 = useState([]); var users = _s1[0]; var setUsers = _s1[1];
  var _s2 = useState([]); var mechanics = _s2[0]; var setMechanics = _s2[1];
  var _s3 = useState([]); var reviews = _s3[0]; var setReviews = _s3[1];
  var _s4 = useState([]); var requests = _s4[0]; var setRequests = _s4[1];
  var _s5 = useState('overview'); var activeTab = _s5[0]; var setActiveTab = _s5[1];
  var _s6 = useState(true); var loading = _s6[0]; var setLoading = _s6[1];

  useEffect(function() {
    loadAdminData();
  }, []);

  function loadAdminData() {
    setLoading(true);

    // Fetch all users
    supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .then(function(result) {
        if (!result.error) {
          setUsers(result.data || []);
        }
      });

    // Fetch all mechanics
    supabase
      .from('mechanics')
      .select('*')
      .order('created_at', { ascending: false })
      .then(function(result) {
        if (!result.error) {
          setMechanics(result.data || []);
        }
      });

    // Fetch all reviews
    supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })
      .then(function(result) {
        if (!result.error) {
          setReviews(result.data || []);
        }
      });

    // Fetch all service requests
    supabase
      .from('service_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .then(function(result) {
        if (!result.error) {
          setRequests(result.data || []);
        }
        setLoading(false);
      });
  }

  function verifyMechanic(mechanicId) {
    supabase
      .from('mechanics')
      .update({ is_verified: true })
      .eq('id', mechanicId)
      .then(function(result) {
        if (!result.error) {
          setMechanics(mechanics.map(function(m) {
            if (m.id === mechanicId) {
              return Object.assign({}, m, { is_verified: true });
            }
            return m;
          }));
        }
      });
  }

  function unverifyMechanic(mechanicId) {
    supabase
      .from('mechanics')
      .update({ is_verified: false })
      .eq('id', mechanicId)
      .then(function(result) {
        if (!result.error) {
          setMechanics(mechanics.map(function(m) {
            if (m.id === mechanicId) {
              return Object.assign({}, m, { is_verified: false });
            }
            return m;
          }));
        }
      });
  }

  function deleteMechanic(mechanicId) {
    if (window.confirm('Are you sure you want to delete this mechanic?')) {
      supabase
        .from('mechanics')
        .delete()
        .eq('id', mechanicId)
        .then(function(result) {
          if (!result.error) {
            setMechanics(mechanics.filter(function(m) { return m.id !== mechanicId; }));
          }
        });
    }
  }

  function deleteUser(userId) {
    if (window.confirm('Are you sure you want to delete this user profile?')) {
      supabase
        .from('profiles')
        .delete()
        .eq('id', userId)
        .then(function(result) {
          if (!result.error) {
            setUsers(users.filter(function(u) { return u.id !== userId; }));
          }
        });
    }
  }

  function deleteReview(reviewId) {
    if (window.confirm('Are you sure you want to delete this review?')) {
      supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId)
        .then(function(result) {
          if (!result.error) {
            setReviews(reviews.filter(function(r) { return r.id !== reviewId; }));
          }
        });
    }
  }

  function renderStars(count) {
    var stars = '';
    for (var i = 0; i < count; i++) {
      stars += '\u2B50';
    }
    return stars;
  }

  function getVerifiedCount() {
    return mechanics.filter(function(m) { return m.is_verified; }).length;
  }

  function getAvailableCount() {
    return mechanics.filter(function(m) { return m.status === 'available'; }).length;
  }

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-topbar">
          <Link to="/" className="logo">
            <div className="logo-icon">🛡️</div>
            <div className="logo-text">Mech<span>N</span></div>
          </Link>
          <span className="admin-badge">Admin</span>
        </div>
        <div style={{ textAlign: 'center', paddingTop: '100px', color: '#64748b' }}>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="auth-blob-1"></div>

      {/* Top Bar */}
      <div className="admin-topbar">
        <Link to="/search" className="logo">
          <div className="logo-icon">🛡️</div>
          <div className="logo-text">Mech<span>N</span></div>
        </Link>
        <span className="admin-badge">Admin Panel</span>
        <div className="admin-topbar-actions">
          <Link to="/search" className="btn-admin-action">🔍 Search</Link>
          <Link to="/dashboard" className="btn-admin-action">👤 Dashboard</Link>
        </div>
      </div>

      <div className="admin-container">

        {/* Header */}
        <div className="admin-header">
          <h1>🛡️ Admin Dashboard</h1>
          <p>Manage users, mechanics, reviews, and service requests</p>
        </div>

        {/* Stats Grid */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <span className="stat-icon">👥</span>
            <span className="stat-value">{users.length}</span>
            <span className="stat-label">Total Users</span>
          </div>
          <div className="admin-stat-card">
            <span className="stat-icon">🔧</span>
            <span className="stat-value">{mechanics.length}</span>
            <span className="stat-label">Mechanics</span>
          </div>
          <div className="admin-stat-card">
            <span className="stat-icon">✅</span>
            <span className="stat-value">{getVerifiedCount()}</span>
            <span className="stat-label">Verified</span>
          </div>
          <div className="admin-stat-card">
            <span className="stat-icon">⭐</span>
            <span className="stat-value">{reviews.length}</span>
            <span className="stat-label">Reviews</span>
          </div>
          <div className="admin-stat-card">
            <span className="stat-icon">🟢</span>
            <span className="stat-value">{getAvailableCount()}</span>
            <span className="stat-label">Available Now</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            className={'admin-tab' + (activeTab === 'overview' ? ' active' : '')}
            onClick={function() { setActiveTab('overview'); }}
          >
            📊 Overview
          </button>
          <button
            className={'admin-tab' + (activeTab === 'users' ? ' active' : '')}
            onClick={function() { setActiveTab('users'); }}
          >
            👥 Users
          </button>
          <button
            className={'admin-tab' + (activeTab === 'mechanics' ? ' active' : '')}
            onClick={function() { setActiveTab('mechanics'); }}
          >
            🔧 Mechanics
          </button>
          <button
            className={'admin-tab' + (activeTab === 'reviews' ? ' active' : '')}
            onClick={function() { setActiveTab('reviews'); }}
          >
            ⭐ Reviews
          </button>
          <button
            className={'admin-tab' + (activeTab === 'requests' ? ' active' : '')}
            onClick={function() { setActiveTab('requests'); }}
          >
            🚨 Requests
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Recent Users */}
            <div className="admin-section">
              <div className="admin-section-title">
                <span>👥</span> Recent Users
              </div>
              {users.length === 0 && (
                <div className="admin-empty">
                  <span className="empty-icon">👥</span>
                  <p>No users registered yet</p>
                </div>
              )}
              {users.length > 0 && (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.slice(0, 5).map(function(user) {
                      return (
                        <tr key={user.id}>
                          <td>{user.full_name || 'N/A'}</td>
                          <td>{user.email || 'N/A'}</td>
                          <td>{user.phone || 'N/A'}</td>
                          <td>
                            <span className={'role-badge ' + (user.role === 'mechanic' ? 'role-mechanic' : 'role-user')}>
                              {user.role || 'user'}
                            </span>
                          </td>
                          <td>{new Date(user.created_at).toLocaleDateString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Recent Mechanics */}
            <div className="admin-section">
              <div className="admin-section-title">
                <span>🔧</span> Recent Mechanics
              </div>
              {mechanics.length === 0 && (
                <div className="admin-empty">
                  <span className="empty-icon">🔧</span>
                  <p>No mechanics registered yet</p>
                </div>
              )}
              {mechanics.length > 0 && (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Shop Name</th>
                      <th>City</th>
                      <th>Phone</th>
                      <th>Status</th>
                      <th>Verified</th>
                      <th>Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mechanics.slice(0, 5).map(function(mech) {
                      return (
                        <tr key={mech.id}>
                          <td>{mech.shop_name}</td>
                          <td>{mech.city}</td>
                          <td>{mech.phone}</td>
                          <td>
                            <span className={'status-badge status-' + mech.status}>
                              {mech.status}
                            </span>
                          </td>
                          <td>
                            {mech.is_verified
                              ? <span className="verified-badge">✅ Yes</span>
                              : <span className="not-verified">❌ No</span>
                            }
                          </td>
                          <td>⭐ {mech.rating}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="admin-section">
            <div className="admin-section-title">
              <span>👥</span> All Users ({users.length})
            </div>
            {users.length === 0 && (
              <div className="admin-empty">
                <span className="empty-icon">👥</span>
                <p>No users found</p>
              </div>
            )}
            {users.length > 0 && (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>City</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(function(user) {
                    return (
                      <tr key={user.id}>
                        <td>{user.full_name || 'N/A'}</td>
                        <td>{user.email || 'N/A'}</td>
                        <td>{user.phone || 'N/A'}</td>
                        <td>
                          <span className={'role-badge ' + (user.role === 'mechanic' ? 'role-mechanic' : user.role === 'admin' ? 'role-admin' : 'role-user')}>
                            {user.role || 'user'}
                          </span>
                        </td>
                        <td>{user.city || 'N/A'}</td>
                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
                        <td>
                          <button className="btn-delete-admin" onClick={function() { deleteUser(user.id); }}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Mechanics Tab */}
        {activeTab === 'mechanics' && (
          <div className="admin-section">
            <div className="admin-section-title">
              <span>🔧</span> All Mechanics ({mechanics.length})
            </div>
            {mechanics.length === 0 && (
              <div className="admin-empty">
                <span className="empty-icon">🔧</span>
                <p>No mechanics found</p>
              </div>
            )}
            {mechanics.length > 0 && (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Shop Name</th>
                    <th>City</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Verified</th>
                    <th>Rating</th>
                    <th>Reviews</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mechanics.map(function(mech) {
                    return (
                      <tr key={mech.id}>
                        <td>{mech.shop_name}</td>
                        <td>{mech.city}, {mech.state}</td>
                        <td>{mech.phone}</td>
                        <td>
                          <span className={'status-badge status-' + mech.status}>
                            {mech.status}
                          </span>
                        </td>
                        <td>
                          {mech.is_verified
                            ? <span className="verified-badge">✅ Yes</span>
                            : <span className="not-verified">❌ No</span>
                          }
                        </td>
                        <td>⭐ {mech.rating}</td>
                        <td>{mech.total_reviews}</td>
                        <td>
                          {!mech.is_verified && (
                            <button className="btn-verify" onClick={function() { verifyMechanic(mech.id); }}>
                              ✅ Verify
                            </button>
                          )}
                          {mech.is_verified && (
                            <button className="btn-delete-admin" onClick={function() { unverifyMechanic(mech.id); }} style={{ marginRight: '6px' }}>
                              Unverify
                            </button>
                          )}
                          <button className="btn-delete-admin" onClick={function() { deleteMechanic(mech.id); }}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="admin-section">
            <div className="admin-section-title">
              <span>⭐</span> All Reviews ({reviews.length})
            </div>
            {reviews.length === 0 && (
              <div className="admin-empty">
                <span className="empty-icon">⭐</span>
                <p>No reviews found</p>
              </div>
            )}
            {reviews.map(function(review) {
              return (
                <div key={review.id} className="admin-review-card">
                  <div className="review-content">
                    <div className="review-top">
                      <span className="review-stars">{renderStars(review.rating)}</span>
                      <button className="btn-delete-admin" onClick={function() { deleteReview(review.id); }}>
                        Delete
                      </button>
                    </div>
                    {review.review_text && (
                      <p className="review-text">{review.review_text}</p>
                    )}
                    <div className="review-meta">
                      {review.service_type && <span>{review.service_type}</span>}
                      {review.price_paid && <span>Rs. {review.price_paid}</span>}
                      <span>{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div className="admin-section">
            <div className="admin-section-title">
              <span>🚨</span> All Service Requests ({requests.length})
            </div>
            {requests.length === 0 && (
              <div className="admin-empty">
                <span className="empty-icon">🚨</span>
                <p>No service requests found</p>
              </div>
            )}
            {requests.length > 0 && (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Problem</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Cost</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map(function(req) {
                    return (
                      <tr key={req.id}>
                        <td>{req.problem_type || 'N/A'}</td>
                        <td>{req.description || 'N/A'}</td>
                        <td>
                          <span className={'status-badge ' + (req.status === 'completed' ? 'status-available' : 'status-busy')}>
                            {req.status}
                          </span>
                        </td>
                        <td>{req.actual_cost ? 'Rs. ' + req.actual_cost : 'N/A'}</td>
                        <td>{new Date(req.created_at).toLocaleDateString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminDashboard;
