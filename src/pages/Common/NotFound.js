import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#050505',
      fontFamily: "'Outfit', sans-serif",
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Green blob */}
      <div style={{
        position: 'fixed',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,255,136,0.08) 0%, transparent 70%)',
        filter: 'blur(80px)',
        top: '-100px',
        right: '-100px'
      }}></div>

      <div style={{ textAlign: 'center', position: 'relative', zIndex: 10, maxWidth: '500px' }}>
        {/* Big 404 */}
        <div style={{
          fontSize: '120px',
          fontWeight: 900,
          background: 'linear-gradient(135deg, #00FF88, #00cc6a)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1,
          marginBottom: '16px'
        }}>
          404
        </div>

        {/* Icon */}
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔧</div>

        {/* Title */}
        <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '12px' }}>
          Page Not Found
        </h1>

        {/* Description */}
        <p style={{ color: '#94a3b8', fontSize: '16px', lineHeight: 1.6, marginBottom: '32px' }}>
          Looks like this road leads nowhere! The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/search" style={{
            padding: '14px 28px',
            background: 'linear-gradient(135deg, #00FF88, #00cc6a)',
            color: '#050505',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 0 25px rgba(0,255,136,0.2)'
          }}>
            🔍 Find Mechanic
          </Link>
          <Link to="/" style={{
            padding: '14px 28px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#94a3b8',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            ← Go Home
          </Link>
        </div>

        {/* Fun message */}
        <p style={{ color: '#334155', fontSize: '13px', marginTop: '40px' }}>
          Even the best mechanics take a wrong turn sometimes 🛣️
        </p>
      </div>
    </div>
  );
}

export default NotFound;
