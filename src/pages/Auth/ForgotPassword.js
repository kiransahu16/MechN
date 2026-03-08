import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import '../../styles/Auth.css';

function ForgotPassword() {
  var _s1 = useState(''); var email = _s1[0]; var setEmail = _s1[1];
  var _s2 = useState(''); var error = _s2[0]; var setError = _s2[1];
  var _s3 = useState(''); var success = _s3[0]; var setSuccess = _s3[1];
  var _s4 = useState(false); var loading = _s4[0]; var setLoading = _s4[1];

  function handleReset(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!email) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }

    supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/login',
    }).then(function(result) {
      if (result.error) {
        setError(result.error.message);
      } else {
        setSuccess('Password reset link sent! Check your email inbox (and spam folder).');
      }
      setLoading(false);
    });
  }

  return (
    <div className="auth-page">
      <div className="auth-blob-1"></div>
      <div className="auth-blob-2"></div>

      <div className="auth-card">
        {/* Logo */}
        <Link to="/" className="auth-logo">
          <div className="auth-logo-icon">🔧</div>
          <div className="auth-logo-text">Mech<span>N</span></div>
        </Link>

        <h1>Forgot Password?</h1>
        <p className="subtitle">Enter your email and we'll send you a reset link</p>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        {!success && (
          <form onSubmit={handleReset}>
            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={function(e) { setEmail(e.target.value); }}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-auth-primary"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        {success && (
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '16px' }}>
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <button
              className="btn-auth-primary"
              onClick={function() { setSuccess(''); setEmail(''); }}
            >
              Try Again
            </button>
          </div>
        )}

        <div className="auth-bottom">
          Remember your password? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
