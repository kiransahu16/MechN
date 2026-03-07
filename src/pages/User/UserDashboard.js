import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import '../../styles/Dashboard.css';

function UserDashboard() {
  var navigate = useNavigate();

  var _s1 = useState(null); var user = _s1[0]; var setUser = _s1[1];
  var _s2 = useState(null); var profile = _s2[0]; var setProfile = _s2[1];
  var _s3 = useState([]); var vehicles = _s3[0]; var setVehicles = _s3[1];
  var _s4 = useState([]); var history = _s4[0]; var setHistory = _s4[1];
  var _s5 = useState('vehicles'); var activeTab = _s5[0]; var setActiveTab = _s5[1];
  var _s6 = useState(false); var showAddVehicle = _s6[0]; var setShowAddVehicle = _s6[1];
  var _s7 = useState(true); var loading = _s7[0]; var setLoading = _s7[1];
  var _s8 = useState(''); var error = _s8[0]; var setError = _s8[1];
  var _s9 = useState(''); var success = _s9[0]; var setSuccess = _s9[1];

  // Add vehicle form states
  var _v1 = useState('Bike'); var vType = _v1[0]; var setVType = _v1[1];
  var _v2 = useState(''); var vBrand = _v2[0]; var setVBrand = _v2[1];
  var _v3 = useState(''); var vModel = _v3[0]; var setVModel = _v3[1];
  var _v4 = useState(''); var vYear = _v4[0]; var setVYear = _v4[1];
  var _v5 = useState('Petrol'); var vFuel = _v5[0]; var setVFuel = _v5[1];
  var _v6 = useState(''); var vReg = _v6[0]; var setVReg = _v6[1];
  var _v7 = useState(false); var saving = _v7[0]; var setSaving = _v7[1];

  useEffect(function() {
    loadUserData();
  }, []);

  function loadUserData() {
    setLoading(true);
    supabase.auth.getUser().then(function(result) {
      if (result.error || !result.data.user) {
        navigate('/login');
        return;
      }

      setUser(result.data.user);

      // Get profile
      supabase
        .from('profiles')
        .select('*')
        .eq('id', result.data.user.id)
        .single()
        .then(function(profileResult) {
          if (!profileResult.error) {
            setProfile(profileResult.data);
          }
        });

      // Get vehicles
      supabase
        .from('vehicles')
        .select('*')
        .eq('user_id', result.data.user.id)
        .order('created_at', { ascending: false })
        .then(function(vehicleResult) {
          if (!vehicleResult.error) {
            setVehicles(vehicleResult.data || []);
          }
        });

      // Get service history
      supabase
        .from('service_history')
        .select('*')
        .eq('user_id', result.data.user.id)
        .order('service_date', { ascending: false })
        .then(function(historyResult) {
          if (!historyResult.error) {
            setHistory(historyResult.data || []);
          }
          setLoading(false);
        });
    });
  }

  function handleAddVehicle(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!vBrand || !vModel) {
      setError('Please enter brand and model');
      return;
    }

    setSaving(true);

    supabase
      .from('vehicles')
      .insert({
        user_id: user.id,
        vehicle_type: vType,
        brand: vBrand,
        model: vModel,
        year: vYear ? parseInt(vYear) : null,
        fuel_type: vFuel,
        registration_no: vReg,
      })
      .then(function(result) {
        if (result.error) {
          setError(result.error.message);
        } else {
          setSuccess('Vehicle added successfully!');
          setShowAddVehicle(false);
          setVBrand('');
          setVModel('');
          setVYear('');
          setVReg('');
          // Refresh vehicles
          supabase
            .from('vehicles')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .then(function(vResult) {
              if (!vResult.error) {
                setVehicles(vResult.data || []);
              }
            });
        }
        setSaving(false);
      });
  }

  function handleDeleteVehicle(vehicleId) {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      supabase
        .from('vehicles')
        .delete()
        .eq('id', vehicleId)
        .then(function(result) {
          if (!result.error) {
            setVehicles(vehicles.filter(function(v) { return v.id !== vehicleId; }));
            setSuccess('Vehicle deleted');
          }
        });
    }
  }

  function handleLogout() {
    supabase.auth.signOut().then(function() {
      navigate('/login');
    });
  }

  function getVehicleEmoji(type) {
    if (type === 'Bike') return '🏍️';
    if (type === 'Car') return '🚗';
    if (type === 'Auto') return '🛺';
    if (type === 'EV') return '⚡';
    if (type === 'Truck') return '🚛';
    return '🚗';
  }

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dash-topbar">
          <Link to="/" className="logo">
            <div className="logo-icon">🔧</div>
            <div className="logo-text">Mech<span>N</span></div>
          </Link>
        </div>
        <div style={{ textAlign: 'center', paddingTop: '100px', color: '#64748b' }}>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="auth-blob-1"></div>

      {/* Top Bar */}
      <div className="dash-topbar">
        <Link to="/search" className="logo">
          <div className="logo-icon">🔧</div>
          <div className="logo-text">Mech<span>N</span></div>
        </Link>
        <div className="dash-topbar-actions">
          <Link to="/search" className="btn-dash-action">🔍 Search</Link>
          <button className="btn-dash-logout" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="dash-container">

        {/* Welcome Card */}
        <div className="dash-welcome">
          <div className="dash-avatar">👤</div>
          <div className="dash-welcome-info">
            <h1>Hello, {profile ? profile.full_name : 'User'}!</h1>
            <p className="email">{user ? user.email : ''}</p>
            <p>{profile ? profile.phone : ''} | {profile ? profile.city : ''}, {profile ? profile.state : ''}</p>
          </div>
        </div>

        {error && <div className="dash-error">{error}</div>}
        {success && <div className="dash-success">{success}</div>}

        {/* Quick Actions */}
        <div className="dash-quick-actions">
          <Link to="/search" className="quick-action">
            <span className="action-icon">🔍</span>
            <span className="action-label">Find Mechanic</span>
          </Link>
          <Link to="/sos" className="quick-action">
            <span className="action-icon">🚨</span>
            <span className="action-label">SOS Emergency</span>
          </Link>
          <Link to="/diy" className="quick-action">
            <span className="action-icon">🔧</span>
            <span className="action-label">DIY Fixes</span>
          </Link>
          <Link to="/mechanic/register" className="quick-action">
            <span className="action-icon">🏪</span>
            <span className="action-label">Register Shop</span>
          </Link>
        </div>

        {/* Tabs */}
        <div className="dash-tabs">
          <button
            className={'dash-tab' + (activeTab === 'vehicles' ? ' active' : '')}
            onClick={function() { setActiveTab('vehicles'); }}
          >
            🏍️ My Vehicles
          </button>
          <button
            className={'dash-tab' + (activeTab === 'history' ? ' active' : '')}
            onClick={function() { setActiveTab('history'); }}
          >
            📋 Service History
          </button>
          <button
            className={'dash-tab' + (activeTab === 'profile' ? ' active' : '')}
            onClick={function() { setActiveTab('profile'); }}
          >
            👤 Profile
          </button>
        </div>

        {/* Vehicles Tab */}
        {activeTab === 'vehicles' && (
          <div className="dash-section">
            <div className="dash-section-header">
              <div className="dash-section-title">
                <span>🏍️</span> My Vehicles
              </div>
              <button className="btn-add" onClick={function() { setShowAddVehicle(!showAddVehicle); }}>
                + Add Vehicle
              </button>
            </div>

            {/* Add Vehicle Form */}
            {showAddVehicle && (
              <div className="add-vehicle-form">
                <h3>Add New Vehicle</h3>
                <form onSubmit={handleAddVehicle}>
                  <div className="form-row">
                    <select className="dash-select" value={vType} onChange={function(e) { setVType(e.target.value); }}>
                      <option value="Bike">Bike</option>
                      <option value="Car">Car</option>
                      <option value="Auto">Auto</option>
                      <option value="EV">EV</option>
                      <option value="Truck">Truck</option>
                    </select>
                    <select className="dash-select" value={vFuel} onChange={function(e) { setVFuel(e.target.value); }}>
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric">Electric</option>
                      <option value="CNG">CNG</option>
                    </select>
                  </div>
                  <div className="form-row">
                    <input
                      className="dash-input"
                      type="text"
                      placeholder="Brand (e.g. Royal Enfield)"
                      value={vBrand}
                      onChange={function(e) { setVBrand(e.target.value); }}
                      required
                    />
                    <input
                      className="dash-input"
                      type="text"
                      placeholder="Model (e.g. Classic 350)"
                      value={vModel}
                      onChange={function(e) { setVModel(e.target.value); }}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <input
                      className="dash-input"
                      type="number"
                      placeholder="Year (e.g. 2022)"
                      value={vYear}
                      onChange={function(e) { setVYear(e.target.value); }}
                    />
                    <input
                      className="dash-input"
                      type="text"
                      placeholder="Registration No (e.g. AP 05 AB 1234)"
                      value={vReg}
                      onChange={function(e) { setVReg(e.target.value); }}
                    />
                  </div>
                  <div className="form-buttons">
                    <button type="submit" className="btn-save" disabled={saving}>
                      {saving ? 'Saving...' : 'Save Vehicle'}
                    </button>
                    <button type="button" className="btn-cancel" onClick={function() { setShowAddVehicle(false); }}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Vehicle List */}
            {vehicles.length === 0 && !showAddVehicle && (
              <div className="dash-empty">
                <span className="empty-icon">🏍️</span>
                <p>No vehicles added yet. Add your bike or car to get personalized service.</p>
              </div>
            )}

            {vehicles.map(function(vehicle) {
              return (
                <div key={vehicle.id} className="vehicle-card">
                  <div className="vehicle-icon">{getVehicleEmoji(vehicle.vehicle_type)}</div>
                  <div className="vehicle-details">
                    <h4>{vehicle.brand} {vehicle.model}</h4>
                    <div className="vehicle-meta">
                      {vehicle.vehicle_type} | {vehicle.fuel_type} | {vehicle.year || 'N/A'}
                    </div>
                    {vehicle.registration_no && (
                      <div className="vehicle-reg">{vehicle.registration_no}</div>
                    )}
                  </div>
                  <button className="btn-vehicle-delete" onClick={function() { handleDeleteVehicle(vehicle.id); }}>
                    Delete
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Service History Tab */}
        {activeTab === 'history' && (
          <div className="dash-section">
            <div className="dash-section-header">
              <div className="dash-section-title">
                <span>📋</span> Service History
              </div>
            </div>

            {history.length === 0 && (
              <div className="dash-empty">
                <span className="empty-icon">📋</span>
                <p>No service history yet. Your repair records will appear here after you use MechN services.</p>
              </div>
            )}

            {history.map(function(item) {
              return (
                <div key={item.id} className="history-card">
                  <div className="history-icon">🔧</div>
                  <div className="history-details">
                    <h4>{item.service_type}</h4>
                    <div className="history-meta">
                      <span>{item.description || 'No description'}</span>
                      <span>{item.service_date}</span>
                      {item.odometer_reading && <span>{item.odometer_reading} km</span>}
                    </div>
                  </div>
                  {item.cost && (
                    <div className="history-cost">Rs. {item.cost}</div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="dash-section">
            <div className="dash-section-header">
              <div className="dash-section-title">
                <span>👤</span> My Profile
              </div>
            </div>

            {profile && (
              <div>
                <div className="vehicle-card">
                  <div className="vehicle-icon">👤</div>
                  <div className="vehicle-details">
                    <h4>{profile.full_name}</h4>
                    <div className="vehicle-meta">{profile.email}</div>
                    <div className="vehicle-meta">{profile.phone}</div>
                  </div>
                </div>
                <div className="vehicle-card">
                  <div className="vehicle-icon">📍</div>
                  <div className="vehicle-details">
                    <h4>Location</h4>
                    <div className="vehicle-meta">{profile.city || 'Not set'}, {profile.state || 'Not set'}</div>
                  </div>
                </div>
                <div className="vehicle-card">
                  <div className="vehicle-icon">🔑</div>
                  <div className="vehicle-details">
                    <h4>Account Type</h4>
                    <div className="vehicle-meta">{profile.role === 'mechanic' ? 'Mechanic' : 'Vehicle Owner'}</div>
                  </div>
                </div>
                <div className="vehicle-card">
                  <div className="vehicle-icon">📅</div>
                  <div className="vehicle-details">
                    <h4>Member Since</h4>
                    <div className="vehicle-meta">{new Date(profile.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default UserDashboard;
