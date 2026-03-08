import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import '../../styles/Auth.css';

function EditProfile() {
  var navigate = useNavigate();

  var _s1 = useState(''); var fullName = _s1[0]; var setFullName = _s1[1];
  var _s2 = useState(''); var phone = _s2[0]; var setPhone = _s2[1];
  var _s3 = useState(''); var city = _s3[0]; var setCity = _s3[1];
  var _s4 = useState(''); var stateName = _s4[0]; var setStateName = _s4[1];
  var _s5 = useState(''); var email = _s5[0]; var setEmail = _s5[1];
  var _s6 = useState(''); var error = _s6[0]; var setError = _s6[1];
  var _s7 = useState(''); var success = _s7[0]; var setSuccess = _s7[1];
  var _s8 = useState(false); var loading = _s8[0]; var setLoading = _s8[1];
  var _s9 = useState(true); var pageLoading = _s9[0]; var setPageLoading = _s9[1];
  var _s10 = useState(null); var userId = _s10[0]; var setUserId = _s10[1];

  useEffect(function() {
    supabase.auth.getUser().then(function(result) {
      if (result.error || !result.data.user) {
        navigate('/login');
        return;
      }

      setUserId(result.data.user.id);
      setEmail(result.data.user.email || '');

      supabase
        .from('profiles')
        .select('*')
        .eq('id', result.data.user.id)
        .single()
        .then(function(profileResult) {
          if (!profileResult.error && profileResult.data) {
            setFullName(profileResult.data.full_name || '');
            setPhone(profileResult.data.phone || '');
            setCity(profileResult.data.city || '');
            setStateName(profileResult.data.state || '');
          }
          setPageLoading(false);
        });
    });
  }, [navigate]);

  function handleSave(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!fullName || !phone) {
      setError('Name and phone are required');
      setLoading(false);
      return;
    }

    supabase
      .from('profiles')
      .update({
        full_name: fullName,
        phone: phone,
        city: city,
        state: stateName,
      })
      .eq('id', userId)
      .then(function(result) {
        if (result.error) {
          setError(result.error.message);
        } else {
          setSuccess('Profile updated successfully!');
          setTimeout(function() {
            navigate('/dashboard');
          }, 1500);
        }
        setLoading(false);
      });
  }

  if (pageLoading) {
    return (
      <div className="auth-page">
        <div className="auth-blob-1"></div>
        <div className="auth-blob-2"></div>
        <div className="auth-card">
          <p style={{ textAlign: 'center', color: '#64748b' }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-blob-1"></div>
      <div className="auth-blob-2"></div>

      <div className="auth-card">
        <Link to="/dashboard" className="auth-logo">
          <div className="auth-logo-icon">🔧</div>
          <div className="auth-logo-text">Mech<span>N</span></div>
        </Link>

        <h1>Edit Profile</h1>
        <p className="subtitle">Update your personal information</p>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <form onSubmit={handleSave}>
          <div className="input-group">
            <label>Full Name *</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={function(e) { setFullName(e.target.value); }}
              required
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              disabled
              style={{ opacity: 0.5, cursor: 'not-allowed' }}
            />
          </div>

          <div className="input-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              placeholder="Enter 10-digit phone number"
              value={phone}
              onChange={function(e) { setPhone(e.target.value); }}
              required
            />
          </div>

          <div className="input-group">
            <label>City</label>
            <input
              type="text"
              placeholder="Enter your city"
              value={city}
              onChange={function(e) { setCity(e.target.value); }}
            />
          </div>

          <div className="input-group">
            <label>State</label>
            <input
              type="text"
              placeholder="Enter your state"
              value={stateName}
              onChange={function(e) { setStateName(e.target.value); }}
            />
          </div>

          <button
            type="submit"
            className="btn-auth-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        <div className="auth-bottom">
          <Link to="/dashboard">← Back to Dashboard</Link>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
