import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Auth.css';

function AboutUs() {
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

      <div style={{ maxWidth: '700px', margin: '0 auto', position: 'relative', zIndex: 10 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '8px' }}>
            About <span style={{
              background: 'linear-gradient(135deg, #00FF88, #00cc6a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>MechN</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '16px' }}>Emergency Roadside Mechanic Finder</p>
        </div>

        {/* Mission */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '20px'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🎯</span> Our Mission
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: 1.8 }}>
            MechN was born from a simple problem — when your vehicle breaks down on the road, finding a reliable mechanic nearby is nearly impossible. You're stranded, stressed, and vulnerable to overcharging. MechN solves this by connecting vehicle owners with verified mechanics instantly using GPS technology. No downloads needed, no waiting — just open MechN and get help.
          </p>
        </div>

        {/* What Makes Us Different */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '20px'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>⚡</span> What Makes MechN Different
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { icon: '🌐', title: 'No Download Needed', desc: 'Works in browser — zero friction' },
              { icon: '🚨', title: 'Emergency First', desc: 'Built for roadside emergencies, not scheduled service' },
              { icon: '💰', title: 'Price Transparency', desc: 'Know the fair price before you call' },
              { icon: '📴', title: 'Works Offline', desc: 'Smart caching for low-network areas' },
              { icon: '🔧', title: 'DIY Fix Tips', desc: 'Try simple fixes before calling a mechanic' },
              { icon: '🤝', title: 'Community Help', desc: 'Nearby users can volunteer to help' }
            ].map(function(item, i) {
              return (
                <div key={i} style={{
                  padding: '16px',
                  background: 'rgba(0,255,136,0.03)',
                  border: '1px solid rgba(0,255,136,0.08)',
                  borderRadius: '12px'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>{item.icon}</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>{item.title}</div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>{item.desc}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tech Stack */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '20px'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🛠️</span> Built With
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {['React.js', 'Supabase', 'PostgreSQL', 'Leaflet Maps', 'Vercel', 'JavaScript', 'CSS3', 'HTML5'].map(function(tech, i) {
              return (
                <span key={i} style={{
                  padding: '8px 16px',
                  background: 'rgba(0,255,136,0.06)',
                  border: '1px solid rgba(0,255,136,0.12)',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: '#00FF88'
                }}>{tech}</span>
              );
            })}
          </div>
        </div>

        {/* Creator */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>
            👨‍💻 Created By
          </h2>
          <p style={{ fontSize: '24px', fontWeight: 800, marginBottom: '4px' }}>Kiran Sahu</p>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '16px' }}>Full Stack Developer</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <a href="https://github.com/kiransahu16" target="_blank" rel="noreferrer" style={{
              padding: '10px 20px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px',
              color: '#94a3b8',
              textDecoration: 'none',
              fontSize: '14px'
            }}>GitHub</a>
          </div>
        </div>

        {/* CTA */}
        <div style={{
          background: 'rgba(0,255,136,0.03)',
          border: '1px solid rgba(0,255,136,0.12)',
          borderRadius: '20px',
          padding: '32px',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>Ready to find a mechanic?</h3>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/search" style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #00FF88, #00cc6a)',
              color: '#050505',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '14px'
            }}>🔍 Find Mechanic</Link>
            <Link to="/mechanic/register" style={{
              padding: '12px 24px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#94a3b8',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '14px'
            }}>🔧 Register Your Shop</Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AboutUs;
