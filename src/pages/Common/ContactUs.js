import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ContactUs() {
  var _s1 = useState(''); var name = _s1[0]; var setName = _s1[1];
  var _s2 = useState(''); var email = _s2[0]; var setEmail = _s2[1];
  var _s3 = useState(''); var subject = _s3[0]; var setSubject = _s3[1];
  var _s4 = useState(''); var message = _s4[0]; var setMessage = _s4[1];
  var _s5 = useState(false); var sent = _s5[0]; var setSent = _s5[1];

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  }

  var inputStyle = {
    width: '100%',
    padding: '14px 16px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    color: '#ffffff',
    fontFamily: "'Outfit', sans-serif",
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease'
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050505',
      fontFamily: "'Outfit', sans-serif",
      color: '#ffffff',
      padding: '80px 20px 40px',
      position: 'relative'
    }}>
      {/* Top Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        background: 'rgba(5,5,5,0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100
      }}>
        <Link to="/search" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div style={{
            width: '36px', height: '36px',
            background: 'linear-gradient(135deg, #00FF88, #00993f)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px',
            boxShadow: '0 0 15px rgba(0,255,136,0.3)'
          }}>🔧</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#fff' }}>Mech<span style={{ color: '#00FF88' }}>N</span></div>
        </Link>
        <Link to="/search" style={{
          padding: '8px 18px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#94a3b8',
          borderRadius: '8px',
          fontSize: '13px',
          textDecoration: 'none'
        }}>← Back</Link>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative', zIndex: 10 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '8px' }}>
            Contact <span style={{
              background: 'linear-gradient(135deg, #00FF88, #00cc6a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Us</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '16px' }}>Have a question or feedback? We'd love to hear from you.</p>
        </div>

        {/* Success Message */}
        {sent && (
          <div style={{
            background: 'rgba(0,255,136,0.1)',
            border: '1px solid rgba(0,255,136,0.2)',
            color: '#00FF88',
            padding: '14px 16px',
            borderRadius: '10px',
            fontSize: '14px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            Message sent successfully! We'll get back to you soon.
          </div>
        )}

        {/* Contact Form */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '20px'
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', fontWeight: 500, marginBottom: '8px' }}>Your Name</label>
              <input style={inputStyle} type="text" placeholder="Enter your name" value={name} onChange={function(e) { setName(e.target.value); }} required />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', fontWeight: 500, marginBottom: '8px' }}>Email</label>
              <input style={inputStyle} type="email" placeholder="Enter your email" value={email} onChange={function(e) { setEmail(e.target.value); }} required />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', fontWeight: 500, marginBottom: '8px' }}>Subject</label>
              <input style={inputStyle} type="text" placeholder="What's this about?" value={subject} onChange={function(e) { setSubject(e.target.value); }} required />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '13px', fontWeight: 500, marginBottom: '8px' }}>Message</label>
              <textarea style={Object.assign({}, inputStyle, { minHeight: '120px', resize: 'vertical', maxWidth: '100%' })} placeholder="Write your message here..." value={message} onChange={function(e) { setMessage(e.target.value); }} required></textarea>
            </div>
            <button type="submit" style={{
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(135deg, #00FF88, #00cc6a)',
              color: '#050505',
              border: 'none',
              borderRadius: '14px',
              fontFamily: "'Outfit', sans-serif",
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 0 25px rgba(0,255,136,0.2)'
            }}>
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '20px'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>📍 Other Ways to Reach Us</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{
              padding: '16px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>📧</div>
              <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>Email</div>
              <div style={{ fontSize: '13px', color: '#00FF88' }}>support@mechn.com</div>
            </div>
            <div style={{
              padding: '16px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>📞</div>
              <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>Phone</div>
              <div style={{ fontSize: '13px', color: '#00FF88' }}>+91 98765 43210</div>
            </div>
            <div style={{
              padding: '16px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>📍</div>
              <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>Location</div>
              <div style={{ fontSize: '13px', color: '#94a3b8' }}>Rajahmundry, AP, India</div>
            </div>
            <div style={{
              padding: '16px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>💻</div>
              <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>GitHub</div>
              <a href="https://github.com/kiransahu16/MechN" target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: '#00FF88', textDecoration: 'none' }}>kiransahu16/MechN</a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ContactUs;
