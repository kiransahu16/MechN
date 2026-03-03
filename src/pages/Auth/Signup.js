import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import '../../styles/Auth.css';

function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState('user');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Signup with Email & Password
  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (phone.length < 10) {
      setError('Please enter a valid phone number');
      setLoading(false);
      return;
    }

    try {
      // Step 1: Create auth user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      // Step 2: Create profile in profiles table
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            full_name: fullName,
            email: email,
            phone: phone,
            role: role,
          });

        if (profileError) {
          setError(profileError.message);
          setLoading(false);
          return;
        }

        // Step 3: If mechanic, redirect to mechanic registration
        if (role === 'mechanic') {
          setSuccess('Account created! Redirecting to shop registration...');
          setTimeout(() => navigate('/mechanic/register'), 2000);
        } else {
          setSuccess('Account created! Redirecting...');
          setTimeout(() => navigate('/search'), 2000);
        }
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }

    setLoading(false);
  };

  // Signup with Google
  const handleGoogleSignup = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/search',
        },
      });

      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError('Google signup failed. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      {/* Green glowing blobs */}
      <div className="auth-blob-1"></div>
      <div className="auth-blob-2"></div>

      <div className="auth-card">
        {/* Logo */}
        <Link to="/" className="auth-logo">
          <div className="auth-logo-icon">🔧</div>
          <div className="auth-logo-text">Mech<span>N</span></div>
        </Link>

        <h1>Create Account</h1>
        <p className="subtitle">Join the MechN network</p>

        {/* Error Message */}
        {error && <div className="auth-error">{error}</div>}

        {/* Success Message */}
        {success && <div className="auth-success">{success}</div>}

        {/* Role Selector */}
        <div className="role-selector">
          <div
            className={`role-option ${role === 'user' ? 'active' : ''}`}
            onClick={() => setRole('user')}
          >
            <span className="role-icon">🏍️</span>
            Vehicle Owner
          </div>
          <div
            className={`role-option ${role === 'mechanic' ? 'active' : ''}`}
            onClick={() => setRole('mechanic')}
          >
            <span className="role-icon">🔧</span>
            Mechanic
          </div>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSignup}>
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Phone Number</label>
            <input
              type="tel"
              placeholder="Enter 10-digit phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-auth-primary"
            disabled={loading}
          >
            {loading ? 'Creating account...' : role === 'mechanic' ? 'Create Account & Register Shop' : 'Create Account'}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-divider">
          <span>OR</span>
        </div>

        {/* Google Signup */}
        <button className="btn-google" onClick={handleGoogleSignup}>
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
          />
          Continue with Google
        </button>

        {/* Login Link */}
        <div className="auth-bottom">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;