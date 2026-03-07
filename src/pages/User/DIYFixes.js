import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/DIYFixes.css';

function DIYFixes() {
  var _s1 = useState('All'); var filter = _s1[0]; var setFilter = _s1[1];
  var _s2 = useState(null); var openCard = _s2[0]; var setOpenCard = _s2[1];

  var filters = [
    { id: 'All', icon: '🔧', label: 'All' },
    { id: 'Bike', icon: '🏍️', label: 'Bike' },
    { id: 'Car', icon: '🚗', label: 'Car' },
    { id: 'Both', icon: '🚘', label: 'Both' }
  ];

  var fixes = [
    {
      id: 1,
      title: "Bike Won't Start",
      icon: '🔋',
      vehicle: 'Bike',
      difficulty: 'Easy',
      tools: 'None',
      warning: 'Do not try to start the bike repeatedly — it can drain the battery completely.',
      steps: [
        'Check if the kill switch is in the ON position. This is the #1 reason bikes don\'t start.',
        'Make sure the bike is in neutral gear. Some bikes won\'t start in gear without clutch.',
        'Hold the clutch lever fully and try starting again.',
        'Check if the fuel tank has petrol. Turn the fuel knob to RESERVE if low.',
        'Look at the battery terminals — if you see white powder, the terminals are corroded. Clean them with a cloth.',
        'If none of these work, the battery may be dead. You need a jump start or mechanic.'
      ]
    },
    {
      id: 2,
      title: 'Tyre Puncture — Temporary Fix',
      icon: '🛞',
      vehicle: 'Both',
      difficulty: 'Medium',
      tools: 'Puncture repair kit (available at petrol pumps)',
      warning: 'This is a temporary fix only. Visit a mechanic for proper repair within 24 hours.',
      steps: [
        'If riding, pull over safely to the side of the road immediately.',
        'Locate the puncture — look for a nail or sharp object stuck in the tyre.',
        'If you have a tubeless tyre repair kit: insert the reamer tool into the puncture hole and push in/out a few times.',
        'Thread the repair strip through the insertion tool needle.',
        'Push the insertion tool with the strip into the puncture hole firmly.',
        'Pull the tool out quickly — the strip will stay inside sealing the hole.',
        'Cut the excess strip sticking out. Inflate the tyre at the nearest petrol pump.',
        'Drive slowly to the nearest mechanic for a proper repair.'
      ]
    },
    {
      id: 3,
      title: 'Car Overheating on Highway',
      icon: '🔥',
      vehicle: 'Car',
      difficulty: 'Easy',
      tools: 'Water bottle',
      warning: 'NEVER open the radiator cap when the engine is hot — the steam can cause severe burns!',
      steps: [
        'Pull over immediately and turn off the AC. Turn on the heater to maximum — this helps cool the engine.',
        'Stop the car safely and turn off the engine.',
        'Open the hood/bonnet but DO NOT touch the radiator cap.',
        'Wait at least 15-20 minutes for the engine to cool down.',
        'While waiting, check under the car for any visible coolant leaks (green/orange liquid).',
        'After the engine cools, carefully open the radiator cap with a cloth.',
        'Pour water slowly into the radiator if the coolant is low.',
        'Start the car and drive slowly to the nearest mechanic. Keep watching the temperature gauge.'
      ]
    },
    {
      id: 4,
      title: 'Dead Battery — Jump Start',
      icon: '⚡',
      vehicle: 'Both',
      difficulty: 'Medium',
      tools: 'Jumper cables + another vehicle with charged battery',
      warning: 'Connect cables in the correct order. Wrong connections can damage the electrical system.',
      steps: [
        'Park the helper vehicle close to your vehicle. Both engines should be OFF.',
        'Open both hoods and locate the batteries.',
        'Connect the RED cable to the POSITIVE (+) terminal of your dead battery.',
        'Connect the other end of RED cable to the POSITIVE (+) terminal of the helper battery.',
        'Connect the BLACK cable to the NEGATIVE (-) terminal of the helper battery.',
        'Connect the other end of BLACK cable to an unpainted metal surface on your car (NOT the battery).',
        'Start the helper vehicle first. Wait 2-3 minutes.',
        'Now try starting your vehicle. If it starts, let it run for at least 15 minutes.',
        'Remove cables in REVERSE order — black from your car, black from helper, red from helper, red from yours.',
        'Drive to a mechanic to get the battery checked/replaced.'
      ]
    },
    {
      id: 5,
      title: 'Bike Chain Came Off',
      icon: '🔗',
      vehicle: 'Bike',
      difficulty: 'Medium',
      tools: 'Cloth/gloves (to protect hands from grease)',
      warning: 'Be careful of sharp chain edges. Use a cloth to protect your hands.',
      steps: [
        'Put the bike on its center stand. If no center stand, lean it against a wall.',
        'Put the bike in neutral gear.',
        'Wrap a cloth around your hands to protect from grease and sharp edges.',
        'Place the chain back on the rear sprocket (the gear wheel at the back tyre).',
        'Then loop the chain onto the front sprocket (near the engine).',
        'Slowly rotate the rear wheel forward by hand to align the chain on both sprockets.',
        'Check chain tension — it should have about 20-25mm of slack.',
        'If the chain keeps coming off, it may be too loose. Visit a mechanic for chain tightening.'
      ]
    },
    {
      id: 6,
      title: 'Car Won\'t Start — No Sound',
      icon: '🔇',
      vehicle: 'Car',
      difficulty: 'Easy',
      tools: 'None',
      warning: 'If you smell fuel/gas inside the car, do NOT try to start it. Exit and call for help.',
      steps: [
        'Check if the gear is in P (Park) for automatic or Neutral for manual transmission.',
        'Make sure you are pressing the brake pedal (automatic) or clutch (manual) while starting.',
        'Check if the steering wheel is locked — try turning the key while gently turning the steering wheel.',
        'Look at the dashboard — are any lights turning on when you turn the key to ON position?',
        'If NO lights at all: the battery is completely dead. You need a jump start.',
        'If lights come on but car doesn\'t crank: the starter motor might be faulty. Call a mechanic.',
        'Try tapping the key fob battery area if you have a push-button start — the fob battery might be low.'
      ]
    },
    {
      id: 7,
      title: 'Headlight Not Working',
      icon: '💡',
      vehicle: 'Both',
      difficulty: 'Easy',
      tools: 'None for checking, screwdriver for bulb replacement',
      warning: 'Do not touch halogen bulbs with bare hands — the oil from your skin can cause them to burst.',
      steps: [
        'First check if it\'s just one headlight or both. If both, it\'s likely a fuse issue.',
        'Check the headlight switch — toggle between low beam and high beam.',
        'Look for a loose connection — gently wiggle the connector behind the headlight.',
        'If you have a spare fuse, check the headlight fuse in the fuse box (usually under the dashboard or near the battery).',
        'For bikes: the headlight bulb is usually accessible by removing a few screws on the headlight casing.',
        'If the bulb is blackened or the filament is broken, it needs replacement.',
        'For nighttime driving without headlights: use hazard lights and drive very slowly to the nearest mechanic.'
      ]
    },
    {
      id: 8,
      title: 'Brakes Feel Spongy/Soft',
      icon: '🛑',
      vehicle: 'Both',
      difficulty: 'Easy',
      tools: 'None',
      warning: 'Spongy brakes are dangerous! Drive very slowly and use engine braking. Go to a mechanic ASAP.',
      steps: [
        'STOP driving fast immediately. Reduce speed and drive carefully.',
        'Pump the brake pedal/lever several times rapidly. This can temporarily restore some brake pressure.',
        'Use engine braking — downshift to lower gears to slow down.',
        'Check brake fluid level — there\'s usually a small transparent tank near the brake master cylinder.',
        'If brake fluid is very low, that explains the spongy feeling. There might be a leak.',
        'For bikes: check if the brake pads are worn out by looking through the caliper.',
        'DO NOT continue driving long distances. Go to the nearest mechanic immediately.',
        'If brakes fail completely: use engine braking, hazard lights, and honk to warn others.'
      ]
    }
  ];

  // Filter fixes
  var filteredFixes = fixes;
  if (filter !== 'All') {
    filteredFixes = fixes.filter(function(fix) {
      return fix.vehicle === filter || fix.vehicle === 'Both';
    });
  }

  function toggleCard(id) {
    if (openCard === id) {
      setOpenCard(null);
    } else {
      setOpenCard(id);
    }
  }

  return (
    <div className="diy-page">
      <div className="auth-blob-1"></div>

      {/* Top Bar */}
      <div className="diy-topbar">
        <Link to="/search" className="logo">
          <div className="logo-icon">🔧</div>
          <div className="logo-text">Mech<span>N</span></div>
        </Link>
        <Link to="/search" className="btn-back-diy">
          ← Back to Search
        </Link>
      </div>

      <div className="diy-container">
        {/* Header */}
        <div className="diy-header">
          <h1>🔧 <span className="highlight">DIY Fix</span> Tips</h1>
          <p>Try these simple fixes before calling a mechanic. Save time and money!</p>
        </div>

        {/* Filters */}
        <div className="diy-filters">
          {filters.map(function(f) {
            return (
              <div
                key={f.id}
                className={'diy-filter-chip' + (filter === f.id ? ' active' : '')}
                onClick={function() { setFilter(f.id); }}
              >
                <span>{f.icon}</span>
                {f.label}
              </div>
            );
          })}
        </div>

        {/* Fix Cards */}
        {filteredFixes.length === 0 && (
          <div className="diy-no-results">
            <span className="icon">🔍</span>
            <p>No fixes found for this filter</p>
          </div>
        )}

        {filteredFixes.map(function(fix) {
          var isOpen = openCard === fix.id;
          var diffClass = fix.difficulty === 'Easy' ? 'difficulty-easy' : fix.difficulty === 'Medium' ? 'difficulty-medium' : 'difficulty-hard';

          return (
            <div key={fix.id} className="diy-card">
              <div className="diy-card-header" onClick={function() { toggleCard(fix.id); }}>
                <div className="diy-card-title">
                  <div className="problem-icon">{fix.icon}</div>
                  <div>
                    <h3>{fix.title}</h3>
                    <div className="card-meta">
                      <span className={diffClass}>{fix.difficulty}</span>
                      <span>{fix.vehicle === 'Both' ? 'Bike & Car' : fix.vehicle}</span>
                    </div>
                  </div>
                </div>
                <div className={'diy-card-toggle' + (isOpen ? ' open' : '')}>▼</div>
              </div>

              <div className={'diy-card-body' + (isOpen ? ' open' : '')}>
                {/* Warning */}
                <div className="diy-warning">
                  <span className="warning-icon">⚠️</span>
                  <span className="warning-text">{fix.warning}</span>
                </div>

                {/* Tools */}
                <div className="diy-tools">
                  <span className="tools-label">🧰 Tools:</span>
                  <span className="tools-value">{fix.tools}</span>
                </div>

                {/* Steps */}
                <ul className="diy-steps">
                  {fix.steps.map(function(step, index) {
                    return (
                      <li key={index} className="diy-step">
                        <span className="step-number">{index + 1}</span>
                        <span className="step-text">{step}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })}

        {/* Still Need Help */}
        <div className="diy-help-banner">
          <h3>Still need help?</h3>
          <p>If these tips didn't solve your problem, find a mechanic near you</p>
          <div className="diy-help-buttons">
            <Link to="/search" className="btn-find-mechanic">
              🔍 Find Mechanic
            </Link>
            <Link to="/sos" className="btn-sos-diy">
              🚨 SOS Emergency
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DIYFixes;
